const escapeHtml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");

/**
 * Renders the subset of Markdown the source uses inside a line: `**bold**`
 * measurements and `*italic*` Spanish market phrases.
 */
export const inline = (value: string) =>
  escapeHtml(value)
    .split(/(?<part>\*\*[^*]+\*\*|\*[^*]+\*)/gu)
    .map((part) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return `<strong>${part.slice(2, -2)}</strong>`;
      }
      if (part.startsWith("*") && part.endsWith("*")) {
        return `<em>${part.slice(1, -1)}</em>`;
      }
      return part;
    })
    .join("");
