#!/usr/bin/env node

/**
 * Audio Tài Lộc - Security Environment Generator
 * Generates strong environment variables for production deployment
 */

const crypto = require('crypto');

function generateSecureSecret(length = 64) {
  return crypto.randomBytes(length).toString('base64url');
}

function generateJWTSecret() {
  return crypto.randomBytes(64).toString('hex');
}

function generateAPIKey() {
  return crypto.randomBytes(32).toString('hex');
}

console.log('🔐 Audio Tài Lộc - Security Environment Generator\n');

const secrets = {
  // JWT Secrets
  JWT_ACCESS_SECRET: generateJWTSecret(),
  JWT_REFRESH_SECRET: generateJWTSecret(),
  
  // API Keys
  ADMIN_API_KEY: generateAPIKey(),
  
  // Session Secrets
  SESSION_SECRET: generateSecureSecret(),
  
  // Encryption Keys
  ENCRYPTION_KEY: generateSecureSecret(32),
  
  // Database
  DATABASE_URL: 'postgresql://username:password@host:5432/audiotailoc_prod',
  
  // Redis
  REDIS_URL: 'redis://user:password@host:6379',
  
  // Environment
  NODE_ENV: 'production',
  PORT: '3010',
};

console.log('📋 Backend Environment Variables (.env):\n');
for (const [key, value] of Object.entries(secrets)) {
  console.log(`${key}="${value}"`);
}

console.log('\n🚨 SECURITY WARNINGS:');
console.log('- Store these secrets securely (LastPass, 1Password, etc.)');
console.log('- Never commit real secrets to Git');
console.log('- Use different secrets for dev/staging/production');
console.log('- Rotate secrets regularly');
console.log('- Set up proper backup/recovery for secrets');

console.log('\n📝 Next Steps:');
console.log('1. Copy secrets to your environment (Heroku, Vercel, etc.)');
console.log('2. Update .env.example with placeholder values');
console.log('3. Test authentication flows after deployment');
console.log('4. Set up monitoring for failed auth attempts');