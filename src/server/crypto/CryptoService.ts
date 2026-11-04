/**
 * ZERO-TRUST ENVELOPE ENCRYPTION SERVICE
 * Stack: Web Crypto API (SubtleCrypto)
 * Algorithm: AES-256-GCM with 96-bit random IV + PBKDF2/HKDF key derivation
 */

export class CryptoService {
  private static DEFAULT_MASTER_KEY = 'polymath-quest-master-edge-secret-2026';

  /**
   * Derive a 256-bit AES-GCM CryptoKey from master key + user salt
   */
  private static async deriveKey(masterSecret: string, userSalt: string): Promise<CryptoKey> {
    const encoder = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      encoder.encode(masterSecret || this.DEFAULT_MASTER_KEY),
      { name: 'PBKDF2' },
      false,
      ['deriveKey']
    );

    return crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: encoder.encode(userSalt),
        iterations: 100000,
        hash: 'SHA-256'
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );
  }

  /**
   * Encrypt plaintext into "iv_base64:ciphertext_base64"
   */
  public static async encrypt(
    plaintext: string,
    userSalt: string,
    masterSecret: string = this.DEFAULT_MASTER_KEY
  ): Promise<string> {
    try {
      const key = await this.deriveKey(masterSecret, userSalt);
      const iv = crypto.getRandomValues(new Uint8Array(12)); // 96-bit IV
      const encodedText = new TextEncoder().encode(plaintext);

      const encryptedBuffer = await crypto.subtle.encrypt(
        {
          name: 'AES-GCM',
          iv
        },
        key,
        encodedText
      );

      const ivBase64 = btoa(String.fromCharCode(...iv));
      const cipherBase64 = btoa(String.fromCharCode(...new Uint8Array(encryptedBuffer)));

      return `${ivBase64}:${cipherBase64}`;
    } catch (e) {
      console.error('Encryption error:', e);
      throw new Error('Encryption failed');
    }
  }

  /**
   * Decrypt "iv_base64:ciphertext_base64" back into plaintext
   */
  public static async decrypt(
    encryptedPayload: string,
    userSalt: string,
    masterSecret: string = this.DEFAULT_MASTER_KEY
  ): Promise<string> {
    try {
      if (!encryptedPayload.includes(':')) {
        return encryptedPayload; // Fallback if already plaintext
      }

      const [ivBase64, cipherBase64] = encryptedPayload.split(':');
      const iv = Uint8Array.from(atob(ivBase64), c => c.charCodeAt(0));
      const ciphertext = Uint8Array.from(atob(cipherBase64), c => c.charCodeAt(0));

      const key = await this.deriveKey(masterSecret, userSalt);

      const decryptedBuffer = await crypto.subtle.decrypt(
        {
          name: 'AES-GCM',
          iv
        },
        key,
        ciphertext
      );

      return new TextDecoder().decode(decryptedBuffer);
    } catch (e) {
      console.error('Decryption error:', e);
      return '[Decryption Error: Invalid Key or Corrupted Payload]';
    }
  }

  /**
   * Encrypt object as JSON
   */
  public static async encryptObject<T>(
    obj: T,
    userSalt: string,
    masterSecret?: string
  ): Promise<string> {
    const jsonStr = JSON.stringify(obj);
    return this.encrypt(jsonStr, userSalt, masterSecret);
  }

  /**
   * Decrypt JSON object
   */
  public static async decryptObject<T>(
    encryptedPayload: string,
    userSalt: string,
    masterSecret?: string
  ): Promise<T | null> {
    const decryptedStr = await this.decrypt(encryptedPayload, userSalt, masterSecret);
    try {
      return JSON.parse(decryptedStr) as T;
    } catch {
      return null;
    }
  }
}
