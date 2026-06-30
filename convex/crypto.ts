// A 32-byte (256-bit) default key for local development.
// In production, set ENCRYPTION_KEY in your Convex dashboard (must be exactly 64 hex characters).
const DEFAULT_KEY_HEX = "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef";

function getEncryptionKeyHex(): string {
  const envKey = process.env.ENCRYPTION_KEY;
  if (envKey && envKey.length === 64) {
    return envKey;
  }
  return DEFAULT_KEY_HEX;
}

function hexToArrayBuffer(hex: string): ArrayBuffer {
  const bytes = new Uint8Array(Math.ceil(hex.length / 2));
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.substring(i * 2, i * 2 + 2), 16);
  }
  return bytes.buffer;
}

function arrayBufferToHex(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let hex = "";
  for (let i = 0; i < bytes.length; i++) {
    hex += bytes[i].toString(16).padStart(2, "0");
  }
  return hex;
}

async function getCryptoKey(): Promise<CryptoKey> {
  const rawKey = hexToArrayBuffer(getEncryptionKeyHex());
  return await crypto.subtle.importKey(
    "raw",
    rawKey,
    { name: "AES-GCM" },
    false,
    ["encrypt", "decrypt"]
  );
}

// Format: iv:ciphertext (both hex-encoded)
export async function encryptString(text: string): Promise<string> {
  if (!text) return text;
  
  const key = await getCryptoKey();
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encoded = new TextEncoder().encode(text);
  
  const ciphertext = await crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv,
    },
    key,
    encoded
  );
  
  return `${arrayBufferToHex(iv.buffer)}:${arrayBufferToHex(ciphertext)}`;
}

export async function decryptString(encryptedText: string): Promise<string> {
  if (!encryptedText) return encryptedText;
  
  const parts = encryptedText.split(":");
  if (parts.length !== 2) {
    // Fallback for unencrypted legacy data
    return encryptedText; 
  }
  
  try {
    const key = await getCryptoKey();
    const iv = hexToArrayBuffer(parts[0]);
    const ciphertext = hexToArrayBuffer(parts[1]);
    
    const decrypted = await crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv,
      },
      key,
      ciphertext
    );
    
    return new TextDecoder().decode(decrypted);
  } catch (error) {
    console.error("Failed to decrypt string, returning original", error);
    return encryptedText; // Fallback for invalid format or wrong key
  }
}
