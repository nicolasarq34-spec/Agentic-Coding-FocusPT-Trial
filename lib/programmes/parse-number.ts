// Forms send everything as text. These turn that text into numbers, or null when it isn't valid.

// "3" → 3. Rejects decimals, words and anything outside min–max (so huge numbers never reach the database).
export function parseWholeNumber(text: string, min: number, max: number): number | null {
  const value = text.trim();
  if (!/^\d+$/.test(value)) return null;
  const number = Number(value);
  return number >= min && number <= max ? number : null;
}

// "82.5" or "82,5" → 82.5 (Finnish keyboards type a comma). At most two decimals, like the database column.
export function parseWeight(text: string): number | null {
  const value = text.trim().replace(",", ".");
  if (!/^\d+(\.\d{1,2})?$/.test(value)) return null;
  const number = Number(value);
  return number <= 999.99 ? number : null;
}
