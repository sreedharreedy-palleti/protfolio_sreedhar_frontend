/**
 * Parses project content string or array into individual points.
 * Handles:
 * - Arrays of points
 * - Newline-separated lines (\n)
 * - Bullet-separated text (•, *, -)
 * - Period-delimited sentences ("Sentence 1. Sentence 2.")
 */
export function parseProjectPoints(content) {
  if (!content) return [];
  if (Array.isArray(content)) {
    return content.map((c) => String(c).trim()).filter(Boolean);
  }
  if (typeof content !== 'string') return [String(content)];

  const trimmed = content.trim();
  if (!trimmed) return [];

  // Check if content has newlines (e.g. user entered one point per line)
  if (trimmed.includes('\n')) {
    return trimmed
      .split('\n')
      .map((line) => line.replace(/^[\s•\-*\d.]+\s*/, '').trim())
      .filter((line) => line.length > 0);
  }

  // Check if content has bullet characters like •
  if (trimmed.includes('•')) {
    return trimmed
      .split('•')
      .map((p) => p.trim())
      .filter(Boolean);
  }

  // If text contains multiple sentences ending in periods, split into separate points
  const sentences = trimmed
    .split(/(?<=\.)\s+/)
    .map((s) => s.replace(/^[\s•\-*\d.]+\s*/, '').trim())
    .filter((s) => s.length > 0);

  if (sentences.length > 1) {
    return sentences;
  }

  return [trimmed];
}
