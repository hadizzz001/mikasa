"use client";

import { usePathname, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function BackButton() {
  const pathname = usePathname();
  const router = useRouter();

  // Never show the back arrow on the home page.
  if (pathname === "/") return null;

  return (
    <div className="container-x pt-4 lg:pt-6">
      <button
        type="button"
        onClick={() => router.back()}
        aria-label="Go back"
        className="inline-flex items-center gap-1.5 text-sm text-[var(--muted-fg)] hover:text-[var(--foreground)] transition-colors"
      >
        <ArrowLeft size={18} strokeWidth={1.5} aria-hidden="true" />
        <span>Back</span>
      </button>
    </div>
  );
}
