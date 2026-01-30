// @ts-nocheck
import { defineConfig } from 'prisma/config';
import * as path from 'path';
import 'dotenv/config';

export default defineConfig({
    schema: path.join(process.cwd(), 'prisma/schema.prisma'),

    // Migrate configuration - database URLs for migrations
    migrate: {
        url: process.env.DATABASE_URL as string,
        shadowDatabaseUrl: process.env.DIRECT_DATABASE_URL as string,
    },
    // @ts-ignore - Prisma 7 config property
    datasource: {
        provider: 'postgresql',
        url: process.env.DATABASE_URL as string,
    },
});
