/**
 * Strips empty spacer blocks (e.g. `<p><br></p>`, `<h1><br></h1>`) that the
 * rich-text editor inserts, so the vertical rhythm is driven by CSS instead of
 * stray blank lines.
 *
 * The HTML comes from the admin CMS (the About / Privacy collections) and is
 * therefore trusted, which is why it is rendered with `dangerouslySetInnerHTML`.
 */
export function cleanRichHtml(html: string | undefined | null): string {
  if (!html) return "";
  return html
    .replace(/<(h[1-6]|p)(\s[^>]*)?>(?:\s|&nbsp;|<br\s*\/?>)*<\/\1>/gi, "")
    .trim();
}
