export declare const ApiResponses: {
    OK: {
        status: number;
        description: string;
    };
    CREATED: {
        status: number;
        description: string;
    };
    NO_CONTENT: {
        status: number;
        description: string;
    };
    BAD_REQUEST: {
        status: number;
        description: string;
    };
    UNAUTHORIZED: {
        status: number;
        description: string;
    };
    FORBIDDEN: {
        status: number;
        description: string;
    };
    NOT_FOUND: {
        status: number;
        description: string;
    };
    CONFLICT: {
        status: number;
        description: string;
    };
    VALIDATION_ERROR: {
        status: number;
        description: string;
    };
    RATE_LIMITED: {
        status: number;
        description: string;
    };
    INTERNAL_ERROR: {
        status: number;
        description: string;
    };
    SERVICE_UNAVAILABLE: {
        status: number;
        description: string;
    };
};
export declare const CommonQueryParams: {
    PAGE: {
        name: string;
        required: boolean;
        description: string;
        example: number;
        schema: {
            type: string;
            minimum: number;
            default: number;
        };
    };
    PAGE_SIZE: {
        name: string;
        required: boolean;
        description: string;
        example: number;
        schema: {
            type: string;
            minimum: number;
            maximum: number;
            default: number;
        };
    };
    SEARCH: {
        name: string;
        required: boolean;
        description: string;
        example: string;
        schema: {
            type: string;
        };
    };
    SORT_BY: {
        name: string;
        required: boolean;
        description: string;
        example: string;
        schema: {
            type: string;
            enum: string[];
        };
    };
    SORT_ORDER: {
        name: string;
        required: boolean;
        description: string;
        example: string;
        schema: {
            type: string;
            enum: string[];
            default: string;
        };
    };
};
export declare const SecuritySchemes: {
    JWT: {
        type: string;
        scheme: string;
        bearerFormat: string;
        name: string;
        description: string;
        in: string;
    };
    API_KEY: {
        type: string;
        name: string;
        in: string;
        description: string;
    };
};
export declare const ExampleData: {
    USER: {
        id: string;
        email: string;
        name: string;
        role: string;
        isVerified: boolean;
        phone: string;
        createdAt: string;
        lastLoginAt: string;
    };
    PRODUCT: {
        id: string;
        name: string;
        slug: string;
        description: string;
        priceCents: number;
        imageUrl: string;
        categoryId: string;
        featured: boolean;
        inStock: boolean;
        specifications: {
            brand: string;
            model: string;
            type: string;
            connectivity: string;
            batteryLife: string;
            weight: string;
            noiseCancellation: boolean;
            warranty: string;
        };
        images: string[];
        createdAt: string;
        updatedAt: string;
    };
    CATEGORY: {
        id: string;
        name: string;
        slug: string;
        description: string;
        imageUrl: string;
        productCount: number;
        createdAt: string;
    };
    ORDER: {
        id: string;
        orderNumber: string;
        userId: string;
        status: string;
        totalCents: number;
        shippingAddress: {
            name: string;
            phone: string;
            email: string;
            address: string;
            ward: string;
            district: string;
            city: string;
            postalCode: string;
            country: string;
        };
        items: {
            productId: string;
            name: string;
            sku: string;
            quantity: number;
            unitPriceCents: number;
            totalCents: number;
            imageUrl: string;
        }[];
        paymentMethod: string;
        paymentStatus: string;
        shippingMethod: string;
        shippingCents: number;
        taxCents: number;
        discountCents: number;
        createdAt: string;
        updatedAt: string;
    };
    CART: {
        id: string;
        userId: string;
        items: {
            productId: string;
            name: string;
            quantity: number;
            unitPriceCents: number;
            totalCents: number;
            imageUrl: string;
        }[];
        totalCents: number;
        itemCount: number;
        createdAt: string;
        updatedAt: string;
    };
    PAYMENT_INTENT: {
        id: string;
        amount: number;
        currency: string;
        status: string;
        paymentMethod: string;
        orderId: string;
        metadata: {
            customerName: string;
            customerEmail: string;
            orderNumber: string;
        };
        createdAt: string;
        completedAt: string;
    };
};
export declare const ErrorExamples: {
    VALIDATION: {
        success: boolean;
        message: string;
        errorCode: string;
        errors: string[];
        timestamp: string;
        requestId: string;
        path: string;
    };
    UNAUTHORIZED: {
        success: boolean;
        message: string;
        errorCode: string;
        timestamp: string;
        requestId: string;
        path: string;
    };
    FORBIDDEN: {
        success: boolean;
        message: string;
        errorCode: string;
        timestamp: string;
        requestId: string;
        path: string;
    };
    NOT_FOUND: {
        success: boolean;
        message: string;
        errorCode: string;
        timestamp: string;
        requestId: string;
        path: string;
    };
    RATE_LIMITED: {
        success: boolean;
        message: string;
        errorCode: string;
        retryAfter: number;
        timestamp: string;
        requestId: string;
    };
};
export declare const CartExamples: {
    EMPTY_CART: {
        id: string;
        items: any[];
        totalQuantity: number;
        totalPrice: number;
        createdAt: string;
        updatedAt: string;
    };
    GUEST_CART: {
        id: string;
        items: {
            id: string;
            productId: string;
            product: {
                id: string;
                name: string;
                price: number;
                image: string;
            };
            quantity: number;
            unitPrice: number;
            totalPrice: number;
        }[];
        totalQuantity: number;
        totalPrice: number;
        createdAt: string;
        updatedAt: string;
    };
    USER_CART: {
        id: string;
        userId: string;
        items: {
            id: string;
            productId: string;
            product: {
                id: string;
                name: string;
                price: number;
                image: string;
            };
            quantity: number;
            unitPrice: number;
            totalPrice: number;
        }[];
        totalQuantity: number;
        totalPrice: number;
        createdAt: string;
        updatedAt: string;
    };
    ADD_TO_CART: {
        productId: string;
        quantity: number;
    };
    UPDATE_CART_ITEM: {
        quantity: number;
    };
};
export declare const OrderExamples: {
    ORDER_PENDING: {
        id: string;
        status: string;
        totalAmount: number;
        items: {
            id: string;
            productId: string;
            productName: string;
            quantity: number;
            unitPrice: number;
            totalPrice: number;
        }[];
        customer: {
            name: string;
            phone: string;
            email: string;
        };
        shippingAddress: {
            address: string;
            ward: string;
            district: string;
            city: string;
            postalCode: string;
        };
        notes: string;
        createdAt: string;
        updatedAt: string;
    };
    ORDER_CONFIRMED: {
        id: string;
        status: string;
        totalAmount: number;
        items: {
            id: string;
            productId: string;
            productName: string;
            quantity: number;
            unitPrice: number;
            totalPrice: number;
        }[];
        customer: {
            name: string;
            phone: string;
            email: string;
        };
        shippingAddress: {
            address: string;
            ward: string;
            district: string;
            city: string;
            postalCode: string;
        };
        paymentMethod: string;
        estimatedDelivery: string;
        createdAt: string;
        updatedAt: string;
    };
    CREATE_ORDER: {
        items: {
            productId: string;
            quantity: number;
        }[];
        shippingAddress: string;
        customerName: string;
        customerPhone: string;
        customerEmail: string;
        notes: string;
    };
};
export declare const PaymentExamples: {
    PAYMENT_METHODS: {
        id: string;
        name: string;
        description: string;
        logo: string;
        enabled: boolean;
        fees: string;
        minAmount: number;
        maxAmount: number;
    }[];
    PAYMENT_INTENT: {
        id: string;
        orderId: string;
        provider: string;
        amount: number;
        currency: string;
        status: string;
        paymentUrl: string;
        idempotencyKey: string;
        returnUrl: string;
        createdAt: string;
        expiresAt: string;
    };
    CREATE_INTENT: {
        orderId: string;
        provider: string;
        idempotencyKey: string;
        returnUrl: string;
    };
    PAYMENT_SUCCESS: {
        id: string;
        orderId: string;
        provider: string;
        amount: number;
        currency: string;
        status: string;
        transactionId: string;
        paidAt: string;
        bankCode: string;
        bankTranNo: string;
    };
    REFUND_REQUEST: {
        paymentId: string;
        amountCents: number;
        reason: string;
    };
    REFUND_RESPONSE: {
        id: string;
        paymentId: string;
        orderId: string;
        amount: number;
        currency: string;
        status: string;
        reason: string;
        createdAt: string;
        estimatedCompletionAt: string;
    };
};
export declare const UserExamples: {
    USER_PROFILE: {
        id: string;
        email: string;
        name: string;
        phone: string;
        role: string;
        avatar: string;
        address: {
            street: string;
            ward: string;
            district: string;
            city: string;
            postalCode: string;
        };
        preferences: {
            language: string;
            currency: string;
        };
        stats: {
            totalOrders: number;
            totalSpent: number;
            averageOrderValue: number;
            favoriteCategory: string;
        };
        createdAt: string;
        updatedAt: string;
        lastLoginAt: string;
    };
    ADMIN_USER: {
        id: string;
        email: string;
        name: string;
        phone: string;
        role: string;
        avatar: string;
        permissions: string[];
        createdAt: string;
        updatedAt: string;
        lastLoginAt: string;
    };
    CREATE_USER: {
        email: string;
        password: string;
        name: string;
        phone: string;
        role: string;
    };
    UPDATE_USER: {
        name: string;
        phone: string;
    };
    USER_STATS: {
        totalUsers: number;
        activeUsers: number;
        newUsersThisMonth: number;
        usersByRole: {
            USER: number;
            ADMIN: number;
        };
        usersByStatus: {
            active: number;
            inactive: number;
        };
        topLocations: {
            city: string;
            count: number;
        }[];
        growthRate: number;
    };
    ACTIVITY_STATS: {
        period: string;
        dailyActiveUsers: {
            date: string;
            count: number;
        }[];
        loginsByHour: {
            '08': number;
            '09': number;
            '10': number;
            '11': number;
            '12': number;
            '13': number;
            '14': number;
            '15': number;
            '16': number;
            '17': number;
            '18': number;
            '19': number;
            '20': number;
            '21': number;
            '22': number;
        };
        averageSessionDuration: string;
        topActions: {
            action: string;
            count: number;
        }[];
    };
};
export declare const FileExamples: {
    UPLOADED_FILE: {
        id: string;
        filename: string;
        originalName: string;
        mimeType: string;
        size: number;
        url: string;
        thumbnailUrl: string;
        type: string;
        metadata: {
            width: number;
            height: number;
            format: string;
            colorSpace: string;
        };
        uploadedBy: string;
        associatedWith: {
            type: string;
            id: string;
        };
        storage: {
            provider: string;
            bucket: string;
            key: string;
        };
        createdAt: string;
        updatedAt: string;
    };
    USER_AVATAR: {
        id: string;
        filename: string;
        originalName: string;
        mimeType: string;
        size: number;
        url: string;
        thumbnailUrl: string;
        type: string;
        metadata: {
            width: number;
            height: number;
            format: string;
            colorSpace: string;
        };
        uploadedBy: string;
        associatedWith: {
            type: string;
            id: string;
        };
        createdAt: string;
        updatedAt: string;
    };
    MULTIPLE_FILES: {
        id: string;
        filename: string;
        originalName: string;
        mimeType: string;
        size: number;
        url: string;
        type: string;
    }[];
    FILE_STATS: {
        totalFiles: number;
        totalSize: string;
        filesByType: {
            'product-image': number;
            'user-avatar': number;
            document: number;
            'gallery-image': number;
        };
        storageUsage: {
            used: string;
            limit: string;
            percentage: number;
        };
        recentUploads: number;
        popularTypes: {
            type: string;
            count: number;
        }[];
    };
};
export declare const AdminExamples: {
    DASHBOARD_OVERVIEW: {
        overview: {
            totalUsers: number;
            totalProducts: number;
            totalOrders: number;
            totalRevenue: number;
            newUsers: number;
            newOrders: number;
            pendingOrders: number;
            lowStockProducts: number;
        };
        recentActivities: {
            orders: {
                id: string;
                totalAmount: number;
                status: string;
                createdAt: string;
                user: {
                    name: string;
                    email: string;
                };
            }[];
            users: {
                id: string;
                name: string;
                email: string;
                createdAt: string;
            }[];
        };
        period: {
            startDate: string;
            endDate: string;
        };
    };
    BULK_ACTION_REQUEST: {
        action: string;
        ids: string[];
        type: string;
    };
    BULK_ACTION_RESPONSE: {
        success: boolean;
        message: string;
        processed: number;
        failed: number;
        results: {
            id: string;
            status: string;
        }[];
    };
    SYSTEM_STATUS: {
        status: string;
        uptime: string;
        version: string;
        environment: string;
        database: {
            status: string;
            responseTime: string;
            connections: {
                active: number;
                max: number;
            };
        };
        cache: {
            status: string;
            hitRate: string;
            memoryUsage: string;
        };
        storage: {
            used: string;
            available: string;
            percentage: number;
        };
    };
};
export declare const InventoryExamples: {
    INVENTORY_LIST: {
        success: boolean;
        data: {
            items: ({
                id: string;
                productId: string;
                productName: string;
                sku: string;
                currentStock: number;
                reservedStock: number;
                availableStock: number;
                lowStockThreshold: number;
                status: string;
                lastRestocked: string;
                movements: {
                    type: string;
                    quantity: number;
                    date: string;
                    note: string;
                }[];
                alert?: undefined;
            } | {
                id: string;
                productId: string;
                productName: string;
                sku: string;
                currentStock: number;
                reservedStock: number;
                availableStock: number;
                lowStockThreshold: number;
                status: string;
                alert: string;
                lastRestocked: string;
                movements?: undefined;
            })[];
            pagination: {
                page: number;
                pageSize: number;
                total: number;
                totalPages: number;
            };
            summary: {
                totalProducts: number;
                lowStockProducts: number;
                outOfStockProducts: number;
                totalValue: number;
            };
        };
    };
    INVENTORY_ADJUSTMENT: {
        success: boolean;
        data: {
            id: string;
            productId: string;
            adjustments: {
                stockDelta: number;
                reservedDelta: number;
                previousStock: number;
                newStock: number;
                previousReserved: number;
                newReserved: number;
            };
            reason: string;
            adjustedBy: string;
            adjustedAt: string;
        };
        message: string;
    };
    LOW_STOCK_ALERT: {
        success: boolean;
        data: {
            alertProducts: {
                productId: string;
                productName: string;
                currentStock: number;
                lowStockThreshold: number;
                recommendedRestock: number;
                supplier: string;
                lastOrder: string;
            }[];
            totalAlerts: number;
            urgentAlerts: number;
        };
    };
};
export declare const MarketingExamples: {
    CAMPAIGNS_LIST: {
        success: boolean;
        data: {
            campaigns: ({
                id: string;
                name: string;
                type: string;
                status: string;
                description: string;
                startDate: string;
                endDate: string;
                budget: number;
                spent: number;
                targeting: {
                    ageRange: string;
                    location: string[];
                    interests: string[];
                    segment?: undefined;
                    purchaseHistory?: undefined;
                };
                offers: {
                    type: string;
                    value: number;
                    category: string;
                    conditions: string;
                }[];
                performance: {
                    impressions: number;
                    clicks: number;
                    conversions: number;
                    revenue: number;
                    ctr: number;
                    conversionRate: number;
                    roas: number;
                };
            } | {
                id: string;
                name: string;
                type: string;
                status: string;
                description: string;
                startDate: string;
                endDate: string;
                budget: number;
                targeting: {
                    segment: string;
                    purchaseHistory: string;
                    ageRange?: undefined;
                    location?: undefined;
                    interests?: undefined;
                };
                offers: {
                    type: string;
                    value: number;
                    products: string[];
                    conditions: string;
                }[];
                spent?: undefined;
                performance?: undefined;
            })[];
            pagination: {
                page: number;
                pageSize: number;
                total: number;
                totalPages: number;
            };
            summary: {
                totalCampaigns: number;
                activeCampaigns: number;
                totalBudget: number;
                totalSpent: number;
                averageRoas: number;
            };
        };
    };
    CAMPAIGN_ANALYTICS: {
        success: boolean;
        data: {
            campaignId: string;
            period: {
                start: string;
                end: string;
            };
            metrics: {
                reach: number;
                impressions: number;
                clicks: number;
                ctr: number;
                conversions: number;
                conversionRate: number;
                revenue: number;
                roas: number;
                costPerClick: number;
                costPerConversion: number;
            };
            topProducts: {
                productId: string;
                productName: string;
                clicks: number;
                conversions: number;
                revenue: number;
            }[];
            audienceInsights: {
                demographics: {
                    age: {
                        '25-34': number;
                        '35-44': number;
                        '45-54': number;
                        '55+': number;
                    };
                    gender: {
                        male: number;
                        female: number;
                    };
                };
                geography: {
                    'TP.HCM': number;
                    'H\u00E0 N\u1ED9i': number;
                    '\u0110\u00E0 N\u1EB5ng': number;
                    Khác: number;
                };
            };
        };
    };
    PROMOTIONS_LIST: {
        success: boolean;
        data: {
            promotions: ({
                id: string;
                code: string;
                name: string;
                type: string;
                value: number;
                status: string;
                usageLimit: number;
                usedCount: number;
                startDate: string;
                endDate: string;
                conditions: {
                    minOrderValue: number;
                    categories: string[];
                    brands: string[];
                };
                applicableProducts: number;
                totalSavings: number;
            } | {
                id: string;
                code: string;
                name: string;
                type: string;
                status: string;
                usageLimit: any;
                usedCount: number;
                conditions: {
                    minOrderValue: number;
                    categories?: undefined;
                    brands?: undefined;
                };
                value?: undefined;
                startDate?: undefined;
                endDate?: undefined;
                applicableProducts?: undefined;
                totalSavings?: undefined;
            })[];
            summary: {
                totalPromotions: number;
                activePromotions: number;
                totalSavings: number;
                totalUsage: number;
            };
        };
    };
};
export declare const SearchExamples: {
    BASIC_SEARCH: {
        success: boolean;
        data: {
            products: {
                id: string;
                name: string;
                description: string;
                price: number;
                discountPrice: number;
                category: string;
                brand: string;
                imageUrl: string;
                rating: number;
                reviewCount: number;
                inStock: boolean;
                featured: boolean;
                relevanceScore: number;
            }[];
            services: {
                id: string;
                name: string;
                description: string;
                price: number;
                category: string;
                rating: number;
                relevanceScore: number;
            }[];
            total: number;
            query: string;
            searchTime: string;
            suggestions: string[];
        };
    };
    PRODUCT_SEARCH: {
        success: boolean;
        data: {
            products: {
                id: string;
                name: string;
                sku: string;
                description: string;
                price: number;
                discountPrice: number;
                discountPercent: number;
                category: {
                    id: string;
                    name: string;
                    slug: string;
                };
                brand: string;
                specifications: {
                    power: string;
                    frequency: string;
                    connectivity: string[];
                };
                images: string[];
                rating: number;
                reviewCount: number;
                inStock: boolean;
                stockCount: number;
                featured: boolean;
                tags: string[];
                createdAt: string;
            }[];
            filters: {
                categories: {
                    id: string;
                    name: string;
                    count: number;
                }[];
                brands: {
                    name: string;
                    count: number;
                }[];
                priceRanges: {
                    min: number;
                    max: number;
                    count: number;
                }[];
            };
            pagination: {
                page: number;
                limit: number;
                total: number;
                totalPages: number;
            };
            sorting: {
                sortBy: string;
                sortOrder: string;
                availableSort: string[];
            };
            searchTime: string;
        };
    };
    SEARCH_SUGGESTIONS: {
        success: boolean;
        data: {
            suggestions: {
                text: string;
                type: string;
                count: number;
                category: string;
            }[];
            trending: string[];
            recent: string[];
        };
    };
};
export declare const AIExamples: {
    AI_RECOMMENDATION: {
        success: boolean;
        data: {
            recommendations: ({
                productId: string;
                name: string;
                price: number;
                discountPrice: number;
                reason: string;
                confidence: number;
                category: string;
                rating: number;
                imageUrl: string;
            } | {
                productId: string;
                name: string;
                price: number;
                reason: string;
                confidence: number;
                category: string;
                rating: number;
                imageUrl: string;
                discountPrice?: undefined;
            })[];
            algorithm: string;
            generatedAt: string;
            userId: string;
        };
    };
    CHAT_RESPONSE: {
        success: boolean;
        data: {
            response: string;
            suggestions: {
                productId: string;
                name: string;
                price: number;
            }[];
            conversationId: string;
            responseTime: string;
            confidence: number;
        };
    };
    SMART_SEARCH: {
        success: boolean;
        data: {
            query: string;
            interpretedIntent: {
                productType: string;
                roomSize: string;
                budget: number;
                purpose: string;
            };
            recommendations: {
                productId: string;
                name: string;
                price: number;
                suitabilityScore: number;
                reasons: string[];
            }[];
            alternatives: {
                productId: string;
                name: string;
                price: number;
                note: string;
            }[];
            processingTime: string;
        };
    };
};
export declare const BookingExamples: {
    BOOKING_LIST: {
        success: boolean;
        data: {
            bookings: ({
                id: string;
                type: string;
                status: string;
                title: string;
                description: string;
                customer: {
                    id: string;
                    name: string;
                    phone: string;
                    email: string;
                };
                technician: {
                    id: string;
                    name: string;
                    phone: string;
                    rating: number;
                };
                address: {
                    street: string;
                    ward: string;
                    district: string;
                    city: string;
                    coordinates: {
                        lat: number;
                        lng: number;
                    };
                };
                scheduledDate: string;
                estimatedDuration: number;
                services: {
                    id: string;
                    name: string;
                    price: number;
                    duration: number;
                }[];
                totalPrice: number;
                equipment: ({
                    productId: string;
                    name: string;
                    quantity: number;
                    serialNumber: string;
                    serialNumbers?: undefined;
                } | {
                    productId: string;
                    name: string;
                    quantity: number;
                    serialNumbers: string[];
                    serialNumber?: undefined;
                })[];
                notes: string;
                createdAt: string;
                updatedAt: string;
                maintenanceType?: undefined;
                lastMaintenance?: undefined;
            } | {
                id: string;
                type: string;
                status: string;
                title: string;
                description: string;
                customer: {
                    id: string;
                    name: string;
                    phone: string;
                    email?: undefined;
                };
                scheduledDate: string;
                estimatedDuration: number;
                services: {
                    id: string;
                    name: string;
                    price: number;
                    duration: number;
                }[];
                totalPrice: number;
                maintenanceType: string;
                lastMaintenance: string;
                technician?: undefined;
                address?: undefined;
                equipment?: undefined;
                notes?: undefined;
                createdAt?: undefined;
                updatedAt?: undefined;
            })[];
            pagination: {
                page: number;
                pageSize: number;
                total: number;
                totalPages: number;
            };
            summary: {
                totalBookings: number;
                pendingBookings: number;
                confirmedBookings: number;
                completedBookings: number;
                todayBookings: number;
            };
        };
    };
    CREATE_BOOKING: {
        success: boolean;
        data: {
            id: string;
            bookingNumber: string;
            type: string;
            status: string;
            customer: {
                name: string;
                phone: string;
                email: string;
            };
            requestedDate: string;
            estimatedPrice: number;
            services: string[];
            autoAssignment: boolean;
            expectedResponse: string;
            createdAt: string;
        };
        message: string;
    };
    BOOKING_SCHEDULE: {
        success: boolean;
        data: {
            date: string;
            technicians: ({
                id: string;
                name: string;
                skills: string[];
                rating: number;
                workload: number;
                schedule: {
                    timeSlot: string;
                    bookingId: string;
                    status: string;
                    customer: string;
                    service: string;
                }[];
                availableSlots: string[];
            } | {
                id: string;
                name: string;
                skills: string[];
                rating: number;
                workload: number;
                availableSlots: string[];
                schedule?: undefined;
            })[];
            summary: {
                totalBookings: number;
                availableTechnicians: number;
                utilizationRate: number;
            };
        };
    };
};
export declare const CustomerExamples: {
    CUSTOMER_PROFILE: {
        success: boolean;
        data: {
            id: string;
            profile: {
                name: string;
                email: string;
                phone: string;
                dateOfBirth: string;
                gender: string;
                avatar: string;
            };
            address: {
                primary: {
                    street: string;
                    ward: string;
                    district: string;
                    city: string;
                    postalCode: string;
                    isDefault: boolean;
                };
                shipping: {
                    id: string;
                    name: string;
                    street: string;
                    ward: string;
                    district: string;
                    city: string;
                }[];
            };
            preferences: {
                categories: string[];
                brands: string[];
                priceRange: {
                    min: number;
                    max: number;
                };
            };
            loyaltyProgram: {
                tier: string;
                points: number;
                benefits: string[];
            };
            statistics: {
                totalOrders: number;
                totalSpent: number;
                averageOrderValue: number;
                favoriteCategory: string;
            };
        };
    };
    CUSTOMER_INSIGHTS: {
        success: boolean;
        data: {
            segment: string;
            lifetimeValue: number;
            predictedNextPurchase: string;
            recommendations: {
                type: string;
                productId: string;
                reason: string;
                confidence: number;
            }[];
            behaviorPatterns: {
                preferredShoppingTime: string;
                seasonalTrends: string[];
                brandLoyalty: string;
            };
        };
    };
};
export declare const PagesExamples: {
    PAGES_LIST: {
        success: boolean;
        data: {
            pages: ({
                id: string;
                title: string;
                slug: string;
                type: string;
                status: string;
                content: {
                    summary: string;
                };
                seo: {
                    metaTitle: string;
                    metaDescription: string;
                };
                createdAt: string;
                views: number;
                featured: boolean;
                category?: undefined;
                tags?: undefined;
                readingTime?: undefined;
            } | {
                id: string;
                title: string;
                slug: string;
                type: string;
                status: string;
                category: {
                    id: string;
                    name: string;
                };
                tags: string[];
                readingTime: number;
                views: number;
                content?: undefined;
                seo?: undefined;
                createdAt?: undefined;
                featured?: undefined;
            })[];
            pagination: {
                page: number;
                pageSize: number;
                total: number;
                totalPages: number;
            };
        };
    };
};
export declare const MonitoringExamples: {
    HEALTH_CHECK: {
        success: boolean;
        data: {
            status: string;
            timestamp: string;
            uptime: number;
            version: string;
            environment: string;
            components: {
                database: {
                    status: string;
                    responseTime: string;
                    connections: {
                        active: number;
                        max: number;
                    };
                };
                redis: {
                    status: string;
                    responseTime: string;
                    memory: {
                        used: string;
                        max: string;
                    };
                };
                storage: {
                    status: string;
                    disk: {
                        used: string;
                        available: string;
                    };
                };
            };
        };
    };
};
