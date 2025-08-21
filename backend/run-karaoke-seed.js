console.log('🏁 Running Karaoke Seeding Script...\n');

try {
  require('ts-node/register');
  require('./src/seed-karaoke.ts');
} catch (error) {
  console.error('❌ Error running seed script:', error.message);
}
