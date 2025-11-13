/**
 * Prisma Model Mapping Helper
 * Maps snake_case database table names to camelCase for easier use in code
 * 
 * This file provides type-safe access to Prisma models using developer-friendly names.
 */

import { PrismaClient } from '@prisma/client';

/**
 * Type-safe model accessor that maps camelCase names to snake_case Prisma delegates
 */
export class PrismaHelper {
  constructor(private prisma: PrismaClient) {}

  // Model accessors
  get activityLog() { return this.prisma.activity_logs; }
  get banner() { return this.prisma.banners; }
  get blogArticle() { return this.prisma.blog_articles; }
  get blogCategory() { return this.prisma.blog_categories; }
  get blogComment() { return this.prisma.blog_comments; }
  get cart() { return this.prisma.carts; }
  get cartItem() { return this.prisma.cart_items; }
  get category() { return this.prisma.categories; }
  // get comparison() { return this.prisma.comparisons; } // Not in schema
  // get comparisonItem() { return this.prisma.comparison_items; } // Not in schema
  // get contactMessage() { return this.prisma.contact_messages; } // Not in schema
  // get coupon() { return this.prisma.coupons; } // Not in schema
  get customerQuestion() { return this.prisma.customer_questions; }
  // get dashboardWidget() { return this.prisma.dashboard_widgets; } // Not in schema
  get knowledgeBaseEntry() { return this.prisma.knowledge_base_entries; }
  // get notification() { return this.prisma.notifications; } // Not in schema
  get order() { return this.prisma.orders; }
  get orderItem() { return this.prisma.order_items; }
  // get orderStatusHistory() { return this.prisma.order_status_history; } // Not in schema (use service_status_history)
  get payment() { return this.prisma.payments; }
  get paymentIntent() { return this.prisma.payment_intents; }
  get product() { return this.prisma.products; }
  // get productImage() { return this.prisma.product_images; } // Not in schema (images stored in JSON fields)
  get productReview() { return this.prisma.product_reviews; }
  // get productSpec() { return this.prisma.product_specs; } // Not in schema (specs stored in JSON fields)
  // get productTag() { return this.prisma.product_tags; } // Not in schema
  get project() { return this.prisma.projects; }
  // get projectImage() { return this.prisma.project_images; } // Not in schema
  // get projectService() { return this.prisma.project_services; } // Not in schema
  get service() { return this.prisma.services; }
  get serviceBooking() { return this.prisma.service_bookings; }
  get serviceBookingItem() { return this.prisma.service_booking_items; }
  get serviceItem() { return this.prisma.service_items; }
  get serviceType() { return this.prisma.service_types; }
  // get session() { return this.prisma.sessions; } // Not in schema
  get systemConfig() { return this.prisma.system_configs; }
  // get tag() { return this.prisma.tags; } // Not in schema
  get technician() { return this.prisma.technicians; }
  get technicianSchedule() { return this.prisma.technician_schedules; }
  get user() { return this.prisma.users; }
  get wishlistItem() { return this.prisma.wishlist_items; }

  // Pass-through for transactions and other Prisma methods
  get $transaction() { return this.prisma.$transaction.bind(this.prisma); }
  get $connect() { return this.prisma.$connect.bind(this.prisma); }
  get $disconnect() { return this.prisma.$disconnect.bind(this.prisma); }
  get $on() { return this.prisma.$on.bind(this.prisma); }
  get $queryRaw() { return this.prisma.$queryRaw.bind(this.prisma); }
  get $executeRaw() { return this.prisma.$executeRaw.bind(this.prisma); }
}

export default PrismaHelper;
