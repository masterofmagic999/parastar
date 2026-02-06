/**
 * Encryption utilities using Web Crypto API with AES-256-GCM
 * Provides secure encryption/decryption for sensitive data like passwords
 */

// Convert string to ArrayBuffer
function stringToArrayBuffer(str: string): ArrayBuffer {
  const encoder = new TextEncoder()
  return encoder.encode(str).buffer
}

// Convert ArrayBuffer to string
function arrayBufferToString(buffer: ArrayBuffer): string {
  const decoder = new TextDecoder()
  return decoder.decode(buffer)
}

// Convert ArrayBuffer to base64 string
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer)
  let binary = ''
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return btoa(binary)
}

// Convert base64 string to ArrayBuffer
function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }
  return bytes.buffer
}

/**
 * Generate a cryptographic key from a master password
 * Uses PBKDF2 with salt for key derivation
 */
async function deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    stringToArrayBuffer(password),
    'PBKDF2',
    false,
    ['deriveBits', 'deriveKey']
  )

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt as BufferSource,
      iterations: 100000,
      hash: 'SHA-256'
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  )
}

/**
 * Encrypt data using AES-256-GCM
 * @param plaintext - The data to encrypt
 * @param masterPassword - The master password for encryption
 * @returns Base64 encoded encrypted data with salt and IV
 */
export async function encrypt(plaintext: string, masterPassword: string): Promise<string> {
  try {
    // Generate random salt and IV
    const salt = crypto.getRandomValues(new Uint8Array(16))
    const iv = crypto.getRandomValues(new Uint8Array(12))

    // Derive encryption key
    const key = await deriveKey(masterPassword, salt)

    // Encrypt the data
    const encrypted = await crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv: iv
      },
      key,
      stringToArrayBuffer(plaintext)
    )

    // Combine salt, IV, and encrypted data
    const combined = new Uint8Array(salt.length + iv.length + encrypted.byteLength)
    combined.set(salt, 0)
    combined.set(iv, salt.length)
    combined.set(new Uint8Array(encrypted), salt.length + iv.length)

    // Return as base64
    return arrayBufferToBase64(combined.buffer)
  } catch (error) {
    console.error('Encryption error:', error)
    throw new Error('Failed to encrypt data')
  }
}

/**
 * Decrypt data using AES-256-GCM
 * @param encryptedData - Base64 encoded encrypted data with salt and IV
 * @param masterPassword - The master password for decryption
 * @returns Decrypted plaintext
 */
export async function decrypt(encryptedData: string, masterPassword: string): Promise<string> {
  try {
    // Decode from base64
    const combined = new Uint8Array(base64ToArrayBuffer(encryptedData))

    // Extract salt, IV, and encrypted data
    const salt = combined.slice(0, 16)
    const iv = combined.slice(16, 28)
    const encrypted = combined.slice(28)

    // Derive decryption key
    const key = await deriveKey(masterPassword, salt)

    // Decrypt the data
    const decrypted = await crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: iv
      },
      key,
      encrypted
    )

    return arrayBufferToString(decrypted)
  } catch (error) {
    console.error('Decryption error:', error)
    throw new Error('Failed to decrypt data - incorrect password or corrupted data')
  }
}

/**
 * Generate a random encryption key for the user
 * This can be used as a master password if user doesn't want to set one
 */
export function generateRandomKey(): string {
  const array = crypto.getRandomValues(new Uint8Array(32))
  return arrayBufferToBase64(array.buffer)
}

/**
 * Hash a password for verification purposes (not for encryption)
 * Uses SHA-256
 */
export async function hashPassword(password: string): Promise<string> {
  const buffer = stringToArrayBuffer(password)
  const hash = await crypto.subtle.digest('SHA-256', buffer)
  return arrayBufferToBase64(hash)
}

/**
 * Validate that encrypted data can be decrypted with the given password
 * @param encryptedData - The encrypted data to validate
 * @param password - The password to test
 * @returns true if password is correct, false otherwise
 */
export async function validatePassword(encryptedData: string, password: string): Promise<boolean> {
  try {
    await decrypt(encryptedData, password)
    return true
  } catch {
    return false
  }
}
