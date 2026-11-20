import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge multiple class names with Tailwind CSS conflict resolution.
 * Canonical utility for shadcn/ui and headless component composition.
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
