/**
 * Formátuje datum do českého formátu (DD. MM. YYYY).
 * Používáme pro zobrazení datumů v UI.
 */
export function formatDate(date: Date): string {
  return date.toLocaleDateString("cs-CZ", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
  });
}
