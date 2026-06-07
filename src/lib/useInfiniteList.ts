"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// Shared infinite-scroll loader for paginated product listings.
//
// What went wrong in the previous attempt:
//   The trigger function used `setState((prev) => {...; started = true; ...})`
//   to atomically flip `loadingMore: true` AND signal whether the load should
//   proceed. But React 18+ batches/queues updater functions — the callback
//   does NOT run synchronously when setState is called. So the `started`
//   flag stayed `false` immediately after the call, the function returned
//   early, the fetch never started, and yet the queued updater eventually
//   committed `loadingMore: true` to state. End result: spinner forever,
//   no items.
//
// This rewrite avoids that trap by:
//   1. Using a synchronous ref (`inflightRef`) for the double-fire guard
//      instead of trying to read a value that depends on setState having
//      run. The ref is checked and flipped synchronously inside the loader.
//   2. Using a numeric request-id ref to drop stale responses, removing
//      the need for fragile key-comparison inside setState updaters.
//   3. Driving auto-load from BOTH a window scroll listener (rAF-throttled)
//      AND an IntersectionObserver, plus an initial check on each re-render
//      so a list shorter than the viewport still triggers a load.
//   4. Keeping all setStates inside async `.then`/`.finally` callbacks so
//      the reset effect doesn't violate `react-hooks/set-state-in-effect`.

interface PaginatedResponse<T> {
  products?: T[];
  hasMore?: boolean;
  totalItems?: number;
}

interface ListData<T> {
  /** The serialized query this data was loaded for. */
  key: string;
  items: T[];
  page: number;
  hasMore: boolean;
  totalItems: number;
}

export interface UseInfiniteListResult<T> {
  items: T[];
  loading: boolean;
  loadingMore: boolean;
  hasMore: boolean;
  totalItems: number;
  sentinelRef: React.RefObject<HTMLDivElement | null>;
  /** Manually trigger the next page (used by the fallback "Load more" button). */
  loadMore: () => void;
}

const TRIGGER_OFFSET = 400; // pixels before the sentinel comes into view

export function useInfiniteList<T>(
  /** URL the resource list lives at, e.g. "/api/productsz1". */
  endpoint: string,
  /** Query string for the current filter set; the list resets when this changes. */
  queryKey: string,
  /** Page size. */
  limit: number,
): UseInfiniteListResult<T> {
  const [data, setData] = useState<ListData<T> | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);

  const sentinelRef = useRef<HTMLDivElement | null>(null);
  // Bumped on every fetch (reset OR load-more). Only the response whose id
  // still matches `reqIdRef.current` is allowed to mutate state.
  const reqIdRef = useRef(0);
  // Synchronous double-fire guard — set BEFORE setState so a second trigger
  // call before React re-renders is rejected.
  const inflightRef = useRef(false);

  // Initial / reset load when the query changes. No synchronous setState in
  // the effect body — derived `loading` (key mismatch) drives the skeleton.
  useEffect(() => {
    const reqId = ++reqIdRef.current;
    inflightRef.current = false;

    const params = new URLSearchParams(queryKey);
    params.set("page", "1");
    params.set("limit", String(limit));

    fetch(`${endpoint}?${params.toString()}`)
      .then((r) => r.json() as Promise<PaginatedResponse<T>>)
      .then((d) => {
        if (reqId !== reqIdRef.current) return;
        setLoadingMore(false);
        setData({
          key: queryKey,
          items: d.products || [],
          page: 1,
          hasMore: !!d.hasMore,
          totalItems: d.totalItems || 0,
        });
      })
      .catch((err: unknown) => {
        if (reqId !== reqIdRef.current) return;
        console.warn("[useInfiniteList] initial load failed:", err);
        setLoadingMore(false);
        setData({
          key: queryKey,
          items: [],
          page: 1,
          hasMore: false,
          totalItems: 0,
        });
      });
  }, [endpoint, queryKey, limit]);

  // Derived view state — only data that matches the current query counts.
  const fresh = data && data.key === queryKey ? data : null;
  const loading = !fresh;
  const items = fresh?.items ?? [];
  const hasMore = fresh?.hasMore ?? false;
  const totalItems = fresh?.totalItems ?? 0;

  const loadMore = useCallback(() => {
    // Sync guards — no setState involved, no batching surprises.
    if (inflightRef.current) return;
    if (!fresh || !fresh.hasMore) return;

    inflightRef.current = true;
    const reqId = ++reqIdRef.current;
    const next = fresh.page + 1;
    const key = fresh.key;

    setLoadingMore(true);

    const params = new URLSearchParams(key);
    params.set("page", String(next));
    params.set("limit", String(limit));

    fetch(`${endpoint}?${params.toString()}`)
      .then((r) => r.json() as Promise<PaginatedResponse<T>>)
      .then((d) => {
        if (reqId !== reqIdRef.current) return;
        setData((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            items: [...prev.items, ...(d.products || [])],
            page: next,
            hasMore: !!d.hasMore,
          };
        });
      })
      .catch((err: unknown) => {
        if (reqId !== reqIdRef.current) return;
        console.warn("[useInfiniteList] load more failed:", err);
      })
      .finally(() => {
        // Always clear the in-flight flag even for stale responses, otherwise
        // a stale failure could permanently lock the loader.
        inflightRef.current = false;
        if (reqId === reqIdRef.current) setLoadingMore(false);
      });
  }, [endpoint, limit, fresh]);

  // Stash the latest `loadMore` in a ref so the scroll listener (which is
  // attached once on mount) always calls the freshest closure without
  // re-attaching listeners on every render.
  const loadMoreRef = useRef(loadMore);
  useEffect(() => {
    loadMoreRef.current = loadMore;
  }, [loadMore]);

  // Mount-once window scroll/resize listener. rAF-throttled to coalesce
  // bursts of scroll events into one check per frame.
  useEffect(() => {
    let scheduled = false;
    function check() {
      scheduled = false;
      const sentinel = sentinelRef.current;
      if (!sentinel) return;
      const rect = sentinel.getBoundingClientRect();
      const viewport =
        window.innerHeight || document.documentElement.clientHeight;
      if (rect.top - viewport < TRIGGER_OFFSET) {
        loadMoreRef.current();
      }
    }
    function onScroll() {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(check);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // IntersectionObserver + initial-visibility check. Re-runs when `loading`
  // flips false (sentinel mounts) AND when `items.length` grows (so a list
  // that's still shorter than the viewport after appending keeps loading).
  useEffect(() => {
    if (loading) return;
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    let observer: IntersectionObserver | null = null;
    if (typeof IntersectionObserver !== "undefined") {
      observer = new IntersectionObserver(
        (entries) => {
          if (entries[0]?.isIntersecting) loadMoreRef.current();
        },
        { rootMargin: `${TRIGGER_OFFSET}px 0px` },
      );
      observer.observe(sentinel);
    }

    // Deferred initial check via rAF — fires after the sentinel has settled
    // into its final layout position, and is async so we don't violate
    // react-hooks/set-state-in-effect.
    const rafId = requestAnimationFrame(() => {
      const s = sentinelRef.current;
      if (!s) return;
      const rect = s.getBoundingClientRect();
      const viewport =
        window.innerHeight || document.documentElement.clientHeight;
      if (rect.top - viewport < TRIGGER_OFFSET) {
        loadMoreRef.current();
      }
    });

    return () => {
      cancelAnimationFrame(rafId);
      observer?.disconnect();
    };
  }, [loading, items.length]);

  return {
    items,
    loading,
    loadingMore,
    hasMore,
    totalItems,
    sentinelRef,
    loadMore,
  };
}
