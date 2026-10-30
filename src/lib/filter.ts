import type { Reference } from "./types";

const normalize = (s: string) =>
  s.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();

export function filterReferences(
  items: Reference[],
  query: string,
  category: string | null,
): Reference[] {
  const q = normalize(query.trim());
  return items.filter((r) => {
    if (category && r.category !== category) return false;
    if (!q) return true;
    const haystack = normalize(
      [r.title, r.category, r.summary, r.takeaway, ...r.tags, ...r.fonts].join(" "),
    );
    return haystack.includes(q);
  });
}
