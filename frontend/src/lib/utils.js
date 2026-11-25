/**
 * Merge multiple class names with falsy filtering.
 * Lightweight, zero-dependency utility for component class composition.
 */
export function cn(...inputs) {
  return inputs
    .flat(Infinity)
    .filter(Boolean)
    .join(" ");
}
