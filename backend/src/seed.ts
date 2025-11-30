import { spawn } from 'child_process';
import * as path from 'path';

async function runSeed(scriptName: string): Promise<void> {
    console.log(`\n🚀 Running ${scriptName}...`);
    return new Promise((resolve, reject) => {
        const scriptPath = path.join(__dirname, '..', 'prisma', scriptName);
        const childProcess = spawn('npx', ['ts-node', scriptPath], {
            shell: false,
            stdio: 'inherit',
        });

        childProcess.on('close', (code) => {
            if (code === 0) {
                resolve();
            } else {
                reject(new Error(`Process exited with code ${code}`));
            }
        });

        childProcess.on('error', (error) => {
            reject(error);
        });
    });
}

async function main() {
    console.log('🌱 Starting Master Seed Process...');
    const startTime = Date.now();

    try {
        // 1. Seed Admin (Users)
        await runSeed('seed-admin.ts');

        // 2. Seed Customers (Users)
        await runSeed('seed-customers.ts');

        // 3. Seed Products & Categories
        await runSeed('seed-products.ts');

        // 4. Seed Promotions (Depends on Admin, Products, Categories)
        await runSeed('seed-promotions.ts');

        const duration = ((Date.now() - startTime) / 1000).toFixed(2);
        console.log(`\n✅ All seeds completed successfully in ${duration}s!`);
    } catch (error) {
        console.error('\n❌ Seeding failed!');
        process.exit(1);
    }
}

main();
