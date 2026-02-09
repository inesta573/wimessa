/**
 * Formats a number using Arabic-Indic numerals (٠١٢٣٤٥٦٧٨٩) when locale is Arabic.
 * Otherwise returns the number as a string.
 */
export function formatNumber(num, locale) {
  if (locale !== 'ar') return String(num)
  return new Intl.NumberFormat('ar-EG', { useGrouping: false }).format(Number(num))
}
