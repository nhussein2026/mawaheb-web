// Arabic-aware search key (§4.9): remove diacritics and tatweel, fold letter
// variants, convert Eastern digits, compare Latin case-insensitively — so
// "احمد" finds "أحمد".
export function normalizeSearch(value = "") {
  return String(value)
    .replace(/[ً-ْـ]/g, "")
    .replace(/[أإآٱ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ة/g, "ه")
    .replace(/ؤ/g, "و")
    .replace(/ئ/g, "ي")
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660))
    .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 0x06f0))
    .toLowerCase()
    .trim();
}

export const matchesSearch = (haystack, query) =>
  normalizeSearch(haystack).includes(normalizeSearch(query));
