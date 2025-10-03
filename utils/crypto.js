/**
 * @file crypto.js
 * @description Encryption utilities for securing API keys
 * @module utils/crypto
 */

/**
 * Generate a consistent encryption key from user's browser identity
 * Uses Web Crypto API to derive a key from a salt
 * @returns {Promise<CryptoKey>} Encryption key
 */
async function getEncryptionKey() {
  // Use a combination of extension ID and a fixed salt
  // This ensures the key is consistent for the user but unique per installation
  const extensionId = chrome.runtime.id;
  const salt = new TextEncoder().encode(`smart-reply-${extensionId}`);

  // Import the salt as key material
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    salt,
    { name: 'PBKDF2' },
    false,
    ['deriveBits', 'deriveKey']
  );

  // Derive a key using PBKDF2
  const key = await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: 100000,
      hash: 'SHA-256'
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );

  return key;
}

/**
 * Encrypt a string using AES-GCM
 * @param {string} plaintext - Text to encrypt
 * @returns {Promise<string>} Base64-encoded encrypted data with IV
 */
export async function encrypt(plaintext) {
  if (!plaintext) {
    return '';
  }

  try {
    const key = await getEncryptionKey();

    // Generate a random IV (initialization vector)
    const iv = crypto.getRandomValues(new Uint8Array(12));

    // Encode the plaintext
    const encoded = new TextEncoder().encode(plaintext);

    // Encrypt the data
    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv: iv },
      key,
      encoded
    );

    // Combine IV and encrypted data
    const combined = new Uint8Array(iv.length + encrypted.byteLength);
    combined.set(iv, 0);
    combined.set(new Uint8Array(encrypted), iv.length);

    // Convert to base64 for storage
    return btoa(String.fromCharCode(...combined));
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt data');
  }
}

/**
 * Decrypt a string using AES-GCM
 * @param {string} ciphertext - Base64-encoded encrypted data with IV
 * @returns {Promise<string>} Decrypted plaintext
 */
export async function decrypt(ciphertext) {
  if (!ciphertext) {
    return '';
  }

  try {
    const key = await getEncryptionKey();

    // Convert from base64
    const combined = Uint8Array.from(atob(ciphertext), c => c.charCodeAt(0));

    // Extract IV and encrypted data
    const iv = combined.slice(0, 12);
    const encrypted = combined.slice(12);

    // Decrypt the data
    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: iv },
      key,
      encrypted
    );

    // Decode to string
    return new TextDecoder().decode(decrypted);
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt data');
  }
}

/**
 * Check if a value is encrypted (basic heuristic check)
 * @param {string} value - Value to check
 * @returns {boolean} True if value appears to be encrypted
 */
export function isEncrypted(value) {
  if (!value || typeof value !== 'string') {
    return false;
  }

  // Check if it's base64 encoded and of reasonable length
  // Encrypted API keys should be longer than plain text due to IV and encryption overhead
  const base64Pattern = /^[A-Za-z0-9+/]+=*$/;
  return base64Pattern.test(value) && value.length > 50;
}
