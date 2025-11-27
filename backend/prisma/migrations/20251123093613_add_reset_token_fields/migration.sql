-- AlterTable
ALTER TABLE "public"."users" ADD COLUMN     "resetExpires" TIMESTAMP(3),
ADD COLUMN     "resetToken" TEXT;
