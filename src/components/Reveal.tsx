// Reveal used to fade/slide its children in on scroll (IntersectionObserver +
// `.reveal` starting at opacity 0). That left large parts of the page invisible
// until JS ran, so all motion was removed: it is now a plain wrapper that keeps
// the same props and the same `.reveal` element, and renders content instantly.
export default function Reveal({
  children,
  className = "",
}: {
  children: React.ReactNode;
  /** Kept so existing call sites compile; no longer used. */
  delay?: number;
  className?: string;
}) {
  return <div className={`reveal ${className}`}>{children}</div>;
}
