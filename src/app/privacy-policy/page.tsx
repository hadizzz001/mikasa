import type { Metadata } from "next";
import PrivacyContent from "./PrivacyContent";

export const metadata: Metadata = {
  title: "Privacy Policy — Sana Home",
  description:
    "Sana Home delivery, returns and exchange policy. Local delivery across Lebanon with same-day delivery in Sidon, plus our return & exchange terms.",
};

export default function PrivacyPolicyPage() {
  return <PrivacyContent />;
}
