import { NextResponse } from "next/server";
import { getDb } from "../../../lib/mongodb";
import { withStringIds } from "../../../lib/withStringId";

export const dynamic = "force-dynamic";

type Query = Record<string, unknown>;

// Paginated + filtered product listing used by the shop and search pages.
// Adapted to the sana data model where `factory` is the category dimension,
// `arrival` ("yes"/"no") flags new arrivals and `sale` ("yes"/"no") flags sales.
export async function GET(req: Request) {
  try {
    const db = await getDb();
    const collection = db.collection("Product");

    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "12", 10);
    const skip = (page - 1) * limit;

    const search = (searchParams.get("q") || "").trim();
    const cats = searchParams.getAll("cat").map((c) => c.trim()).filter(Boolean);
    // `sub`/`subsub`/`brnd` kept for URL compatibility with the reference UI.
    const subs = searchParams.getAll("sub").map((c) => c.trim()).filter(Boolean);
    const filter = (searchParams.get("filter") || "").trim().toLowerCase();
    // Maximum price threshold, used by the "offer" promo banner to show only
    // products cheaper than the given value (e.g. minoff=10 -> under $10).
    const minoff = parseFloat(searchParams.get("minoff") || "0");
    // Minimum discount percentage, used by the banner1 promo to show only
    // products discounted by at least this much (e.g. pct=25 -> 25% off+).
    const pct = parseFloat(searchParams.get("pct") || "0");

    const query: Query = {};
    const and: Query[] = [];

    // Fuzzy text search across the meaningful sana fields.
    if (search) {
      const tokens = search.split(/\s+/).filter(Boolean);
      for (const token of tokens) {
        and.push({
          $or: [
            { title: { $regex: token, $options: "i" } },
            { code: { $regex: token, $options: "i" } },
            { factory: { $regex: token, $options: "i" } },
            { description: { $regex: token, $options: "i" } },
            { "color.color": { $regex: token, $options: "i" } },
            { "color.sizes.size": { $regex: token, $options: "i" } },
          ],
        });
      }
    }

    // Category filter -> sana `factory`. "yes" is treated as a new-arrival flag.
    if (cats.length > 0) {
      const factoryCats = cats.filter((c) => c.toLowerCase() !== "yes");
      if (cats.some((c) => c.toLowerCase() === "yes")) {
        query.arrival = "yes";
      }
      if (factoryCats.length > 0) {
        and.push({
          $or: [
            { factory: { $in: factoryCats } },
            { category: { $in: factoryCats } },
          ],
        });
      }
    }

    if (subs.length > 0) {
      and.push({ subcategory: { $in: subs } });
    }

    if (filter === "new") {
      query.arrival = "yes";
    } else if (filter === "best" || filter === "sale") {
      query.sale = "yes";
    }

    // Offer filter: keep products whose effective (sellable) price is below the
    // `minoff` threshold. Prices live at the top level for single products and
    // inside `color[].sizes[]` for collections, and on-sale items use the lower
    // `discount` value — so compute the minimum real price and compare. All
    // values are stored as strings, hence the defensive numeric conversion.
    if (minoff > 0) {
      const num = (field: string) => ({
        $convert: { input: field, to: "double", onError: 0, onNull: 0 },
      });
      // The discount when it is a genuine reduction, otherwise the list price.
      const effective = (price: object, disc: object) => ({
        $let: {
          vars: { pr: price, ds: disc },
          in: {
            $cond: [
              { $and: [{ $gt: ["$$ds", 0] }, { $lt: ["$$ds", "$$pr"] }] },
              "$$ds",
              "$$pr",
            ],
          },
        },
      });
      // Flatten every size across every colour into one list of prices.
      const sizePrices = {
        $map: {
          input: {
            $reduce: {
              input: { $ifNull: ["$color", []] },
              initialValue: [],
              in: {
                $concatArrays: ["$$value", { $ifNull: ["$$this.sizes", []] }],
              },
            },
          },
          as: "s",
          in: effective(num("$$s.price"), num("$$s.discount")),
        },
      };
      // A collection's lowest size price, or the single product's own price.
      const minPrice = {
        $cond: [
          { $gt: [{ $size: sizePrices }, 0] },
          { $min: sizePrices },
          effective(num("$price"), num("$discount")),
        ],
      };
      and.push({
        $expr: { $and: [{ $gt: [minPrice, 0] }, { $lt: [minPrice, minoff] }] },
      });
    }

    // Discount-percentage filter (banner1 promo). Show only products that carry
    // the banner's exact discount. Percentages are strings stored at the top
    // level for single products and inside color[].sizes[] for collections. A
    // range like "5-50" is a min/max summary, so it must NOT count as a match
    // for 25 — we compare against the individual numeric values only.
    if (pct > 0) {
      // Numeric value of a percentage field; -1 for empty/invalid (e.g. a
      // "5-50" range string) so it never equals a real target percentage.
      const num = (field: string) => ({
        $convert: { input: field, to: "double", onError: -1, onNull: -1 },
      });
      // Every individual size percentage across all colours.
      const sizePcts = {
        $map: {
          input: {
            $reduce: {
              input: { $ifNull: ["$color", []] },
              initialValue: [],
              in: {
                $concatArrays: ["$$value", { $ifNull: ["$$this.sizes", []] }],
              },
            },
          },
          as: "s",
          in: num("$$s.percentage"),
        },
      };
      // Match when `pct` equals the top-level percentage or any single size's
      // percentage. (Ranges contribute -1 at the top level and are only matched
      // via their concrete per-size values.)
      and.push({
        $expr: {
          $in: [pct, { $concatArrays: [[num("$percentage")], sizePcts] }],
        },
      });
    }

    if (and.length > 0) {
      query.$and = and;
    }

    const total = await collection.countDocuments(query);
    // Order by the admin-defined product `sort` (ascending). Products without a
    // `sort` value fall to the end, newest-first as a sensible default.
    const SORT_LAST = Number.MAX_SAFE_INTEGER;
    const data = await collection
      .aggregate([
        { $match: query },
        {
          $addFields: {
            _sortKey: {
              $convert: {
                input: "$sort",
                to: "double",
                onError: SORT_LAST,
                onNull: SORT_LAST,
              },
            },
          },
        },
        { $sort: { _sortKey: 1, _id: -1 } },
        { $skip: skip },
        { $limit: limit },
        { $project: { _sortKey: 0 } },
      ])
      .toArray();

    return NextResponse.json({
      currentPage: page,
      totalPages: Math.max(1, Math.ceil(total / limit)),
      totalItems: total,
      hasMore: page * limit < total,
      products: withStringIds(data),
    });
  } catch (error) {
    console.error("productsz1 error:", error);
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}
