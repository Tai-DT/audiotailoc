import path from 'node:path';
import { defineConfig } from 'prisma/config';

// Load environment variables
import 'dotenv/config';

export default defineConfig({
    schema: path.join(__dirname, 'prisma', 'schema.prisma'),

    // Migrate configuration - database URLs for migrations
    migrate: {
        url: process.env.DATABASE_URL,
        shadowDatabaseUrl: process.env.DIRECT_DATABASE_URL,
    },
});
