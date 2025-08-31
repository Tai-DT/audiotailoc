/*
  Warnings:

  - You are about to drop the column `metadata` on the `chat_messages` table. All the data in the column will be lost.
  - You are about to drop the column `text` on the `chat_messages` table. All the data in the column will be lost.
  - You are about to drop the column `assignedTo` on the `chat_sessions` table. All the data in the column will be lost.
  - You are about to drop the column `metadata` on the `chat_sessions` table. All the data in the column will be lost.
  - You are about to drop the column `data` on the `notifications` table. All the data in the column will be lost.
  - You are about to drop the column `read` on the `notifications` table. All the data in the column will be lost.
  - You are about to drop the column `readAt` on the `notifications` table. All the data in the column will be lost.
  - You are about to drop the column `raw` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `endDate` on the `promotions` table. All the data in the column will be lost.
  - You are about to drop the column `maxAmount` on the `promotions` table. All the data in the column will be lost.
  - You are about to drop the column `minAmount` on the `promotions` table. All the data in the column will be lost.
  - You are about to drop the column `startDate` on the `promotions` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `promotions` table. All the data in the column will be lost.
  - You are about to drop the column `address` on the `service_bookings` table. All the data in the column will be lost.
  - You are about to drop the column `customerEmail` on the `service_bookings` table. All the data in the column will be lost.
  - You are about to drop the column `customerName` on the `service_bookings` table. All the data in the column will be lost.
  - You are about to drop the column `customerPhone` on the `service_bookings` table. All the data in the column will be lost.
  - Added the required column `content` to the `chat_messages` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `service_bookings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `basePriceCents` to the `services` table without a default value. This is not possible if the table is not empty.
  - Added the required column `duration` to the `services` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `services` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "inventory" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "productId" TEXT NOT NULL,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "reserved" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "inventory_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "wishlist_items" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "wishlist_items_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "wishlist_items_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "product_reviews" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "title" TEXT,
    "comment" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "product_reviews_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "product_reviews_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "pages" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "search_queries" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "query" TEXT NOT NULL,
    "userId" TEXT,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "search_queries_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "product_views" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "productId" TEXT NOT NULL,
    "userId" TEXT,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "duration" INTEGER,
    CONSTRAINT "product_views_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "product_views_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "service_views" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "serviceId" TEXT NOT NULL,
    "userId" TEXT,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "duration" INTEGER,
    CONSTRAINT "service_views_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "service_views_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "services" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "customer_questions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT,
    "question" TEXT NOT NULL,
    "category" TEXT,
    "satisfaction" INTEGER,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "customer_questions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "technicians" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "specialties" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "service_items" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "serviceId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "service_items_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "services" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "service_booking_items" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "bookingId" TEXT NOT NULL,
    "serviceItemId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "service_booking_items_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "service_bookings" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "service_booking_items_serviceItemId_fkey" FOREIGN KEY ("serviceItemId") REFERENCES "service_items" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "technician_schedules" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "technicianId" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "technician_schedules_technicianId_fkey" FOREIGN KEY ("technicianId") REFERENCES "technicians" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "system_configs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'STRING'
);

-- CreateTable
CREATE TABLE "loyalty_accounts" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "points" INTEGER NOT NULL DEFAULT 0,
    "tier" TEXT NOT NULL DEFAULT 'BRONZE',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "loyalty_accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "point_transactions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "accountId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT,
    "expiresAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "point_transactions_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "loyalty_accounts" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "redemption_history" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "accountId" TEXT NOT NULL,
    "rewardId" TEXT NOT NULL,
    "pointsUsed" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'COMPLETED',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "redemption_history_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "loyalty_accounts" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "redemption_history_rewardId_fkey" FOREIGN KEY ("rewardId") REFERENCES "loyalty_rewards" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "loyalty_rewards" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "pointsCost" INTEGER NOT NULL,
    "value" INTEGER NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'DISCOUNT',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "webhooks" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "url" TEXT NOT NULL,
    "secret" TEXT NOT NULL,
    "events" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "projects" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "userId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "projects_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_chat_messages" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionId" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'user',
    "content" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "chat_messages_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "chat_sessions" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_chat_messages" ("createdAt", "id", "role", "sessionId", "updatedAt") SELECT "createdAt", "id", "role", "sessionId", "updatedAt" FROM "chat_messages";
DROP TABLE "chat_messages";
ALTER TABLE "new_chat_messages" RENAME TO "chat_messages";
CREATE TABLE "new_chat_sessions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT,
    "guestId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "source" TEXT NOT NULL DEFAULT 'WEB',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "chat_sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_chat_sessions" ("createdAt", "guestId", "id", "source", "status", "updatedAt", "userId") SELECT "createdAt", "guestId", "id", "source", "status", "updatedAt", "userId" FROM "chat_sessions";
DROP TABLE "chat_sessions";
ALTER TABLE "new_chat_sessions" RENAME TO "chat_sessions";
CREATE TABLE "new_knowledge_base_entries" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "kind" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "productId" TEXT,
    "tags" TEXT,
    "embedding" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "knowledge_base_entries_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_knowledge_base_entries" ("content", "createdAt", "embedding", "id", "kind", "productId", "title", "updatedAt") SELECT "content", "createdAt", "embedding", "id", "kind", "productId", "title", "updatedAt" FROM "knowledge_base_entries";
DROP TABLE "knowledge_base_entries";
ALTER TABLE "new_knowledge_base_entries" RENAME TO "knowledge_base_entries";
CREATE TABLE "new_notifications" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'INFO',
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_notifications" ("createdAt", "id", "message", "title", "type", "userId") SELECT "createdAt", "id", "message", "title", "type", "userId" FROM "notifications";
DROP TABLE "notifications";
ALTER TABLE "new_notifications" RENAME TO "notifications";
CREATE TABLE "new_payment_intents" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orderId" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "amountCents" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "clientSecret" TEXT,
    "returnUrl" TEXT,
    "metadata" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "payment_intents_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_payment_intents" ("amountCents", "clientSecret", "createdAt", "id", "metadata", "orderId", "provider", "returnUrl", "status", "updatedAt") SELECT "amountCents", "clientSecret", "createdAt", "id", "metadata", "orderId", "provider", "returnUrl", "status", "updatedAt" FROM "payment_intents";
DROP TABLE "payment_intents";
ALTER TABLE "new_payment_intents" RENAME TO "payment_intents";
CREATE TABLE "new_payments" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orderId" TEXT NOT NULL,
    "intentId" TEXT,
    "provider" TEXT NOT NULL,
    "amountCents" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "transactionId" TEXT,
    "metadata" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "payments_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "payments_intentId_fkey" FOREIGN KEY ("intentId") REFERENCES "payment_intents" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_payments" ("amountCents", "createdAt", "id", "intentId", "orderId", "provider", "status", "transactionId", "updatedAt") SELECT "amountCents", "createdAt", "id", "intentId", "orderId", "provider", "status", "transactionId", "updatedAt" FROM "payments";
DROP TABLE "payments";
ALTER TABLE "new_payments" RENAME TO "payments";
CREATE TABLE "new_products" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "priceCents" INTEGER NOT NULL,
    "imageUrl" TEXT,
    "images" TEXT,
    "categoryId" TEXT,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "products_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_products" ("categoryId", "createdAt", "description", "featured", "id", "imageUrl", "images", "isActive", "name", "priceCents", "slug", "updatedAt") SELECT "categoryId", "createdAt", "description", "featured", "id", "imageUrl", "images", "isActive", "name", "priceCents", "slug", "updatedAt" FROM "products";
DROP TABLE "products";
ALTER TABLE "new_products" RENAME TO "products";
CREATE UNIQUE INDEX "products_slug_key" ON "products"("slug");
CREATE TABLE "new_promotions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT NOT NULL DEFAULT 'PERCENTAGE',
    "value" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "expiresAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_promotions" ("code", "createdAt", "description", "id", "isActive", "name", "type", "value") SELECT "code", "createdAt", "description", "id", "isActive", "name", "type", "value" FROM "promotions";
DROP TABLE "promotions";
ALTER TABLE "new_promotions" RENAME TO "promotions";
CREATE UNIQUE INDEX "promotions_code_key" ON "promotions"("code");
CREATE TABLE "new_service_bookings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "technicianId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "scheduledAt" DATETIME,
    "completedAt" DATETIME,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "service_bookings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "service_bookings_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "services" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "service_bookings_technicianId_fkey" FOREIGN KEY ("technicianId") REFERENCES "technicians" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_service_bookings" ("createdAt", "id", "notes", "scheduledAt", "serviceId", "status", "updatedAt") SELECT "createdAt", "id", "notes", "scheduledAt", "serviceId", "status", "updatedAt" FROM "service_bookings";
DROP TABLE "service_bookings";
ALTER TABLE "new_service_bookings" RENAME TO "service_bookings";
CREATE TABLE "new_services" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "basePriceCents" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,
    "duration" INTEGER NOT NULL,
    "categoryId" TEXT,
    "images" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "category" TEXT,
    "type" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_services" ("category", "createdAt", "description", "id", "isActive", "name", "price", "type", "updatedAt") SELECT "category", "createdAt", "description", "id", "isActive", "name", "price", "type", "updatedAt" FROM "services";
DROP TABLE "services";
ALTER TABLE "new_services" RENAME TO "services";
CREATE UNIQUE INDEX "services_slug_key" ON "services"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "inventory_productId_key" ON "inventory"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "wishlist_items_userId_productId_key" ON "wishlist_items"("userId", "productId");

-- CreateIndex
CREATE UNIQUE INDEX "pages_slug_key" ON "pages"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "technicians_email_key" ON "technicians"("email");

-- CreateIndex
CREATE UNIQUE INDEX "system_configs_key_key" ON "system_configs"("key");

-- CreateIndex
CREATE UNIQUE INDEX "loyalty_accounts_userId_key" ON "loyalty_accounts"("userId");
