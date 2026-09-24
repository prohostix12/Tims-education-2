import crypto from "crypto";
import { getDb } from "./mongodb";

export const ADMIN_CREDENTIALS_COLLECTION = "admin_credentials";
const ADMIN_USERNAME = "admin";

export interface AdminCredentialsDoc {
  _id?: any;
  username: string;
  passwordHash: string;
  salt: string;
  updatedAt: Date | string;
}

/**
 * Hashes a plaintext password using crypto.pbkdf2Sync (SHA-512 with 10,000 iterations).
 */
export function hashPassword(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, 10000, 64, "sha512").toString("hex");
}

/**
 * Retrieves stored admin credentials from MongoDB.
 */
export async function getAdminCredentials(): Promise<AdminCredentialsDoc | null> {
  try {
    const db = await getDb();
    const doc = await db
      .collection<AdminCredentialsDoc>(ADMIN_CREDENTIALS_COLLECTION)
      .findOne({ username: ADMIN_USERNAME });
    return doc;
  } catch (error) {
    console.error("Failed to fetch admin credentials from MongoDB:", error);
    return null;
  }
}

/**
 * Verifies password against stored MongoDB hash or fallback environment variable.
 */
export async function verifyAdminPassword(passwordInput: string): Promise<boolean> {
  if (!passwordInput) return false;
  const trimmedInput = passwordInput.trim();

  try {
    const storedCreds = await getAdminCredentials();

    // If MongoDB has a password record, compare against it
    if (storedCreds && storedCreds.passwordHash && storedCreds.salt) {
      const inputHash = hashPassword(trimmedInput, storedCreds.salt);
      const bufA = Buffer.from(inputHash, "utf8");
      const bufB = Buffer.from(storedCreds.passwordHash, "utf8");
      if (bufA.length === bufB.length) {
        return crypto.timingSafeEqual(bufA, bufB);
      }
      return false;
    }
  } catch (err) {
    console.warn("MongoDB password check error, falling back to environment variable:", err);
  }

  // Fallback to env var or default "mytims" if no record exists in MongoDB yet
  const fallbackPassword = process.env.ADMIN_PASSWORD?.trim() || "mytims";
  return trimmedInput === fallbackPassword;
}

/**
 * Updates the admin password in MongoDB after verifying the current password.
 */
export async function updateAdminPassword(
  currentPasswordInput: string,
  newPasswordInput: string
): Promise<{ success: boolean; error?: string }> {
  if (!currentPasswordInput || !newPasswordInput) {
    return { success: false, error: "Both current and new passwords are required." };
  }

  if (newPasswordInput.length < 6) {
    return { success: false, error: "New password must be at least 6 characters long." };
  }

  const isValidCurrent = await verifyAdminPassword(currentPasswordInput);
  if (!isValidCurrent) {
    return { success: false, error: "Current password is incorrect." };
  }

  try {
    const db = await getDb();
    const salt = crypto.randomBytes(16).toString("hex");
    const passwordHash = hashPassword(newPasswordInput, salt);

    await db.collection<AdminCredentialsDoc>(ADMIN_CREDENTIALS_COLLECTION).updateOne(
      { username: ADMIN_USERNAME },
      {
        $set: {
          username: ADMIN_USERNAME,
          passwordHash,
          salt,
          updatedAt: new Date(),
        },
      },
      { upsert: true }
    );

    return { success: true };
  } catch (error: any) {
    console.error("Error updating admin password in MongoDB:", error);
    return {
      success: false,
      error: "Failed to save new password in MongoDB database. Please try again.",
    };
  }
}
