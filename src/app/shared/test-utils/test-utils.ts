/**
 * Returns a new Date object with the seconds and milliseconds set to zero.
 *
 * @param date - The input date, which can be a Date object, a timestamp (number), or undefined/null.
 * @returns A new Date object with seconds and milliseconds set to zero, or null if the input is falsy.
 */
export function dateWithZeroSeconds(date: Date | number | undefined | null): Date | null {
  if (!date) return null;
  const d = new Date(date);
  d.setSeconds(0, 0);
  return d;
}
