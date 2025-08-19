import { createHash, randomBytes, scrypt, timingSafeEqual } from 'crypto';
import { promisify } from 'util';

const scryptAsync = promisify(scrypt);

/**
 * Generate random string
 */
export function generateRandomString(length: number = 32): string {
  return randomBytes(length).toString('hex');
}

/**
 * Generate random token
 */
export function generateToken(length: number = 64): string {
  return randomBytes(length).toString('base64url');
}

/**
 * Hash string using SHA-256
 */
export function hashString(input: string): string {
  return createHash('sha256').update(input).digest('hex');
}

/**
 * Hash password using scrypt
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString('hex');
  const hash = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${salt}:${hash.toString('hex')}`;
}

/**
 * Verify password against hash
 */
export async function verifyPassword(
  password: string,
  hashedPassword: string,
): Promise<boolean> {
  const [salt, hash] = hashedPassword.split(':');
  if (!salt || !hash) {
    return false;
  }
  const testHash = (await scryptAsync(password, salt, 64)) as Buffer;
  const originalHash = Buffer.from(hash, 'hex');
  
  return timingSafeEqual(testHash, originalHash);
}

/**
 * Generate JWT secret
 */
export function generateJwtSecret(): string {
  return randomBytes(64).toString('base64url');
}

/**
 * Generate API key
 */
export function generateApiKey(prefix: string = 'at'): string {
  const timestamp = Date.now().toString(36);
  const random = randomBytes(16).toString('hex');
  return `${prefix}_${timestamp}_${random}`;
}

/**
 * Generate short ID
 */
export function generateShortId(length: number = 8): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Generate UUID v4
 */
export function generateUuid(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Encrypt text (simple base64 encoding for demo)
 * In production, use proper encryption like AES
 */
export function encryptText(text: string): string {
  return Buffer.from(text, 'utf8').toString('base64');
}

/**
 * Decrypt text (simple base64 decoding for demo)
 * In production, use proper decryption like AES
 */
export function decryptText(encryptedText: string): string {
  return Buffer.from(encryptedText, 'base64').toString('utf8');
}

/**
 * Generate secure random number
 */
export function generateSecureRandom(min: number, max: number): number {
  const range = max - min + 1;
  const bytesNeeded = Math.ceil(Math.log2(range) / 8);
  const maxNum = Math.pow(256, bytesNeeded);
  const maxValidNum = maxNum - (maxNum % range);
  
  let randomNum: number;
  do {
    randomNum = parseInt(randomBytes(bytesNeeded).toString('hex'), 16);
  } while (randomNum >= maxValidNum);
  
  return min + (randomNum % range);
}

/**
 * Generate password reset token
 */
export function generatePasswordResetToken(): string {
  return generateToken(32);
}

/**
 * Generate email verification token
 */
export function generateEmailVerificationToken(): string {
  return generateToken(32);
}

/**
 * Generate refresh token
 */
export function generateRefreshToken(): string {
  return generateToken(64);
}

/**
 * Generate access token
 */
export function generateAccessToken(): string {
  return generateToken(32);
}
