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

  /**
   * Generate a random cryptographic salt (hex)
   */
  public static generateSalt(): string {
    const bytes = crypto.getRandomValues(new Uint8Array(16));
    return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Hash a user password using PBKDF2 with SHA-256 (100,000 iterations)
   */
  public static async hashPassword(password: string, salt: string): Promise<string> {
    const encoder = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      encoder.encode(password),
      { name: 'PBKDF2' },
      false,
      ['deriveBits']
    );

    const derivedBits = await crypto.subtle.deriveBits(
      {
        name: 'PBKDF2',
        salt: encoder.encode(salt),
        iterations: 100000,
        hash: 'SHA-256'
      },
      keyMaterial,
      256
    );

    const hashArray = Array.from(new Uint8Array(derivedBits));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Verify password against stored PBKDF2 hash
   */
  public static async verifyPassword(password: string, storedHash: string, salt: string): Promise<boolean> {
    const computedHash = await this.hashPassword(password, salt);
    return computedHash === storedHash;
  }

  /**
   * Create a signed session token
   */
  public static async createSessionToken(userId: string, email: string): Promise<string> {
    const payload = {
      uid: userId,
      em: email,
      exp: Date.now() + 30 * 24 * 60 * 60 * 1000 // 30 days
    };
    const payloadStr = JSON.stringify(payload);
    const payloadB64 = btoa(payloadStr);

    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(this.DEFAULT_MASTER_KEY),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );

    const signatureBuffer = await crypto.subtle.sign('HMAC', key, encoder.encode(payloadB64));
    const signatureB64 = btoa(String.fromCharCode(...new Uint8Array(signatureBuffer)));

    return `${payloadB64}.${signatureB64}`;
  }

  /**
   * Verify signed session token
   */
  public static async verifySessionToken(token: string): Promise<{ userId: string; email: string } | null> {
    try {
      if (!token || !token.includes('.')) return null;
      const [payloadB64, signatureB64] = token.split('.');
      const encoder = new TextEncoder();

      const key = await crypto.subtle.importKey(
        'raw',
        encoder.encode(this.DEFAULT_MASTER_KEY),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['verify']
      );

      const signatureBytes = Uint8Array.from(atob(signatureB64), c => c.charCodeAt(0));
      const isValid = await crypto.subtle.verify('HMAC', key, signatureBytes, encoder.encode(payloadB64));
      if (!isValid) return null;

      const payload = JSON.parse(atob(payloadB64));
      if (payload.exp && Date.now() > payload.exp) return null;

      return { userId: payload.uid, email: payload.em };
    } catch {
      return null;
    }
  }
}


