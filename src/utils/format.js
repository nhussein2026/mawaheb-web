// Numbers and dates (§4.10): formatted with Intl and forced to Western digits,
// because some Arabic locales default to Eastern digits.
const LOCALE = "ar-YE-u-nu-latn";

const dateFmt = new Intl.DateTimeFormat(LOCALE, { day: "2-digit", month: "2-digit", year: "numeric" });
const dateLongFmt = new Intl.DateTimeFormat(LOCALE, { dateStyle: "medium" });
const dateTimeFmt = new Intl.DateTimeFormat(LOCALE, {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});
const numberFmt = new Intl.NumberFormat(LOCALE);
const relFmt = new Intl.RelativeTimeFormat(LOCALE, { numeric: "auto" });

// Arabic Intl output wraps parts in right-to-left marks, which flip the
// visual order of a date run ("2026/10/18"). Strip them so dates read
// 18/10/2026 as on the website.
const clean = (str) => str.replace(/[\u200E\u200F\u061C]/g, "");

const toDate = (v) => {
  if (v == null || v === "") return null;
  const d = v instanceof Date ? v : new Date(v);
  return Number.isNaN(d.getTime()) ? null : d;
};

/** 18/10/2026 */
export const formatDate = (v, fallback = "—") => {
  const d = toDate(v);
  return d ? clean(dateFmt.format(d)) : fallback;
};

/** 18 أكتوبر 2026 */
export const formatDateLong = (v, fallback = "—") => {
  const d = toDate(v);
  return d ? clean(dateLongFmt.format(d)) : fallback;
};

/** 18/10/2026، 14:05 */
export const formatDateTime = (v, fallback = "—") => {
  const d = toDate(v);
  return d ? clean(dateTimeFmt.format(d)) : fallback;
};

export const formatNumber = (v, fallback = "—") => {
  if (v == null || v === "" || Number.isNaN(Number(v))) return fallback;
  return numberFmt.format(Number(v));
};

export const formatCurrency = (v, currency = "USD", fallback = "—") => {
  if (v == null || v === "" || Number.isNaN(Number(v))) return fallback;
  return new Intl.NumberFormat(LOCALE, { style: "currency", currency }).format(Number(v));
};

/** Relative under 7 days ("قبل 3 ساعات"), a date beyond (§4.7 activity timeline). */
export const formatRelative = (v, fallback = "—") => {
  const d = toDate(v);
  if (!d) return fallback;
  const diffSec = Math.round((d.getTime() - Date.now()) / 1000);
  const abs = Math.abs(diffSec);
  if (abs >= 7 * 86400) return clean(dateFmt.format(d));
  if (abs < 60) return relFmt.format(diffSec, "second");
  if (abs < 3600) return relFmt.format(Math.round(diffSec / 60), "minute");
  if (abs < 86400) return relFmt.format(Math.round(diffSec / 3600), "hour");
  return relFmt.format(Math.round(diffSec / 86400), "day");
};

const timeFmt = new Intl.DateTimeFormat(LOCALE, { hour: "2-digit", minute: "2-digit" });

/** 14:05 */
export const formatTime = (v, fallback = "—") => {
  const d = toDate(v);
  return d ? clean(timeFmt.format(d)) : fallback;
};
