/**
 * Utility module for email sanitization and normalization.
 */

/**
 * Clean, sanitize, and normalize an email address.
 * Strips accidental prefixes (e.g. "mailto:"), surrounding quotes or brackets,
 * trailing punctuation (commas, periods from copy-pasting), invisible unicode
 * zero-width characters, and whitespace, returning a clean lowercase email.
 *
 * @param {string} rawEmail
 * @returns {string}
 */
export function cleanEmail(rawEmail) {
  if (!rawEmail || typeof rawEmail !== "string") return "";

  let email = rawEmail.trim();

  // Remove zero-width characters and invisible spaces
  email = email.replace(/[\u200B-\u200D\uFEFF]/g, "");

  // Strip surrounding quotes or brackets
  email = email.replace(/^["'<(\[]+|["'>)\]]+$/g, "");

  // Strip leading mailto: (case-insensitive)
  email = email.replace(/^mailto:\s*/i, "");

  // Strip surrounding quotes again if wrapped inside mailto
  email = email.replace(/^["'<(\[]+|["'>)\]]+$/g, "");

  // Strip trailing punctuation often caught in copy-paste
  email = email.replace(/[.,;:]+$/, "");

  return email.trim().toLowerCase();
}

export default cleanEmail;
