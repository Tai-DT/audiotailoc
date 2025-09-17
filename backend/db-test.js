const { exec } = require('child_process');

console.log('  Database Connectivity Test');
console.log('==============================');

// Change to backend directory and run a simple Prisma command
const cmd = 'cd backend && npx prisma version';

exec(cmd, (error, stdout, stderr) => {
  if (error) {
    console.log(' Prisma not accessible:', error.message);
    return;
  }
  
  console.log(' Prisma is available');
  console.log('Version info:');
  console.log(stdout);
  
  // Now test database connection
  const dbTest = 'cd backend && node -e \"const { PrismaClient } = require('@prisma/client'); const prisma = new PrismaClient(); prisma.user.count().then(count => { console.log(\'Database connected! User count:\', count); process.exit(0); }).catch(err => { console.log(\'Database error:\', err.message); process.exit(1); });\"';
  
  exec(dbTest, (dbError, dbStdout, dbStderr) => {
    if (dbError) {
      console.log(' Database connection failed:', dbError.message);
    } else {
      console.log(' Database connection successful');
      console.log(dbStdout);
    }
  });
});
