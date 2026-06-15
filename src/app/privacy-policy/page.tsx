import type { Metadata } from "next";
import PrivacyContent from "./PrivacyContent";

export const metadata: Metadata = {
  title: "Privacy Policy — Mikasa Home",
  description:
    "Mikasa Home delivery, returns and exchange policy. Local delivery across Lebanon with same-day delivery in Beirut, plus our return & exchange terms.",
};

export default function PrivacyPolicyPage() {
  return <PrivacyContent />;
}
