import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12;

function getSecretKey(): Buffer {
  const secretKey = process.env.ENCRYPTION_KEY || process.env.NEXTAUTH_SECRET || "tims_education_fallback_secure_key_2026";
  return crypto.createHash("sha256").update(secretKey).digest();
}

export type EncryptedData = {
  ciphertext: string;
  iv: string;
  authTag: string;
};

export function encryptSecret(plainText: string): EncryptedData {
  if (!plainText) {
    return { ciphertext: "", iv: "", authTag: "" };
  }
  const key = getSecretKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  let encrypted = cipher.update(plainText, "utf8", "hex");
  encrypted += cipher.final("hex");
  const authTag = cipher.getAuthTag().toString("hex");

  return {
    ciphertext: encrypted,
    iv: iv.toString("hex"),
    authTag,
  };
}

export function decryptSecret(data: EncryptedData): string {
  if (!data || !data.ciphertext || !data.iv || !data.authTag) {
    return "";
  }
  try {
    const key = getSecretKey();
    const iv = Buffer.from(data.iv, "hex");
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(Buffer.from(data.authTag, "hex"));

    let decrypted = decipher.update(data.ciphertext, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  } catch (error) {
    console.error("Failed to decrypt secret:", error);
    return "";
  }
}

export function maskSecret(secret: string): string {
  if (!secret) return "";
  return "••••••••••••••••";
}
