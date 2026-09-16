/**
 * Validates a phone number for TIMS enquiry forms.
 * Accepts standard 10-digit mobile numbers up to 15-digit international format (E.164 standard).
 */
export function isValidPhoneNumber(phone: unknown): { valid: boolean; reason?: string } {
  if (!phone || typeof phone !== "string") {
    return { valid: false, reason: "Phone number is required." };
  }

  const trimmed = phone.trim();
  if (!trimmed) {
    return { valid: false, reason: "Phone number is required." };
  }

  // Allowed characters: optional leading +, numbers, spaces, hyphens, parentheses
  if (!/^\+?[0-9\s\-()]+$/.test(trimmed)) {
    return { valid: false, reason: "Phone number contains invalid characters." };
  }

  const digitsOnly = trimmed.replace(/\D/g, "");

  if (digitsOnly.length < 10) {
    return { valid: false, reason: "Phone number must be at least 10 digits." };
  }

  if (digitsOnly.length > 15) {
    return { valid: false, reason: "Phone number cannot exceed 15 digits." };
  }

  // Reject repeating dummy digits (e.g., 0000000000, 1111111111, 9999999999)
  if (/^(\d)\1+$/.test(digitsOnly)) {
    return { valid: false, reason: "Please enter a valid phone number." };
  }

  // Reject obvious ascending dummy numbers (1234567890, 0123456789)
  const dummySequences = ["1234567890", "0123456789"];
  if (dummySequences.includes(digitsOnly)) {
    return { valid: false, reason: "Please enter a valid phone number." };
  }

  return { valid: true };
}
