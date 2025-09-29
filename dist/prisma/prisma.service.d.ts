import { OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
export declare class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    constructor();
    getAcceleratedClient(): import("@prisma/client/runtime/library").DynamicClientExtensionThis<import(".prisma/client").Prisma.TypeMap<import("@prisma/client/runtime/library").InternalArgs & {
        result: {};
        model: {
            $allModels: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This_1, FormalArgs_1 extends import("@prisma/client/runtime/library").Args<This_1, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_1 extends FormalArgs_1>(this: This_1, args?: { [key_1 in keyof ActualArgs_1]: key_1 extends keyof FormalArgs_1 ? ActualArgs_1[key_1] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_1, ActualArgs_1, "count">>;
                findFirst: () => <This_2, FormalArgs_2 extends import("@prisma/client/runtime/library").Args<This_2, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_2 extends FormalArgs_2>(this: This_2, args?: { [key_2 in keyof ActualArgs_2]: key_2 extends keyof FormalArgs_2 ? ActualArgs_2[key_2] : never; } & (ActualArgs_2 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_2 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_2, ActualArgs_2, "findFirst">>;
                findFirstOrThrow: () => <This_3, FormalArgs_3 extends import("@prisma/client/runtime/library").Args<This_3, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_3 extends FormalArgs_3>(this: This_3, args?: { [key_3 in keyof ActualArgs_3]: key_3 extends keyof FormalArgs_3 ? ActualArgs_3[key_3] : never; } & (ActualArgs_3 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_3 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_3, ActualArgs_3, "findFirstOrThrow">>;
                findMany: () => <This_4, FormalArgs_4 extends import("@prisma/client/runtime/library").Args<This_4, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_4 extends FormalArgs_4>(this: This_4, args?: { [key_4 in keyof ActualArgs_4]: key_4 extends keyof FormalArgs_4 ? ActualArgs_4[key_4] : never; } & (ActualArgs_4 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_4 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_4, ActualArgs_4, "findMany">>;
                findUnique: () => <This_5, FormalArgs_5 extends import("@prisma/client/runtime/library").Args<This_5, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_5 extends FormalArgs_5>(this: This_5, args: { [key_5 in keyof ActualArgs_5]: key_5 extends keyof FormalArgs_5 ? ActualArgs_5[key_5] : never; } & (ActualArgs_5 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_5 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_5, ActualArgs_5, "findUnique">>;
                findUniqueOrThrow: () => <This_6, FormalArgs_6 extends import("@prisma/client/runtime/library").Args<This_6, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_6 extends FormalArgs_6>(this: This_6, args: { [key_6 in keyof ActualArgs_6]: key_6 extends keyof FormalArgs_6 ? ActualArgs_6[key_6] : never; } & (ActualArgs_6 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_6 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_6, ActualArgs_6, "findUniqueOrThrow">>;
                groupBy: () => <This_7, FormalArgs_7 extends import("@prisma/client/runtime/library").Args<This_7, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_7 extends FormalArgs_7>(this: This_7, args: { [key_7 in keyof ActualArgs_7]: key_7 extends keyof FormalArgs_7 ? ActualArgs_7[key_7] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_7, ActualArgs_7, "groupBy">>;
            };
            activity_logs: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This_1, FormalArgs_1 extends import("@prisma/client/runtime/library").Args<This_1, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_1 extends FormalArgs_1>(this: This_1, args?: { [key_1 in keyof ActualArgs_1]: key_1 extends keyof FormalArgs_1 ? ActualArgs_1[key_1] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_1, ActualArgs_1, "count">>;
                findFirst: () => <This_2, FormalArgs_2 extends import("@prisma/client/runtime/library").Args<This_2, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_2 extends FormalArgs_2>(this: This_2, args?: { [key_2 in keyof ActualArgs_2]: key_2 extends keyof FormalArgs_2 ? ActualArgs_2[key_2] : never; } & (ActualArgs_2 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_2 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_2, ActualArgs_2, "findFirst">>;
                findFirstOrThrow: () => <This_3, FormalArgs_3 extends import("@prisma/client/runtime/library").Args<This_3, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_3 extends FormalArgs_3>(this: This_3, args?: { [key_3 in keyof ActualArgs_3]: key_3 extends keyof FormalArgs_3 ? ActualArgs_3[key_3] : never; } & (ActualArgs_3 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_3 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_3, ActualArgs_3, "findFirstOrThrow">>;
                findMany: () => <This_4, FormalArgs_4 extends import("@prisma/client/runtime/library").Args<This_4, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_4 extends FormalArgs_4>(this: This_4, args?: { [key_4 in keyof ActualArgs_4]: key_4 extends keyof FormalArgs_4 ? ActualArgs_4[key_4] : never; } & (ActualArgs_4 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_4 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_4, ActualArgs_4, "findMany">>;
                findUnique: () => <This_5, FormalArgs_5 extends import("@prisma/client/runtime/library").Args<This_5, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_5 extends FormalArgs_5>(this: This_5, args: { [key_5 in keyof ActualArgs_5]: key_5 extends keyof FormalArgs_5 ? ActualArgs_5[key_5] : never; } & (ActualArgs_5 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_5 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_5, ActualArgs_5, "findUnique">>;
                findUniqueOrThrow: () => <This_6, FormalArgs_6 extends import("@prisma/client/runtime/library").Args<This_6, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_6 extends FormalArgs_6>(this: This_6, args: { [key_6 in keyof ActualArgs_6]: key_6 extends keyof FormalArgs_6 ? ActualArgs_6[key_6] : never; } & (ActualArgs_6 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_6 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_6, ActualArgs_6, "findUniqueOrThrow">>;
                groupBy: () => <This_7, FormalArgs_7 extends import("@prisma/client/runtime/library").Args<This_7, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_7 extends FormalArgs_7>(this: This_7, args: { [key_7 in keyof ActualArgs_7]: key_7 extends keyof FormalArgs_7 ? ActualArgs_7[key_7] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_7, ActualArgs_7, "groupBy">>;
            };
            banners: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This_1, FormalArgs_1 extends import("@prisma/client/runtime/library").Args<This_1, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_1 extends FormalArgs_1>(this: This_1, args?: { [key_1 in keyof ActualArgs_1]: key_1 extends keyof FormalArgs_1 ? ActualArgs_1[key_1] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_1, ActualArgs_1, "count">>;
                findFirst: () => <This_2, FormalArgs_2 extends import("@prisma/client/runtime/library").Args<This_2, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_2 extends FormalArgs_2>(this: This_2, args?: { [key_2 in keyof ActualArgs_2]: key_2 extends keyof FormalArgs_2 ? ActualArgs_2[key_2] : never; } & (ActualArgs_2 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_2 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_2, ActualArgs_2, "findFirst">>;
                findFirstOrThrow: () => <This_3, FormalArgs_3 extends import("@prisma/client/runtime/library").Args<This_3, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_3 extends FormalArgs_3>(this: This_3, args?: { [key_3 in keyof ActualArgs_3]: key_3 extends keyof FormalArgs_3 ? ActualArgs_3[key_3] : never; } & (ActualArgs_3 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_3 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_3, ActualArgs_3, "findFirstOrThrow">>;
                findMany: () => <This_4, FormalArgs_4 extends import("@prisma/client/runtime/library").Args<This_4, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_4 extends FormalArgs_4>(this: This_4, args?: { [key_4 in keyof ActualArgs_4]: key_4 extends keyof FormalArgs_4 ? ActualArgs_4[key_4] : never; } & (ActualArgs_4 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_4 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_4, ActualArgs_4, "findMany">>;
                findUnique: () => <This_5, FormalArgs_5 extends import("@prisma/client/runtime/library").Args<This_5, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_5 extends FormalArgs_5>(this: This_5, args: { [key_5 in keyof ActualArgs_5]: key_5 extends keyof FormalArgs_5 ? ActualArgs_5[key_5] : never; } & (ActualArgs_5 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_5 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_5, ActualArgs_5, "findUnique">>;
                findUniqueOrThrow: () => <This_6, FormalArgs_6 extends import("@prisma/client/runtime/library").Args<This_6, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_6 extends FormalArgs_6>(this: This_6, args: { [key_6 in keyof ActualArgs_6]: key_6 extends keyof FormalArgs_6 ? ActualArgs_6[key_6] : never; } & (ActualArgs_6 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_6 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_6, ActualArgs_6, "findUniqueOrThrow">>;
                groupBy: () => <This_7, FormalArgs_7 extends import("@prisma/client/runtime/library").Args<This_7, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_7 extends FormalArgs_7>(this: This_7, args: { [key_7 in keyof ActualArgs_7]: key_7 extends keyof FormalArgs_7 ? ActualArgs_7[key_7] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_7, ActualArgs_7, "groupBy">>;
            };
            blog_articles: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This_1, FormalArgs_1 extends import("@prisma/client/runtime/library").Args<This_1, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_1 extends FormalArgs_1>(this: This_1, args?: { [key_1 in keyof ActualArgs_1]: key_1 extends keyof FormalArgs_1 ? ActualArgs_1[key_1] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_1, ActualArgs_1, "count">>;
                findFirst: () => <This_2, FormalArgs_2 extends import("@prisma/client/runtime/library").Args<This_2, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_2 extends FormalArgs_2>(this: This_2, args?: { [key_2 in keyof ActualArgs_2]: key_2 extends keyof FormalArgs_2 ? ActualArgs_2[key_2] : never; } & (ActualArgs_2 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_2 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_2, ActualArgs_2, "findFirst">>;
                findFirstOrThrow: () => <This_3, FormalArgs_3 extends import("@prisma/client/runtime/library").Args<This_3, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_3 extends FormalArgs_3>(this: This_3, args?: { [key_3 in keyof ActualArgs_3]: key_3 extends keyof FormalArgs_3 ? ActualArgs_3[key_3] : never; } & (ActualArgs_3 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_3 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_3, ActualArgs_3, "findFirstOrThrow">>;
                findMany: () => <This_4, FormalArgs_4 extends import("@prisma/client/runtime/library").Args<This_4, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_4 extends FormalArgs_4>(this: This_4, args?: { [key_4 in keyof ActualArgs_4]: key_4 extends keyof FormalArgs_4 ? ActualArgs_4[key_4] : never; } & (ActualArgs_4 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_4 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_4, ActualArgs_4, "findMany">>;
                findUnique: () => <This_5, FormalArgs_5 extends import("@prisma/client/runtime/library").Args<This_5, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_5 extends FormalArgs_5>(this: This_5, args: { [key_5 in keyof ActualArgs_5]: key_5 extends keyof FormalArgs_5 ? ActualArgs_5[key_5] : never; } & (ActualArgs_5 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_5 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_5, ActualArgs_5, "findUnique">>;
                findUniqueOrThrow: () => <This_6, FormalArgs_6 extends import("@prisma/client/runtime/library").Args<This_6, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_6 extends FormalArgs_6>(this: This_6, args: { [key_6 in keyof ActualArgs_6]: key_6 extends keyof FormalArgs_6 ? ActualArgs_6[key_6] : never; } & (ActualArgs_6 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_6 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_6, ActualArgs_6, "findUniqueOrThrow">>;
                groupBy: () => <This_7, FormalArgs_7 extends import("@prisma/client/runtime/library").Args<This_7, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_7 extends FormalArgs_7>(this: This_7, args: { [key_7 in keyof ActualArgs_7]: key_7 extends keyof FormalArgs_7 ? ActualArgs_7[key_7] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_7, ActualArgs_7, "groupBy">>;
            };
            blog_categories: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This_1, FormalArgs_1 extends import("@prisma/client/runtime/library").Args<This_1, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_1 extends FormalArgs_1>(this: This_1, args?: { [key_1 in keyof ActualArgs_1]: key_1 extends keyof FormalArgs_1 ? ActualArgs_1[key_1] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_1, ActualArgs_1, "count">>;
                findFirst: () => <This_2, FormalArgs_2 extends import("@prisma/client/runtime/library").Args<This_2, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_2 extends FormalArgs_2>(this: This_2, args?: { [key_2 in keyof ActualArgs_2]: key_2 extends keyof FormalArgs_2 ? ActualArgs_2[key_2] : never; } & (ActualArgs_2 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_2 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_2, ActualArgs_2, "findFirst">>;
                findFirstOrThrow: () => <This_3, FormalArgs_3 extends import("@prisma/client/runtime/library").Args<This_3, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_3 extends FormalArgs_3>(this: This_3, args?: { [key_3 in keyof ActualArgs_3]: key_3 extends keyof FormalArgs_3 ? ActualArgs_3[key_3] : never; } & (ActualArgs_3 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_3 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_3, ActualArgs_3, "findFirstOrThrow">>;
                findMany: () => <This_4, FormalArgs_4 extends import("@prisma/client/runtime/library").Args<This_4, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_4 extends FormalArgs_4>(this: This_4, args?: { [key_4 in keyof ActualArgs_4]: key_4 extends keyof FormalArgs_4 ? ActualArgs_4[key_4] : never; } & (ActualArgs_4 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_4 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_4, ActualArgs_4, "findMany">>;
                findUnique: () => <This_5, FormalArgs_5 extends import("@prisma/client/runtime/library").Args<This_5, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_5 extends FormalArgs_5>(this: This_5, args: { [key_5 in keyof ActualArgs_5]: key_5 extends keyof FormalArgs_5 ? ActualArgs_5[key_5] : never; } & (ActualArgs_5 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_5 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_5, ActualArgs_5, "findUnique">>;
                findUniqueOrThrow: () => <This_6, FormalArgs_6 extends import("@prisma/client/runtime/library").Args<This_6, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_6 extends FormalArgs_6>(this: This_6, args: { [key_6 in keyof ActualArgs_6]: key_6 extends keyof FormalArgs_6 ? ActualArgs_6[key_6] : never; } & (ActualArgs_6 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_6 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_6, ActualArgs_6, "findUniqueOrThrow">>;
                groupBy: () => <This_7, FormalArgs_7 extends import("@prisma/client/runtime/library").Args<This_7, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_7 extends FormalArgs_7>(this: This_7, args: { [key_7 in keyof ActualArgs_7]: key_7 extends keyof FormalArgs_7 ? ActualArgs_7[key_7] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_7, ActualArgs_7, "groupBy">>;
            };
            blog_comments: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This_1, FormalArgs_1 extends import("@prisma/client/runtime/library").Args<This_1, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_1 extends FormalArgs_1>(this: This_1, args?: { [key_1 in keyof ActualArgs_1]: key_1 extends keyof FormalArgs_1 ? ActualArgs_1[key_1] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_1, ActualArgs_1, "count">>;
                findFirst: () => <This_2, FormalArgs_2 extends import("@prisma/client/runtime/library").Args<This_2, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_2 extends FormalArgs_2>(this: This_2, args?: { [key_2 in keyof ActualArgs_2]: key_2 extends keyof FormalArgs_2 ? ActualArgs_2[key_2] : never; } & (ActualArgs_2 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_2 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_2, ActualArgs_2, "findFirst">>;
                findFirstOrThrow: () => <This_3, FormalArgs_3 extends import("@prisma/client/runtime/library").Args<This_3, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_3 extends FormalArgs_3>(this: This_3, args?: { [key_3 in keyof ActualArgs_3]: key_3 extends keyof FormalArgs_3 ? ActualArgs_3[key_3] : never; } & (ActualArgs_3 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_3 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_3, ActualArgs_3, "findFirstOrThrow">>;
                findMany: () => <This_4, FormalArgs_4 extends import("@prisma/client/runtime/library").Args<This_4, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_4 extends FormalArgs_4>(this: This_4, args?: { [key_4 in keyof ActualArgs_4]: key_4 extends keyof FormalArgs_4 ? ActualArgs_4[key_4] : never; } & (ActualArgs_4 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_4 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_4, ActualArgs_4, "findMany">>;
                findUnique: () => <This_5, FormalArgs_5 extends import("@prisma/client/runtime/library").Args<This_5, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_5 extends FormalArgs_5>(this: This_5, args: { [key_5 in keyof ActualArgs_5]: key_5 extends keyof FormalArgs_5 ? ActualArgs_5[key_5] : never; } & (ActualArgs_5 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_5 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_5, ActualArgs_5, "findUnique">>;
                findUniqueOrThrow: () => <This_6, FormalArgs_6 extends import("@prisma/client/runtime/library").Args<This_6, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_6 extends FormalArgs_6>(this: This_6, args: { [key_6 in keyof ActualArgs_6]: key_6 extends keyof FormalArgs_6 ? ActualArgs_6[key_6] : never; } & (ActualArgs_6 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_6 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_6, ActualArgs_6, "findUniqueOrThrow">>;
                groupBy: () => <This_7, FormalArgs_7 extends import("@prisma/client/runtime/library").Args<This_7, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_7 extends FormalArgs_7>(this: This_7, args: { [key_7 in keyof ActualArgs_7]: key_7 extends keyof FormalArgs_7 ? ActualArgs_7[key_7] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_7, ActualArgs_7, "groupBy">>;
            };
            campaign_clicks: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This_1, FormalArgs_1 extends import("@prisma/client/runtime/library").Args<This_1, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_1 extends FormalArgs_1>(this: This_1, args?: { [key_1 in keyof ActualArgs_1]: key_1 extends keyof FormalArgs_1 ? ActualArgs_1[key_1] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_1, ActualArgs_1, "count">>;
                findFirst: () => <This_2, FormalArgs_2 extends import("@prisma/client/runtime/library").Args<This_2, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_2 extends FormalArgs_2>(this: This_2, args?: { [key_2 in keyof ActualArgs_2]: key_2 extends keyof FormalArgs_2 ? ActualArgs_2[key_2] : never; } & (ActualArgs_2 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_2 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_2, ActualArgs_2, "findFirst">>;
                findFirstOrThrow: () => <This_3, FormalArgs_3 extends import("@prisma/client/runtime/library").Args<This_3, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_3 extends FormalArgs_3>(this: This_3, args?: { [key_3 in keyof ActualArgs_3]: key_3 extends keyof FormalArgs_3 ? ActualArgs_3[key_3] : never; } & (ActualArgs_3 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_3 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_3, ActualArgs_3, "findFirstOrThrow">>;
                findMany: () => <This_4, FormalArgs_4 extends import("@prisma/client/runtime/library").Args<This_4, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_4 extends FormalArgs_4>(this: This_4, args?: { [key_4 in keyof ActualArgs_4]: key_4 extends keyof FormalArgs_4 ? ActualArgs_4[key_4] : never; } & (ActualArgs_4 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_4 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_4, ActualArgs_4, "findMany">>;
                findUnique: () => <This_5, FormalArgs_5 extends import("@prisma/client/runtime/library").Args<This_5, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_5 extends FormalArgs_5>(this: This_5, args: { [key_5 in keyof ActualArgs_5]: key_5 extends keyof FormalArgs_5 ? ActualArgs_5[key_5] : never; } & (ActualArgs_5 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_5 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_5, ActualArgs_5, "findUnique">>;
                findUniqueOrThrow: () => <This_6, FormalArgs_6 extends import("@prisma/client/runtime/library").Args<This_6, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_6 extends FormalArgs_6>(this: This_6, args: { [key_6 in keyof ActualArgs_6]: key_6 extends keyof FormalArgs_6 ? ActualArgs_6[key_6] : never; } & (ActualArgs_6 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_6 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_6, ActualArgs_6, "findUniqueOrThrow">>;
                groupBy: () => <This_7, FormalArgs_7 extends import("@prisma/client/runtime/library").Args<This_7, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_7 extends FormalArgs_7>(this: This_7, args: { [key_7 in keyof ActualArgs_7]: key_7 extends keyof FormalArgs_7 ? ActualArgs_7[key_7] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_7, ActualArgs_7, "groupBy">>;
            };
            campaign_opens: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This_1, FormalArgs_1 extends import("@prisma/client/runtime/library").Args<This_1, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_1 extends FormalArgs_1>(this: This_1, args?: { [key_1 in keyof ActualArgs_1]: key_1 extends keyof FormalArgs_1 ? ActualArgs_1[key_1] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_1, ActualArgs_1, "count">>;
                findFirst: () => <This_2, FormalArgs_2 extends import("@prisma/client/runtime/library").Args<This_2, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_2 extends FormalArgs_2>(this: This_2, args?: { [key_2 in keyof ActualArgs_2]: key_2 extends keyof FormalArgs_2 ? ActualArgs_2[key_2] : never; } & (ActualArgs_2 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_2 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_2, ActualArgs_2, "findFirst">>;
                findFirstOrThrow: () => <This_3, FormalArgs_3 extends import("@prisma/client/runtime/library").Args<This_3, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_3 extends FormalArgs_3>(this: This_3, args?: { [key_3 in keyof ActualArgs_3]: key_3 extends keyof FormalArgs_3 ? ActualArgs_3[key_3] : never; } & (ActualArgs_3 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_3 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_3, ActualArgs_3, "findFirstOrThrow">>;
                findMany: () => <This_4, FormalArgs_4 extends import("@prisma/client/runtime/library").Args<This_4, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_4 extends FormalArgs_4>(this: This_4, args?: { [key_4 in keyof ActualArgs_4]: key_4 extends keyof FormalArgs_4 ? ActualArgs_4[key_4] : never; } & (ActualArgs_4 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_4 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_4, ActualArgs_4, "findMany">>;
                findUnique: () => <This_5, FormalArgs_5 extends import("@prisma/client/runtime/library").Args<This_5, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_5 extends FormalArgs_5>(this: This_5, args: { [key_5 in keyof ActualArgs_5]: key_5 extends keyof FormalArgs_5 ? ActualArgs_5[key_5] : never; } & (ActualArgs_5 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_5 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_5, ActualArgs_5, "findUnique">>;
                findUniqueOrThrow: () => <This_6, FormalArgs_6 extends import("@prisma/client/runtime/library").Args<This_6, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_6 extends FormalArgs_6>(this: This_6, args: { [key_6 in keyof ActualArgs_6]: key_6 extends keyof FormalArgs_6 ? ActualArgs_6[key_6] : never; } & (ActualArgs_6 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_6 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_6, ActualArgs_6, "findUniqueOrThrow">>;
                groupBy: () => <This_7, FormalArgs_7 extends import("@prisma/client/runtime/library").Args<This_7, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_7 extends FormalArgs_7>(this: This_7, args: { [key_7 in keyof ActualArgs_7]: key_7 extends keyof FormalArgs_7 ? ActualArgs_7[key_7] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_7, ActualArgs_7, "groupBy">>;
            };
            campaign_recipients: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This_1, FormalArgs_1 extends import("@prisma/client/runtime/library").Args<This_1, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_1 extends FormalArgs_1>(this: This_1, args?: { [key_1 in keyof ActualArgs_1]: key_1 extends keyof FormalArgs_1 ? ActualArgs_1[key_1] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_1, ActualArgs_1, "count">>;
                findFirst: () => <This_2, FormalArgs_2 extends import("@prisma/client/runtime/library").Args<This_2, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_2 extends FormalArgs_2>(this: This_2, args?: { [key_2 in keyof ActualArgs_2]: key_2 extends keyof FormalArgs_2 ? ActualArgs_2[key_2] : never; } & (ActualArgs_2 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_2 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_2, ActualArgs_2, "findFirst">>;
                findFirstOrThrow: () => <This_3, FormalArgs_3 extends import("@prisma/client/runtime/library").Args<This_3, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_3 extends FormalArgs_3>(this: This_3, args?: { [key_3 in keyof ActualArgs_3]: key_3 extends keyof FormalArgs_3 ? ActualArgs_3[key_3] : never; } & (ActualArgs_3 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_3 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_3, ActualArgs_3, "findFirstOrThrow">>;
                findMany: () => <This_4, FormalArgs_4 extends import("@prisma/client/runtime/library").Args<This_4, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_4 extends FormalArgs_4>(this: This_4, args?: { [key_4 in keyof ActualArgs_4]: key_4 extends keyof FormalArgs_4 ? ActualArgs_4[key_4] : never; } & (ActualArgs_4 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_4 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_4, ActualArgs_4, "findMany">>;
                findUnique: () => <This_5, FormalArgs_5 extends import("@prisma/client/runtime/library").Args<This_5, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_5 extends FormalArgs_5>(this: This_5, args: { [key_5 in keyof ActualArgs_5]: key_5 extends keyof FormalArgs_5 ? ActualArgs_5[key_5] : never; } & (ActualArgs_5 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_5 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_5, ActualArgs_5, "findUnique">>;
                findUniqueOrThrow: () => <This_6, FormalArgs_6 extends import("@prisma/client/runtime/library").Args<This_6, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_6 extends FormalArgs_6>(this: This_6, args: { [key_6 in keyof ActualArgs_6]: key_6 extends keyof FormalArgs_6 ? ActualArgs_6[key_6] : never; } & (ActualArgs_6 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_6 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_6, ActualArgs_6, "findUniqueOrThrow">>;
                groupBy: () => <This_7, FormalArgs_7 extends import("@prisma/client/runtime/library").Args<This_7, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_7 extends FormalArgs_7>(this: This_7, args: { [key_7 in keyof ActualArgs_7]: key_7 extends keyof FormalArgs_7 ? ActualArgs_7[key_7] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_7, ActualArgs_7, "groupBy">>;
            };
            campaigns: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This_1, FormalArgs_1 extends import("@prisma/client/runtime/library").Args<This_1, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_1 extends FormalArgs_1>(this: This_1, args?: { [key_1 in keyof ActualArgs_1]: key_1 extends keyof FormalArgs_1 ? ActualArgs_1[key_1] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_1, ActualArgs_1, "count">>;
                findFirst: () => <This_2, FormalArgs_2 extends import("@prisma/client/runtime/library").Args<This_2, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_2 extends FormalArgs_2>(this: This_2, args?: { [key_2 in keyof ActualArgs_2]: key_2 extends keyof FormalArgs_2 ? ActualArgs_2[key_2] : never; } & (ActualArgs_2 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_2 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_2, ActualArgs_2, "findFirst">>;
                findFirstOrThrow: () => <This_3, FormalArgs_3 extends import("@prisma/client/runtime/library").Args<This_3, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_3 extends FormalArgs_3>(this: This_3, args?: { [key_3 in keyof ActualArgs_3]: key_3 extends keyof FormalArgs_3 ? ActualArgs_3[key_3] : never; } & (ActualArgs_3 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_3 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_3, ActualArgs_3, "findFirstOrThrow">>;
                findMany: () => <This_4, FormalArgs_4 extends import("@prisma/client/runtime/library").Args<This_4, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_4 extends FormalArgs_4>(this: This_4, args?: { [key_4 in keyof ActualArgs_4]: key_4 extends keyof FormalArgs_4 ? ActualArgs_4[key_4] : never; } & (ActualArgs_4 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_4 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_4, ActualArgs_4, "findMany">>;
                findUnique: () => <This_5, FormalArgs_5 extends import("@prisma/client/runtime/library").Args<This_5, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_5 extends FormalArgs_5>(this: This_5, args: { [key_5 in keyof ActualArgs_5]: key_5 extends keyof FormalArgs_5 ? ActualArgs_5[key_5] : never; } & (ActualArgs_5 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_5 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_5, ActualArgs_5, "findUnique">>;
                findUniqueOrThrow: () => <This_6, FormalArgs_6 extends import("@prisma/client/runtime/library").Args<This_6, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_6 extends FormalArgs_6>(this: This_6, args: { [key_6 in keyof ActualArgs_6]: key_6 extends keyof FormalArgs_6 ? ActualArgs_6[key_6] : never; } & (ActualArgs_6 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_6 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_6, ActualArgs_6, "findUniqueOrThrow">>;
                groupBy: () => <This_7, FormalArgs_7 extends import("@prisma/client/runtime/library").Args<This_7, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_7 extends FormalArgs_7>(this: This_7, args: { [key_7 in keyof ActualArgs_7]: key_7 extends keyof FormalArgs_7 ? ActualArgs_7[key_7] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_7, ActualArgs_7, "groupBy">>;
            };
            cart_items: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This_1, FormalArgs_1 extends import("@prisma/client/runtime/library").Args<This_1, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_1 extends FormalArgs_1>(this: This_1, args?: { [key_1 in keyof ActualArgs_1]: key_1 extends keyof FormalArgs_1 ? ActualArgs_1[key_1] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_1, ActualArgs_1, "count">>;
                findFirst: () => <This_2, FormalArgs_2 extends import("@prisma/client/runtime/library").Args<This_2, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_2 extends FormalArgs_2>(this: This_2, args?: { [key_2 in keyof ActualArgs_2]: key_2 extends keyof FormalArgs_2 ? ActualArgs_2[key_2] : never; } & (ActualArgs_2 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_2 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_2, ActualArgs_2, "findFirst">>;
                findFirstOrThrow: () => <This_3, FormalArgs_3 extends import("@prisma/client/runtime/library").Args<This_3, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_3 extends FormalArgs_3>(this: This_3, args?: { [key_3 in keyof ActualArgs_3]: key_3 extends keyof FormalArgs_3 ? ActualArgs_3[key_3] : never; } & (ActualArgs_3 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_3 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_3, ActualArgs_3, "findFirstOrThrow">>;
                findMany: () => <This_4, FormalArgs_4 extends import("@prisma/client/runtime/library").Args<This_4, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_4 extends FormalArgs_4>(this: This_4, args?: { [key_4 in keyof ActualArgs_4]: key_4 extends keyof FormalArgs_4 ? ActualArgs_4[key_4] : never; } & (ActualArgs_4 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_4 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_4, ActualArgs_4, "findMany">>;
                findUnique: () => <This_5, FormalArgs_5 extends import("@prisma/client/runtime/library").Args<This_5, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_5 extends FormalArgs_5>(this: This_5, args: { [key_5 in keyof ActualArgs_5]: key_5 extends keyof FormalArgs_5 ? ActualArgs_5[key_5] : never; } & (ActualArgs_5 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_5 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_5, ActualArgs_5, "findUnique">>;
                findUniqueOrThrow: () => <This_6, FormalArgs_6 extends import("@prisma/client/runtime/library").Args<This_6, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_6 extends FormalArgs_6>(this: This_6, args: { [key_6 in keyof ActualArgs_6]: key_6 extends keyof FormalArgs_6 ? ActualArgs_6[key_6] : never; } & (ActualArgs_6 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_6 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_6, ActualArgs_6, "findUniqueOrThrow">>;
                groupBy: () => <This_7, FormalArgs_7 extends import("@prisma/client/runtime/library").Args<This_7, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_7 extends FormalArgs_7>(this: This_7, args: { [key_7 in keyof ActualArgs_7]: key_7 extends keyof FormalArgs_7 ? ActualArgs_7[key_7] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_7, ActualArgs_7, "groupBy">>;
            };
            carts: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This_1, FormalArgs_1 extends import("@prisma/client/runtime/library").Args<This_1, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_1 extends FormalArgs_1>(this: This_1, args?: { [key_1 in keyof ActualArgs_1]: key_1 extends keyof FormalArgs_1 ? ActualArgs_1[key_1] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_1, ActualArgs_1, "count">>;
                findFirst: () => <This_2, FormalArgs_2 extends import("@prisma/client/runtime/library").Args<This_2, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_2 extends FormalArgs_2>(this: This_2, args?: { [key_2 in keyof ActualArgs_2]: key_2 extends keyof FormalArgs_2 ? ActualArgs_2[key_2] : never; } & (ActualArgs_2 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_2 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_2, ActualArgs_2, "findFirst">>;
                findFirstOrThrow: () => <This_3, FormalArgs_3 extends import("@prisma/client/runtime/library").Args<This_3, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_3 extends FormalArgs_3>(this: This_3, args?: { [key_3 in keyof ActualArgs_3]: key_3 extends keyof FormalArgs_3 ? ActualArgs_3[key_3] : never; } & (ActualArgs_3 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_3 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_3, ActualArgs_3, "findFirstOrThrow">>;
                findMany: () => <This_4, FormalArgs_4 extends import("@prisma/client/runtime/library").Args<This_4, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_4 extends FormalArgs_4>(this: This_4, args?: { [key_4 in keyof ActualArgs_4]: key_4 extends keyof FormalArgs_4 ? ActualArgs_4[key_4] : never; } & (ActualArgs_4 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_4 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_4, ActualArgs_4, "findMany">>;
                findUnique: () => <This_5, FormalArgs_5 extends import("@prisma/client/runtime/library").Args<This_5, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_5 extends FormalArgs_5>(this: This_5, args: { [key_5 in keyof ActualArgs_5]: key_5 extends keyof FormalArgs_5 ? ActualArgs_5[key_5] : never; } & (ActualArgs_5 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_5 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_5, ActualArgs_5, "findUnique">>;
                findUniqueOrThrow: () => <This_6, FormalArgs_6 extends import("@prisma/client/runtime/library").Args<This_6, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_6 extends FormalArgs_6>(this: This_6, args: { [key_6 in keyof ActualArgs_6]: key_6 extends keyof FormalArgs_6 ? ActualArgs_6[key_6] : never; } & (ActualArgs_6 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_6 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_6, ActualArgs_6, "findUniqueOrThrow">>;
                groupBy: () => <This_7, FormalArgs_7 extends import("@prisma/client/runtime/library").Args<This_7, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_7 extends FormalArgs_7>(this: This_7, args: { [key_7 in keyof ActualArgs_7]: key_7 extends keyof FormalArgs_7 ? ActualArgs_7[key_7] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_7, ActualArgs_7, "groupBy">>;
            };
            categories: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This_1, FormalArgs_1 extends import("@prisma/client/runtime/library").Args<This_1, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_1 extends FormalArgs_1>(this: This_1, args?: { [key_1 in keyof ActualArgs_1]: key_1 extends keyof FormalArgs_1 ? ActualArgs_1[key_1] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_1, ActualArgs_1, "count">>;
                findFirst: () => <This_2, FormalArgs_2 extends import("@prisma/client/runtime/library").Args<This_2, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_2 extends FormalArgs_2>(this: This_2, args?: { [key_2 in keyof ActualArgs_2]: key_2 extends keyof FormalArgs_2 ? ActualArgs_2[key_2] : never; } & (ActualArgs_2 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_2 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_2, ActualArgs_2, "findFirst">>;
                findFirstOrThrow: () => <This_3, FormalArgs_3 extends import("@prisma/client/runtime/library").Args<This_3, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_3 extends FormalArgs_3>(this: This_3, args?: { [key_3 in keyof ActualArgs_3]: key_3 extends keyof FormalArgs_3 ? ActualArgs_3[key_3] : never; } & (ActualArgs_3 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_3 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_3, ActualArgs_3, "findFirstOrThrow">>;
                findMany: () => <This_4, FormalArgs_4 extends import("@prisma/client/runtime/library").Args<This_4, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_4 extends FormalArgs_4>(this: This_4, args?: { [key_4 in keyof ActualArgs_4]: key_4 extends keyof FormalArgs_4 ? ActualArgs_4[key_4] : never; } & (ActualArgs_4 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_4 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_4, ActualArgs_4, "findMany">>;
                findUnique: () => <This_5, FormalArgs_5 extends import("@prisma/client/runtime/library").Args<This_5, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_5 extends FormalArgs_5>(this: This_5, args: { [key_5 in keyof ActualArgs_5]: key_5 extends keyof FormalArgs_5 ? ActualArgs_5[key_5] : never; } & (ActualArgs_5 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_5 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_5, ActualArgs_5, "findUnique">>;
                findUniqueOrThrow: () => <This_6, FormalArgs_6 extends import("@prisma/client/runtime/library").Args<This_6, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_6 extends FormalArgs_6>(this: This_6, args: { [key_6 in keyof ActualArgs_6]: key_6 extends keyof FormalArgs_6 ? ActualArgs_6[key_6] : never; } & (ActualArgs_6 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_6 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_6, ActualArgs_6, "findUniqueOrThrow">>;
                groupBy: () => <This_7, FormalArgs_7 extends import("@prisma/client/runtime/library").Args<This_7, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_7 extends FormalArgs_7>(this: This_7, args: { [key_7 in keyof ActualArgs_7]: key_7 extends keyof FormalArgs_7 ? ActualArgs_7[key_7] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_7, ActualArgs_7, "groupBy">>;
            };
            customer_questions: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This_1, FormalArgs_1 extends import("@prisma/client/runtime/library").Args<This_1, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_1 extends FormalArgs_1>(this: This_1, args?: { [key_1 in keyof ActualArgs_1]: key_1 extends keyof FormalArgs_1 ? ActualArgs_1[key_1] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_1, ActualArgs_1, "count">>;
                findFirst: () => <This_2, FormalArgs_2 extends import("@prisma/client/runtime/library").Args<This_2, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_2 extends FormalArgs_2>(this: This_2, args?: { [key_2 in keyof ActualArgs_2]: key_2 extends keyof FormalArgs_2 ? ActualArgs_2[key_2] : never; } & (ActualArgs_2 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_2 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_2, ActualArgs_2, "findFirst">>;
                findFirstOrThrow: () => <This_3, FormalArgs_3 extends import("@prisma/client/runtime/library").Args<This_3, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_3 extends FormalArgs_3>(this: This_3, args?: { [key_3 in keyof ActualArgs_3]: key_3 extends keyof FormalArgs_3 ? ActualArgs_3[key_3] : never; } & (ActualArgs_3 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_3 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_3, ActualArgs_3, "findFirstOrThrow">>;
                findMany: () => <This_4, FormalArgs_4 extends import("@prisma/client/runtime/library").Args<This_4, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_4 extends FormalArgs_4>(this: This_4, args?: { [key_4 in keyof ActualArgs_4]: key_4 extends keyof FormalArgs_4 ? ActualArgs_4[key_4] : never; } & (ActualArgs_4 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_4 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_4, ActualArgs_4, "findMany">>;
                findUnique: () => <This_5, FormalArgs_5 extends import("@prisma/client/runtime/library").Args<This_5, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_5 extends FormalArgs_5>(this: This_5, args: { [key_5 in keyof ActualArgs_5]: key_5 extends keyof FormalArgs_5 ? ActualArgs_5[key_5] : never; } & (ActualArgs_5 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_5 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_5, ActualArgs_5, "findUnique">>;
                findUniqueOrThrow: () => <This_6, FormalArgs_6 extends import("@prisma/client/runtime/library").Args<This_6, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_6 extends FormalArgs_6>(this: This_6, args: { [key_6 in keyof ActualArgs_6]: key_6 extends keyof FormalArgs_6 ? ActualArgs_6[key_6] : never; } & (ActualArgs_6 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_6 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_6, ActualArgs_6, "findUniqueOrThrow">>;
                groupBy: () => <This_7, FormalArgs_7 extends import("@prisma/client/runtime/library").Args<This_7, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_7 extends FormalArgs_7>(this: This_7, args: { [key_7 in keyof ActualArgs_7]: key_7 extends keyof FormalArgs_7 ? ActualArgs_7[key_7] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_7, ActualArgs_7, "groupBy">>;
            };
            email_logs: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This_1, FormalArgs_1 extends import("@prisma/client/runtime/library").Args<This_1, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_1 extends FormalArgs_1>(this: This_1, args?: { [key_1 in keyof ActualArgs_1]: key_1 extends keyof FormalArgs_1 ? ActualArgs_1[key_1] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_1, ActualArgs_1, "count">>;
                findFirst: () => <This_2, FormalArgs_2 extends import("@prisma/client/runtime/library").Args<This_2, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_2 extends FormalArgs_2>(this: This_2, args?: { [key_2 in keyof ActualArgs_2]: key_2 extends keyof FormalArgs_2 ? ActualArgs_2[key_2] : never; } & (ActualArgs_2 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_2 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_2, ActualArgs_2, "findFirst">>;
                findFirstOrThrow: () => <This_3, FormalArgs_3 extends import("@prisma/client/runtime/library").Args<This_3, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_3 extends FormalArgs_3>(this: This_3, args?: { [key_3 in keyof ActualArgs_3]: key_3 extends keyof FormalArgs_3 ? ActualArgs_3[key_3] : never; } & (ActualArgs_3 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_3 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_3, ActualArgs_3, "findFirstOrThrow">>;
                findMany: () => <This_4, FormalArgs_4 extends import("@prisma/client/runtime/library").Args<This_4, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_4 extends FormalArgs_4>(this: This_4, args?: { [key_4 in keyof ActualArgs_4]: key_4 extends keyof FormalArgs_4 ? ActualArgs_4[key_4] : never; } & (ActualArgs_4 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_4 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_4, ActualArgs_4, "findMany">>;
                findUnique: () => <This_5, FormalArgs_5 extends import("@prisma/client/runtime/library").Args<This_5, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_5 extends FormalArgs_5>(this: This_5, args: { [key_5 in keyof ActualArgs_5]: key_5 extends keyof FormalArgs_5 ? ActualArgs_5[key_5] : never; } & (ActualArgs_5 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_5 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_5, ActualArgs_5, "findUnique">>;
                findUniqueOrThrow: () => <This_6, FormalArgs_6 extends import("@prisma/client/runtime/library").Args<This_6, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_6 extends FormalArgs_6>(this: This_6, args: { [key_6 in keyof ActualArgs_6]: key_6 extends keyof FormalArgs_6 ? ActualArgs_6[key_6] : never; } & (ActualArgs_6 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_6 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_6, ActualArgs_6, "findUniqueOrThrow">>;
                groupBy: () => <This_7, FormalArgs_7 extends import("@prisma/client/runtime/library").Args<This_7, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_7 extends FormalArgs_7>(this: This_7, args: { [key_7 in keyof ActualArgs_7]: key_7 extends keyof FormalArgs_7 ? ActualArgs_7[key_7] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_7, ActualArgs_7, "groupBy">>;
            };
            email_templates: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This_1, FormalArgs_1 extends import("@prisma/client/runtime/library").Args<This_1, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_1 extends FormalArgs_1>(this: This_1, args?: { [key_1 in keyof ActualArgs_1]: key_1 extends keyof FormalArgs_1 ? ActualArgs_1[key_1] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_1, ActualArgs_1, "count">>;
                findFirst: () => <This_2, FormalArgs_2 extends import("@prisma/client/runtime/library").Args<This_2, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_2 extends FormalArgs_2>(this: This_2, args?: { [key_2 in keyof ActualArgs_2]: key_2 extends keyof FormalArgs_2 ? ActualArgs_2[key_2] : never; } & (ActualArgs_2 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_2 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_2, ActualArgs_2, "findFirst">>;
                findFirstOrThrow: () => <This_3, FormalArgs_3 extends import("@prisma/client/runtime/library").Args<This_3, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_3 extends FormalArgs_3>(this: This_3, args?: { [key_3 in keyof ActualArgs_3]: key_3 extends keyof FormalArgs_3 ? ActualArgs_3[key_3] : never; } & (ActualArgs_3 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_3 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_3, ActualArgs_3, "findFirstOrThrow">>;
                findMany: () => <This_4, FormalArgs_4 extends import("@prisma/client/runtime/library").Args<This_4, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_4 extends FormalArgs_4>(this: This_4, args?: { [key_4 in keyof ActualArgs_4]: key_4 extends keyof FormalArgs_4 ? ActualArgs_4[key_4] : never; } & (ActualArgs_4 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_4 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_4, ActualArgs_4, "findMany">>;
                findUnique: () => <This_5, FormalArgs_5 extends import("@prisma/client/runtime/library").Args<This_5, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_5 extends FormalArgs_5>(this: This_5, args: { [key_5 in keyof ActualArgs_5]: key_5 extends keyof FormalArgs_5 ? ActualArgs_5[key_5] : never; } & (ActualArgs_5 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_5 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_5, ActualArgs_5, "findUnique">>;
                findUniqueOrThrow: () => <This_6, FormalArgs_6 extends import("@prisma/client/runtime/library").Args<This_6, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_6 extends FormalArgs_6>(this: This_6, args: { [key_6 in keyof ActualArgs_6]: key_6 extends keyof FormalArgs_6 ? ActualArgs_6[key_6] : never; } & (ActualArgs_6 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_6 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_6, ActualArgs_6, "findUniqueOrThrow">>;
                groupBy: () => <This_7, FormalArgs_7 extends import("@prisma/client/runtime/library").Args<This_7, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_7 extends FormalArgs_7>(this: This_7, args: { [key_7 in keyof ActualArgs_7]: key_7 extends keyof FormalArgs_7 ? ActualArgs_7[key_7] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_7, ActualArgs_7, "groupBy">>;
            };
            inventory: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This_1, FormalArgs_1 extends import("@prisma/client/runtime/library").Args<This_1, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_1 extends FormalArgs_1>(this: This_1, args?: { [key_1 in keyof ActualArgs_1]: key_1 extends keyof FormalArgs_1 ? ActualArgs_1[key_1] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_1, ActualArgs_1, "count">>;
                findFirst: () => <This_2, FormalArgs_2 extends import("@prisma/client/runtime/library").Args<This_2, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_2 extends FormalArgs_2>(this: This_2, args?: { [key_2 in keyof ActualArgs_2]: key_2 extends keyof FormalArgs_2 ? ActualArgs_2[key_2] : never; } & (ActualArgs_2 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_2 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_2, ActualArgs_2, "findFirst">>;
                findFirstOrThrow: () => <This_3, FormalArgs_3 extends import("@prisma/client/runtime/library").Args<This_3, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_3 extends FormalArgs_3>(this: This_3, args?: { [key_3 in keyof ActualArgs_3]: key_3 extends keyof FormalArgs_3 ? ActualArgs_3[key_3] : never; } & (ActualArgs_3 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_3 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_3, ActualArgs_3, "findFirstOrThrow">>;
                findMany: () => <This_4, FormalArgs_4 extends import("@prisma/client/runtime/library").Args<This_4, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_4 extends FormalArgs_4>(this: This_4, args?: { [key_4 in keyof ActualArgs_4]: key_4 extends keyof FormalArgs_4 ? ActualArgs_4[key_4] : never; } & (ActualArgs_4 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_4 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_4, ActualArgs_4, "findMany">>;
                findUnique: () => <This_5, FormalArgs_5 extends import("@prisma/client/runtime/library").Args<This_5, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_5 extends FormalArgs_5>(this: This_5, args: { [key_5 in keyof ActualArgs_5]: key_5 extends keyof FormalArgs_5 ? ActualArgs_5[key_5] : never; } & (ActualArgs_5 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_5 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_5, ActualArgs_5, "findUnique">>;
                findUniqueOrThrow: () => <This_6, FormalArgs_6 extends import("@prisma/client/runtime/library").Args<This_6, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_6 extends FormalArgs_6>(this: This_6, args: { [key_6 in keyof ActualArgs_6]: key_6 extends keyof FormalArgs_6 ? ActualArgs_6[key_6] : never; } & (ActualArgs_6 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_6 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_6, ActualArgs_6, "findUniqueOrThrow">>;
                groupBy: () => <This_7, FormalArgs_7 extends import("@prisma/client/runtime/library").Args<This_7, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_7 extends FormalArgs_7>(this: This_7, args: { [key_7 in keyof ActualArgs_7]: key_7 extends keyof FormalArgs_7 ? ActualArgs_7[key_7] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_7, ActualArgs_7, "groupBy">>;
            };
            inventory_alerts: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This_1, FormalArgs_1 extends import("@prisma/client/runtime/library").Args<This_1, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_1 extends FormalArgs_1>(this: This_1, args?: { [key_1 in keyof ActualArgs_1]: key_1 extends keyof FormalArgs_1 ? ActualArgs_1[key_1] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_1, ActualArgs_1, "count">>;
                findFirst: () => <This_2, FormalArgs_2 extends import("@prisma/client/runtime/library").Args<This_2, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_2 extends FormalArgs_2>(this: This_2, args?: { [key_2 in keyof ActualArgs_2]: key_2 extends keyof FormalArgs_2 ? ActualArgs_2[key_2] : never; } & (ActualArgs_2 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_2 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_2, ActualArgs_2, "findFirst">>;
                findFirstOrThrow: () => <This_3, FormalArgs_3 extends import("@prisma/client/runtime/library").Args<This_3, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_3 extends FormalArgs_3>(this: This_3, args?: { [key_3 in keyof ActualArgs_3]: key_3 extends keyof FormalArgs_3 ? ActualArgs_3[key_3] : never; } & (ActualArgs_3 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_3 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_3, ActualArgs_3, "findFirstOrThrow">>;
                findMany: () => <This_4, FormalArgs_4 extends import("@prisma/client/runtime/library").Args<This_4, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_4 extends FormalArgs_4>(this: This_4, args?: { [key_4 in keyof ActualArgs_4]: key_4 extends keyof FormalArgs_4 ? ActualArgs_4[key_4] : never; } & (ActualArgs_4 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_4 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_4, ActualArgs_4, "findMany">>;
                findUnique: () => <This_5, FormalArgs_5 extends import("@prisma/client/runtime/library").Args<This_5, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_5 extends FormalArgs_5>(this: This_5, args: { [key_5 in keyof ActualArgs_5]: key_5 extends keyof FormalArgs_5 ? ActualArgs_5[key_5] : never; } & (ActualArgs_5 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_5 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_5, ActualArgs_5, "findUnique">>;
                findUniqueOrThrow: () => <This_6, FormalArgs_6 extends import("@prisma/client/runtime/library").Args<This_6, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_6 extends FormalArgs_6>(this: This_6, args: { [key_6 in keyof ActualArgs_6]: key_6 extends keyof FormalArgs_6 ? ActualArgs_6[key_6] : never; } & (ActualArgs_6 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_6 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_6, ActualArgs_6, "findUniqueOrThrow">>;
                groupBy: () => <This_7, FormalArgs_7 extends import("@prisma/client/runtime/library").Args<This_7, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_7 extends FormalArgs_7>(this: This_7, args: { [key_7 in keyof ActualArgs_7]: key_7 extends keyof FormalArgs_7 ? ActualArgs_7[key_7] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_7, ActualArgs_7, "groupBy">>;
            };
            inventory_movements: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This_1, FormalArgs_1 extends import("@prisma/client/runtime/library").Args<This_1, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_1 extends FormalArgs_1>(this: This_1, args?: { [key_1 in keyof ActualArgs_1]: key_1 extends keyof FormalArgs_1 ? ActualArgs_1[key_1] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_1, ActualArgs_1, "count">>;
                findFirst: () => <This_2, FormalArgs_2 extends import("@prisma/client/runtime/library").Args<This_2, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_2 extends FormalArgs_2>(this: This_2, args?: { [key_2 in keyof ActualArgs_2]: key_2 extends keyof FormalArgs_2 ? ActualArgs_2[key_2] : never; } & (ActualArgs_2 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_2 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_2, ActualArgs_2, "findFirst">>;
                findFirstOrThrow: () => <This_3, FormalArgs_3 extends import("@prisma/client/runtime/library").Args<This_3, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_3 extends FormalArgs_3>(this: This_3, args?: { [key_3 in keyof ActualArgs_3]: key_3 extends keyof FormalArgs_3 ? ActualArgs_3[key_3] : never; } & (ActualArgs_3 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_3 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_3, ActualArgs_3, "findFirstOrThrow">>;
                findMany: () => <This_4, FormalArgs_4 extends import("@prisma/client/runtime/library").Args<This_4, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_4 extends FormalArgs_4>(this: This_4, args?: { [key_4 in keyof ActualArgs_4]: key_4 extends keyof FormalArgs_4 ? ActualArgs_4[key_4] : never; } & (ActualArgs_4 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_4 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_4, ActualArgs_4, "findMany">>;
                findUnique: () => <This_5, FormalArgs_5 extends import("@prisma/client/runtime/library").Args<This_5, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_5 extends FormalArgs_5>(this: This_5, args: { [key_5 in keyof ActualArgs_5]: key_5 extends keyof FormalArgs_5 ? ActualArgs_5[key_5] : never; } & (ActualArgs_5 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_5 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_5, ActualArgs_5, "findUnique">>;
                findUniqueOrThrow: () => <This_6, FormalArgs_6 extends import("@prisma/client/runtime/library").Args<This_6, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_6 extends FormalArgs_6>(this: This_6, args: { [key_6 in keyof ActualArgs_6]: key_6 extends keyof FormalArgs_6 ? ActualArgs_6[key_6] : never; } & (ActualArgs_6 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_6 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_6, ActualArgs_6, "findUniqueOrThrow">>;
                groupBy: () => <This_7, FormalArgs_7 extends import("@prisma/client/runtime/library").Args<This_7, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_7 extends FormalArgs_7>(this: This_7, args: { [key_7 in keyof ActualArgs_7]: key_7 extends keyof FormalArgs_7 ? ActualArgs_7[key_7] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_7, ActualArgs_7, "groupBy">>;
            };
            inventory_reports: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This_1, FormalArgs_1 extends import("@prisma/client/runtime/library").Args<This_1, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_1 extends FormalArgs_1>(this: This_1, args?: { [key_1 in keyof ActualArgs_1]: key_1 extends keyof FormalArgs_1 ? ActualArgs_1[key_1] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_1, ActualArgs_1, "count">>;
                findFirst: () => <This_2, FormalArgs_2 extends import("@prisma/client/runtime/library").Args<This_2, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_2 extends FormalArgs_2>(this: This_2, args?: { [key_2 in keyof ActualArgs_2]: key_2 extends keyof FormalArgs_2 ? ActualArgs_2[key_2] : never; } & (ActualArgs_2 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_2 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_2, ActualArgs_2, "findFirst">>;
                findFirstOrThrow: () => <This_3, FormalArgs_3 extends import("@prisma/client/runtime/library").Args<This_3, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_3 extends FormalArgs_3>(this: This_3, args?: { [key_3 in keyof ActualArgs_3]: key_3 extends keyof FormalArgs_3 ? ActualArgs_3[key_3] : never; } & (ActualArgs_3 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_3 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_3, ActualArgs_3, "findFirstOrThrow">>;
                findMany: () => <This_4, FormalArgs_4 extends import("@prisma/client/runtime/library").Args<This_4, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_4 extends FormalArgs_4>(this: This_4, args?: { [key_4 in keyof ActualArgs_4]: key_4 extends keyof FormalArgs_4 ? ActualArgs_4[key_4] : never; } & (ActualArgs_4 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_4 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_4, ActualArgs_4, "findMany">>;
                findUnique: () => <This_5, FormalArgs_5 extends import("@prisma/client/runtime/library").Args<This_5, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_5 extends FormalArgs_5>(this: This_5, args: { [key_5 in keyof ActualArgs_5]: key_5 extends keyof FormalArgs_5 ? ActualArgs_5[key_5] : never; } & (ActualArgs_5 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_5 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_5, ActualArgs_5, "findUnique">>;
                findUniqueOrThrow: () => <This_6, FormalArgs_6 extends import("@prisma/client/runtime/library").Args<This_6, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_6 extends FormalArgs_6>(this: This_6, args: { [key_6 in keyof ActualArgs_6]: key_6 extends keyof FormalArgs_6 ? ActualArgs_6[key_6] : never; } & (ActualArgs_6 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_6 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_6, ActualArgs_6, "findUniqueOrThrow">>;
                groupBy: () => <This_7, FormalArgs_7 extends import("@prisma/client/runtime/library").Args<This_7, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_7 extends FormalArgs_7>(this: This_7, args: { [key_7 in keyof ActualArgs_7]: key_7 extends keyof FormalArgs_7 ? ActualArgs_7[key_7] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_7, ActualArgs_7, "groupBy">>;
            };
            knowledge_base_entries: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This_1, FormalArgs_1 extends import("@prisma/client/runtime/library").Args<This_1, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_1 extends FormalArgs_1>(this: This_1, args?: { [key_1 in keyof ActualArgs_1]: key_1 extends keyof FormalArgs_1 ? ActualArgs_1[key_1] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_1, ActualArgs_1, "count">>;
                findFirst: () => <This_2, FormalArgs_2 extends import("@prisma/client/runtime/library").Args<This_2, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_2 extends FormalArgs_2>(this: This_2, args?: { [key_2 in keyof ActualArgs_2]: key_2 extends keyof FormalArgs_2 ? ActualArgs_2[key_2] : never; } & (ActualArgs_2 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_2 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_2, ActualArgs_2, "findFirst">>;
                findFirstOrThrow: () => <This_3, FormalArgs_3 extends import("@prisma/client/runtime/library").Args<This_3, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_3 extends FormalArgs_3>(this: This_3, args?: { [key_3 in keyof ActualArgs_3]: key_3 extends keyof FormalArgs_3 ? ActualArgs_3[key_3] : never; } & (ActualArgs_3 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_3 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_3, ActualArgs_3, "findFirstOrThrow">>;
                findMany: () => <This_4, FormalArgs_4 extends import("@prisma/client/runtime/library").Args<This_4, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_4 extends FormalArgs_4>(this: This_4, args?: { [key_4 in keyof ActualArgs_4]: key_4 extends keyof FormalArgs_4 ? ActualArgs_4[key_4] : never; } & (ActualArgs_4 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_4 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_4, ActualArgs_4, "findMany">>;
                findUnique: () => <This_5, FormalArgs_5 extends import("@prisma/client/runtime/library").Args<This_5, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_5 extends FormalArgs_5>(this: This_5, args: { [key_5 in keyof ActualArgs_5]: key_5 extends keyof FormalArgs_5 ? ActualArgs_5[key_5] : never; } & (ActualArgs_5 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_5 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_5, ActualArgs_5, "findUnique">>;
                findUniqueOrThrow: () => <This_6, FormalArgs_6 extends import("@prisma/client/runtime/library").Args<This_6, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_6 extends FormalArgs_6>(this: This_6, args: { [key_6 in keyof ActualArgs_6]: key_6 extends keyof FormalArgs_6 ? ActualArgs_6[key_6] : never; } & (ActualArgs_6 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_6 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_6, ActualArgs_6, "findUniqueOrThrow">>;
                groupBy: () => <This_7, FormalArgs_7 extends import("@prisma/client/runtime/library").Args<This_7, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_7 extends FormalArgs_7>(this: This_7, args: { [key_7 in keyof ActualArgs_7]: key_7 extends keyof FormalArgs_7 ? ActualArgs_7[key_7] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_7, ActualArgs_7, "groupBy">>;
            };
            loyalty_accounts: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This_1, FormalArgs_1 extends import("@prisma/client/runtime/library").Args<This_1, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_1 extends FormalArgs_1>(this: This_1, args?: { [key_1 in keyof ActualArgs_1]: key_1 extends keyof FormalArgs_1 ? ActualArgs_1[key_1] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_1, ActualArgs_1, "count">>;
                findFirst: () => <This_2, FormalArgs_2 extends import("@prisma/client/runtime/library").Args<This_2, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_2 extends FormalArgs_2>(this: This_2, args?: { [key_2 in keyof ActualArgs_2]: key_2 extends keyof FormalArgs_2 ? ActualArgs_2[key_2] : never; } & (ActualArgs_2 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_2 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_2, ActualArgs_2, "findFirst">>;
                findFirstOrThrow: () => <This_3, FormalArgs_3 extends import("@prisma/client/runtime/library").Args<This_3, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_3 extends FormalArgs_3>(this: This_3, args?: { [key_3 in keyof ActualArgs_3]: key_3 extends keyof FormalArgs_3 ? ActualArgs_3[key_3] : never; } & (ActualArgs_3 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_3 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_3, ActualArgs_3, "findFirstOrThrow">>;
                findMany: () => <This_4, FormalArgs_4 extends import("@prisma/client/runtime/library").Args<This_4, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_4 extends FormalArgs_4>(this: This_4, args?: { [key_4 in keyof ActualArgs_4]: key_4 extends keyof FormalArgs_4 ? ActualArgs_4[key_4] : never; } & (ActualArgs_4 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_4 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_4, ActualArgs_4, "findMany">>;
                findUnique: () => <This_5, FormalArgs_5 extends import("@prisma/client/runtime/library").Args<This_5, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_5 extends FormalArgs_5>(this: This_5, args: { [key_5 in keyof ActualArgs_5]: key_5 extends keyof FormalArgs_5 ? ActualArgs_5[key_5] : never; } & (ActualArgs_5 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_5 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_5, ActualArgs_5, "findUnique">>;
                findUniqueOrThrow: () => <This_6, FormalArgs_6 extends import("@prisma/client/runtime/library").Args<This_6, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_6 extends FormalArgs_6>(this: This_6, args: { [key_6 in keyof ActualArgs_6]: key_6 extends keyof FormalArgs_6 ? ActualArgs_6[key_6] : never; } & (ActualArgs_6 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_6 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_6, ActualArgs_6, "findUniqueOrThrow">>;
                groupBy: () => <This_7, FormalArgs_7 extends import("@prisma/client/runtime/library").Args<This_7, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_7 extends FormalArgs_7>(this: This_7, args: { [key_7 in keyof ActualArgs_7]: key_7 extends keyof FormalArgs_7 ? ActualArgs_7[key_7] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_7, ActualArgs_7, "groupBy">>;
            };
            loyalty_rewards: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This_1, FormalArgs_1 extends import("@prisma/client/runtime/library").Args<This_1, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_1 extends FormalArgs_1>(this: This_1, args?: { [key_1 in keyof ActualArgs_1]: key_1 extends keyof FormalArgs_1 ? ActualArgs_1[key_1] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_1, ActualArgs_1, "count">>;
                findFirst: () => <This_2, FormalArgs_2 extends import("@prisma/client/runtime/library").Args<This_2, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_2 extends FormalArgs_2>(this: This_2, args?: { [key_2 in keyof ActualArgs_2]: key_2 extends keyof FormalArgs_2 ? ActualArgs_2[key_2] : never; } & (ActualArgs_2 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_2 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_2, ActualArgs_2, "findFirst">>;
                findFirstOrThrow: () => <This_3, FormalArgs_3 extends import("@prisma/client/runtime/library").Args<This_3, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_3 extends FormalArgs_3>(this: This_3, args?: { [key_3 in keyof ActualArgs_3]: key_3 extends keyof FormalArgs_3 ? ActualArgs_3[key_3] : never; } & (ActualArgs_3 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_3 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_3, ActualArgs_3, "findFirstOrThrow">>;
                findMany: () => <This_4, FormalArgs_4 extends import("@prisma/client/runtime/library").Args<This_4, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_4 extends FormalArgs_4>(this: This_4, args?: { [key_4 in keyof ActualArgs_4]: key_4 extends keyof FormalArgs_4 ? ActualArgs_4[key_4] : never; } & (ActualArgs_4 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_4 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_4, ActualArgs_4, "findMany">>;
                findUnique: () => <This_5, FormalArgs_5 extends import("@prisma/client/runtime/library").Args<This_5, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_5 extends FormalArgs_5>(this: This_5, args: { [key_5 in keyof ActualArgs_5]: key_5 extends keyof FormalArgs_5 ? ActualArgs_5[key_5] : never; } & (ActualArgs_5 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_5 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_5, ActualArgs_5, "findUnique">>;
                findUniqueOrThrow: () => <This_6, FormalArgs_6 extends import("@prisma/client/runtime/library").Args<This_6, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_6 extends FormalArgs_6>(this: This_6, args: { [key_6 in keyof ActualArgs_6]: key_6 extends keyof FormalArgs_6 ? ActualArgs_6[key_6] : never; } & (ActualArgs_6 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_6 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_6, ActualArgs_6, "findUniqueOrThrow">>;
                groupBy: () => <This_7, FormalArgs_7 extends import("@prisma/client/runtime/library").Args<This_7, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_7 extends FormalArgs_7>(this: This_7, args: { [key_7 in keyof ActualArgs_7]: key_7 extends keyof FormalArgs_7 ? ActualArgs_7[key_7] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_7, ActualArgs_7, "groupBy">>;
            };
            newsletter_subscriptions: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This_1, FormalArgs_1 extends import("@prisma/client/runtime/library").Args<This_1, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_1 extends FormalArgs_1>(this: This_1, args?: { [key_1 in keyof ActualArgs_1]: key_1 extends keyof FormalArgs_1 ? ActualArgs_1[key_1] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_1, ActualArgs_1, "count">>;
                findFirst: () => <This_2, FormalArgs_2 extends import("@prisma/client/runtime/library").Args<This_2, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_2 extends FormalArgs_2>(this: This_2, args?: { [key_2 in keyof ActualArgs_2]: key_2 extends keyof FormalArgs_2 ? ActualArgs_2[key_2] : never; } & (ActualArgs_2 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_2 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_2, ActualArgs_2, "findFirst">>;
                findFirstOrThrow: () => <This_3, FormalArgs_3 extends import("@prisma/client/runtime/library").Args<This_3, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_3 extends FormalArgs_3>(this: This_3, args?: { [key_3 in keyof ActualArgs_3]: key_3 extends keyof FormalArgs_3 ? ActualArgs_3[key_3] : never; } & (ActualArgs_3 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_3 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_3, ActualArgs_3, "findFirstOrThrow">>;
                findMany: () => <This_4, FormalArgs_4 extends import("@prisma/client/runtime/library").Args<This_4, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_4 extends FormalArgs_4>(this: This_4, args?: { [key_4 in keyof ActualArgs_4]: key_4 extends keyof FormalArgs_4 ? ActualArgs_4[key_4] : never; } & (ActualArgs_4 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_4 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_4, ActualArgs_4, "findMany">>;
                findUnique: () => <This_5, FormalArgs_5 extends import("@prisma/client/runtime/library").Args<This_5, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_5 extends FormalArgs_5>(this: This_5, args: { [key_5 in keyof ActualArgs_5]: key_5 extends keyof FormalArgs_5 ? ActualArgs_5[key_5] : never; } & (ActualArgs_5 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_5 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_5, ActualArgs_5, "findUnique">>;
                findUniqueOrThrow: () => <This_6, FormalArgs_6 extends import("@prisma/client/runtime/library").Args<This_6, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_6 extends FormalArgs_6>(this: This_6, args: { [key_6 in keyof ActualArgs_6]: key_6 extends keyof FormalArgs_6 ? ActualArgs_6[key_6] : never; } & (ActualArgs_6 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_6 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_6, ActualArgs_6, "findUniqueOrThrow">>;
                groupBy: () => <This_7, FormalArgs_7 extends import("@prisma/client/runtime/library").Args<This_7, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_7 extends FormalArgs_7>(this: This_7, args: { [key_7 in keyof ActualArgs_7]: key_7 extends keyof FormalArgs_7 ? ActualArgs_7[key_7] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_7, ActualArgs_7, "groupBy">>;
            };
            order_items: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This_1, FormalArgs_1 extends import("@prisma/client/runtime/library").Args<This_1, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_1 extends FormalArgs_1>(this: This_1, args?: { [key_1 in keyof ActualArgs_1]: key_1 extends keyof FormalArgs_1 ? ActualArgs_1[key_1] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_1, ActualArgs_1, "count">>;
                findFirst: () => <This_2, FormalArgs_2 extends import("@prisma/client/runtime/library").Args<This_2, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_2 extends FormalArgs_2>(this: This_2, args?: { [key_2 in keyof ActualArgs_2]: key_2 extends keyof FormalArgs_2 ? ActualArgs_2[key_2] : never; } & (ActualArgs_2 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_2 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_2, ActualArgs_2, "findFirst">>;
                findFirstOrThrow: () => <This_3, FormalArgs_3 extends import("@prisma/client/runtime/library").Args<This_3, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_3 extends FormalArgs_3>(this: This_3, args?: { [key_3 in keyof ActualArgs_3]: key_3 extends keyof FormalArgs_3 ? ActualArgs_3[key_3] : never; } & (ActualArgs_3 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_3 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_3, ActualArgs_3, "findFirstOrThrow">>;
                findMany: () => <This_4, FormalArgs_4 extends import("@prisma/client/runtime/library").Args<This_4, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_4 extends FormalArgs_4>(this: This_4, args?: { [key_4 in keyof ActualArgs_4]: key_4 extends keyof FormalArgs_4 ? ActualArgs_4[key_4] : never; } & (ActualArgs_4 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_4 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_4, ActualArgs_4, "findMany">>;
                findUnique: () => <This_5, FormalArgs_5 extends import("@prisma/client/runtime/library").Args<This_5, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_5 extends FormalArgs_5>(this: This_5, args: { [key_5 in keyof ActualArgs_5]: key_5 extends keyof FormalArgs_5 ? ActualArgs_5[key_5] : never; } & (ActualArgs_5 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_5 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_5, ActualArgs_5, "findUnique">>;
                findUniqueOrThrow: () => <This_6, FormalArgs_6 extends import("@prisma/client/runtime/library").Args<This_6, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_6 extends FormalArgs_6>(this: This_6, args: { [key_6 in keyof ActualArgs_6]: key_6 extends keyof FormalArgs_6 ? ActualArgs_6[key_6] : never; } & (ActualArgs_6 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_6 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_6, ActualArgs_6, "findUniqueOrThrow">>;
                groupBy: () => <This_7, FormalArgs_7 extends import("@prisma/client/runtime/library").Args<This_7, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_7 extends FormalArgs_7>(this: This_7, args: { [key_7 in keyof ActualArgs_7]: key_7 extends keyof FormalArgs_7 ? ActualArgs_7[key_7] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_7, ActualArgs_7, "groupBy">>;
            };
            orders: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This_1, FormalArgs_1 extends import("@prisma/client/runtime/library").Args<This_1, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_1 extends FormalArgs_1>(this: This_1, args?: { [key_1 in keyof ActualArgs_1]: key_1 extends keyof FormalArgs_1 ? ActualArgs_1[key_1] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_1, ActualArgs_1, "count">>;
                findFirst: () => <This_2, FormalArgs_2 extends import("@prisma/client/runtime/library").Args<This_2, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_2 extends FormalArgs_2>(this: This_2, args?: { [key_2 in keyof ActualArgs_2]: key_2 extends keyof FormalArgs_2 ? ActualArgs_2[key_2] : never; } & (ActualArgs_2 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_2 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_2, ActualArgs_2, "findFirst">>;
                findFirstOrThrow: () => <This_3, FormalArgs_3 extends import("@prisma/client/runtime/library").Args<This_3, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_3 extends FormalArgs_3>(this: This_3, args?: { [key_3 in keyof ActualArgs_3]: key_3 extends keyof FormalArgs_3 ? ActualArgs_3[key_3] : never; } & (ActualArgs_3 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_3 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_3, ActualArgs_3, "findFirstOrThrow">>;
                findMany: () => <This_4, FormalArgs_4 extends import("@prisma/client/runtime/library").Args<This_4, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_4 extends FormalArgs_4>(this: This_4, args?: { [key_4 in keyof ActualArgs_4]: key_4 extends keyof FormalArgs_4 ? ActualArgs_4[key_4] : never; } & (ActualArgs_4 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_4 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_4, ActualArgs_4, "findMany">>;
                findUnique: () => <This_5, FormalArgs_5 extends import("@prisma/client/runtime/library").Args<This_5, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_5 extends FormalArgs_5>(this: This_5, args: { [key_5 in keyof ActualArgs_5]: key_5 extends keyof FormalArgs_5 ? ActualArgs_5[key_5] : never; } & (ActualArgs_5 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_5 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_5, ActualArgs_5, "findUnique">>;
                findUniqueOrThrow: () => <This_6, FormalArgs_6 extends import("@prisma/client/runtime/library").Args<This_6, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_6 extends FormalArgs_6>(this: This_6, args: { [key_6 in keyof ActualArgs_6]: key_6 extends keyof FormalArgs_6 ? ActualArgs_6[key_6] : never; } & (ActualArgs_6 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_6 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_6, ActualArgs_6, "findUniqueOrThrow">>;
                groupBy: () => <This_7, FormalArgs_7 extends import("@prisma/client/runtime/library").Args<This_7, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_7 extends FormalArgs_7>(this: This_7, args: { [key_7 in keyof ActualArgs_7]: key_7 extends keyof FormalArgs_7 ? ActualArgs_7[key_7] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_7, ActualArgs_7, "groupBy">>;
            };
            pages: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This_1, FormalArgs_1 extends import("@prisma/client/runtime/library").Args<This_1, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_1 extends FormalArgs_1>(this: This_1, args?: { [key_1 in keyof ActualArgs_1]: key_1 extends keyof FormalArgs_1 ? ActualArgs_1[key_1] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_1, ActualArgs_1, "count">>;
                findFirst: () => <This_2, FormalArgs_2 extends import("@prisma/client/runtime/library").Args<This_2, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_2 extends FormalArgs_2>(this: This_2, args?: { [key_2 in keyof ActualArgs_2]: key_2 extends keyof FormalArgs_2 ? ActualArgs_2[key_2] : never; } & (ActualArgs_2 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_2 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_2, ActualArgs_2, "findFirst">>;
                findFirstOrThrow: () => <This_3, FormalArgs_3 extends import("@prisma/client/runtime/library").Args<This_3, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_3 extends FormalArgs_3>(this: This_3, args?: { [key_3 in keyof ActualArgs_3]: key_3 extends keyof FormalArgs_3 ? ActualArgs_3[key_3] : never; } & (ActualArgs_3 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_3 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_3, ActualArgs_3, "findFirstOrThrow">>;
                findMany: () => <This_4, FormalArgs_4 extends import("@prisma/client/runtime/library").Args<This_4, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_4 extends FormalArgs_4>(this: This_4, args?: { [key_4 in keyof ActualArgs_4]: key_4 extends keyof FormalArgs_4 ? ActualArgs_4[key_4] : never; } & (ActualArgs_4 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_4 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_4, ActualArgs_4, "findMany">>;
                findUnique: () => <This_5, FormalArgs_5 extends import("@prisma/client/runtime/library").Args<This_5, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_5 extends FormalArgs_5>(this: This_5, args: { [key_5 in keyof ActualArgs_5]: key_5 extends keyof FormalArgs_5 ? ActualArgs_5[key_5] : never; } & (ActualArgs_5 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_5 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_5, ActualArgs_5, "findUnique">>;
                findUniqueOrThrow: () => <This_6, FormalArgs_6 extends import("@prisma/client/runtime/library").Args<This_6, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_6 extends FormalArgs_6>(this: This_6, args: { [key_6 in keyof ActualArgs_6]: key_6 extends keyof FormalArgs_6 ? ActualArgs_6[key_6] : never; } & (ActualArgs_6 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_6 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_6, ActualArgs_6, "findUniqueOrThrow">>;
                groupBy: () => <This_7, FormalArgs_7 extends import("@prisma/client/runtime/library").Args<This_7, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_7 extends FormalArgs_7>(this: This_7, args: { [key_7 in keyof ActualArgs_7]: key_7 extends keyof FormalArgs_7 ? ActualArgs_7[key_7] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_7, ActualArgs_7, "groupBy">>;
            };
            payment_intents: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This_1, FormalArgs_1 extends import("@prisma/client/runtime/library").Args<This_1, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_1 extends FormalArgs_1>(this: This_1, args?: { [key_1 in keyof ActualArgs_1]: key_1 extends keyof FormalArgs_1 ? ActualArgs_1[key_1] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_1, ActualArgs_1, "count">>;
                findFirst: () => <This_2, FormalArgs_2 extends import("@prisma/client/runtime/library").Args<This_2, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_2 extends FormalArgs_2>(this: This_2, args?: { [key_2 in keyof ActualArgs_2]: key_2 extends keyof FormalArgs_2 ? ActualArgs_2[key_2] : never; } & (ActualArgs_2 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_2 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_2, ActualArgs_2, "findFirst">>;
                findFirstOrThrow: () => <This_3, FormalArgs_3 extends import("@prisma/client/runtime/library").Args<This_3, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_3 extends FormalArgs_3>(this: This_3, args?: { [key_3 in keyof ActualArgs_3]: key_3 extends keyof FormalArgs_3 ? ActualArgs_3[key_3] : never; } & (ActualArgs_3 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_3 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_3, ActualArgs_3, "findFirstOrThrow">>;
                findMany: () => <This_4, FormalArgs_4 extends import("@prisma/client/runtime/library").Args<This_4, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_4 extends FormalArgs_4>(this: This_4, args?: { [key_4 in keyof ActualArgs_4]: key_4 extends keyof FormalArgs_4 ? ActualArgs_4[key_4] : never; } & (ActualArgs_4 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_4 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_4, ActualArgs_4, "findMany">>;
                findUnique: () => <This_5, FormalArgs_5 extends import("@prisma/client/runtime/library").Args<This_5, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_5 extends FormalArgs_5>(this: This_5, args: { [key_5 in keyof ActualArgs_5]: key_5 extends keyof FormalArgs_5 ? ActualArgs_5[key_5] : never; } & (ActualArgs_5 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_5 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_5, ActualArgs_5, "findUnique">>;
                findUniqueOrThrow: () => <This_6, FormalArgs_6 extends import("@prisma/client/runtime/library").Args<This_6, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_6 extends FormalArgs_6>(this: This_6, args: { [key_6 in keyof ActualArgs_6]: key_6 extends keyof FormalArgs_6 ? ActualArgs_6[key_6] : never; } & (ActualArgs_6 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_6 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_6, ActualArgs_6, "findUniqueOrThrow">>;
                groupBy: () => <This_7, FormalArgs_7 extends import("@prisma/client/runtime/library").Args<This_7, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_7 extends FormalArgs_7>(this: This_7, args: { [key_7 in keyof ActualArgs_7]: key_7 extends keyof FormalArgs_7 ? ActualArgs_7[key_7] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_7, ActualArgs_7, "groupBy">>;
            };
            payments: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This_1, FormalArgs_1 extends import("@prisma/client/runtime/library").Args<This_1, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_1 extends FormalArgs_1>(this: This_1, args?: { [key_1 in keyof ActualArgs_1]: key_1 extends keyof FormalArgs_1 ? ActualArgs_1[key_1] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_1, ActualArgs_1, "count">>;
                findFirst: () => <This_2, FormalArgs_2 extends import("@prisma/client/runtime/library").Args<This_2, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_2 extends FormalArgs_2>(this: This_2, args?: { [key_2 in keyof ActualArgs_2]: key_2 extends keyof FormalArgs_2 ? ActualArgs_2[key_2] : never; } & (ActualArgs_2 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_2 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_2, ActualArgs_2, "findFirst">>;
                findFirstOrThrow: () => <This_3, FormalArgs_3 extends import("@prisma/client/runtime/library").Args<This_3, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_3 extends FormalArgs_3>(this: This_3, args?: { [key_3 in keyof ActualArgs_3]: key_3 extends keyof FormalArgs_3 ? ActualArgs_3[key_3] : never; } & (ActualArgs_3 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_3 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_3, ActualArgs_3, "findFirstOrThrow">>;
                findMany: () => <This_4, FormalArgs_4 extends import("@prisma/client/runtime/library").Args<This_4, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_4 extends FormalArgs_4>(this: This_4, args?: { [key_4 in keyof ActualArgs_4]: key_4 extends keyof FormalArgs_4 ? ActualArgs_4[key_4] : never; } & (ActualArgs_4 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_4 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_4, ActualArgs_4, "findMany">>;
                findUnique: () => <This_5, FormalArgs_5 extends import("@prisma/client/runtime/library").Args<This_5, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_5 extends FormalArgs_5>(this: This_5, args: { [key_5 in keyof ActualArgs_5]: key_5 extends keyof FormalArgs_5 ? ActualArgs_5[key_5] : never; } & (ActualArgs_5 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_5 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_5, ActualArgs_5, "findUnique">>;
                findUniqueOrThrow: () => <This_6, FormalArgs_6 extends import("@prisma/client/runtime/library").Args<This_6, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_6 extends FormalArgs_6>(this: This_6, args: { [key_6 in keyof ActualArgs_6]: key_6 extends keyof FormalArgs_6 ? ActualArgs_6[key_6] : never; } & (ActualArgs_6 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_6 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_6, ActualArgs_6, "findUniqueOrThrow">>;
                groupBy: () => <This_7, FormalArgs_7 extends import("@prisma/client/runtime/library").Args<This_7, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_7 extends FormalArgs_7>(this: This_7, args: { [key_7 in keyof ActualArgs_7]: key_7 extends keyof FormalArgs_7 ? ActualArgs_7[key_7] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_7, ActualArgs_7, "groupBy">>;
            };
            point_transactions: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This_1, FormalArgs_1 extends import("@prisma/client/runtime/library").Args<This_1, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_1 extends FormalArgs_1>(this: This_1, args?: { [key_1 in keyof ActualArgs_1]: key_1 extends keyof FormalArgs_1 ? ActualArgs_1[key_1] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_1, ActualArgs_1, "count">>;
                findFirst: () => <This_2, FormalArgs_2 extends import("@prisma/client/runtime/library").Args<This_2, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_2 extends FormalArgs_2>(this: This_2, args?: { [key_2 in keyof ActualArgs_2]: key_2 extends keyof FormalArgs_2 ? ActualArgs_2[key_2] : never; } & (ActualArgs_2 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_2 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_2, ActualArgs_2, "findFirst">>;
                findFirstOrThrow: () => <This_3, FormalArgs_3 extends import("@prisma/client/runtime/library").Args<This_3, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_3 extends FormalArgs_3>(this: This_3, args?: { [key_3 in keyof ActualArgs_3]: key_3 extends keyof FormalArgs_3 ? ActualArgs_3[key_3] : never; } & (ActualArgs_3 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_3 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_3, ActualArgs_3, "findFirstOrThrow">>;
                findMany: () => <This_4, FormalArgs_4 extends import("@prisma/client/runtime/library").Args<This_4, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_4 extends FormalArgs_4>(this: This_4, args?: { [key_4 in keyof ActualArgs_4]: key_4 extends keyof FormalArgs_4 ? ActualArgs_4[key_4] : never; } & (ActualArgs_4 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_4 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_4, ActualArgs_4, "findMany">>;
                findUnique: () => <This_5, FormalArgs_5 extends import("@prisma/client/runtime/library").Args<This_5, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_5 extends FormalArgs_5>(this: This_5, args: { [key_5 in keyof ActualArgs_5]: key_5 extends keyof FormalArgs_5 ? ActualArgs_5[key_5] : never; } & (ActualArgs_5 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_5 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_5, ActualArgs_5, "findUnique">>;
                findUniqueOrThrow: () => <This_6, FormalArgs_6 extends import("@prisma/client/runtime/library").Args<This_6, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_6 extends FormalArgs_6>(this: This_6, args: { [key_6 in keyof ActualArgs_6]: key_6 extends keyof FormalArgs_6 ? ActualArgs_6[key_6] : never; } & (ActualArgs_6 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_6 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_6, ActualArgs_6, "findUniqueOrThrow">>;
                groupBy: () => <This_7, FormalArgs_7 extends import("@prisma/client/runtime/library").Args<This_7, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_7 extends FormalArgs_7>(this: This_7, args: { [key_7 in keyof ActualArgs_7]: key_7 extends keyof FormalArgs_7 ? ActualArgs_7[key_7] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_7, ActualArgs_7, "groupBy">>;
            };
            policies: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This_1, FormalArgs_1 extends import("@prisma/client/runtime/library").Args<This_1, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_1 extends FormalArgs_1>(this: This_1, args?: { [key_1 in keyof ActualArgs_1]: key_1 extends keyof FormalArgs_1 ? ActualArgs_1[key_1] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_1, ActualArgs_1, "count">>;
                findFirst: () => <This_2, FormalArgs_2 extends import("@prisma/client/runtime/library").Args<This_2, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_2 extends FormalArgs_2>(this: This_2, args?: { [key_2 in keyof ActualArgs_2]: key_2 extends keyof FormalArgs_2 ? ActualArgs_2[key_2] : never; } & (ActualArgs_2 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_2 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_2, ActualArgs_2, "findFirst">>;
                findFirstOrThrow: () => <This_3, FormalArgs_3 extends import("@prisma/client/runtime/library").Args<This_3, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_3 extends FormalArgs_3>(this: This_3, args?: { [key_3 in keyof ActualArgs_3]: key_3 extends keyof FormalArgs_3 ? ActualArgs_3[key_3] : never; } & (ActualArgs_3 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_3 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_3, ActualArgs_3, "findFirstOrThrow">>;
                findMany: () => <This_4, FormalArgs_4 extends import("@prisma/client/runtime/library").Args<This_4, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_4 extends FormalArgs_4>(this: This_4, args?: { [key_4 in keyof ActualArgs_4]: key_4 extends keyof FormalArgs_4 ? ActualArgs_4[key_4] : never; } & (ActualArgs_4 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_4 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_4, ActualArgs_4, "findMany">>;
                findUnique: () => <This_5, FormalArgs_5 extends import("@prisma/client/runtime/library").Args<This_5, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_5 extends FormalArgs_5>(this: This_5, args: { [key_5 in keyof ActualArgs_5]: key_5 extends keyof FormalArgs_5 ? ActualArgs_5[key_5] : never; } & (ActualArgs_5 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_5 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_5, ActualArgs_5, "findUnique">>;
                findUniqueOrThrow: () => <This_6, FormalArgs_6 extends import("@prisma/client/runtime/library").Args<This_6, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_6 extends FormalArgs_6>(this: This_6, args: { [key_6 in keyof ActualArgs_6]: key_6 extends keyof FormalArgs_6 ? ActualArgs_6[key_6] : never; } & (ActualArgs_6 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_6 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_6, ActualArgs_6, "findUniqueOrThrow">>;
                groupBy: () => <This_7, FormalArgs_7 extends import("@prisma/client/runtime/library").Args<This_7, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_7 extends FormalArgs_7>(this: This_7, args: { [key_7 in keyof ActualArgs_7]: key_7 extends keyof FormalArgs_7 ? ActualArgs_7[key_7] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_7, ActualArgs_7, "groupBy">>;
            };
            product_review_reports: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This_1, FormalArgs_1 extends import("@prisma/client/runtime/library").Args<This_1, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_1 extends FormalArgs_1>(this: This_1, args?: { [key_1 in keyof ActualArgs_1]: key_1 extends keyof FormalArgs_1 ? ActualArgs_1[key_1] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_1, ActualArgs_1, "count">>;
                findFirst: () => <This_2, FormalArgs_2 extends import("@prisma/client/runtime/library").Args<This_2, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_2 extends FormalArgs_2>(this: This_2, args?: { [key_2 in keyof ActualArgs_2]: key_2 extends keyof FormalArgs_2 ? ActualArgs_2[key_2] : never; } & (ActualArgs_2 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_2 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_2, ActualArgs_2, "findFirst">>;
                findFirstOrThrow: () => <This_3, FormalArgs_3 extends import("@prisma/client/runtime/library").Args<This_3, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_3 extends FormalArgs_3>(this: This_3, args?: { [key_3 in keyof ActualArgs_3]: key_3 extends keyof FormalArgs_3 ? ActualArgs_3[key_3] : never; } & (ActualArgs_3 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_3 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_3, ActualArgs_3, "findFirstOrThrow">>;
                findMany: () => <This_4, FormalArgs_4 extends import("@prisma/client/runtime/library").Args<This_4, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_4 extends FormalArgs_4>(this: This_4, args?: { [key_4 in keyof ActualArgs_4]: key_4 extends keyof FormalArgs_4 ? ActualArgs_4[key_4] : never; } & (ActualArgs_4 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_4 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_4, ActualArgs_4, "findMany">>;
                findUnique: () => <This_5, FormalArgs_5 extends import("@prisma/client/runtime/library").Args<This_5, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_5 extends FormalArgs_5>(this: This_5, args: { [key_5 in keyof ActualArgs_5]: key_5 extends keyof FormalArgs_5 ? ActualArgs_5[key_5] : never; } & (ActualArgs_5 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_5 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_5, ActualArgs_5, "findUnique">>;
                findUniqueOrThrow: () => <This_6, FormalArgs_6 extends import("@prisma/client/runtime/library").Args<This_6, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_6 extends FormalArgs_6>(this: This_6, args: { [key_6 in keyof ActualArgs_6]: key_6 extends keyof FormalArgs_6 ? ActualArgs_6[key_6] : never; } & (ActualArgs_6 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_6 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_6, ActualArgs_6, "findUniqueOrThrow">>;
                groupBy: () => <This_7, FormalArgs_7 extends import("@prisma/client/runtime/library").Args<This_7, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_7 extends FormalArgs_7>(this: This_7, args: { [key_7 in keyof ActualArgs_7]: key_7 extends keyof FormalArgs_7 ? ActualArgs_7[key_7] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_7, ActualArgs_7, "groupBy">>;
            };
            product_review_votes: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This_1, FormalArgs_1 extends import("@prisma/client/runtime/library").Args<This_1, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_1 extends FormalArgs_1>(this: This_1, args?: { [key_1 in keyof ActualArgs_1]: key_1 extends keyof FormalArgs_1 ? ActualArgs_1[key_1] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_1, ActualArgs_1, "count">>;
                findFirst: () => <This_2, FormalArgs_2 extends import("@prisma/client/runtime/library").Args<This_2, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_2 extends FormalArgs_2>(this: This_2, args?: { [key_2 in keyof ActualArgs_2]: key_2 extends keyof FormalArgs_2 ? ActualArgs_2[key_2] : never; } & (ActualArgs_2 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_2 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_2, ActualArgs_2, "findFirst">>;
                findFirstOrThrow: () => <This_3, FormalArgs_3 extends import("@prisma/client/runtime/library").Args<This_3, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_3 extends FormalArgs_3>(this: This_3, args?: { [key_3 in keyof ActualArgs_3]: key_3 extends keyof FormalArgs_3 ? ActualArgs_3[key_3] : never; } & (ActualArgs_3 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_3 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_3, ActualArgs_3, "findFirstOrThrow">>;
                findMany: () => <This_4, FormalArgs_4 extends import("@prisma/client/runtime/library").Args<This_4, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_4 extends FormalArgs_4>(this: This_4, args?: { [key_4 in keyof ActualArgs_4]: key_4 extends keyof FormalArgs_4 ? ActualArgs_4[key_4] : never; } & (ActualArgs_4 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_4 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_4, ActualArgs_4, "findMany">>;
                findUnique: () => <This_5, FormalArgs_5 extends import("@prisma/client/runtime/library").Args<This_5, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_5 extends FormalArgs_5>(this: This_5, args: { [key_5 in keyof ActualArgs_5]: key_5 extends keyof FormalArgs_5 ? ActualArgs_5[key_5] : never; } & (ActualArgs_5 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_5 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_5, ActualArgs_5, "findUnique">>;
                findUniqueOrThrow: () => <This_6, FormalArgs_6 extends import("@prisma/client/runtime/library").Args<This_6, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_6 extends FormalArgs_6>(this: This_6, args: { [key_6 in keyof ActualArgs_6]: key_6 extends keyof FormalArgs_6 ? ActualArgs_6[key_6] : never; } & (ActualArgs_6 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_6 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_6, ActualArgs_6, "findUniqueOrThrow">>;
                groupBy: () => <This_7, FormalArgs_7 extends import("@prisma/client/runtime/library").Args<This_7, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_7 extends FormalArgs_7>(this: This_7, args: { [key_7 in keyof ActualArgs_7]: key_7 extends keyof FormalArgs_7 ? ActualArgs_7[key_7] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_7, ActualArgs_7, "groupBy">>;
            };
            product_reviews: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This_1, FormalArgs_1 extends import("@prisma/client/runtime/library").Args<This_1, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_1 extends FormalArgs_1>(this: This_1, args?: { [key_1 in keyof ActualArgs_1]: key_1 extends keyof FormalArgs_1 ? ActualArgs_1[key_1] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_1, ActualArgs_1, "count">>;
                findFirst: () => <This_2, FormalArgs_2 extends import("@prisma/client/runtime/library").Args<This_2, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_2 extends FormalArgs_2>(this: This_2, args?: { [key_2 in keyof ActualArgs_2]: key_2 extends keyof FormalArgs_2 ? ActualArgs_2[key_2] : never; } & (ActualArgs_2 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_2 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_2, ActualArgs_2, "findFirst">>;
                findFirstOrThrow: () => <This_3, FormalArgs_3 extends import("@prisma/client/runtime/library").Args<This_3, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_3 extends FormalArgs_3>(this: This_3, args?: { [key_3 in keyof ActualArgs_3]: key_3 extends keyof FormalArgs_3 ? ActualArgs_3[key_3] : never; } & (ActualArgs_3 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_3 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_3, ActualArgs_3, "findFirstOrThrow">>;
                findMany: () => <This_4, FormalArgs_4 extends import("@prisma/client/runtime/library").Args<This_4, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_4 extends FormalArgs_4>(this: This_4, args?: { [key_4 in keyof ActualArgs_4]: key_4 extends keyof FormalArgs_4 ? ActualArgs_4[key_4] : never; } & (ActualArgs_4 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_4 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_4, ActualArgs_4, "findMany">>;
                findUnique: () => <This_5, FormalArgs_5 extends import("@prisma/client/runtime/library").Args<This_5, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_5 extends FormalArgs_5>(this: This_5, args: { [key_5 in keyof ActualArgs_5]: key_5 extends keyof FormalArgs_5 ? ActualArgs_5[key_5] : never; } & (ActualArgs_5 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_5 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_5, ActualArgs_5, "findUnique">>;
                findUniqueOrThrow: () => <This_6, FormalArgs_6 extends import("@prisma/client/runtime/library").Args<This_6, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_6 extends FormalArgs_6>(this: This_6, args: { [key_6 in keyof ActualArgs_6]: key_6 extends keyof FormalArgs_6 ? ActualArgs_6[key_6] : never; } & (ActualArgs_6 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_6 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_6, ActualArgs_6, "findUniqueOrThrow">>;
                groupBy: () => <This_7, FormalArgs_7 extends import("@prisma/client/runtime/library").Args<This_7, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_7 extends FormalArgs_7>(this: This_7, args: { [key_7 in keyof ActualArgs_7]: key_7 extends keyof FormalArgs_7 ? ActualArgs_7[key_7] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_7, ActualArgs_7, "groupBy">>;
            };
            product_views: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This_1, FormalArgs_1 extends import("@prisma/client/runtime/library").Args<This_1, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_1 extends FormalArgs_1>(this: This_1, args?: { [key_1 in keyof ActualArgs_1]: key_1 extends keyof FormalArgs_1 ? ActualArgs_1[key_1] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_1, ActualArgs_1, "count">>;
                findFirst: () => <This_2, FormalArgs_2 extends import("@prisma/client/runtime/library").Args<This_2, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_2 extends FormalArgs_2>(this: This_2, args?: { [key_2 in keyof ActualArgs_2]: key_2 extends keyof FormalArgs_2 ? ActualArgs_2[key_2] : never; } & (ActualArgs_2 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_2 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_2, ActualArgs_2, "findFirst">>;
                findFirstOrThrow: () => <This_3, FormalArgs_3 extends import("@prisma/client/runtime/library").Args<This_3, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_3 extends FormalArgs_3>(this: This_3, args?: { [key_3 in keyof ActualArgs_3]: key_3 extends keyof FormalArgs_3 ? ActualArgs_3[key_3] : never; } & (ActualArgs_3 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_3 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_3, ActualArgs_3, "findFirstOrThrow">>;
                findMany: () => <This_4, FormalArgs_4 extends import("@prisma/client/runtime/library").Args<This_4, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_4 extends FormalArgs_4>(this: This_4, args?: { [key_4 in keyof ActualArgs_4]: key_4 extends keyof FormalArgs_4 ? ActualArgs_4[key_4] : never; } & (ActualArgs_4 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_4 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_4, ActualArgs_4, "findMany">>;
                findUnique: () => <This_5, FormalArgs_5 extends import("@prisma/client/runtime/library").Args<This_5, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_5 extends FormalArgs_5>(this: This_5, args: { [key_5 in keyof ActualArgs_5]: key_5 extends keyof FormalArgs_5 ? ActualArgs_5[key_5] : never; } & (ActualArgs_5 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_5 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_5, ActualArgs_5, "findUnique">>;
                findUniqueOrThrow: () => <This_6, FormalArgs_6 extends import("@prisma/client/runtime/library").Args<This_6, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_6 extends FormalArgs_6>(this: This_6, args: { [key_6 in keyof ActualArgs_6]: key_6 extends keyof FormalArgs_6 ? ActualArgs_6[key_6] : never; } & (ActualArgs_6 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_6 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_6, ActualArgs_6, "findUniqueOrThrow">>;
                groupBy: () => <This_7, FormalArgs_7 extends import("@prisma/client/runtime/library").Args<This_7, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_7 extends FormalArgs_7>(this: This_7, args: { [key_7 in keyof ActualArgs_7]: key_7 extends keyof FormalArgs_7 ? ActualArgs_7[key_7] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_7, ActualArgs_7, "groupBy">>;
            };
            products: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This_1, FormalArgs_1 extends import("@prisma/client/runtime/library").Args<This_1, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_1 extends FormalArgs_1>(this: This_1, args?: { [key_1 in keyof ActualArgs_1]: key_1 extends keyof FormalArgs_1 ? ActualArgs_1[key_1] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_1, ActualArgs_1, "count">>;
                findFirst: () => <This_2, FormalArgs_2 extends import("@prisma/client/runtime/library").Args<This_2, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_2 extends FormalArgs_2>(this: This_2, args?: { [key_2 in keyof ActualArgs_2]: key_2 extends keyof FormalArgs_2 ? ActualArgs_2[key_2] : never; } & (ActualArgs_2 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_2 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_2, ActualArgs_2, "findFirst">>;
                findFirstOrThrow: () => <This_3, FormalArgs_3 extends import("@prisma/client/runtime/library").Args<This_3, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_3 extends FormalArgs_3>(this: This_3, args?: { [key_3 in keyof ActualArgs_3]: key_3 extends keyof FormalArgs_3 ? ActualArgs_3[key_3] : never; } & (ActualArgs_3 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_3 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_3, ActualArgs_3, "findFirstOrThrow">>;
                findMany: () => <This_4, FormalArgs_4 extends import("@prisma/client/runtime/library").Args<This_4, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_4 extends FormalArgs_4>(this: This_4, args?: { [key_4 in keyof ActualArgs_4]: key_4 extends keyof FormalArgs_4 ? ActualArgs_4[key_4] : never; } & (ActualArgs_4 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_4 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_4, ActualArgs_4, "findMany">>;
                findUnique: () => <This_5, FormalArgs_5 extends import("@prisma/client/runtime/library").Args<This_5, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_5 extends FormalArgs_5>(this: This_5, args: { [key_5 in keyof ActualArgs_5]: key_5 extends keyof FormalArgs_5 ? ActualArgs_5[key_5] : never; } & (ActualArgs_5 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_5 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_5, ActualArgs_5, "findUnique">>;
                findUniqueOrThrow: () => <This_6, FormalArgs_6 extends import("@prisma/client/runtime/library").Args<This_6, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_6 extends FormalArgs_6>(this: This_6, args: { [key_6 in keyof ActualArgs_6]: key_6 extends keyof FormalArgs_6 ? ActualArgs_6[key_6] : never; } & (ActualArgs_6 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_6 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_6, ActualArgs_6, "findUniqueOrThrow">>;
                groupBy: () => <This_7, FormalArgs_7 extends import("@prisma/client/runtime/library").Args<This_7, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_7 extends FormalArgs_7>(this: This_7, args: { [key_7 in keyof ActualArgs_7]: key_7 extends keyof FormalArgs_7 ? ActualArgs_7[key_7] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_7, ActualArgs_7, "groupBy">>;
            };
            projects: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This_1, FormalArgs_1 extends import("@prisma/client/runtime/library").Args<This_1, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_1 extends FormalArgs_1>(this: This_1, args?: { [key_1 in keyof ActualArgs_1]: key_1 extends keyof FormalArgs_1 ? ActualArgs_1[key_1] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_1, ActualArgs_1, "count">>;
                findFirst: () => <This_2, FormalArgs_2 extends import("@prisma/client/runtime/library").Args<This_2, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_2 extends FormalArgs_2>(this: This_2, args?: { [key_2 in keyof ActualArgs_2]: key_2 extends keyof FormalArgs_2 ? ActualArgs_2[key_2] : never; } & (ActualArgs_2 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_2 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_2, ActualArgs_2, "findFirst">>;
                findFirstOrThrow: () => <This_3, FormalArgs_3 extends import("@prisma/client/runtime/library").Args<This_3, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_3 extends FormalArgs_3>(this: This_3, args?: { [key_3 in keyof ActualArgs_3]: key_3 extends keyof FormalArgs_3 ? ActualArgs_3[key_3] : never; } & (ActualArgs_3 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_3 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_3, ActualArgs_3, "findFirstOrThrow">>;
                findMany: () => <This_4, FormalArgs_4 extends import("@prisma/client/runtime/library").Args<This_4, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_4 extends FormalArgs_4>(this: This_4, args?: { [key_4 in keyof ActualArgs_4]: key_4 extends keyof FormalArgs_4 ? ActualArgs_4[key_4] : never; } & (ActualArgs_4 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_4 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_4, ActualArgs_4, "findMany">>;
                findUnique: () => <This_5, FormalArgs_5 extends import("@prisma/client/runtime/library").Args<This_5, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_5 extends FormalArgs_5>(this: This_5, args: { [key_5 in keyof ActualArgs_5]: key_5 extends keyof FormalArgs_5 ? ActualArgs_5[key_5] : never; } & (ActualArgs_5 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_5 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_5, ActualArgs_5, "findUnique">>;
                findUniqueOrThrow: () => <This_6, FormalArgs_6 extends import("@prisma/client/runtime/library").Args<This_6, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_6 extends FormalArgs_6>(this: This_6, args: { [key_6 in keyof ActualArgs_6]: key_6 extends keyof FormalArgs_6 ? ActualArgs_6[key_6] : never; } & (ActualArgs_6 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_6 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_6, ActualArgs_6, "findUniqueOrThrow">>;
                groupBy: () => <This_7, FormalArgs_7 extends import("@prisma/client/runtime/library").Args<This_7, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_7 extends FormalArgs_7>(this: This_7, args: { [key_7 in keyof ActualArgs_7]: key_7 extends keyof FormalArgs_7 ? ActualArgs_7[key_7] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_7, ActualArgs_7, "groupBy">>;
            };
            promotions: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This_1, FormalArgs_1 extends import("@prisma/client/runtime/library").Args<This_1, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_1 extends FormalArgs_1>(this: This_1, args?: { [key_1 in keyof ActualArgs_1]: key_1 extends keyof FormalArgs_1 ? ActualArgs_1[key_1] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_1, ActualArgs_1, "count">>;
                findFirst: () => <This_2, FormalArgs_2 extends import("@prisma/client/runtime/library").Args<This_2, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_2 extends FormalArgs_2>(this: This_2, args?: { [key_2 in keyof ActualArgs_2]: key_2 extends keyof FormalArgs_2 ? ActualArgs_2[key_2] : never; } & (ActualArgs_2 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_2 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_2, ActualArgs_2, "findFirst">>;
                findFirstOrThrow: () => <This_3, FormalArgs_3 extends import("@prisma/client/runtime/library").Args<This_3, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_3 extends FormalArgs_3>(this: This_3, args?: { [key_3 in keyof ActualArgs_3]: key_3 extends keyof FormalArgs_3 ? ActualArgs_3[key_3] : never; } & (ActualArgs_3 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_3 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_3, ActualArgs_3, "findFirstOrThrow">>;
                findMany: () => <This_4, FormalArgs_4 extends import("@prisma/client/runtime/library").Args<This_4, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_4 extends FormalArgs_4>(this: This_4, args?: { [key_4 in keyof ActualArgs_4]: key_4 extends keyof FormalArgs_4 ? ActualArgs_4[key_4] : never; } & (ActualArgs_4 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_4 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_4, ActualArgs_4, "findMany">>;
                findUnique: () => <This_5, FormalArgs_5 extends import("@prisma/client/runtime/library").Args<This_5, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_5 extends FormalArgs_5>(this: This_5, args: { [key_5 in keyof ActualArgs_5]: key_5 extends keyof FormalArgs_5 ? ActualArgs_5[key_5] : never; } & (ActualArgs_5 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_5 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_5, ActualArgs_5, "findUnique">>;
                findUniqueOrThrow: () => <This_6, FormalArgs_6 extends import("@prisma/client/runtime/library").Args<This_6, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_6 extends FormalArgs_6>(this: This_6, args: { [key_6 in keyof ActualArgs_6]: key_6 extends keyof FormalArgs_6 ? ActualArgs_6[key_6] : never; } & (ActualArgs_6 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_6 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_6, ActualArgs_6, "findUniqueOrThrow">>;
                groupBy: () => <This_7, FormalArgs_7 extends import("@prisma/client/runtime/library").Args<This_7, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_7 extends FormalArgs_7>(this: This_7, args: { [key_7 in keyof ActualArgs_7]: key_7 extends keyof FormalArgs_7 ? ActualArgs_7[key_7] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_7, ActualArgs_7, "groupBy">>;
            };
            redemption_history: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This_1, FormalArgs_1 extends import("@prisma/client/runtime/library").Args<This_1, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_1 extends FormalArgs_1>(this: This_1, args?: { [key_1 in keyof ActualArgs_1]: key_1 extends keyof FormalArgs_1 ? ActualArgs_1[key_1] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_1, ActualArgs_1, "count">>;
                findFirst: () => <This_2, FormalArgs_2 extends import("@prisma/client/runtime/library").Args<This_2, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_2 extends FormalArgs_2>(this: This_2, args?: { [key_2 in keyof ActualArgs_2]: key_2 extends keyof FormalArgs_2 ? ActualArgs_2[key_2] : never; } & (ActualArgs_2 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_2 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_2, ActualArgs_2, "findFirst">>;
                findFirstOrThrow: () => <This_3, FormalArgs_3 extends import("@prisma/client/runtime/library").Args<This_3, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_3 extends FormalArgs_3>(this: This_3, args?: { [key_3 in keyof ActualArgs_3]: key_3 extends keyof FormalArgs_3 ? ActualArgs_3[key_3] : never; } & (ActualArgs_3 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_3 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_3, ActualArgs_3, "findFirstOrThrow">>;
                findMany: () => <This_4, FormalArgs_4 extends import("@prisma/client/runtime/library").Args<This_4, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_4 extends FormalArgs_4>(this: This_4, args?: { [key_4 in keyof ActualArgs_4]: key_4 extends keyof FormalArgs_4 ? ActualArgs_4[key_4] : never; } & (ActualArgs_4 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_4 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_4, ActualArgs_4, "findMany">>;
                findUnique: () => <This_5, FormalArgs_5 extends import("@prisma/client/runtime/library").Args<This_5, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_5 extends FormalArgs_5>(this: This_5, args: { [key_5 in keyof ActualArgs_5]: key_5 extends keyof FormalArgs_5 ? ActualArgs_5[key_5] : never; } & (ActualArgs_5 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_5 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_5, ActualArgs_5, "findUnique">>;
                findUniqueOrThrow: () => <This_6, FormalArgs_6 extends import("@prisma/client/runtime/library").Args<This_6, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_6 extends FormalArgs_6>(this: This_6, args: { [key_6 in keyof ActualArgs_6]: key_6 extends keyof FormalArgs_6 ? ActualArgs_6[key_6] : never; } & (ActualArgs_6 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_6 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_6, ActualArgs_6, "findUniqueOrThrow">>;
                groupBy: () => <This_7, FormalArgs_7 extends import("@prisma/client/runtime/library").Args<This_7, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_7 extends FormalArgs_7>(this: This_7, args: { [key_7 in keyof ActualArgs_7]: key_7 extends keyof FormalArgs_7 ? ActualArgs_7[key_7] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_7, ActualArgs_7, "groupBy">>;
            };
            refunds: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This_1, FormalArgs_1 extends import("@prisma/client/runtime/library").Args<This_1, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_1 extends FormalArgs_1>(this: This_1, args?: { [key_1 in keyof ActualArgs_1]: key_1 extends keyof FormalArgs_1 ? ActualArgs_1[key_1] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_1, ActualArgs_1, "count">>;
                findFirst: () => <This_2, FormalArgs_2 extends import("@prisma/client/runtime/library").Args<This_2, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_2 extends FormalArgs_2>(this: This_2, args?: { [key_2 in keyof ActualArgs_2]: key_2 extends keyof FormalArgs_2 ? ActualArgs_2[key_2] : never; } & (ActualArgs_2 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_2 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_2, ActualArgs_2, "findFirst">>;
                findFirstOrThrow: () => <This_3, FormalArgs_3 extends import("@prisma/client/runtime/library").Args<This_3, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_3 extends FormalArgs_3>(this: This_3, args?: { [key_3 in keyof ActualArgs_3]: key_3 extends keyof FormalArgs_3 ? ActualArgs_3[key_3] : never; } & (ActualArgs_3 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_3 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_3, ActualArgs_3, "findFirstOrThrow">>;
                findMany: () => <This_4, FormalArgs_4 extends import("@prisma/client/runtime/library").Args<This_4, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_4 extends FormalArgs_4>(this: This_4, args?: { [key_4 in keyof ActualArgs_4]: key_4 extends keyof FormalArgs_4 ? ActualArgs_4[key_4] : never; } & (ActualArgs_4 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_4 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_4, ActualArgs_4, "findMany">>;
                findUnique: () => <This_5, FormalArgs_5 extends import("@prisma/client/runtime/library").Args<This_5, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_5 extends FormalArgs_5>(this: This_5, args: { [key_5 in keyof ActualArgs_5]: key_5 extends keyof FormalArgs_5 ? ActualArgs_5[key_5] : never; } & (ActualArgs_5 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_5 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_5, ActualArgs_5, "findUnique">>;
                findUniqueOrThrow: () => <This_6, FormalArgs_6 extends import("@prisma/client/runtime/library").Args<This_6, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_6 extends FormalArgs_6>(this: This_6, args: { [key_6 in keyof ActualArgs_6]: key_6 extends keyof FormalArgs_6 ? ActualArgs_6[key_6] : never; } & (ActualArgs_6 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_6 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_6, ActualArgs_6, "findUniqueOrThrow">>;
                groupBy: () => <This_7, FormalArgs_7 extends import("@prisma/client/runtime/library").Args<This_7, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_7 extends FormalArgs_7>(this: This_7, args: { [key_7 in keyof ActualArgs_7]: key_7 extends keyof FormalArgs_7 ? ActualArgs_7[key_7] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_7, ActualArgs_7, "groupBy">>;
            };
            search_queries: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This_1, FormalArgs_1 extends import("@prisma/client/runtime/library").Args<This_1, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_1 extends FormalArgs_1>(this: This_1, args?: { [key_1 in keyof ActualArgs_1]: key_1 extends keyof FormalArgs_1 ? ActualArgs_1[key_1] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_1, ActualArgs_1, "count">>;
                findFirst: () => <This_2, FormalArgs_2 extends import("@prisma/client/runtime/library").Args<This_2, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_2 extends FormalArgs_2>(this: This_2, args?: { [key_2 in keyof ActualArgs_2]: key_2 extends keyof FormalArgs_2 ? ActualArgs_2[key_2] : never; } & (ActualArgs_2 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_2 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_2, ActualArgs_2, "findFirst">>;
                findFirstOrThrow: () => <This_3, FormalArgs_3 extends import("@prisma/client/runtime/library").Args<This_3, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_3 extends FormalArgs_3>(this: This_3, args?: { [key_3 in keyof ActualArgs_3]: key_3 extends keyof FormalArgs_3 ? ActualArgs_3[key_3] : never; } & (ActualArgs_3 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_3 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_3, ActualArgs_3, "findFirstOrThrow">>;
                findMany: () => <This_4, FormalArgs_4 extends import("@prisma/client/runtime/library").Args<This_4, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_4 extends FormalArgs_4>(this: This_4, args?: { [key_4 in keyof ActualArgs_4]: key_4 extends keyof FormalArgs_4 ? ActualArgs_4[key_4] : never; } & (ActualArgs_4 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_4 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_4, ActualArgs_4, "findMany">>;
                findUnique: () => <This_5, FormalArgs_5 extends import("@prisma/client/runtime/library").Args<This_5, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_5 extends FormalArgs_5>(this: This_5, args: { [key_5 in keyof ActualArgs_5]: key_5 extends keyof FormalArgs_5 ? ActualArgs_5[key_5] : never; } & (ActualArgs_5 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_5 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_5, ActualArgs_5, "findUnique">>;
                findUniqueOrThrow: () => <This_6, FormalArgs_6 extends import("@prisma/client/runtime/library").Args<This_6, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_6 extends FormalArgs_6>(this: This_6, args: { [key_6 in keyof ActualArgs_6]: key_6 extends keyof FormalArgs_6 ? ActualArgs_6[key_6] : never; } & (ActualArgs_6 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_6 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_6, ActualArgs_6, "findUniqueOrThrow">>;
                groupBy: () => <This_7, FormalArgs_7 extends import("@prisma/client/runtime/library").Args<This_7, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_7 extends FormalArgs_7>(this: This_7, args: { [key_7 in keyof ActualArgs_7]: key_7 extends keyof FormalArgs_7 ? ActualArgs_7[key_7] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_7, ActualArgs_7, "groupBy">>;
            };
            service_booking_items: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This_1, FormalArgs_1 extends import("@prisma/client/runtime/library").Args<This_1, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_1 extends FormalArgs_1>(this: This_1, args?: { [key_1 in keyof ActualArgs_1]: key_1 extends keyof FormalArgs_1 ? ActualArgs_1[key_1] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_1, ActualArgs_1, "count">>;
                findFirst: () => <This_2, FormalArgs_2 extends import("@prisma/client/runtime/library").Args<This_2, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_2 extends FormalArgs_2>(this: This_2, args?: { [key_2 in keyof ActualArgs_2]: key_2 extends keyof FormalArgs_2 ? ActualArgs_2[key_2] : never; } & (ActualArgs_2 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_2 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_2, ActualArgs_2, "findFirst">>;
                findFirstOrThrow: () => <This_3, FormalArgs_3 extends import("@prisma/client/runtime/library").Args<This_3, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_3 extends FormalArgs_3>(this: This_3, args?: { [key_3 in keyof ActualArgs_3]: key_3 extends keyof FormalArgs_3 ? ActualArgs_3[key_3] : never; } & (ActualArgs_3 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_3 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_3, ActualArgs_3, "findFirstOrThrow">>;
                findMany: () => <This_4, FormalArgs_4 extends import("@prisma/client/runtime/library").Args<This_4, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_4 extends FormalArgs_4>(this: This_4, args?: { [key_4 in keyof ActualArgs_4]: key_4 extends keyof FormalArgs_4 ? ActualArgs_4[key_4] : never; } & (ActualArgs_4 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_4 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_4, ActualArgs_4, "findMany">>;
                findUnique: () => <This_5, FormalArgs_5 extends import("@prisma/client/runtime/library").Args<This_5, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_5 extends FormalArgs_5>(this: This_5, args: { [key_5 in keyof ActualArgs_5]: key_5 extends keyof FormalArgs_5 ? ActualArgs_5[key_5] : never; } & (ActualArgs_5 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_5 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_5, ActualArgs_5, "findUnique">>;
                findUniqueOrThrow: () => <This_6, FormalArgs_6 extends import("@prisma/client/runtime/library").Args<This_6, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_6 extends FormalArgs_6>(this: This_6, args: { [key_6 in keyof ActualArgs_6]: key_6 extends keyof FormalArgs_6 ? ActualArgs_6[key_6] : never; } & (ActualArgs_6 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_6 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_6, ActualArgs_6, "findUniqueOrThrow">>;
                groupBy: () => <This_7, FormalArgs_7 extends import("@prisma/client/runtime/library").Args<This_7, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_7 extends FormalArgs_7>(this: This_7, args: { [key_7 in keyof ActualArgs_7]: key_7 extends keyof FormalArgs_7 ? ActualArgs_7[key_7] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_7, ActualArgs_7, "groupBy">>;
            };
            service_bookings: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This_1, FormalArgs_1 extends import("@prisma/client/runtime/library").Args<This_1, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_1 extends FormalArgs_1>(this: This_1, args?: { [key_1 in keyof ActualArgs_1]: key_1 extends keyof FormalArgs_1 ? ActualArgs_1[key_1] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_1, ActualArgs_1, "count">>;
                findFirst: () => <This_2, FormalArgs_2 extends import("@prisma/client/runtime/library").Args<This_2, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_2 extends FormalArgs_2>(this: This_2, args?: { [key_2 in keyof ActualArgs_2]: key_2 extends keyof FormalArgs_2 ? ActualArgs_2[key_2] : never; } & (ActualArgs_2 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_2 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_2, ActualArgs_2, "findFirst">>;
                findFirstOrThrow: () => <This_3, FormalArgs_3 extends import("@prisma/client/runtime/library").Args<This_3, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_3 extends FormalArgs_3>(this: This_3, args?: { [key_3 in keyof ActualArgs_3]: key_3 extends keyof FormalArgs_3 ? ActualArgs_3[key_3] : never; } & (ActualArgs_3 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_3 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_3, ActualArgs_3, "findFirstOrThrow">>;
                findMany: () => <This_4, FormalArgs_4 extends import("@prisma/client/runtime/library").Args<This_4, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_4 extends FormalArgs_4>(this: This_4, args?: { [key_4 in keyof ActualArgs_4]: key_4 extends keyof FormalArgs_4 ? ActualArgs_4[key_4] : never; } & (ActualArgs_4 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_4 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_4, ActualArgs_4, "findMany">>;
                findUnique: () => <This_5, FormalArgs_5 extends import("@prisma/client/runtime/library").Args<This_5, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_5 extends FormalArgs_5>(this: This_5, args: { [key_5 in keyof ActualArgs_5]: key_5 extends keyof FormalArgs_5 ? ActualArgs_5[key_5] : never; } & (ActualArgs_5 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_5 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_5, ActualArgs_5, "findUnique">>;
                findUniqueOrThrow: () => <This_6, FormalArgs_6 extends import("@prisma/client/runtime/library").Args<This_6, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_6 extends FormalArgs_6>(this: This_6, args: { [key_6 in keyof ActualArgs_6]: key_6 extends keyof FormalArgs_6 ? ActualArgs_6[key_6] : never; } & (ActualArgs_6 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_6 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_6, ActualArgs_6, "findUniqueOrThrow">>;
                groupBy: () => <This_7, FormalArgs_7 extends import("@prisma/client/runtime/library").Args<This_7, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_7 extends FormalArgs_7>(this: This_7, args: { [key_7 in keyof ActualArgs_7]: key_7 extends keyof FormalArgs_7 ? ActualArgs_7[key_7] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_7, ActualArgs_7, "groupBy">>;
            };
            service_items: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This_1, FormalArgs_1 extends import("@prisma/client/runtime/library").Args<This_1, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_1 extends FormalArgs_1>(this: This_1, args?: { [key_1 in keyof ActualArgs_1]: key_1 extends keyof FormalArgs_1 ? ActualArgs_1[key_1] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_1, ActualArgs_1, "count">>;
                findFirst: () => <This_2, FormalArgs_2 extends import("@prisma/client/runtime/library").Args<This_2, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_2 extends FormalArgs_2>(this: This_2, args?: { [key_2 in keyof ActualArgs_2]: key_2 extends keyof FormalArgs_2 ? ActualArgs_2[key_2] : never; } & (ActualArgs_2 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_2 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_2, ActualArgs_2, "findFirst">>;
                findFirstOrThrow: () => <This_3, FormalArgs_3 extends import("@prisma/client/runtime/library").Args<This_3, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_3 extends FormalArgs_3>(this: This_3, args?: { [key_3 in keyof ActualArgs_3]: key_3 extends keyof FormalArgs_3 ? ActualArgs_3[key_3] : never; } & (ActualArgs_3 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_3 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_3, ActualArgs_3, "findFirstOrThrow">>;
                findMany: () => <This_4, FormalArgs_4 extends import("@prisma/client/runtime/library").Args<This_4, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_4 extends FormalArgs_4>(this: This_4, args?: { [key_4 in keyof ActualArgs_4]: key_4 extends keyof FormalArgs_4 ? ActualArgs_4[key_4] : never; } & (ActualArgs_4 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_4 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_4, ActualArgs_4, "findMany">>;
                findUnique: () => <This_5, FormalArgs_5 extends import("@prisma/client/runtime/library").Args<This_5, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_5 extends FormalArgs_5>(this: This_5, args: { [key_5 in keyof ActualArgs_5]: key_5 extends keyof FormalArgs_5 ? ActualArgs_5[key_5] : never; } & (ActualArgs_5 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_5 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_5, ActualArgs_5, "findUnique">>;
                findUniqueOrThrow: () => <This_6, FormalArgs_6 extends import("@prisma/client/runtime/library").Args<This_6, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_6 extends FormalArgs_6>(this: This_6, args: { [key_6 in keyof ActualArgs_6]: key_6 extends keyof FormalArgs_6 ? ActualArgs_6[key_6] : never; } & (ActualArgs_6 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_6 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_6, ActualArgs_6, "findUniqueOrThrow">>;
                groupBy: () => <This_7, FormalArgs_7 extends import("@prisma/client/runtime/library").Args<This_7, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_7 extends FormalArgs_7>(this: This_7, args: { [key_7 in keyof ActualArgs_7]: key_7 extends keyof FormalArgs_7 ? ActualArgs_7[key_7] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_7, ActualArgs_7, "groupBy">>;
            };
            service_payments: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This_1, FormalArgs_1 extends import("@prisma/client/runtime/library").Args<This_1, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_1 extends FormalArgs_1>(this: This_1, args?: { [key_1 in keyof ActualArgs_1]: key_1 extends keyof FormalArgs_1 ? ActualArgs_1[key_1] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_1, ActualArgs_1, "count">>;
                findFirst: () => <This_2, FormalArgs_2 extends import("@prisma/client/runtime/library").Args<This_2, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_2 extends FormalArgs_2>(this: This_2, args?: { [key_2 in keyof ActualArgs_2]: key_2 extends keyof FormalArgs_2 ? ActualArgs_2[key_2] : never; } & (ActualArgs_2 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_2 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_2, ActualArgs_2, "findFirst">>;
                findFirstOrThrow: () => <This_3, FormalArgs_3 extends import("@prisma/client/runtime/library").Args<This_3, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_3 extends FormalArgs_3>(this: This_3, args?: { [key_3 in keyof ActualArgs_3]: key_3 extends keyof FormalArgs_3 ? ActualArgs_3[key_3] : never; } & (ActualArgs_3 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_3 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_3, ActualArgs_3, "findFirstOrThrow">>;
                findMany: () => <This_4, FormalArgs_4 extends import("@prisma/client/runtime/library").Args<This_4, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_4 extends FormalArgs_4>(this: This_4, args?: { [key_4 in keyof ActualArgs_4]: key_4 extends keyof FormalArgs_4 ? ActualArgs_4[key_4] : never; } & (ActualArgs_4 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_4 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_4, ActualArgs_4, "findMany">>;
                findUnique: () => <This_5, FormalArgs_5 extends import("@prisma/client/runtime/library").Args<This_5, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_5 extends FormalArgs_5>(this: This_5, args: { [key_5 in keyof ActualArgs_5]: key_5 extends keyof FormalArgs_5 ? ActualArgs_5[key_5] : never; } & (ActualArgs_5 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_5 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_5, ActualArgs_5, "findUnique">>;
                findUniqueOrThrow: () => <This_6, FormalArgs_6 extends import("@prisma/client/runtime/library").Args<This_6, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_6 extends FormalArgs_6>(this: This_6, args: { [key_6 in keyof ActualArgs_6]: key_6 extends keyof FormalArgs_6 ? ActualArgs_6[key_6] : never; } & (ActualArgs_6 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_6 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_6, ActualArgs_6, "findUniqueOrThrow">>;
                groupBy: () => <This_7, FormalArgs_7 extends import("@prisma/client/runtime/library").Args<This_7, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_7 extends FormalArgs_7>(this: This_7, args: { [key_7 in keyof ActualArgs_7]: key_7 extends keyof FormalArgs_7 ? ActualArgs_7[key_7] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_7, ActualArgs_7, "groupBy">>;
            };
            service_status_history: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This_1, FormalArgs_1 extends import("@prisma/client/runtime/library").Args<This_1, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_1 extends FormalArgs_1>(this: This_1, args?: { [key_1 in keyof ActualArgs_1]: key_1 extends keyof FormalArgs_1 ? ActualArgs_1[key_1] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_1, ActualArgs_1, "count">>;
                findFirst: () => <This_2, FormalArgs_2 extends import("@prisma/client/runtime/library").Args<This_2, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_2 extends FormalArgs_2>(this: This_2, args?: { [key_2 in keyof ActualArgs_2]: key_2 extends keyof FormalArgs_2 ? ActualArgs_2[key_2] : never; } & (ActualArgs_2 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_2 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_2, ActualArgs_2, "findFirst">>;
                findFirstOrThrow: () => <This_3, FormalArgs_3 extends import("@prisma/client/runtime/library").Args<This_3, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_3 extends FormalArgs_3>(this: This_3, args?: { [key_3 in keyof ActualArgs_3]: key_3 extends keyof FormalArgs_3 ? ActualArgs_3[key_3] : never; } & (ActualArgs_3 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_3 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_3, ActualArgs_3, "findFirstOrThrow">>;
                findMany: () => <This_4, FormalArgs_4 extends import("@prisma/client/runtime/library").Args<This_4, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_4 extends FormalArgs_4>(this: This_4, args?: { [key_4 in keyof ActualArgs_4]: key_4 extends keyof FormalArgs_4 ? ActualArgs_4[key_4] : never; } & (ActualArgs_4 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_4 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_4, ActualArgs_4, "findMany">>;
                findUnique: () => <This_5, FormalArgs_5 extends import("@prisma/client/runtime/library").Args<This_5, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_5 extends FormalArgs_5>(this: This_5, args: { [key_5 in keyof ActualArgs_5]: key_5 extends keyof FormalArgs_5 ? ActualArgs_5[key_5] : never; } & (ActualArgs_5 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_5 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_5, ActualArgs_5, "findUnique">>;
                findUniqueOrThrow: () => <This_6, FormalArgs_6 extends import("@prisma/client/runtime/library").Args<This_6, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_6 extends FormalArgs_6>(this: This_6, args: { [key_6 in keyof ActualArgs_6]: key_6 extends keyof FormalArgs_6 ? ActualArgs_6[key_6] : never; } & (ActualArgs_6 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_6 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_6, ActualArgs_6, "findUniqueOrThrow">>;
                groupBy: () => <This_7, FormalArgs_7 extends import("@prisma/client/runtime/library").Args<This_7, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_7 extends FormalArgs_7>(this: This_7, args: { [key_7 in keyof ActualArgs_7]: key_7 extends keyof FormalArgs_7 ? ActualArgs_7[key_7] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_7, ActualArgs_7, "groupBy">>;
            };
            service_types: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This_1, FormalArgs_1 extends import("@prisma/client/runtime/library").Args<This_1, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_1 extends FormalArgs_1>(this: This_1, args?: { [key_1 in keyof ActualArgs_1]: key_1 extends keyof FormalArgs_1 ? ActualArgs_1[key_1] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_1, ActualArgs_1, "count">>;
                findFirst: () => <This_2, FormalArgs_2 extends import("@prisma/client/runtime/library").Args<This_2, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_2 extends FormalArgs_2>(this: This_2, args?: { [key_2 in keyof ActualArgs_2]: key_2 extends keyof FormalArgs_2 ? ActualArgs_2[key_2] : never; } & (ActualArgs_2 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_2 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_2, ActualArgs_2, "findFirst">>;
                findFirstOrThrow: () => <This_3, FormalArgs_3 extends import("@prisma/client/runtime/library").Args<This_3, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_3 extends FormalArgs_3>(this: This_3, args?: { [key_3 in keyof ActualArgs_3]: key_3 extends keyof FormalArgs_3 ? ActualArgs_3[key_3] : never; } & (ActualArgs_3 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_3 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_3, ActualArgs_3, "findFirstOrThrow">>;
                findMany: () => <This_4, FormalArgs_4 extends import("@prisma/client/runtime/library").Args<This_4, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_4 extends FormalArgs_4>(this: This_4, args?: { [key_4 in keyof ActualArgs_4]: key_4 extends keyof FormalArgs_4 ? ActualArgs_4[key_4] : never; } & (ActualArgs_4 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_4 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_4, ActualArgs_4, "findMany">>;
                findUnique: () => <This_5, FormalArgs_5 extends import("@prisma/client/runtime/library").Args<This_5, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_5 extends FormalArgs_5>(this: This_5, args: { [key_5 in keyof ActualArgs_5]: key_5 extends keyof FormalArgs_5 ? ActualArgs_5[key_5] : never; } & (ActualArgs_5 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_5 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_5, ActualArgs_5, "findUnique">>;
                findUniqueOrThrow: () => <This_6, FormalArgs_6 extends import("@prisma/client/runtime/library").Args<This_6, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_6 extends FormalArgs_6>(this: This_6, args: { [key_6 in keyof ActualArgs_6]: key_6 extends keyof FormalArgs_6 ? ActualArgs_6[key_6] : never; } & (ActualArgs_6 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_6 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_6, ActualArgs_6, "findUniqueOrThrow">>;
                groupBy: () => <This_7, FormalArgs_7 extends import("@prisma/client/runtime/library").Args<This_7, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_7 extends FormalArgs_7>(this: This_7, args: { [key_7 in keyof ActualArgs_7]: key_7 extends keyof FormalArgs_7 ? ActualArgs_7[key_7] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_7, ActualArgs_7, "groupBy">>;
            };
            service_views: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This_1, FormalArgs_1 extends import("@prisma/client/runtime/library").Args<This_1, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_1 extends FormalArgs_1>(this: This_1, args?: { [key_1 in keyof ActualArgs_1]: key_1 extends keyof FormalArgs_1 ? ActualArgs_1[key_1] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_1, ActualArgs_1, "count">>;
                findFirst: () => <This_2, FormalArgs_2 extends import("@prisma/client/runtime/library").Args<This_2, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_2 extends FormalArgs_2>(this: This_2, args?: { [key_2 in keyof ActualArgs_2]: key_2 extends keyof FormalArgs_2 ? ActualArgs_2[key_2] : never; } & (ActualArgs_2 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_2 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_2, ActualArgs_2, "findFirst">>;
                findFirstOrThrow: () => <This_3, FormalArgs_3 extends import("@prisma/client/runtime/library").Args<This_3, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_3 extends FormalArgs_3>(this: This_3, args?: { [key_3 in keyof ActualArgs_3]: key_3 extends keyof FormalArgs_3 ? ActualArgs_3[key_3] : never; } & (ActualArgs_3 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_3 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_3, ActualArgs_3, "findFirstOrThrow">>;
                findMany: () => <This_4, FormalArgs_4 extends import("@prisma/client/runtime/library").Args<This_4, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_4 extends FormalArgs_4>(this: This_4, args?: { [key_4 in keyof ActualArgs_4]: key_4 extends keyof FormalArgs_4 ? ActualArgs_4[key_4] : never; } & (ActualArgs_4 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_4 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_4, ActualArgs_4, "findMany">>;
                findUnique: () => <This_5, FormalArgs_5 extends import("@prisma/client/runtime/library").Args<This_5, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_5 extends FormalArgs_5>(this: This_5, args: { [key_5 in keyof ActualArgs_5]: key_5 extends keyof FormalArgs_5 ? ActualArgs_5[key_5] : never; } & (ActualArgs_5 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_5 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_5, ActualArgs_5, "findUnique">>;
                findUniqueOrThrow: () => <This_6, FormalArgs_6 extends import("@prisma/client/runtime/library").Args<This_6, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_6 extends FormalArgs_6>(this: This_6, args: { [key_6 in keyof ActualArgs_6]: key_6 extends keyof FormalArgs_6 ? ActualArgs_6[key_6] : never; } & (ActualArgs_6 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_6 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_6, ActualArgs_6, "findUniqueOrThrow">>;
                groupBy: () => <This_7, FormalArgs_7 extends import("@prisma/client/runtime/library").Args<This_7, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_7 extends FormalArgs_7>(this: This_7, args: { [key_7 in keyof ActualArgs_7]: key_7 extends keyof FormalArgs_7 ? ActualArgs_7[key_7] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_7, ActualArgs_7, "groupBy">>;
            };
            services: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This_1, FormalArgs_1 extends import("@prisma/client/runtime/library").Args<This_1, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_1 extends FormalArgs_1>(this: This_1, args?: { [key_1 in keyof ActualArgs_1]: key_1 extends keyof FormalArgs_1 ? ActualArgs_1[key_1] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_1, ActualArgs_1, "count">>;
                findFirst: () => <This_2, FormalArgs_2 extends import("@prisma/client/runtime/library").Args<This_2, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_2 extends FormalArgs_2>(this: This_2, args?: { [key_2 in keyof ActualArgs_2]: key_2 extends keyof FormalArgs_2 ? ActualArgs_2[key_2] : never; } & (ActualArgs_2 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_2 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_2, ActualArgs_2, "findFirst">>;
                findFirstOrThrow: () => <This_3, FormalArgs_3 extends import("@prisma/client/runtime/library").Args<This_3, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_3 extends FormalArgs_3>(this: This_3, args?: { [key_3 in keyof ActualArgs_3]: key_3 extends keyof FormalArgs_3 ? ActualArgs_3[key_3] : never; } & (ActualArgs_3 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_3 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_3, ActualArgs_3, "findFirstOrThrow">>;
                findMany: () => <This_4, FormalArgs_4 extends import("@prisma/client/runtime/library").Args<This_4, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_4 extends FormalArgs_4>(this: This_4, args?: { [key_4 in keyof ActualArgs_4]: key_4 extends keyof FormalArgs_4 ? ActualArgs_4[key_4] : never; } & (ActualArgs_4 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_4 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_4, ActualArgs_4, "findMany">>;
                findUnique: () => <This_5, FormalArgs_5 extends import("@prisma/client/runtime/library").Args<This_5, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_5 extends FormalArgs_5>(this: This_5, args: { [key_5 in keyof ActualArgs_5]: key_5 extends keyof FormalArgs_5 ? ActualArgs_5[key_5] : never; } & (ActualArgs_5 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_5 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_5, ActualArgs_5, "findUnique">>;
                findUniqueOrThrow: () => <This_6, FormalArgs_6 extends import("@prisma/client/runtime/library").Args<This_6, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_6 extends FormalArgs_6>(this: This_6, args: { [key_6 in keyof ActualArgs_6]: key_6 extends keyof FormalArgs_6 ? ActualArgs_6[key_6] : never; } & (ActualArgs_6 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_6 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_6, ActualArgs_6, "findUniqueOrThrow">>;
                groupBy: () => <This_7, FormalArgs_7 extends import("@prisma/client/runtime/library").Args<This_7, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_7 extends FormalArgs_7>(this: This_7, args: { [key_7 in keyof ActualArgs_7]: key_7 extends keyof FormalArgs_7 ? ActualArgs_7[key_7] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_7, ActualArgs_7, "groupBy">>;
            };
            site_settings: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This_1, FormalArgs_1 extends import("@prisma/client/runtime/library").Args<This_1, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_1 extends FormalArgs_1>(this: This_1, args?: { [key_1 in keyof ActualArgs_1]: key_1 extends keyof FormalArgs_1 ? ActualArgs_1[key_1] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_1, ActualArgs_1, "count">>;
                findFirst: () => <This_2, FormalArgs_2 extends import("@prisma/client/runtime/library").Args<This_2, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_2 extends FormalArgs_2>(this: This_2, args?: { [key_2 in keyof ActualArgs_2]: key_2 extends keyof FormalArgs_2 ? ActualArgs_2[key_2] : never; } & (ActualArgs_2 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_2 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_2, ActualArgs_2, "findFirst">>;
                findFirstOrThrow: () => <This_3, FormalArgs_3 extends import("@prisma/client/runtime/library").Args<This_3, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_3 extends FormalArgs_3>(this: This_3, args?: { [key_3 in keyof ActualArgs_3]: key_3 extends keyof FormalArgs_3 ? ActualArgs_3[key_3] : never; } & (ActualArgs_3 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_3 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_3, ActualArgs_3, "findFirstOrThrow">>;
                findMany: () => <This_4, FormalArgs_4 extends import("@prisma/client/runtime/library").Args<This_4, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_4 extends FormalArgs_4>(this: This_4, args?: { [key_4 in keyof ActualArgs_4]: key_4 extends keyof FormalArgs_4 ? ActualArgs_4[key_4] : never; } & (ActualArgs_4 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_4 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_4, ActualArgs_4, "findMany">>;
                findUnique: () => <This_5, FormalArgs_5 extends import("@prisma/client/runtime/library").Args<This_5, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_5 extends FormalArgs_5>(this: This_5, args: { [key_5 in keyof ActualArgs_5]: key_5 extends keyof FormalArgs_5 ? ActualArgs_5[key_5] : never; } & (ActualArgs_5 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_5 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_5, ActualArgs_5, "findUnique">>;
                findUniqueOrThrow: () => <This_6, FormalArgs_6 extends import("@prisma/client/runtime/library").Args<This_6, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_6 extends FormalArgs_6>(this: This_6, args: { [key_6 in keyof ActualArgs_6]: key_6 extends keyof FormalArgs_6 ? ActualArgs_6[key_6] : never; } & (ActualArgs_6 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_6 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_6, ActualArgs_6, "findUniqueOrThrow">>;
                groupBy: () => <This_7, FormalArgs_7 extends import("@prisma/client/runtime/library").Args<This_7, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_7 extends FormalArgs_7>(this: This_7, args: { [key_7 in keyof ActualArgs_7]: key_7 extends keyof FormalArgs_7 ? ActualArgs_7[key_7] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_7, ActualArgs_7, "groupBy">>;
            };
            site_stats: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This_1, FormalArgs_1 extends import("@prisma/client/runtime/library").Args<This_1, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_1 extends FormalArgs_1>(this: This_1, args?: { [key_1 in keyof ActualArgs_1]: key_1 extends keyof FormalArgs_1 ? ActualArgs_1[key_1] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_1, ActualArgs_1, "count">>;
                findFirst: () => <This_2, FormalArgs_2 extends import("@prisma/client/runtime/library").Args<This_2, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_2 extends FormalArgs_2>(this: This_2, args?: { [key_2 in keyof ActualArgs_2]: key_2 extends keyof FormalArgs_2 ? ActualArgs_2[key_2] : never; } & (ActualArgs_2 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_2 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_2, ActualArgs_2, "findFirst">>;
                findFirstOrThrow: () => <This_3, FormalArgs_3 extends import("@prisma/client/runtime/library").Args<This_3, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_3 extends FormalArgs_3>(this: This_3, args?: { [key_3 in keyof ActualArgs_3]: key_3 extends keyof FormalArgs_3 ? ActualArgs_3[key_3] : never; } & (ActualArgs_3 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_3 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_3, ActualArgs_3, "findFirstOrThrow">>;
                findMany: () => <This_4, FormalArgs_4 extends import("@prisma/client/runtime/library").Args<This_4, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_4 extends FormalArgs_4>(this: This_4, args?: { [key_4 in keyof ActualArgs_4]: key_4 extends keyof FormalArgs_4 ? ActualArgs_4[key_4] : never; } & (ActualArgs_4 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_4 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_4, ActualArgs_4, "findMany">>;
                findUnique: () => <This_5, FormalArgs_5 extends import("@prisma/client/runtime/library").Args<This_5, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_5 extends FormalArgs_5>(this: This_5, args: { [key_5 in keyof ActualArgs_5]: key_5 extends keyof FormalArgs_5 ? ActualArgs_5[key_5] : never; } & (ActualArgs_5 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_5 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_5, ActualArgs_5, "findUnique">>;
                findUniqueOrThrow: () => <This_6, FormalArgs_6 extends import("@prisma/client/runtime/library").Args<This_6, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_6 extends FormalArgs_6>(this: This_6, args: { [key_6 in keyof ActualArgs_6]: key_6 extends keyof FormalArgs_6 ? ActualArgs_6[key_6] : never; } & (ActualArgs_6 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_6 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_6, ActualArgs_6, "findUniqueOrThrow">>;
                groupBy: () => <This_7, FormalArgs_7 extends import("@prisma/client/runtime/library").Args<This_7, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_7 extends FormalArgs_7>(this: This_7, args: { [key_7 in keyof ActualArgs_7]: key_7 extends keyof FormalArgs_7 ? ActualArgs_7[key_7] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_7, ActualArgs_7, "groupBy">>;
            };
            software: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This_1, FormalArgs_1 extends import("@prisma/client/runtime/library").Args<This_1, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_1 extends FormalArgs_1>(this: This_1, args?: { [key_1 in keyof ActualArgs_1]: key_1 extends keyof FormalArgs_1 ? ActualArgs_1[key_1] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_1, ActualArgs_1, "count">>;
                findFirst: () => <This_2, FormalArgs_2 extends import("@prisma/client/runtime/library").Args<This_2, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_2 extends FormalArgs_2>(this: This_2, args?: { [key_2 in keyof ActualArgs_2]: key_2 extends keyof FormalArgs_2 ? ActualArgs_2[key_2] : never; } & (ActualArgs_2 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_2 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_2, ActualArgs_2, "findFirst">>;
                findFirstOrThrow: () => <This_3, FormalArgs_3 extends import("@prisma/client/runtime/library").Args<This_3, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_3 extends FormalArgs_3>(this: This_3, args?: { [key_3 in keyof ActualArgs_3]: key_3 extends keyof FormalArgs_3 ? ActualArgs_3[key_3] : never; } & (ActualArgs_3 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_3 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_3, ActualArgs_3, "findFirstOrThrow">>;
                findMany: () => <This_4, FormalArgs_4 extends import("@prisma/client/runtime/library").Args<This_4, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_4 extends FormalArgs_4>(this: This_4, args?: { [key_4 in keyof ActualArgs_4]: key_4 extends keyof FormalArgs_4 ? ActualArgs_4[key_4] : never; } & (ActualArgs_4 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_4 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_4, ActualArgs_4, "findMany">>;
                findUnique: () => <This_5, FormalArgs_5 extends import("@prisma/client/runtime/library").Args<This_5, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_5 extends FormalArgs_5>(this: This_5, args: { [key_5 in keyof ActualArgs_5]: key_5 extends keyof FormalArgs_5 ? ActualArgs_5[key_5] : never; } & (ActualArgs_5 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_5 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_5, ActualArgs_5, "findUnique">>;
                findUniqueOrThrow: () => <This_6, FormalArgs_6 extends import("@prisma/client/runtime/library").Args<This_6, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_6 extends FormalArgs_6>(this: This_6, args: { [key_6 in keyof ActualArgs_6]: key_6 extends keyof FormalArgs_6 ? ActualArgs_6[key_6] : never; } & (ActualArgs_6 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_6 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_6, ActualArgs_6, "findUniqueOrThrow">>;
                groupBy: () => <This_7, FormalArgs_7 extends import("@prisma/client/runtime/library").Args<This_7, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_7 extends FormalArgs_7>(this: This_7, args: { [key_7 in keyof ActualArgs_7]: key_7 extends keyof FormalArgs_7 ? ActualArgs_7[key_7] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_7, ActualArgs_7, "groupBy">>;
            };
            system_configs: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This_1, FormalArgs_1 extends import("@prisma/client/runtime/library").Args<This_1, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_1 extends FormalArgs_1>(this: This_1, args?: { [key_1 in keyof ActualArgs_1]: key_1 extends keyof FormalArgs_1 ? ActualArgs_1[key_1] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_1, ActualArgs_1, "count">>;
                findFirst: () => <This_2, FormalArgs_2 extends import("@prisma/client/runtime/library").Args<This_2, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_2 extends FormalArgs_2>(this: This_2, args?: { [key_2 in keyof ActualArgs_2]: key_2 extends keyof FormalArgs_2 ? ActualArgs_2[key_2] : never; } & (ActualArgs_2 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_2 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_2, ActualArgs_2, "findFirst">>;
                findFirstOrThrow: () => <This_3, FormalArgs_3 extends import("@prisma/client/runtime/library").Args<This_3, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_3 extends FormalArgs_3>(this: This_3, args?: { [key_3 in keyof ActualArgs_3]: key_3 extends keyof FormalArgs_3 ? ActualArgs_3[key_3] : never; } & (ActualArgs_3 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_3 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_3, ActualArgs_3, "findFirstOrThrow">>;
                findMany: () => <This_4, FormalArgs_4 extends import("@prisma/client/runtime/library").Args<This_4, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_4 extends FormalArgs_4>(this: This_4, args?: { [key_4 in keyof ActualArgs_4]: key_4 extends keyof FormalArgs_4 ? ActualArgs_4[key_4] : never; } & (ActualArgs_4 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_4 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_4, ActualArgs_4, "findMany">>;
                findUnique: () => <This_5, FormalArgs_5 extends import("@prisma/client/runtime/library").Args<This_5, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_5 extends FormalArgs_5>(this: This_5, args: { [key_5 in keyof ActualArgs_5]: key_5 extends keyof FormalArgs_5 ? ActualArgs_5[key_5] : never; } & (ActualArgs_5 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_5 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_5, ActualArgs_5, "findUnique">>;
                findUniqueOrThrow: () => <This_6, FormalArgs_6 extends import("@prisma/client/runtime/library").Args<This_6, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_6 extends FormalArgs_6>(this: This_6, args: { [key_6 in keyof ActualArgs_6]: key_6 extends keyof FormalArgs_6 ? ActualArgs_6[key_6] : never; } & (ActualArgs_6 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_6 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_6, ActualArgs_6, "findUniqueOrThrow">>;
                groupBy: () => <This_7, FormalArgs_7 extends import("@prisma/client/runtime/library").Args<This_7, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_7 extends FormalArgs_7>(this: This_7, args: { [key_7 in keyof ActualArgs_7]: key_7 extends keyof FormalArgs_7 ? ActualArgs_7[key_7] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_7, ActualArgs_7, "groupBy">>;
            };
            technician_schedules: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This_1, FormalArgs_1 extends import("@prisma/client/runtime/library").Args<This_1, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_1 extends FormalArgs_1>(this: This_1, args?: { [key_1 in keyof ActualArgs_1]: key_1 extends keyof FormalArgs_1 ? ActualArgs_1[key_1] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_1, ActualArgs_1, "count">>;
                findFirst: () => <This_2, FormalArgs_2 extends import("@prisma/client/runtime/library").Args<This_2, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_2 extends FormalArgs_2>(this: This_2, args?: { [key_2 in keyof ActualArgs_2]: key_2 extends keyof FormalArgs_2 ? ActualArgs_2[key_2] : never; } & (ActualArgs_2 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_2 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_2, ActualArgs_2, "findFirst">>;
                findFirstOrThrow: () => <This_3, FormalArgs_3 extends import("@prisma/client/runtime/library").Args<This_3, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_3 extends FormalArgs_3>(this: This_3, args?: { [key_3 in keyof ActualArgs_3]: key_3 extends keyof FormalArgs_3 ? ActualArgs_3[key_3] : never; } & (ActualArgs_3 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_3 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_3, ActualArgs_3, "findFirstOrThrow">>;
                findMany: () => <This_4, FormalArgs_4 extends import("@prisma/client/runtime/library").Args<This_4, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_4 extends FormalArgs_4>(this: This_4, args?: { [key_4 in keyof ActualArgs_4]: key_4 extends keyof FormalArgs_4 ? ActualArgs_4[key_4] : never; } & (ActualArgs_4 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_4 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_4, ActualArgs_4, "findMany">>;
                findUnique: () => <This_5, FormalArgs_5 extends import("@prisma/client/runtime/library").Args<This_5, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_5 extends FormalArgs_5>(this: This_5, args: { [key_5 in keyof ActualArgs_5]: key_5 extends keyof FormalArgs_5 ? ActualArgs_5[key_5] : never; } & (ActualArgs_5 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_5 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_5, ActualArgs_5, "findUnique">>;
                findUniqueOrThrow: () => <This_6, FormalArgs_6 extends import("@prisma/client/runtime/library").Args<This_6, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_6 extends FormalArgs_6>(this: This_6, args: { [key_6 in keyof ActualArgs_6]: key_6 extends keyof FormalArgs_6 ? ActualArgs_6[key_6] : never; } & (ActualArgs_6 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_6 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_6, ActualArgs_6, "findUniqueOrThrow">>;
                groupBy: () => <This_7, FormalArgs_7 extends import("@prisma/client/runtime/library").Args<This_7, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_7 extends FormalArgs_7>(this: This_7, args: { [key_7 in keyof ActualArgs_7]: key_7 extends keyof FormalArgs_7 ? ActualArgs_7[key_7] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_7, ActualArgs_7, "groupBy">>;
            };
            technicians: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This_1, FormalArgs_1 extends import("@prisma/client/runtime/library").Args<This_1, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_1 extends FormalArgs_1>(this: This_1, args?: { [key_1 in keyof ActualArgs_1]: key_1 extends keyof FormalArgs_1 ? ActualArgs_1[key_1] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_1, ActualArgs_1, "count">>;
                findFirst: () => <This_2, FormalArgs_2 extends import("@prisma/client/runtime/library").Args<This_2, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_2 extends FormalArgs_2>(this: This_2, args?: { [key_2 in keyof ActualArgs_2]: key_2 extends keyof FormalArgs_2 ? ActualArgs_2[key_2] : never; } & (ActualArgs_2 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_2 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_2, ActualArgs_2, "findFirst">>;
                findFirstOrThrow: () => <This_3, FormalArgs_3 extends import("@prisma/client/runtime/library").Args<This_3, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_3 extends FormalArgs_3>(this: This_3, args?: { [key_3 in keyof ActualArgs_3]: key_3 extends keyof FormalArgs_3 ? ActualArgs_3[key_3] : never; } & (ActualArgs_3 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_3 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_3, ActualArgs_3, "findFirstOrThrow">>;
                findMany: () => <This_4, FormalArgs_4 extends import("@prisma/client/runtime/library").Args<This_4, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_4 extends FormalArgs_4>(this: This_4, args?: { [key_4 in keyof ActualArgs_4]: key_4 extends keyof FormalArgs_4 ? ActualArgs_4[key_4] : never; } & (ActualArgs_4 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_4 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_4, ActualArgs_4, "findMany">>;
                findUnique: () => <This_5, FormalArgs_5 extends import("@prisma/client/runtime/library").Args<This_5, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_5 extends FormalArgs_5>(this: This_5, args: { [key_5 in keyof ActualArgs_5]: key_5 extends keyof FormalArgs_5 ? ActualArgs_5[key_5] : never; } & (ActualArgs_5 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_5 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_5, ActualArgs_5, "findUnique">>;
                findUniqueOrThrow: () => <This_6, FormalArgs_6 extends import("@prisma/client/runtime/library").Args<This_6, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_6 extends FormalArgs_6>(this: This_6, args: { [key_6 in keyof ActualArgs_6]: key_6 extends keyof FormalArgs_6 ? ActualArgs_6[key_6] : never; } & (ActualArgs_6 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_6 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_6, ActualArgs_6, "findUniqueOrThrow">>;
                groupBy: () => <This_7, FormalArgs_7 extends import("@prisma/client/runtime/library").Args<This_7, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_7 extends FormalArgs_7>(this: This_7, args: { [key_7 in keyof ActualArgs_7]: key_7 extends keyof FormalArgs_7 ? ActualArgs_7[key_7] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_7, ActualArgs_7, "groupBy">>;
            };
            testimonials: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This_1, FormalArgs_1 extends import("@prisma/client/runtime/library").Args<This_1, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_1 extends FormalArgs_1>(this: This_1, args?: { [key_1 in keyof ActualArgs_1]: key_1 extends keyof FormalArgs_1 ? ActualArgs_1[key_1] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_1, ActualArgs_1, "count">>;
                findFirst: () => <This_2, FormalArgs_2 extends import("@prisma/client/runtime/library").Args<This_2, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_2 extends FormalArgs_2>(this: This_2, args?: { [key_2 in keyof ActualArgs_2]: key_2 extends keyof FormalArgs_2 ? ActualArgs_2[key_2] : never; } & (ActualArgs_2 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_2 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_2, ActualArgs_2, "findFirst">>;
                findFirstOrThrow: () => <This_3, FormalArgs_3 extends import("@prisma/client/runtime/library").Args<This_3, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_3 extends FormalArgs_3>(this: This_3, args?: { [key_3 in keyof ActualArgs_3]: key_3 extends keyof FormalArgs_3 ? ActualArgs_3[key_3] : never; } & (ActualArgs_3 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_3 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_3, ActualArgs_3, "findFirstOrThrow">>;
                findMany: () => <This_4, FormalArgs_4 extends import("@prisma/client/runtime/library").Args<This_4, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_4 extends FormalArgs_4>(this: This_4, args?: { [key_4 in keyof ActualArgs_4]: key_4 extends keyof FormalArgs_4 ? ActualArgs_4[key_4] : never; } & (ActualArgs_4 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_4 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_4, ActualArgs_4, "findMany">>;
                findUnique: () => <This_5, FormalArgs_5 extends import("@prisma/client/runtime/library").Args<This_5, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_5 extends FormalArgs_5>(this: This_5, args: { [key_5 in keyof ActualArgs_5]: key_5 extends keyof FormalArgs_5 ? ActualArgs_5[key_5] : never; } & (ActualArgs_5 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_5 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_5, ActualArgs_5, "findUnique">>;
                findUniqueOrThrow: () => <This_6, FormalArgs_6 extends import("@prisma/client/runtime/library").Args<This_6, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_6 extends FormalArgs_6>(this: This_6, args: { [key_6 in keyof ActualArgs_6]: key_6 extends keyof FormalArgs_6 ? ActualArgs_6[key_6] : never; } & (ActualArgs_6 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_6 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_6, ActualArgs_6, "findUniqueOrThrow">>;
                groupBy: () => <This_7, FormalArgs_7 extends import("@prisma/client/runtime/library").Args<This_7, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_7 extends FormalArgs_7>(this: This_7, args: { [key_7 in keyof ActualArgs_7]: key_7 extends keyof FormalArgs_7 ? ActualArgs_7[key_7] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_7, ActualArgs_7, "groupBy">>;
            };
            users: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This_1, FormalArgs_1 extends import("@prisma/client/runtime/library").Args<This_1, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_1 extends FormalArgs_1>(this: This_1, args?: { [key_1 in keyof ActualArgs_1]: key_1 extends keyof FormalArgs_1 ? ActualArgs_1[key_1] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_1, ActualArgs_1, "count">>;
                findFirst: () => <This_2, FormalArgs_2 extends import("@prisma/client/runtime/library").Args<This_2, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_2 extends FormalArgs_2>(this: This_2, args?: { [key_2 in keyof ActualArgs_2]: key_2 extends keyof FormalArgs_2 ? ActualArgs_2[key_2] : never; } & (ActualArgs_2 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_2 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_2, ActualArgs_2, "findFirst">>;
                findFirstOrThrow: () => <This_3, FormalArgs_3 extends import("@prisma/client/runtime/library").Args<This_3, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_3 extends FormalArgs_3>(this: This_3, args?: { [key_3 in keyof ActualArgs_3]: key_3 extends keyof FormalArgs_3 ? ActualArgs_3[key_3] : never; } & (ActualArgs_3 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_3 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_3, ActualArgs_3, "findFirstOrThrow">>;
                findMany: () => <This_4, FormalArgs_4 extends import("@prisma/client/runtime/library").Args<This_4, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_4 extends FormalArgs_4>(this: This_4, args?: { [key_4 in keyof ActualArgs_4]: key_4 extends keyof FormalArgs_4 ? ActualArgs_4[key_4] : never; } & (ActualArgs_4 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_4 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_4, ActualArgs_4, "findMany">>;
                findUnique: () => <This_5, FormalArgs_5 extends import("@prisma/client/runtime/library").Args<This_5, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_5 extends FormalArgs_5>(this: This_5, args: { [key_5 in keyof ActualArgs_5]: key_5 extends keyof FormalArgs_5 ? ActualArgs_5[key_5] : never; } & (ActualArgs_5 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_5 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_5, ActualArgs_5, "findUnique">>;
                findUniqueOrThrow: () => <This_6, FormalArgs_6 extends import("@prisma/client/runtime/library").Args<This_6, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_6 extends FormalArgs_6>(this: This_6, args: { [key_6 in keyof ActualArgs_6]: key_6 extends keyof FormalArgs_6 ? ActualArgs_6[key_6] : never; } & (ActualArgs_6 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_6 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_6, ActualArgs_6, "findUniqueOrThrow">>;
                groupBy: () => <This_7, FormalArgs_7 extends import("@prisma/client/runtime/library").Args<This_7, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_7 extends FormalArgs_7>(this: This_7, args: { [key_7 in keyof ActualArgs_7]: key_7 extends keyof FormalArgs_7 ? ActualArgs_7[key_7] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_7, ActualArgs_7, "groupBy">>;
            };
            webhooks: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This_1, FormalArgs_1 extends import("@prisma/client/runtime/library").Args<This_1, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_1 extends FormalArgs_1>(this: This_1, args?: { [key_1 in keyof ActualArgs_1]: key_1 extends keyof FormalArgs_1 ? ActualArgs_1[key_1] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_1, ActualArgs_1, "count">>;
                findFirst: () => <This_2, FormalArgs_2 extends import("@prisma/client/runtime/library").Args<This_2, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_2 extends FormalArgs_2>(this: This_2, args?: { [key_2 in keyof ActualArgs_2]: key_2 extends keyof FormalArgs_2 ? ActualArgs_2[key_2] : never; } & (ActualArgs_2 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_2 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_2, ActualArgs_2, "findFirst">>;
                findFirstOrThrow: () => <This_3, FormalArgs_3 extends import("@prisma/client/runtime/library").Args<This_3, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_3 extends FormalArgs_3>(this: This_3, args?: { [key_3 in keyof ActualArgs_3]: key_3 extends keyof FormalArgs_3 ? ActualArgs_3[key_3] : never; } & (ActualArgs_3 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_3 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_3, ActualArgs_3, "findFirstOrThrow">>;
                findMany: () => <This_4, FormalArgs_4 extends import("@prisma/client/runtime/library").Args<This_4, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_4 extends FormalArgs_4>(this: This_4, args?: { [key_4 in keyof ActualArgs_4]: key_4 extends keyof FormalArgs_4 ? ActualArgs_4[key_4] : never; } & (ActualArgs_4 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_4 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_4, ActualArgs_4, "findMany">>;
                findUnique: () => <This_5, FormalArgs_5 extends import("@prisma/client/runtime/library").Args<This_5, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_5 extends FormalArgs_5>(this: This_5, args: { [key_5 in keyof ActualArgs_5]: key_5 extends keyof FormalArgs_5 ? ActualArgs_5[key_5] : never; } & (ActualArgs_5 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_5 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_5, ActualArgs_5, "findUnique">>;
                findUniqueOrThrow: () => <This_6, FormalArgs_6 extends import("@prisma/client/runtime/library").Args<This_6, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_6 extends FormalArgs_6>(this: This_6, args: { [key_6 in keyof ActualArgs_6]: key_6 extends keyof FormalArgs_6 ? ActualArgs_6[key_6] : never; } & (ActualArgs_6 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_6 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_6, ActualArgs_6, "findUniqueOrThrow">>;
                groupBy: () => <This_7, FormalArgs_7 extends import("@prisma/client/runtime/library").Args<This_7, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_7 extends FormalArgs_7>(this: This_7, args: { [key_7 in keyof ActualArgs_7]: key_7 extends keyof FormalArgs_7 ? ActualArgs_7[key_7] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_7, ActualArgs_7, "groupBy">>;
            };
            wishlist_items: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This_1, FormalArgs_1 extends import("@prisma/client/runtime/library").Args<This_1, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_1 extends FormalArgs_1>(this: This_1, args?: { [key_1 in keyof ActualArgs_1]: key_1 extends keyof FormalArgs_1 ? ActualArgs_1[key_1] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_1, ActualArgs_1, "count">>;
                findFirst: () => <This_2, FormalArgs_2 extends import("@prisma/client/runtime/library").Args<This_2, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_2 extends FormalArgs_2>(this: This_2, args?: { [key_2 in keyof ActualArgs_2]: key_2 extends keyof FormalArgs_2 ? ActualArgs_2[key_2] : never; } & (ActualArgs_2 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_2 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_2, ActualArgs_2, "findFirst">>;
                findFirstOrThrow: () => <This_3, FormalArgs_3 extends import("@prisma/client/runtime/library").Args<This_3, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_3 extends FormalArgs_3>(this: This_3, args?: { [key_3 in keyof ActualArgs_3]: key_3 extends keyof FormalArgs_3 ? ActualArgs_3[key_3] : never; } & (ActualArgs_3 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_3 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_3, ActualArgs_3, "findFirstOrThrow">>;
                findMany: () => <This_4, FormalArgs_4 extends import("@prisma/client/runtime/library").Args<This_4, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_4 extends FormalArgs_4>(this: This_4, args?: { [key_4 in keyof ActualArgs_4]: key_4 extends keyof FormalArgs_4 ? ActualArgs_4[key_4] : never; } & (ActualArgs_4 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_4 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_4, ActualArgs_4, "findMany">>;
                findUnique: () => <This_5, FormalArgs_5 extends import("@prisma/client/runtime/library").Args<This_5, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_5 extends FormalArgs_5>(this: This_5, args: { [key_5 in keyof ActualArgs_5]: key_5 extends keyof FormalArgs_5 ? ActualArgs_5[key_5] : never; } & (ActualArgs_5 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_5 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_5, ActualArgs_5, "findUnique">>;
                findUniqueOrThrow: () => <This_6, FormalArgs_6 extends import("@prisma/client/runtime/library").Args<This_6, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_6 extends FormalArgs_6>(this: This_6, args: { [key_6 in keyof ActualArgs_6]: key_6 extends keyof FormalArgs_6 ? ActualArgs_6[key_6] : never; } & (ActualArgs_6 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_6 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_6, ActualArgs_6, "findUniqueOrThrow">>;
                groupBy: () => <This_7, FormalArgs_7 extends import("@prisma/client/runtime/library").Args<This_7, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_7 extends FormalArgs_7>(this: This_7, args: { [key_7 in keyof ActualArgs_7]: key_7 extends keyof FormalArgs_7 ? ActualArgs_7[key_7] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_7, ActualArgs_7, "groupBy">>;
            };
        };
        query: {};
        client: {
            $accelerate: () => {
                invalidate: (input: import("@prisma/extension-accelerate").AccelerateInvalidateInput) => Promise<{
                    requestId: string;
                }>;
                invalidateAll: () => Promise<{
                    requestId: string;
                }>;
            };
        };
    }, {}>, import(".prisma/client").Prisma.TypeMapCb<import(".prisma/client").Prisma.PrismaClientOptions>, {
        result: {};
        model: {
            $allModels: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This_1, FormalArgs_1 extends import("@prisma/client/runtime/library").Args<This_1, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_1 extends FormalArgs_1>(this: This_1, args?: { [key_1 in keyof ActualArgs_1]: key_1 extends keyof FormalArgs_1 ? ActualArgs_1[key_1] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_1, ActualArgs_1, "count">>;
                findFirst: () => <This_2, FormalArgs_2 extends import("@prisma/client/runtime/library").Args<This_2, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_2 extends FormalArgs_2>(this: This_2, args?: { [key_2 in keyof ActualArgs_2]: key_2 extends keyof FormalArgs_2 ? ActualArgs_2[key_2] : never; } & (ActualArgs_2 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_2 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_2, ActualArgs_2, "findFirst">>;
                findFirstOrThrow: () => <This_3, FormalArgs_3 extends import("@prisma/client/runtime/library").Args<This_3, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_3 extends FormalArgs_3>(this: This_3, args?: { [key_3 in keyof ActualArgs_3]: key_3 extends keyof FormalArgs_3 ? ActualArgs_3[key_3] : never; } & (ActualArgs_3 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_3 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_3, ActualArgs_3, "findFirstOrThrow">>;
                findMany: () => <This_4, FormalArgs_4 extends import("@prisma/client/runtime/library").Args<This_4, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_4 extends FormalArgs_4>(this: This_4, args?: { [key_4 in keyof ActualArgs_4]: key_4 extends keyof FormalArgs_4 ? ActualArgs_4[key_4] : never; } & (ActualArgs_4 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_4 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_4, ActualArgs_4, "findMany">>;
                findUnique: () => <This_5, FormalArgs_5 extends import("@prisma/client/runtime/library").Args<This_5, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_5 extends FormalArgs_5>(this: This_5, args: { [key_5 in keyof ActualArgs_5]: key_5 extends keyof FormalArgs_5 ? ActualArgs_5[key_5] : never; } & (ActualArgs_5 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_5 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_5, ActualArgs_5, "findUnique">>;
                findUniqueOrThrow: () => <This_6, FormalArgs_6 extends import("@prisma/client/runtime/library").Args<This_6, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_6 extends FormalArgs_6>(this: This_6, args: { [key_6 in keyof ActualArgs_6]: key_6 extends keyof FormalArgs_6 ? ActualArgs_6[key_6] : never; } & (ActualArgs_6 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_6 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_6, ActualArgs_6, "findUniqueOrThrow">>;
                groupBy: () => <This_7, FormalArgs_7 extends import("@prisma/client/runtime/library").Args<This_7, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_7 extends FormalArgs_7>(this: This_7, args: { [key_7 in keyof ActualArgs_7]: key_7 extends keyof FormalArgs_7 ? ActualArgs_7[key_7] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_7, ActualArgs_7, "groupBy">>;
            };
            activity_logs: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This_1, FormalArgs_1 extends import("@prisma/client/runtime/library").Args<This_1, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_1 extends FormalArgs_1>(this: This_1, args?: { [key_1 in keyof ActualArgs_1]: key_1 extends keyof FormalArgs_1 ? ActualArgs_1[key_1] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_1, ActualArgs_1, "count">>;
                findFirst: () => <This_2, FormalArgs_2 extends import("@prisma/client/runtime/library").Args<This_2, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_2 extends FormalArgs_2>(this: This_2, args?: { [key_2 in keyof ActualArgs_2]: key_2 extends keyof FormalArgs_2 ? ActualArgs_2[key_2] : never; } & (ActualArgs_2 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_2 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_2, ActualArgs_2, "findFirst">>;
                findFirstOrThrow: () => <This_3, FormalArgs_3 extends import("@prisma/client/runtime/library").Args<This_3, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_3 extends FormalArgs_3>(this: This_3, args?: { [key_3 in keyof ActualArgs_3]: key_3 extends keyof FormalArgs_3 ? ActualArgs_3[key_3] : never; } & (ActualArgs_3 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_3 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_3, ActualArgs_3, "findFirstOrThrow">>;
                findMany: () => <This_4, FormalArgs_4 extends import("@prisma/client/runtime/library").Args<This_4, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_4 extends FormalArgs_4>(this: This_4, args?: { [key_4 in keyof ActualArgs_4]: key_4 extends keyof FormalArgs_4 ? ActualArgs_4[key_4] : never; } & (ActualArgs_4 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_4 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_4, ActualArgs_4, "findMany">>;
                findUnique: () => <This_5, FormalArgs_5 extends import("@prisma/client/runtime/library").Args<This_5, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_5 extends FormalArgs_5>(this: This_5, args: { [key_5 in keyof ActualArgs_5]: key_5 extends keyof FormalArgs_5 ? ActualArgs_5[key_5] : never; } & (ActualArgs_5 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_5 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_5, ActualArgs_5, "findUnique">>;
                findUniqueOrThrow: () => <This_6, FormalArgs_6 extends import("@prisma/client/runtime/library").Args<This_6, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_6 extends FormalArgs_6>(this: This_6, args: { [key_6 in keyof ActualArgs_6]: key_6 extends keyof FormalArgs_6 ? ActualArgs_6[key_6] : never; } & (ActualArgs_6 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_6 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_6, ActualArgs_6, "findUniqueOrThrow">>;
                groupBy: () => <This_7, FormalArgs_7 extends import("@prisma/client/runtime/library").Args<This_7, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_7 extends FormalArgs_7>(this: This_7, args: { [key_7 in keyof ActualArgs_7]: key_7 extends keyof FormalArgs_7 ? ActualArgs_7[key_7] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_7, ActualArgs_7, "groupBy">>;
            };
            banners: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This_1, FormalArgs_1 extends import("@prisma/client/runtime/library").Args<This_1, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_1 extends FormalArgs_1>(this: This_1, args?: { [key_1 in keyof ActualArgs_1]: key_1 extends keyof FormalArgs_1 ? ActualArgs_1[key_1] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_1, ActualArgs_1, "count">>;
                findFirst: () => <This_2, FormalArgs_2 extends import("@prisma/client/runtime/library").Args<This_2, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_2 extends FormalArgs_2>(this: This_2, args?: { [key_2 in keyof ActualArgs_2]: key_2 extends keyof FormalArgs_2 ? ActualArgs_2[key_2] : never; } & (ActualArgs_2 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_2 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_2, ActualArgs_2, "findFirst">>;
                findFirstOrThrow: () => <This_3, FormalArgs_3 extends import("@prisma/client/runtime/library").Args<This_3, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_3 extends FormalArgs_3>(this: This_3, args?: { [key_3 in keyof ActualArgs_3]: key_3 extends keyof FormalArgs_3 ? ActualArgs_3[key_3] : never; } & (ActualArgs_3 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_3 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_3, ActualArgs_3, "findFirstOrThrow">>;
                findMany: () => <This_4, FormalArgs_4 extends import("@prisma/client/runtime/library").Args<This_4, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_4 extends FormalArgs_4>(this: This_4, args?: { [key_4 in keyof ActualArgs_4]: key_4 extends keyof FormalArgs_4 ? ActualArgs_4[key_4] : never; } & (ActualArgs_4 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_4 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_4, ActualArgs_4, "findMany">>;
                findUnique: () => <This_5, FormalArgs_5 extends import("@prisma/client/runtime/library").Args<This_5, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_5 extends FormalArgs_5>(this: This_5, args: { [key_5 in keyof ActualArgs_5]: key_5 extends keyof FormalArgs_5 ? ActualArgs_5[key_5] : never; } & (ActualArgs_5 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_5 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_5, ActualArgs_5, "findUnique">>;
                findUniqueOrThrow: () => <This_6, FormalArgs_6 extends import("@prisma/client/runtime/library").Args<This_6, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_6 extends FormalArgs_6>(this: This_6, args: { [key_6 in keyof ActualArgs_6]: key_6 extends keyof FormalArgs_6 ? ActualArgs_6[key_6] : never; } & (ActualArgs_6 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_6 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_6, ActualArgs_6, "findUniqueOrThrow">>;
                groupBy: () => <This_7, FormalArgs_7 extends import("@prisma/client/runtime/library").Args<This_7, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_7 extends FormalArgs_7>(this: This_7, args: { [key_7 in keyof ActualArgs_7]: key_7 extends keyof FormalArgs_7 ? ActualArgs_7[key_7] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_7, ActualArgs_7, "groupBy">>;
            };
            blog_articles: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This_1, FormalArgs_1 extends import("@prisma/client/runtime/library").Args<This_1, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_1 extends FormalArgs_1>(this: This_1, args?: { [key_1 in keyof ActualArgs_1]: key_1 extends keyof FormalArgs_1 ? ActualArgs_1[key_1] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_1, ActualArgs_1, "count">>;
                findFirst: () => <This_2, FormalArgs_2 extends import("@prisma/client/runtime/library").Args<This_2, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_2 extends FormalArgs_2>(this: This_2, args?: { [key_2 in keyof ActualArgs_2]: key_2 extends keyof FormalArgs_2 ? ActualArgs_2[key_2] : never; } & (ActualArgs_2 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_2 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_2, ActualArgs_2, "findFirst">>;
                findFirstOrThrow: () => <This_3, FormalArgs_3 extends import("@prisma/client/runtime/library").Args<This_3, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_3 extends FormalArgs_3>(this: This_3, args?: { [key_3 in keyof ActualArgs_3]: key_3 extends keyof FormalArgs_3 ? ActualArgs_3[key_3] : never; } & (ActualArgs_3 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_3 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_3, ActualArgs_3, "findFirstOrThrow">>;
                findMany: () => <This_4, FormalArgs_4 extends import("@prisma/client/runtime/library").Args<This_4, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_4 extends FormalArgs_4>(this: This_4, args?: { [key_4 in keyof ActualArgs_4]: key_4 extends keyof FormalArgs_4 ? ActualArgs_4[key_4] : never; } & (ActualArgs_4 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_4 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_4, ActualArgs_4, "findMany">>;
                findUnique: () => <This_5, FormalArgs_5 extends import("@prisma/client/runtime/library").Args<This_5, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_5 extends FormalArgs_5>(this: This_5, args: { [key_5 in keyof ActualArgs_5]: key_5 extends keyof FormalArgs_5 ? ActualArgs_5[key_5] : never; } & (ActualArgs_5 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_5 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_5, ActualArgs_5, "findUnique">>;
                findUniqueOrThrow: () => <This_6, FormalArgs_6 extends import("@prisma/client/runtime/library").Args<This_6, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_6 extends FormalArgs_6>(this: This_6, args: { [key_6 in keyof ActualArgs_6]: key_6 extends keyof FormalArgs_6 ? ActualArgs_6[key_6] : never; } & (ActualArgs_6 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_6 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_6, ActualArgs_6, "findUniqueOrThrow">>;
                groupBy: () => <This_7, FormalArgs_7 extends import("@prisma/client/runtime/library").Args<This_7, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_7 extends FormalArgs_7>(this: This_7, args: { [key_7 in keyof ActualArgs_7]: key_7 extends keyof FormalArgs_7 ? ActualArgs_7[key_7] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_7, ActualArgs_7, "groupBy">>;
            };
            blog_categories: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This_1, FormalArgs_1 extends import("@prisma/client/runtime/library").Args<This_1, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_1 extends FormalArgs_1>(this: This_1, args?: { [key_1 in keyof ActualArgs_1]: key_1 extends keyof FormalArgs_1 ? ActualArgs_1[key_1] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_1, ActualArgs_1, "count">>;
                findFirst: () => <This_2, FormalArgs_2 extends import("@prisma/client/runtime/library").Args<This_2, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_2 extends FormalArgs_2>(this: This_2, args?: { [key_2 in keyof ActualArgs_2]: key_2 extends keyof FormalArgs_2 ? ActualArgs_2[key_2] : never; } & (ActualArgs_2 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_2 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_2, ActualArgs_2, "findFirst">>;
                findFirstOrThrow: () => <This_3, FormalArgs_3 extends import("@prisma/client/runtime/library").Args<This_3, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_3 extends FormalArgs_3>(this: This_3, args?: { [key_3 in keyof ActualArgs_3]: key_3 extends keyof FormalArgs_3 ? ActualArgs_3[key_3] : never; } & (ActualArgs_3 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_3 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_3, ActualArgs_3, "findFirstOrThrow">>;
                findMany: () => <This_4, FormalArgs_4 extends import("@prisma/client/runtime/library").Args<This_4, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_4 extends FormalArgs_4>(this: This_4, args?: { [key_4 in keyof ActualArgs_4]: key_4 extends keyof FormalArgs_4 ? ActualArgs_4[key_4] : never; } & (ActualArgs_4 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_4 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_4, ActualArgs_4, "findMany">>;
                findUnique: () => <This_5, FormalArgs_5 extends import("@prisma/client/runtime/library").Args<This_5, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_5 extends FormalArgs_5>(this: This_5, args: { [key_5 in keyof ActualArgs_5]: key_5 extends keyof FormalArgs_5 ? ActualArgs_5[key_5] : never; } & (ActualArgs_5 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_5 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_5, ActualArgs_5, "findUnique">>;
                findUniqueOrThrow: () => <This_6, FormalArgs_6 extends import("@prisma/client/runtime/library").Args<This_6, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_6 extends FormalArgs_6>(this: This_6, args: { [key_6 in keyof ActualArgs_6]: key_6 extends keyof FormalArgs_6 ? ActualArgs_6[key_6] : never; } & (ActualArgs_6 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_6 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_6, ActualArgs_6, "findUniqueOrThrow">>;
                groupBy: () => <This_7, FormalArgs_7 extends import("@prisma/client/runtime/library").Args<This_7, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_7 extends FormalArgs_7>(this: This_7, args: { [key_7 in keyof ActualArgs_7]: key_7 extends keyof FormalArgs_7 ? ActualArgs_7[key_7] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_7, ActualArgs_7, "groupBy">>;
            };
            blog_comments: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This_1, FormalArgs_1 extends import("@prisma/client/runtime/library").Args<This_1, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_1 extends FormalArgs_1>(this: This_1, args?: { [key_1 in keyof ActualArgs_1]: key_1 extends keyof FormalArgs_1 ? ActualArgs_1[key_1] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_1, ActualArgs_1, "count">>;
                findFirst: () => <This_2, FormalArgs_2 extends import("@prisma/client/runtime/library").Args<This_2, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_2 extends FormalArgs_2>(this: This_2, args?: { [key_2 in keyof ActualArgs_2]: key_2 extends keyof FormalArgs_2 ? ActualArgs_2[key_2] : never; } & (ActualArgs_2 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_2 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_2, ActualArgs_2, "findFirst">>;
                findFirstOrThrow: () => <This_3, FormalArgs_3 extends import("@prisma/client/runtime/library").Args<This_3, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_3 extends FormalArgs_3>(this: This_3, args?: { [key_3 in keyof ActualArgs_3]: key_3 extends keyof FormalArgs_3 ? ActualArgs_3[key_3] : never; } & (ActualArgs_3 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_3 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_3, ActualArgs_3, "findFirstOrThrow">>;
                findMany: () => <This_4, FormalArgs_4 extends import("@prisma/client/runtime/library").Args<This_4, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_4 extends FormalArgs_4>(this: This_4, args?: { [key_4 in keyof ActualArgs_4]: key_4 extends keyof FormalArgs_4 ? ActualArgs_4[key_4] : never; } & (ActualArgs_4 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_4 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_4, ActualArgs_4, "findMany">>;
                findUnique: () => <This_5, FormalArgs_5 extends import("@prisma/client/runtime/library").Args<This_5, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_5 extends FormalArgs_5>(this: This_5, args: { [key_5 in keyof ActualArgs_5]: key_5 extends keyof FormalArgs_5 ? ActualArgs_5[key_5] : never; } & (ActualArgs_5 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_5 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_5, ActualArgs_5, "findUnique">>;
                findUniqueOrThrow: () => <This_6, FormalArgs_6 extends import("@prisma/client/runtime/library").Args<This_6, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_6 extends FormalArgs_6>(this: This_6, args: { [key_6 in keyof ActualArgs_6]: key_6 extends keyof FormalArgs_6 ? ActualArgs_6[key_6] : never; } & (ActualArgs_6 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_6 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_6, ActualArgs_6, "findUniqueOrThrow">>;
                groupBy: () => <This_7, FormalArgs_7 extends import("@prisma/client/runtime/library").Args<This_7, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_7 extends FormalArgs_7>(this: This_7, args: { [key_7 in keyof ActualArgs_7]: key_7 extends keyof FormalArgs_7 ? ActualArgs_7[key_7] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_7, ActualArgs_7, "groupBy">>;
            };
            campaign_clicks: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This_1, FormalArgs_1 extends import("@prisma/client/runtime/library").Args<This_1, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_1 extends FormalArgs_1>(this: This_1, args?: { [key_1 in keyof ActualArgs_1]: key_1 extends keyof FormalArgs_1 ? ActualArgs_1[key_1] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_1, ActualArgs_1, "count">>;
                findFirst: () => <This_2, FormalArgs_2 extends import("@prisma/client/runtime/library").Args<This_2, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_2 extends FormalArgs_2>(this: This_2, args?: { [key_2 in keyof ActualArgs_2]: key_2 extends keyof FormalArgs_2 ? ActualArgs_2[key_2] : never; } & (ActualArgs_2 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_2 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_2, ActualArgs_2, "findFirst">>;
                findFirstOrThrow: () => <This_3, FormalArgs_3 extends import("@prisma/client/runtime/library").Args<This_3, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_3 extends FormalArgs_3>(this: This_3, args?: { [key_3 in keyof ActualArgs_3]: key_3 extends keyof FormalArgs_3 ? ActualArgs_3[key_3] : never; } & (ActualArgs_3 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_3 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_3, ActualArgs_3, "findFirstOrThrow">>;
                findMany: () => <This_4, FormalArgs_4 extends import("@prisma/client/runtime/library").Args<This_4, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_4 extends FormalArgs_4>(this: This_4, args?: { [key_4 in keyof ActualArgs_4]: key_4 extends keyof FormalArgs_4 ? ActualArgs_4[key_4] : never; } & (ActualArgs_4 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_4 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_4, ActualArgs_4, "findMany">>;
                findUnique: () => <This_5, FormalArgs_5 extends import("@prisma/client/runtime/library").Args<This_5, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_5 extends FormalArgs_5>(this: This_5, args: { [key_5 in keyof ActualArgs_5]: key_5 extends keyof FormalArgs_5 ? ActualArgs_5[key_5] : never; } & (ActualArgs_5 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_5 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_5, ActualArgs_5, "findUnique">>;
                findUniqueOrThrow: () => <This_6, FormalArgs_6 extends import("@prisma/client/runtime/library").Args<This_6, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_6 extends FormalArgs_6>(this: This_6, args: { [key_6 in keyof ActualArgs_6]: key_6 extends keyof FormalArgs_6 ? ActualArgs_6[key_6] : never; } & (ActualArgs_6 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_6 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_6, ActualArgs_6, "findUniqueOrThrow">>;
                groupBy: () => <This_7, FormalArgs_7 extends import("@prisma/client/runtime/library").Args<This_7, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_7 extends FormalArgs_7>(this: This_7, args: { [key_7 in keyof ActualArgs_7]: key_7 extends keyof FormalArgs_7 ? ActualArgs_7[key_7] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_7, ActualArgs_7, "groupBy">>;
            };
            campaign_opens: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This_1, FormalArgs_1 extends import("@prisma/client/runtime/library").Args<This_1, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_1 extends FormalArgs_1>(this: This_1, args?: { [key_1 in keyof ActualArgs_1]: key_1 extends keyof FormalArgs_1 ? ActualArgs_1[key_1] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_1, ActualArgs_1, "count">>;
                findFirst: () => <This_2, FormalArgs_2 extends import("@prisma/client/runtime/library").Args<This_2, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_2 extends FormalArgs_2>(this: This_2, args?: { [key_2 in keyof ActualArgs_2]: key_2 extends keyof FormalArgs_2 ? ActualArgs_2[key_2] : never; } & (ActualArgs_2 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_2 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_2, ActualArgs_2, "findFirst">>;
                findFirstOrThrow: () => <This_3, FormalArgs_3 extends import("@prisma/client/runtime/library").Args<This_3, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_3 extends FormalArgs_3>(this: This_3, args?: { [key_3 in keyof ActualArgs_3]: key_3 extends keyof FormalArgs_3 ? ActualArgs_3[key_3] : never; } & (ActualArgs_3 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_3 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_3, ActualArgs_3, "findFirstOrThrow">>;
                findMany: () => <This_4, FormalArgs_4 extends import("@prisma/client/runtime/library").Args<This_4, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_4 extends FormalArgs_4>(this: This_4, args?: { [key_4 in keyof ActualArgs_4]: key_4 extends keyof FormalArgs_4 ? ActualArgs_4[key_4] : never; } & (ActualArgs_4 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_4 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_4, ActualArgs_4, "findMany">>;
                findUnique: () => <This_5, FormalArgs_5 extends import("@prisma/client/runtime/library").Args<This_5, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_5 extends FormalArgs_5>(this: This_5, args: { [key_5 in keyof ActualArgs_5]: key_5 extends keyof FormalArgs_5 ? ActualArgs_5[key_5] : never; } & (ActualArgs_5 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_5 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_5, ActualArgs_5, "findUnique">>;
                findUniqueOrThrow: () => <This_6, FormalArgs_6 extends import("@prisma/client/runtime/library").Args<This_6, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_6 extends FormalArgs_6>(this: This_6, args: { [key_6 in keyof ActualArgs_6]: key_6 extends keyof FormalArgs_6 ? ActualArgs_6[key_6] : never; } & (ActualArgs_6 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_6 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_6, ActualArgs_6, "findUniqueOrThrow">>;
                groupBy: () => <This_7, FormalArgs_7 extends import("@prisma/client/runtime/library").Args<This_7, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_7 extends FormalArgs_7>(this: This_7, args: { [key_7 in keyof ActualArgs_7]: key_7 extends keyof FormalArgs_7 ? ActualArgs_7[key_7] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_7, ActualArgs_7, "groupBy">>;
            };
            campaign_recipients: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This_1, FormalArgs_1 extends import("@prisma/client/runtime/library").Args<This_1, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_1 extends FormalArgs_1>(this: This_1, args?: { [key_1 in keyof ActualArgs_1]: key_1 extends keyof FormalArgs_1 ? ActualArgs_1[key_1] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_1, ActualArgs_1, "count">>;
                findFirst: () => <This_2, FormalArgs_2 extends import("@prisma/client/runtime/library").Args<This_2, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_2 extends FormalArgs_2>(this: This_2, args?: { [key_2 in keyof ActualArgs_2]: key_2 extends keyof FormalArgs_2 ? ActualArgs_2[key_2] : never; } & (ActualArgs_2 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_2 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_2, ActualArgs_2, "findFirst">>;
                findFirstOrThrow: () => <This_3, FormalArgs_3 extends import("@prisma/client/runtime/library").Args<This_3, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_3 extends FormalArgs_3>(this: This_3, args?: { [key_3 in keyof ActualArgs_3]: key_3 extends keyof FormalArgs_3 ? ActualArgs_3[key_3] : never; } & (ActualArgs_3 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_3 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_3, ActualArgs_3, "findFirstOrThrow">>;
                findMany: () => <This_4, FormalArgs_4 extends import("@prisma/client/runtime/library").Args<This_4, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_4 extends FormalArgs_4>(this: This_4, args?: { [key_4 in keyof ActualArgs_4]: key_4 extends keyof FormalArgs_4 ? ActualArgs_4[key_4] : never; } & (ActualArgs_4 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_4 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_4, ActualArgs_4, "findMany">>;
                findUnique: () => <This_5, FormalArgs_5 extends import("@prisma/client/runtime/library").Args<This_5, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_5 extends FormalArgs_5>(this: This_5, args: { [key_5 in keyof ActualArgs_5]: key_5 extends keyof FormalArgs_5 ? ActualArgs_5[key_5] : never; } & (ActualArgs_5 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_5 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_5, ActualArgs_5, "findUnique">>;
                findUniqueOrThrow: () => <This_6, FormalArgs_6 extends import("@prisma/client/runtime/library").Args<This_6, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_6 extends FormalArgs_6>(this: This_6, args: { [key_6 in keyof ActualArgs_6]: key_6 extends keyof FormalArgs_6 ? ActualArgs_6[key_6] : never; } & (ActualArgs_6 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_6 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_6, ActualArgs_6, "findUniqueOrThrow">>;
                groupBy: () => <This_7, FormalArgs_7 extends import("@prisma/client/runtime/library").Args<This_7, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_7 extends FormalArgs_7>(this: This_7, args: { [key_7 in keyof ActualArgs_7]: key_7 extends keyof FormalArgs_7 ? ActualArgs_7[key_7] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_7, ActualArgs_7, "groupBy">>;
            };
            campaigns: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This_1, FormalArgs_1 extends import("@prisma/client/runtime/library").Args<This_1, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_1 extends FormalArgs_1>(this: This_1, args?: { [key_1 in keyof ActualArgs_1]: key_1 extends keyof FormalArgs_1 ? ActualArgs_1[key_1] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_1, ActualArgs_1, "count">>;
                findFirst: () => <This_2, FormalArgs_2 extends import("@prisma/client/runtime/library").Args<This_2, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_2 extends FormalArgs_2>(this: This_2, args?: { [key_2 in keyof ActualArgs_2]: key_2 extends keyof FormalArgs_2 ? ActualArgs_2[key_2] : never; } & (ActualArgs_2 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_2 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_2, ActualArgs_2, "findFirst">>;
                findFirstOrThrow: () => <This_3, FormalArgs_3 extends import("@prisma/client/runtime/library").Args<This_3, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_3 extends FormalArgs_3>(this: This_3, args?: { [key_3 in keyof ActualArgs_3]: key_3 extends keyof FormalArgs_3 ? ActualArgs_3[key_3] : never; } & (ActualArgs_3 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_3 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_3, ActualArgs_3, "findFirstOrThrow">>;
                findMany: () => <This_4, FormalArgs_4 extends import("@prisma/client/runtime/library").Args<This_4, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_4 extends FormalArgs_4>(this: This_4, args?: { [key_4 in keyof ActualArgs_4]: key_4 extends keyof FormalArgs_4 ? ActualArgs_4[key_4] : never; } & (ActualArgs_4 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_4 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_4, ActualArgs_4, "findMany">>;
                findUnique: () => <This_5, FormalArgs_5 extends import("@prisma/client/runtime/library").Args<This_5, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_5 extends FormalArgs_5>(this: This_5, args: { [key_5 in keyof ActualArgs_5]: key_5 extends keyof FormalArgs_5 ? ActualArgs_5[key_5] : never; } & (ActualArgs_5 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_5 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_5, ActualArgs_5, "findUnique">>;
                findUniqueOrThrow: () => <This_6, FormalArgs_6 extends import("@prisma/client/runtime/library").Args<This_6, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_6 extends FormalArgs_6>(this: This_6, args: { [key_6 in keyof ActualArgs_6]: key_6 extends keyof FormalArgs_6 ? ActualArgs_6[key_6] : never; } & (ActualArgs_6 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_6 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_6, ActualArgs_6, "findUniqueOrThrow">>;
                groupBy: () => <This_7, FormalArgs_7 extends import("@prisma/client/runtime/library").Args<This_7, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_7 extends FormalArgs_7>(this: This_7, args: { [key_7 in keyof ActualArgs_7]: key_7 extends keyof FormalArgs_7 ? ActualArgs_7[key_7] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_7, ActualArgs_7, "groupBy">>;
            };
            cart_items: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This_1, FormalArgs_1 extends import("@prisma/client/runtime/library").Args<This_1, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_1 extends FormalArgs_1>(this: This_1, args?: { [key_1 in keyof ActualArgs_1]: key_1 extends keyof FormalArgs_1 ? ActualArgs_1[key_1] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_1, ActualArgs_1, "count">>;
                findFirst: () => <This_2, FormalArgs_2 extends import("@prisma/client/runtime/library").Args<This_2, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_2 extends FormalArgs_2>(this: This_2, args?: { [key_2 in keyof ActualArgs_2]: key_2 extends keyof FormalArgs_2 ? ActualArgs_2[key_2] : never; } & (ActualArgs_2 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_2 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_2, ActualArgs_2, "findFirst">>;
                findFirstOrThrow: () => <This_3, FormalArgs_3 extends import("@prisma/client/runtime/library").Args<This_3, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_3 extends FormalArgs_3>(this: This_3, args?: { [key_3 in keyof ActualArgs_3]: key_3 extends keyof FormalArgs_3 ? ActualArgs_3[key_3] : never; } & (ActualArgs_3 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_3 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_3, ActualArgs_3, "findFirstOrThrow">>;
                findMany: () => <This_4, FormalArgs_4 extends import("@prisma/client/runtime/library").Args<This_4, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_4 extends FormalArgs_4>(this: This_4, args?: { [key_4 in keyof ActualArgs_4]: key_4 extends keyof FormalArgs_4 ? ActualArgs_4[key_4] : never; } & (ActualArgs_4 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_4 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_4, ActualArgs_4, "findMany">>;
                findUnique: () => <This_5, FormalArgs_5 extends import("@prisma/client/runtime/library").Args<This_5, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_5 extends FormalArgs_5>(this: This_5, args: { [key_5 in keyof ActualArgs_5]: key_5 extends keyof FormalArgs_5 ? ActualArgs_5[key_5] : never; } & (ActualArgs_5 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_5 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_5, ActualArgs_5, "findUnique">>;
                findUniqueOrThrow: () => <This_6, FormalArgs_6 extends import("@prisma/client/runtime/library").Args<This_6, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_6 extends FormalArgs_6>(this: This_6, args: { [key_6 in keyof ActualArgs_6]: key_6 extends keyof FormalArgs_6 ? ActualArgs_6[key_6] : never; } & (ActualArgs_6 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_6 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_6, ActualArgs_6, "findUniqueOrThrow">>;
                groupBy: () => <This_7, FormalArgs_7 extends import("@prisma/client/runtime/library").Args<This_7, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_7 extends FormalArgs_7>(this: This_7, args: { [key_7 in keyof ActualArgs_7]: key_7 extends keyof FormalArgs_7 ? ActualArgs_7[key_7] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_7, ActualArgs_7, "groupBy">>;
            };
            carts: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This_1, FormalArgs_1 extends import("@prisma/client/runtime/library").Args<This_1, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_1 extends FormalArgs_1>(this: This_1, args?: { [key_1 in keyof ActualArgs_1]: key_1 extends keyof FormalArgs_1 ? ActualArgs_1[key_1] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_1, ActualArgs_1, "count">>;
                findFirst: () => <This_2, FormalArgs_2 extends import("@prisma/client/runtime/library").Args<This_2, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_2 extends FormalArgs_2>(this: This_2, args?: { [key_2 in keyof ActualArgs_2]: key_2 extends keyof FormalArgs_2 ? ActualArgs_2[key_2] : never; } & (ActualArgs_2 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_2 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_2, ActualArgs_2, "findFirst">>;
                findFirstOrThrow: () => <This_3, FormalArgs_3 extends import("@prisma/client/runtime/library").Args<This_3, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_3 extends FormalArgs_3>(this: This_3, args?: { [key_3 in keyof ActualArgs_3]: key_3 extends keyof FormalArgs_3 ? ActualArgs_3[key_3] : never; } & (ActualArgs_3 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_3 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_3, ActualArgs_3, "findFirstOrThrow">>;
                findMany: () => <This_4, FormalArgs_4 extends import("@prisma/client/runtime/library").Args<This_4, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_4 extends FormalArgs_4>(this: This_4, args?: { [key_4 in keyof ActualArgs_4]: key_4 extends keyof FormalArgs_4 ? ActualArgs_4[key_4] : never; } & (ActualArgs_4 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_4 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_4, ActualArgs_4, "findMany">>;
                findUnique: () => <This_5, FormalArgs_5 extends import("@prisma/client/runtime/library").Args<This_5, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_5 extends FormalArgs_5>(this: This_5, args: { [key_5 in keyof ActualArgs_5]: key_5 extends keyof FormalArgs_5 ? ActualArgs_5[key_5] : never; } & (ActualArgs_5 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_5 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_5, ActualArgs_5, "findUnique">>;
                findUniqueOrThrow: () => <This_6, FormalArgs_6 extends import("@prisma/client/runtime/library").Args<This_6, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_6 extends FormalArgs_6>(this: This_6, args: { [key_6 in keyof ActualArgs_6]: key_6 extends keyof FormalArgs_6 ? ActualArgs_6[key_6] : never; } & (ActualArgs_6 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_6 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_6, ActualArgs_6, "findUniqueOrThrow">>;
                groupBy: () => <This_7, FormalArgs_7 extends import("@prisma/client/runtime/library").Args<This_7, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_7 extends FormalArgs_7>(this: This_7, args: { [key_7 in keyof ActualArgs_7]: key_7 extends keyof FormalArgs_7 ? ActualArgs_7[key_7] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_7, ActualArgs_7, "groupBy">>;
            };
            categories: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This_1, FormalArgs_1 extends import("@prisma/client/runtime/library").Args<This_1, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_1 extends FormalArgs_1>(this: This_1, args?: { [key_1 in keyof ActualArgs_1]: key_1 extends keyof FormalArgs_1 ? ActualArgs_1[key_1] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_1, ActualArgs_1, "count">>;
                findFirst: () => <This_2, FormalArgs_2 extends import("@prisma/client/runtime/library").Args<This_2, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_2 extends FormalArgs_2>(this: This_2, args?: { [key_2 in keyof ActualArgs_2]: key_2 extends keyof FormalArgs_2 ? ActualArgs_2[key_2] : never; } & (ActualArgs_2 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_2 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_2, ActualArgs_2, "findFirst">>;
                findFirstOrThrow: () => <This_3, FormalArgs_3 extends import("@prisma/client/runtime/library").Args<This_3, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_3 extends FormalArgs_3>(this: This_3, args?: { [key_3 in keyof ActualArgs_3]: key_3 extends keyof FormalArgs_3 ? ActualArgs_3[key_3] : never; } & (ActualArgs_3 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_3 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_3, ActualArgs_3, "findFirstOrThrow">>;
                findMany: () => <This_4, FormalArgs_4 extends import("@prisma/client/runtime/library").Args<This_4, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_4 extends FormalArgs_4>(this: This_4, args?: { [key_4 in keyof ActualArgs_4]: key_4 extends keyof FormalArgs_4 ? ActualArgs_4[key_4] : never; } & (ActualArgs_4 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_4 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_4, ActualArgs_4, "findMany">>;
                findUnique: () => <This_5, FormalArgs_5 extends import("@prisma/client/runtime/library").Args<This_5, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_5 extends FormalArgs_5>(this: This_5, args: { [key_5 in keyof ActualArgs_5]: key_5 extends keyof FormalArgs_5 ? ActualArgs_5[key_5] : never; } & (ActualArgs_5 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_5 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_5, ActualArgs_5, "findUnique">>;
                findUniqueOrThrow: () => <This_6, FormalArgs_6 extends import("@prisma/client/runtime/library").Args<This_6, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_6 extends FormalArgs_6>(this: This_6, args: { [key_6 in keyof ActualArgs_6]: key_6 extends keyof FormalArgs_6 ? ActualArgs_6[key_6] : never; } & (ActualArgs_6 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_6 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_6, ActualArgs_6, "findUniqueOrThrow">>;
                groupBy: () => <This_7, FormalArgs_7 extends import("@prisma/client/runtime/library").Args<This_7, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_7 extends FormalArgs_7>(this: This_7, args: { [key_7 in keyof ActualArgs_7]: key_7 extends keyof FormalArgs_7 ? ActualArgs_7[key_7] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_7, ActualArgs_7, "groupBy">>;
            };
            customer_questions: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This_1, FormalArgs_1 extends import("@prisma/client/runtime/library").Args<This_1, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_1 extends FormalArgs_1>(this: This_1, args?: { [key_1 in keyof ActualArgs_1]: key_1 extends keyof FormalArgs_1 ? ActualArgs_1[key_1] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_1, ActualArgs_1, "count">>;
                findFirst: () => <This_2, FormalArgs_2 extends import("@prisma/client/runtime/library").Args<This_2, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_2 extends FormalArgs_2>(this: This_2, args?: { [key_2 in keyof ActualArgs_2]: key_2 extends keyof FormalArgs_2 ? ActualArgs_2[key_2] : never; } & (ActualArgs_2 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_2 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_2, ActualArgs_2, "findFirst">>;
                findFirstOrThrow: () => <This_3, FormalArgs_3 extends import("@prisma/client/runtime/library").Args<This_3, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_3 extends FormalArgs_3>(this: This_3, args?: { [key_3 in keyof ActualArgs_3]: key_3 extends keyof FormalArgs_3 ? ActualArgs_3[key_3] : never; } & (ActualArgs_3 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_3 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_3, ActualArgs_3, "findFirstOrThrow">>;
                findMany: () => <This_4, FormalArgs_4 extends import("@prisma/client/runtime/library").Args<This_4, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_4 extends FormalArgs_4>(this: This_4, args?: { [key_4 in keyof ActualArgs_4]: key_4 extends keyof FormalArgs_4 ? ActualArgs_4[key_4] : never; } & (ActualArgs_4 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_4 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_4, ActualArgs_4, "findMany">>;
                findUnique: () => <This_5, FormalArgs_5 extends import("@prisma/client/runtime/library").Args<This_5, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_5 extends FormalArgs_5>(this: This_5, args: { [key_5 in keyof ActualArgs_5]: key_5 extends keyof FormalArgs_5 ? ActualArgs_5[key_5] : never; } & (ActualArgs_5 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_5 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_5, ActualArgs_5, "findUnique">>;
                findUniqueOrThrow: () => <This_6, FormalArgs_6 extends import("@prisma/client/runtime/library").Args<This_6, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_6 extends FormalArgs_6>(this: This_6, args: { [key_6 in keyof ActualArgs_6]: key_6 extends keyof FormalArgs_6 ? ActualArgs_6[key_6] : never; } & (ActualArgs_6 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_6 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_6, ActualArgs_6, "findUniqueOrThrow">>;
                groupBy: () => <This_7, FormalArgs_7 extends import("@prisma/client/runtime/library").Args<This_7, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_7 extends FormalArgs_7>(this: This_7, args: { [key_7 in keyof ActualArgs_7]: key_7 extends keyof FormalArgs_7 ? ActualArgs_7[key_7] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_7, ActualArgs_7, "groupBy">>;
            };
            email_logs: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This_1, FormalArgs_1 extends import("@prisma/client/runtime/library").Args<This_1, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_1 extends FormalArgs_1>(this: This_1, args?: { [key_1 in keyof ActualArgs_1]: key_1 extends keyof FormalArgs_1 ? ActualArgs_1[key_1] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_1, ActualArgs_1, "count">>;
                findFirst: () => <This_2, FormalArgs_2 extends import("@prisma/client/runtime/library").Args<This_2, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_2 extends FormalArgs_2>(this: This_2, args?: { [key_2 in keyof ActualArgs_2]: key_2 extends keyof FormalArgs_2 ? ActualArgs_2[key_2] : never; } & (ActualArgs_2 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_2 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_2, ActualArgs_2, "findFirst">>;
                findFirstOrThrow: () => <This_3, FormalArgs_3 extends import("@prisma/client/runtime/library").Args<This_3, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_3 extends FormalArgs_3>(this: This_3, args?: { [key_3 in keyof ActualArgs_3]: key_3 extends keyof FormalArgs_3 ? ActualArgs_3[key_3] : never; } & (ActualArgs_3 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_3 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_3, ActualArgs_3, "findFirstOrThrow">>;
                findMany: () => <This_4, FormalArgs_4 extends import("@prisma/client/runtime/library").Args<This_4, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_4 extends FormalArgs_4>(this: This_4, args?: { [key_4 in keyof ActualArgs_4]: key_4 extends keyof FormalArgs_4 ? ActualArgs_4[key_4] : never; } & (ActualArgs_4 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_4 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_4, ActualArgs_4, "findMany">>;
                findUnique: () => <This_5, FormalArgs_5 extends import("@prisma/client/runtime/library").Args<This_5, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_5 extends FormalArgs_5>(this: This_5, args: { [key_5 in keyof ActualArgs_5]: key_5 extends keyof FormalArgs_5 ? ActualArgs_5[key_5] : never; } & (ActualArgs_5 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_5 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_5, ActualArgs_5, "findUnique">>;
                findUniqueOrThrow: () => <This_6, FormalArgs_6 extends import("@prisma/client/runtime/library").Args<This_6, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_6 extends FormalArgs_6>(this: This_6, args: { [key_6 in keyof ActualArgs_6]: key_6 extends keyof FormalArgs_6 ? ActualArgs_6[key_6] : never; } & (ActualArgs_6 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_6 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_6, ActualArgs_6, "findUniqueOrThrow">>;
                groupBy: () => <This_7, FormalArgs_7 extends import("@prisma/client/runtime/library").Args<This_7, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_7 extends FormalArgs_7>(this: This_7, args: { [key_7 in keyof ActualArgs_7]: key_7 extends keyof FormalArgs_7 ? ActualArgs_7[key_7] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_7, ActualArgs_7, "groupBy">>;
            };
            email_templates: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This_1, FormalArgs_1 extends import("@prisma/client/runtime/library").Args<This_1, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_1 extends FormalArgs_1>(this: This_1, args?: { [key_1 in keyof ActualArgs_1]: key_1 extends keyof FormalArgs_1 ? ActualArgs_1[key_1] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_1, ActualArgs_1, "count">>;
                findFirst: () => <This_2, FormalArgs_2 extends import("@prisma/client/runtime/library").Args<This_2, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_2 extends FormalArgs_2>(this: This_2, args?: { [key_2 in keyof ActualArgs_2]: key_2 extends keyof FormalArgs_2 ? ActualArgs_2[key_2] : never; } & (ActualArgs_2 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_2 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_2, ActualArgs_2, "findFirst">>;
                findFirstOrThrow: () => <This_3, FormalArgs_3 extends import("@prisma/client/runtime/library").Args<This_3, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_3 extends FormalArgs_3>(this: This_3, args?: { [key_3 in keyof ActualArgs_3]: key_3 extends keyof FormalArgs_3 ? ActualArgs_3[key_3] : never; } & (ActualArgs_3 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_3 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_3, ActualArgs_3, "findFirstOrThrow">>;
                findMany: () => <This_4, FormalArgs_4 extends import("@prisma/client/runtime/library").Args<This_4, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_4 extends FormalArgs_4>(this: This_4, args?: { [key_4 in keyof ActualArgs_4]: key_4 extends keyof FormalArgs_4 ? ActualArgs_4[key_4] : never; } & (ActualArgs_4 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_4 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_4, ActualArgs_4, "findMany">>;
                findUnique: () => <This_5, FormalArgs_5 extends import("@prisma/client/runtime/library").Args<This_5, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_5 extends FormalArgs_5>(this: This_5, args: { [key_5 in keyof ActualArgs_5]: key_5 extends keyof FormalArgs_5 ? ActualArgs_5[key_5] : never; } & (ActualArgs_5 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_5 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_5, ActualArgs_5, "findUnique">>;
                findUniqueOrThrow: () => <This_6, FormalArgs_6 extends import("@prisma/client/runtime/library").Args<This_6, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_6 extends FormalArgs_6>(this: This_6, args: { [key_6 in keyof ActualArgs_6]: key_6 extends keyof FormalArgs_6 ? ActualArgs_6[key_6] : never; } & (ActualArgs_6 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_6 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_6, ActualArgs_6, "findUniqueOrThrow">>;
                groupBy: () => <This_7, FormalArgs_7 extends import("@prisma/client/runtime/library").Args<This_7, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_7 extends FormalArgs_7>(this: This_7, args: { [key_7 in keyof ActualArgs_7]: key_7 extends keyof FormalArgs_7 ? ActualArgs_7[key_7] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_7, ActualArgs_7, "groupBy">>;
            };
            inventory: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This_1, FormalArgs_1 extends import("@prisma/client/runtime/library").Args<This_1, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_1 extends FormalArgs_1>(this: This_1, args?: { [key_1 in keyof ActualArgs_1]: key_1 extends keyof FormalArgs_1 ? ActualArgs_1[key_1] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_1, ActualArgs_1, "count">>;
                findFirst: () => <This_2, FormalArgs_2 extends import("@prisma/client/runtime/library").Args<This_2, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_2 extends FormalArgs_2>(this: This_2, args?: { [key_2 in keyof ActualArgs_2]: key_2 extends keyof FormalArgs_2 ? ActualArgs_2[key_2] : never; } & (ActualArgs_2 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_2 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_2, ActualArgs_2, "findFirst">>;
                findFirstOrThrow: () => <This_3, FormalArgs_3 extends import("@prisma/client/runtime/library").Args<This_3, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_3 extends FormalArgs_3>(this: This_3, args?: { [key_3 in keyof ActualArgs_3]: key_3 extends keyof FormalArgs_3 ? ActualArgs_3[key_3] : never; } & (ActualArgs_3 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_3 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_3, ActualArgs_3, "findFirstOrThrow">>;
                findMany: () => <This_4, FormalArgs_4 extends import("@prisma/client/runtime/library").Args<This_4, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_4 extends FormalArgs_4>(this: This_4, args?: { [key_4 in keyof ActualArgs_4]: key_4 extends keyof FormalArgs_4 ? ActualArgs_4[key_4] : never; } & (ActualArgs_4 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_4 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_4, ActualArgs_4, "findMany">>;
                findUnique: () => <This_5, FormalArgs_5 extends import("@prisma/client/runtime/library").Args<This_5, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_5 extends FormalArgs_5>(this: This_5, args: { [key_5 in keyof ActualArgs_5]: key_5 extends keyof FormalArgs_5 ? ActualArgs_5[key_5] : never; } & (ActualArgs_5 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_5 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_5, ActualArgs_5, "findUnique">>;
                findUniqueOrThrow: () => <This_6, FormalArgs_6 extends import("@prisma/client/runtime/library").Args<This_6, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_6 extends FormalArgs_6>(this: This_6, args: { [key_6 in keyof ActualArgs_6]: key_6 extends keyof FormalArgs_6 ? ActualArgs_6[key_6] : never; } & (ActualArgs_6 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_6 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_6, ActualArgs_6, "findUniqueOrThrow">>;
                groupBy: () => <This_7, FormalArgs_7 extends import("@prisma/client/runtime/library").Args<This_7, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_7 extends FormalArgs_7>(this: This_7, args: { [key_7 in keyof ActualArgs_7]: key_7 extends keyof FormalArgs_7 ? ActualArgs_7[key_7] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_7, ActualArgs_7, "groupBy">>;
            };
            inventory_alerts: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This_1, FormalArgs_1 extends import("@prisma/client/runtime/library").Args<This_1, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_1 extends FormalArgs_1>(this: This_1, args?: { [key_1 in keyof ActualArgs_1]: key_1 extends keyof FormalArgs_1 ? ActualArgs_1[key_1] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_1, ActualArgs_1, "count">>;
                findFirst: () => <This_2, FormalArgs_2 extends import("@prisma/client/runtime/library").Args<This_2, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_2 extends FormalArgs_2>(this: This_2, args?: { [key_2 in keyof ActualArgs_2]: key_2 extends keyof FormalArgs_2 ? ActualArgs_2[key_2] : never; } & (ActualArgs_2 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_2 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_2, ActualArgs_2, "findFirst">>;
                findFirstOrThrow: () => <This_3, FormalArgs_3 extends import("@prisma/client/runtime/library").Args<This_3, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_3 extends FormalArgs_3>(this: This_3, args?: { [key_3 in keyof ActualArgs_3]: key_3 extends keyof FormalArgs_3 ? ActualArgs_3[key_3] : never; } & (ActualArgs_3 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_3 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_3, ActualArgs_3, "findFirstOrThrow">>;
                findMany: () => <This_4, FormalArgs_4 extends import("@prisma/client/runtime/library").Args<This_4, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_4 extends FormalArgs_4>(this: This_4, args?: { [key_4 in keyof ActualArgs_4]: key_4 extends keyof FormalArgs_4 ? ActualArgs_4[key_4] : never; } & (ActualArgs_4 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_4 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_4, ActualArgs_4, "findMany">>;
                findUnique: () => <This_5, FormalArgs_5 extends import("@prisma/client/runtime/library").Args<This_5, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_5 extends FormalArgs_5>(this: This_5, args: { [key_5 in keyof ActualArgs_5]: key_5 extends keyof FormalArgs_5 ? ActualArgs_5[key_5] : never; } & (ActualArgs_5 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_5 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_5, ActualArgs_5, "findUnique">>;
                findUniqueOrThrow: () => <This_6, FormalArgs_6 extends import("@prisma/client/runtime/library").Args<This_6, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_6 extends FormalArgs_6>(this: This_6, args: { [key_6 in keyof ActualArgs_6]: key_6 extends keyof FormalArgs_6 ? ActualArgs_6[key_6] : never; } & (ActualArgs_6 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_6 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_6, ActualArgs_6, "findUniqueOrThrow">>;
                groupBy: () => <This_7, FormalArgs_7 extends import("@prisma/client/runtime/library").Args<This_7, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_7 extends FormalArgs_7>(this: This_7, args: { [key_7 in keyof ActualArgs_7]: key_7 extends keyof FormalArgs_7 ? ActualArgs_7[key_7] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_7, ActualArgs_7, "groupBy">>;
            };
            inventory_movements: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This_1, FormalArgs_1 extends import("@prisma/client/runtime/library").Args<This_1, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_1 extends FormalArgs_1>(this: This_1, args?: { [key_1 in keyof ActualArgs_1]: key_1 extends keyof FormalArgs_1 ? ActualArgs_1[key_1] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_1, ActualArgs_1, "count">>;
                findFirst: () => <This_2, FormalArgs_2 extends import("@prisma/client/runtime/library").Args<This_2, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_2 extends FormalArgs_2>(this: This_2, args?: { [key_2 in keyof ActualArgs_2]: key_2 extends keyof FormalArgs_2 ? ActualArgs_2[key_2] : never; } & (ActualArgs_2 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_2 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_2, ActualArgs_2, "findFirst">>;
                findFirstOrThrow: () => <This_3, FormalArgs_3 extends import("@prisma/client/runtime/library").Args<This_3, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_3 extends FormalArgs_3>(this: This_3, args?: { [key_3 in keyof ActualArgs_3]: key_3 extends keyof FormalArgs_3 ? ActualArgs_3[key_3] : never; } & (ActualArgs_3 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_3 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_3, ActualArgs_3, "findFirstOrThrow">>;
                findMany: () => <This_4, FormalArgs_4 extends import("@prisma/client/runtime/library").Args<This_4, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_4 extends FormalArgs_4>(this: This_4, args?: { [key_4 in keyof ActualArgs_4]: key_4 extends keyof FormalArgs_4 ? ActualArgs_4[key_4] : never; } & (ActualArgs_4 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_4 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_4, ActualArgs_4, "findMany">>;
                findUnique: () => <This_5, FormalArgs_5 extends import("@prisma/client/runtime/library").Args<This_5, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_5 extends FormalArgs_5>(this: This_5, args: { [key_5 in keyof ActualArgs_5]: key_5 extends keyof FormalArgs_5 ? ActualArgs_5[key_5] : never; } & (ActualArgs_5 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_5 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_5, ActualArgs_5, "findUnique">>;
                findUniqueOrThrow: () => <This_6, FormalArgs_6 extends import("@prisma/client/runtime/library").Args<This_6, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_6 extends FormalArgs_6>(this: This_6, args: { [key_6 in keyof ActualArgs_6]: key_6 extends keyof FormalArgs_6 ? ActualArgs_6[key_6] : never; } & (ActualArgs_6 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_6 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_6, ActualArgs_6, "findUniqueOrThrow">>;
                groupBy: () => <This_7, FormalArgs_7 extends import("@prisma/client/runtime/library").Args<This_7, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_7 extends FormalArgs_7>(this: This_7, args: { [key_7 in keyof ActualArgs_7]: key_7 extends keyof FormalArgs_7 ? ActualArgs_7[key_7] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_7, ActualArgs_7, "groupBy">>;
            };
            inventory_reports: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This_1, FormalArgs_1 extends import("@prisma/client/runtime/library").Args<This_1, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_1 extends FormalArgs_1>(this: This_1, args?: { [key_1 in keyof ActualArgs_1]: key_1 extends keyof FormalArgs_1 ? ActualArgs_1[key_1] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_1, ActualArgs_1, "count">>;
                findFirst: () => <This_2, FormalArgs_2 extends import("@prisma/client/runtime/library").Args<This_2, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_2 extends FormalArgs_2>(this: This_2, args?: { [key_2 in keyof ActualArgs_2]: key_2 extends keyof FormalArgs_2 ? ActualArgs_2[key_2] : never; } & (ActualArgs_2 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_2 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_2, ActualArgs_2, "findFirst">>;
                findFirstOrThrow: () => <This_3, FormalArgs_3 extends import("@prisma/client/runtime/library").Args<This_3, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_3 extends FormalArgs_3>(this: This_3, args?: { [key_3 in keyof ActualArgs_3]: key_3 extends keyof FormalArgs_3 ? ActualArgs_3[key_3] : never; } & (ActualArgs_3 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_3 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_3, ActualArgs_3, "findFirstOrThrow">>;
                findMany: () => <This_4, FormalArgs_4 extends import("@prisma/client/runtime/library").Args<This_4, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_4 extends FormalArgs_4>(this: This_4, args?: { [key_4 in keyof ActualArgs_4]: key_4 extends keyof FormalArgs_4 ? ActualArgs_4[key_4] : never; } & (ActualArgs_4 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_4 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_4, ActualArgs_4, "findMany">>;
                findUnique: () => <This_5, FormalArgs_5 extends import("@prisma/client/runtime/library").Args<This_5, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_5 extends FormalArgs_5>(this: This_5, args: { [key_5 in keyof ActualArgs_5]: key_5 extends keyof FormalArgs_5 ? ActualArgs_5[key_5] : never; } & (ActualArgs_5 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_5 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_5, ActualArgs_5, "findUnique">>;
                findUniqueOrThrow: () => <This_6, FormalArgs_6 extends import("@prisma/client/runtime/library").Args<This_6, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_6 extends FormalArgs_6>(this: This_6, args: { [key_6 in keyof ActualArgs_6]: key_6 extends keyof FormalArgs_6 ? ActualArgs_6[key_6] : never; } & (ActualArgs_6 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_6 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_6, ActualArgs_6, "findUniqueOrThrow">>;
                groupBy: () => <This_7, FormalArgs_7 extends import("@prisma/client/runtime/library").Args<This_7, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_7 extends FormalArgs_7>(this: This_7, args: { [key_7 in keyof ActualArgs_7]: key_7 extends keyof FormalArgs_7 ? ActualArgs_7[key_7] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_7, ActualArgs_7, "groupBy">>;
            };
            knowledge_base_entries: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This_1, FormalArgs_1 extends import("@prisma/client/runtime/library").Args<This_1, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_1 extends FormalArgs_1>(this: This_1, args?: { [key_1 in keyof ActualArgs_1]: key_1 extends keyof FormalArgs_1 ? ActualArgs_1[key_1] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_1, ActualArgs_1, "count">>;
                findFirst: () => <This_2, FormalArgs_2 extends import("@prisma/client/runtime/library").Args<This_2, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_2 extends FormalArgs_2>(this: This_2, args?: { [key_2 in keyof ActualArgs_2]: key_2 extends keyof FormalArgs_2 ? ActualArgs_2[key_2] : never; } & (ActualArgs_2 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_2 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_2, ActualArgs_2, "findFirst">>;
                findFirstOrThrow: () => <This_3, FormalArgs_3 extends import("@prisma/client/runtime/library").Args<This_3, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_3 extends FormalArgs_3>(this: This_3, args?: { [key_3 in keyof ActualArgs_3]: key_3 extends keyof FormalArgs_3 ? ActualArgs_3[key_3] : never; } & (ActualArgs_3 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_3 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_3, ActualArgs_3, "findFirstOrThrow">>;
                findMany: () => <This_4, FormalArgs_4 extends import("@prisma/client/runtime/library").Args<This_4, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_4 extends FormalArgs_4>(this: This_4, args?: { [key_4 in keyof ActualArgs_4]: key_4 extends keyof FormalArgs_4 ? ActualArgs_4[key_4] : never; } & (ActualArgs_4 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_4 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_4, ActualArgs_4, "findMany">>;
                findUnique: () => <This_5, FormalArgs_5 extends import("@prisma/client/runtime/library").Args<This_5, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_5 extends FormalArgs_5>(this: This_5, args: { [key_5 in keyof ActualArgs_5]: key_5 extends keyof FormalArgs_5 ? ActualArgs_5[key_5] : never; } & (ActualArgs_5 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_5 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_5, ActualArgs_5, "findUnique">>;
                findUniqueOrThrow: () => <This_6, FormalArgs_6 extends import("@prisma/client/runtime/library").Args<This_6, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_6 extends FormalArgs_6>(this: This_6, args: { [key_6 in keyof ActualArgs_6]: key_6 extends keyof FormalArgs_6 ? ActualArgs_6[key_6] : never; } & (ActualArgs_6 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_6 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_6, ActualArgs_6, "findUniqueOrThrow">>;
                groupBy: () => <This_7, FormalArgs_7 extends import("@prisma/client/runtime/library").Args<This_7, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_7 extends FormalArgs_7>(this: This_7, args: { [key_7 in keyof ActualArgs_7]: key_7 extends keyof FormalArgs_7 ? ActualArgs_7[key_7] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_7, ActualArgs_7, "groupBy">>;
            };
            loyalty_accounts: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This_1, FormalArgs_1 extends import("@prisma/client/runtime/library").Args<This_1, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_1 extends FormalArgs_1>(this: This_1, args?: { [key_1 in keyof ActualArgs_1]: key_1 extends keyof FormalArgs_1 ? ActualArgs_1[key_1] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_1, ActualArgs_1, "count">>;
                findFirst: () => <This_2, FormalArgs_2 extends import("@prisma/client/runtime/library").Args<This_2, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_2 extends FormalArgs_2>(this: This_2, args?: { [key_2 in keyof ActualArgs_2]: key_2 extends keyof FormalArgs_2 ? ActualArgs_2[key_2] : never; } & (ActualArgs_2 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_2 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_2, ActualArgs_2, "findFirst">>;
                findFirstOrThrow: () => <This_3, FormalArgs_3 extends import("@prisma/client/runtime/library").Args<This_3, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_3 extends FormalArgs_3>(this: This_3, args?: { [key_3 in keyof ActualArgs_3]: key_3 extends keyof FormalArgs_3 ? ActualArgs_3[key_3] : never; } & (ActualArgs_3 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_3 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_3, ActualArgs_3, "findFirstOrThrow">>;
                findMany: () => <This_4, FormalArgs_4 extends import("@prisma/client/runtime/library").Args<This_4, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_4 extends FormalArgs_4>(this: This_4, args?: { [key_4 in keyof ActualArgs_4]: key_4 extends keyof FormalArgs_4 ? ActualArgs_4[key_4] : never; } & (ActualArgs_4 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_4 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_4, ActualArgs_4, "findMany">>;
                findUnique: () => <This_5, FormalArgs_5 extends import("@prisma/client/runtime/library").Args<This_5, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_5 extends FormalArgs_5>(this: This_5, args: { [key_5 in keyof ActualArgs_5]: key_5 extends keyof FormalArgs_5 ? ActualArgs_5[key_5] : never; } & (ActualArgs_5 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_5 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_5, ActualArgs_5, "findUnique">>;
                findUniqueOrThrow: () => <This_6, FormalArgs_6 extends import("@prisma/client/runtime/library").Args<This_6, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_6 extends FormalArgs_6>(this: This_6, args: { [key_6 in keyof ActualArgs_6]: key_6 extends keyof FormalArgs_6 ? ActualArgs_6[key_6] : never; } & (ActualArgs_6 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_6 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_6, ActualArgs_6, "findUniqueOrThrow">>;
                groupBy: () => <This_7, FormalArgs_7 extends import("@prisma/client/runtime/library").Args<This_7, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_7 extends FormalArgs_7>(this: This_7, args: { [key_7 in keyof ActualArgs_7]: key_7 extends keyof FormalArgs_7 ? ActualArgs_7[key_7] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_7, ActualArgs_7, "groupBy">>;
            };
            loyalty_rewards: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This_1, FormalArgs_1 extends import("@prisma/client/runtime/library").Args<This_1, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_1 extends FormalArgs_1>(this: This_1, args?: { [key_1 in keyof ActualArgs_1]: key_1 extends keyof FormalArgs_1 ? ActualArgs_1[key_1] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_1, ActualArgs_1, "count">>;
                findFirst: () => <This_2, FormalArgs_2 extends import("@prisma/client/runtime/library").Args<This_2, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_2 extends FormalArgs_2>(this: This_2, args?: { [key_2 in keyof ActualArgs_2]: key_2 extends keyof FormalArgs_2 ? ActualArgs_2[key_2] : never; } & (ActualArgs_2 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_2 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_2, ActualArgs_2, "findFirst">>;
                findFirstOrThrow: () => <This_3, FormalArgs_3 extends import("@prisma/client/runtime/library").Args<This_3, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_3 extends FormalArgs_3>(this: This_3, args?: { [key_3 in keyof ActualArgs_3]: key_3 extends keyof FormalArgs_3 ? ActualArgs_3[key_3] : never; } & (ActualArgs_3 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_3 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_3, ActualArgs_3, "findFirstOrThrow">>;
                findMany: () => <This_4, FormalArgs_4 extends import("@prisma/client/runtime/library").Args<This_4, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_4 extends FormalArgs_4>(this: This_4, args?: { [key_4 in keyof ActualArgs_4]: key_4 extends keyof FormalArgs_4 ? ActualArgs_4[key_4] : never; } & (ActualArgs_4 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_4 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_4, ActualArgs_4, "findMany">>;
                findUnique: () => <This_5, FormalArgs_5 extends import("@prisma/client/runtime/library").Args<This_5, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_5 extends FormalArgs_5>(this: This_5, args: { [key_5 in keyof ActualArgs_5]: key_5 extends keyof FormalArgs_5 ? ActualArgs_5[key_5] : never; } & (ActualArgs_5 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_5 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_5, ActualArgs_5, "findUnique">>;
                findUniqueOrThrow: () => <This_6, FormalArgs_6 extends import("@prisma/client/runtime/library").Args<This_6, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_6 extends FormalArgs_6>(this: This_6, args: { [key_6 in keyof ActualArgs_6]: key_6 extends keyof FormalArgs_6 ? ActualArgs_6[key_6] : never; } & (ActualArgs_6 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_6 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_6, ActualArgs_6, "findUniqueOrThrow">>;
                groupBy: () => <This_7, FormalArgs_7 extends import("@prisma/client/runtime/library").Args<This_7, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_7 extends FormalArgs_7>(this: This_7, args: { [key_7 in keyof ActualArgs_7]: key_7 extends keyof FormalArgs_7 ? ActualArgs_7[key_7] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_7, ActualArgs_7, "groupBy">>;
            };
            newsletter_subscriptions: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This_1, FormalArgs_1 extends import("@prisma/client/runtime/library").Args<This_1, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_1 extends FormalArgs_1>(this: This_1, args?: { [key_1 in keyof ActualArgs_1]: key_1 extends keyof FormalArgs_1 ? ActualArgs_1[key_1] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_1, ActualArgs_1, "count">>;
                findFirst: () => <This_2, FormalArgs_2 extends import("@prisma/client/runtime/library").Args<This_2, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_2 extends FormalArgs_2>(this: This_2, args?: { [key_2 in keyof ActualArgs_2]: key_2 extends keyof FormalArgs_2 ? ActualArgs_2[key_2] : never; } & (ActualArgs_2 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_2 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_2, ActualArgs_2, "findFirst">>;
                findFirstOrThrow: () => <This_3, FormalArgs_3 extends import("@prisma/client/runtime/library").Args<This_3, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_3 extends FormalArgs_3>(this: This_3, args?: { [key_3 in keyof ActualArgs_3]: key_3 extends keyof FormalArgs_3 ? ActualArgs_3[key_3] : never; } & (ActualArgs_3 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_3 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_3, ActualArgs_3, "findFirstOrThrow">>;
                findMany: () => <This_4, FormalArgs_4 extends import("@prisma/client/runtime/library").Args<This_4, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_4 extends FormalArgs_4>(this: This_4, args?: { [key_4 in keyof ActualArgs_4]: key_4 extends keyof FormalArgs_4 ? ActualArgs_4[key_4] : never; } & (ActualArgs_4 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_4 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_4, ActualArgs_4, "findMany">>;
                findUnique: () => <This_5, FormalArgs_5 extends import("@prisma/client/runtime/library").Args<This_5, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_5 extends FormalArgs_5>(this: This_5, args: { [key_5 in keyof ActualArgs_5]: key_5 extends keyof FormalArgs_5 ? ActualArgs_5[key_5] : never; } & (ActualArgs_5 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_5 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_5, ActualArgs_5, "findUnique">>;
                findUniqueOrThrow: () => <This_6, FormalArgs_6 extends import("@prisma/client/runtime/library").Args<This_6, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_6 extends FormalArgs_6>(this: This_6, args: { [key_6 in keyof ActualArgs_6]: key_6 extends keyof FormalArgs_6 ? ActualArgs_6[key_6] : never; } & (ActualArgs_6 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_6 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_6, ActualArgs_6, "findUniqueOrThrow">>;
                groupBy: () => <This_7, FormalArgs_7 extends import("@prisma/client/runtime/library").Args<This_7, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_7 extends FormalArgs_7>(this: This_7, args: { [key_7 in keyof ActualArgs_7]: key_7 extends keyof FormalArgs_7 ? ActualArgs_7[key_7] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_7, ActualArgs_7, "groupBy">>;
            };
            order_items: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This_1, FormalArgs_1 extends import("@prisma/client/runtime/library").Args<This_1, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_1 extends FormalArgs_1>(this: This_1, args?: { [key_1 in keyof ActualArgs_1]: key_1 extends keyof FormalArgs_1 ? ActualArgs_1[key_1] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_1, ActualArgs_1, "count">>;
                findFirst: () => <This_2, FormalArgs_2 extends import("@prisma/client/runtime/library").Args<This_2, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_2 extends FormalArgs_2>(this: This_2, args?: { [key_2 in keyof ActualArgs_2]: key_2 extends keyof FormalArgs_2 ? ActualArgs_2[key_2] : never; } & (ActualArgs_2 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_2 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_2, ActualArgs_2, "findFirst">>;
                findFirstOrThrow: () => <This_3, FormalArgs_3 extends import("@prisma/client/runtime/library").Args<This_3, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_3 extends FormalArgs_3>(this: This_3, args?: { [key_3 in keyof ActualArgs_3]: key_3 extends keyof FormalArgs_3 ? ActualArgs_3[key_3] : never; } & (ActualArgs_3 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_3 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_3, ActualArgs_3, "findFirstOrThrow">>;
                findMany: () => <This_4, FormalArgs_4 extends import("@prisma/client/runtime/library").Args<This_4, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_4 extends FormalArgs_4>(this: This_4, args?: { [key_4 in keyof ActualArgs_4]: key_4 extends keyof FormalArgs_4 ? ActualArgs_4[key_4] : never; } & (ActualArgs_4 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_4 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_4, ActualArgs_4, "findMany">>;
                findUnique: () => <This_5, FormalArgs_5 extends import("@prisma/client/runtime/library").Args<This_5, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_5 extends FormalArgs_5>(this: This_5, args: { [key_5 in keyof ActualArgs_5]: key_5 extends keyof FormalArgs_5 ? ActualArgs_5[key_5] : never; } & (ActualArgs_5 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_5 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_5, ActualArgs_5, "findUnique">>;
                findUniqueOrThrow: () => <This_6, FormalArgs_6 extends import("@prisma/client/runtime/library").Args<This_6, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_6 extends FormalArgs_6>(this: This_6, args: { [key_6 in keyof ActualArgs_6]: key_6 extends keyof FormalArgs_6 ? ActualArgs_6[key_6] : never; } & (ActualArgs_6 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_6 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_6, ActualArgs_6, "findUniqueOrThrow">>;
                groupBy: () => <This_7, FormalArgs_7 extends import("@prisma/client/runtime/library").Args<This_7, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_7 extends FormalArgs_7>(this: This_7, args: { [key_7 in keyof ActualArgs_7]: key_7 extends keyof FormalArgs_7 ? ActualArgs_7[key_7] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_7, ActualArgs_7, "groupBy">>;
            };
            orders: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This_1, FormalArgs_1 extends import("@prisma/client/runtime/library").Args<This_1, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_1 extends FormalArgs_1>(this: This_1, args?: { [key_1 in keyof ActualArgs_1]: key_1 extends keyof FormalArgs_1 ? ActualArgs_1[key_1] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_1, ActualArgs_1, "count">>;
                findFirst: () => <This_2, FormalArgs_2 extends import("@prisma/client/runtime/library").Args<This_2, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_2 extends FormalArgs_2>(this: This_2, args?: { [key_2 in keyof ActualArgs_2]: key_2 extends keyof FormalArgs_2 ? ActualArgs_2[key_2] : never; } & (ActualArgs_2 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_2 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_2, ActualArgs_2, "findFirst">>;
                findFirstOrThrow: () => <This_3, FormalArgs_3 extends import("@prisma/client/runtime/library").Args<This_3, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_3 extends FormalArgs_3>(this: This_3, args?: { [key_3 in keyof ActualArgs_3]: key_3 extends keyof FormalArgs_3 ? ActualArgs_3[key_3] : never; } & (ActualArgs_3 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_3 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_3, ActualArgs_3, "findFirstOrThrow">>;
                findMany: () => <This_4, FormalArgs_4 extends import("@prisma/client/runtime/library").Args<This_4, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_4 extends FormalArgs_4>(this: This_4, args?: { [key_4 in keyof ActualArgs_4]: key_4 extends keyof FormalArgs_4 ? ActualArgs_4[key_4] : never; } & (ActualArgs_4 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_4 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_4, ActualArgs_4, "findMany">>;
                findUnique: () => <This_5, FormalArgs_5 extends import("@prisma/client/runtime/library").Args<This_5, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_5 extends FormalArgs_5>(this: This_5, args: { [key_5 in keyof ActualArgs_5]: key_5 extends keyof FormalArgs_5 ? ActualArgs_5[key_5] : never; } & (ActualArgs_5 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_5 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_5, ActualArgs_5, "findUnique">>;
                findUniqueOrThrow: () => <This_6, FormalArgs_6 extends import("@prisma/client/runtime/library").Args<This_6, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_6 extends FormalArgs_6>(this: This_6, args: { [key_6 in keyof ActualArgs_6]: key_6 extends keyof FormalArgs_6 ? ActualArgs_6[key_6] : never; } & (ActualArgs_6 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_6 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_6, ActualArgs_6, "findUniqueOrThrow">>;
                groupBy: () => <This_7, FormalArgs_7 extends import("@prisma/client/runtime/library").Args<This_7, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_7 extends FormalArgs_7>(this: This_7, args: { [key_7 in keyof ActualArgs_7]: key_7 extends keyof FormalArgs_7 ? ActualArgs_7[key_7] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_7, ActualArgs_7, "groupBy">>;
            };
            pages: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This_1, FormalArgs_1 extends import("@prisma/client/runtime/library").Args<This_1, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_1 extends FormalArgs_1>(this: This_1, args?: { [key_1 in keyof ActualArgs_1]: key_1 extends keyof FormalArgs_1 ? ActualArgs_1[key_1] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_1, ActualArgs_1, "count">>;
                findFirst: () => <This_2, FormalArgs_2 extends import("@prisma/client/runtime/library").Args<This_2, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_2 extends FormalArgs_2>(this: This_2, args?: { [key_2 in keyof ActualArgs_2]: key_2 extends keyof FormalArgs_2 ? ActualArgs_2[key_2] : never; } & (ActualArgs_2 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_2 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_2, ActualArgs_2, "findFirst">>;
                findFirstOrThrow: () => <This_3, FormalArgs_3 extends import("@prisma/client/runtime/library").Args<This_3, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_3 extends FormalArgs_3>(this: This_3, args?: { [key_3 in keyof ActualArgs_3]: key_3 extends keyof FormalArgs_3 ? ActualArgs_3[key_3] : never; } & (ActualArgs_3 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_3 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_3, ActualArgs_3, "findFirstOrThrow">>;
                findMany: () => <This_4, FormalArgs_4 extends import("@prisma/client/runtime/library").Args<This_4, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_4 extends FormalArgs_4>(this: This_4, args?: { [key_4 in keyof ActualArgs_4]: key_4 extends keyof FormalArgs_4 ? ActualArgs_4[key_4] : never; } & (ActualArgs_4 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_4 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_4, ActualArgs_4, "findMany">>;
                findUnique: () => <This_5, FormalArgs_5 extends import("@prisma/client/runtime/library").Args<This_5, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_5 extends FormalArgs_5>(this: This_5, args: { [key_5 in keyof ActualArgs_5]: key_5 extends keyof FormalArgs_5 ? ActualArgs_5[key_5] : never; } & (ActualArgs_5 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_5 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_5, ActualArgs_5, "findUnique">>;
                findUniqueOrThrow: () => <This_6, FormalArgs_6 extends import("@prisma/client/runtime/library").Args<This_6, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_6 extends FormalArgs_6>(this: This_6, args: { [key_6 in keyof ActualArgs_6]: key_6 extends keyof FormalArgs_6 ? ActualArgs_6[key_6] : never; } & (ActualArgs_6 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_6 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_6, ActualArgs_6, "findUniqueOrThrow">>;
                groupBy: () => <This_7, FormalArgs_7 extends import("@prisma/client/runtime/library").Args<This_7, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_7 extends FormalArgs_7>(this: This_7, args: { [key_7 in keyof ActualArgs_7]: key_7 extends keyof FormalArgs_7 ? ActualArgs_7[key_7] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_7, ActualArgs_7, "groupBy">>;
            };
            payment_intents: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This_1, FormalArgs_1 extends import("@prisma/client/runtime/library").Args<This_1, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_1 extends FormalArgs_1>(this: This_1, args?: { [key_1 in keyof ActualArgs_1]: key_1 extends keyof FormalArgs_1 ? ActualArgs_1[key_1] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_1, ActualArgs_1, "count">>;
                findFirst: () => <This_2, FormalArgs_2 extends import("@prisma/client/runtime/library").Args<This_2, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_2 extends FormalArgs_2>(this: This_2, args?: { [key_2 in keyof ActualArgs_2]: key_2 extends keyof FormalArgs_2 ? ActualArgs_2[key_2] : never; } & (ActualArgs_2 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_2 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_2, ActualArgs_2, "findFirst">>;
                findFirstOrThrow: () => <This_3, FormalArgs_3 extends import("@prisma/client/runtime/library").Args<This_3, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_3 extends FormalArgs_3>(this: This_3, args?: { [key_3 in keyof ActualArgs_3]: key_3 extends keyof FormalArgs_3 ? ActualArgs_3[key_3] : never; } & (ActualArgs_3 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_3 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_3, ActualArgs_3, "findFirstOrThrow">>;
                findMany: () => <This_4, FormalArgs_4 extends import("@prisma/client/runtime/library").Args<This_4, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_4 extends FormalArgs_4>(this: This_4, args?: { [key_4 in keyof ActualArgs_4]: key_4 extends keyof FormalArgs_4 ? ActualArgs_4[key_4] : never; } & (ActualArgs_4 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_4 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_4, ActualArgs_4, "findMany">>;
                findUnique: () => <This_5, FormalArgs_5 extends import("@prisma/client/runtime/library").Args<This_5, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_5 extends FormalArgs_5>(this: This_5, args: { [key_5 in keyof ActualArgs_5]: key_5 extends keyof FormalArgs_5 ? ActualArgs_5[key_5] : never; } & (ActualArgs_5 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_5 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_5, ActualArgs_5, "findUnique">>;
                findUniqueOrThrow: () => <This_6, FormalArgs_6 extends import("@prisma/client/runtime/library").Args<This_6, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_6 extends FormalArgs_6>(this: This_6, args: { [key_6 in keyof ActualArgs_6]: key_6 extends keyof FormalArgs_6 ? ActualArgs_6[key_6] : never; } & (ActualArgs_6 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_6 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_6, ActualArgs_6, "findUniqueOrThrow">>;
                groupBy: () => <This_7, FormalArgs_7 extends import("@prisma/client/runtime/library").Args<This_7, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_7 extends FormalArgs_7>(this: This_7, args: { [key_7 in keyof ActualArgs_7]: key_7 extends keyof FormalArgs_7 ? ActualArgs_7[key_7] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_7, ActualArgs_7, "groupBy">>;
            };
            payments: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This_1, FormalArgs_1 extends import("@prisma/client/runtime/library").Args<This_1, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_1 extends FormalArgs_1>(this: This_1, args?: { [key_1 in keyof ActualArgs_1]: key_1 extends keyof FormalArgs_1 ? ActualArgs_1[key_1] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_1, ActualArgs_1, "count">>;
                findFirst: () => <This_2, FormalArgs_2 extends import("@prisma/client/runtime/library").Args<This_2, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_2 extends FormalArgs_2>(this: This_2, args?: { [key_2 in keyof ActualArgs_2]: key_2 extends keyof FormalArgs_2 ? ActualArgs_2[key_2] : never; } & (ActualArgs_2 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_2 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_2, ActualArgs_2, "findFirst">>;
                findFirstOrThrow: () => <This_3, FormalArgs_3 extends import("@prisma/client/runtime/library").Args<This_3, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_3 extends FormalArgs_3>(this: This_3, args?: { [key_3 in keyof ActualArgs_3]: key_3 extends keyof FormalArgs_3 ? ActualArgs_3[key_3] : never; } & (ActualArgs_3 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_3 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_3, ActualArgs_3, "findFirstOrThrow">>;
                findMany: () => <This_4, FormalArgs_4 extends import("@prisma/client/runtime/library").Args<This_4, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_4 extends FormalArgs_4>(this: This_4, args?: { [key_4 in keyof ActualArgs_4]: key_4 extends keyof FormalArgs_4 ? ActualArgs_4[key_4] : never; } & (ActualArgs_4 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_4 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_4, ActualArgs_4, "findMany">>;
                findUnique: () => <This_5, FormalArgs_5 extends import("@prisma/client/runtime/library").Args<This_5, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_5 extends FormalArgs_5>(this: This_5, args: { [key_5 in keyof ActualArgs_5]: key_5 extends keyof FormalArgs_5 ? ActualArgs_5[key_5] : never; } & (ActualArgs_5 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_5 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_5, ActualArgs_5, "findUnique">>;
                findUniqueOrThrow: () => <This_6, FormalArgs_6 extends import("@prisma/client/runtime/library").Args<This_6, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_6 extends FormalArgs_6>(this: This_6, args: { [key_6 in keyof ActualArgs_6]: key_6 extends keyof FormalArgs_6 ? ActualArgs_6[key_6] : never; } & (ActualArgs_6 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_6 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_6, ActualArgs_6, "findUniqueOrThrow">>;
                groupBy: () => <This_7, FormalArgs_7 extends import("@prisma/client/runtime/library").Args<This_7, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_7 extends FormalArgs_7>(this: This_7, args: { [key_7 in keyof ActualArgs_7]: key_7 extends keyof FormalArgs_7 ? ActualArgs_7[key_7] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_7, ActualArgs_7, "groupBy">>;
            };
            point_transactions: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This_1, FormalArgs_1 extends import("@prisma/client/runtime/library").Args<This_1, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_1 extends FormalArgs_1>(this: This_1, args?: { [key_1 in keyof ActualArgs_1]: key_1 extends keyof FormalArgs_1 ? ActualArgs_1[key_1] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_1, ActualArgs_1, "count">>;
                findFirst: () => <This_2, FormalArgs_2 extends import("@prisma/client/runtime/library").Args<This_2, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_2 extends FormalArgs_2>(this: This_2, args?: { [key_2 in keyof ActualArgs_2]: key_2 extends keyof FormalArgs_2 ? ActualArgs_2[key_2] : never; } & (ActualArgs_2 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_2 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_2, ActualArgs_2, "findFirst">>;
                findFirstOrThrow: () => <This_3, FormalArgs_3 extends import("@prisma/client/runtime/library").Args<This_3, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_3 extends FormalArgs_3>(this: This_3, args?: { [key_3 in keyof ActualArgs_3]: key_3 extends keyof FormalArgs_3 ? ActualArgs_3[key_3] : never; } & (ActualArgs_3 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_3 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_3, ActualArgs_3, "findFirstOrThrow">>;
                findMany: () => <This_4, FormalArgs_4 extends import("@prisma/client/runtime/library").Args<This_4, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_4 extends FormalArgs_4>(this: This_4, args?: { [key_4 in keyof ActualArgs_4]: key_4 extends keyof FormalArgs_4 ? ActualArgs_4[key_4] : never; } & (ActualArgs_4 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_4 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_4, ActualArgs_4, "findMany">>;
                findUnique: () => <This_5, FormalArgs_5 extends import("@prisma/client/runtime/library").Args<This_5, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_5 extends FormalArgs_5>(this: This_5, args: { [key_5 in keyof ActualArgs_5]: key_5 extends keyof FormalArgs_5 ? ActualArgs_5[key_5] : never; } & (ActualArgs_5 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_5 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_5, ActualArgs_5, "findUnique">>;
                findUniqueOrThrow: () => <This_6, FormalArgs_6 extends import("@prisma/client/runtime/library").Args<This_6, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_6 extends FormalArgs_6>(this: This_6, args: { [key_6 in keyof ActualArgs_6]: key_6 extends keyof FormalArgs_6 ? ActualArgs_6[key_6] : never; } & (ActualArgs_6 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_6 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_6, ActualArgs_6, "findUniqueOrThrow">>;
                groupBy: () => <This_7, FormalArgs_7 extends import("@prisma/client/runtime/library").Args<This_7, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_7 extends FormalArgs_7>(this: This_7, args: { [key_7 in keyof ActualArgs_7]: key_7 extends keyof FormalArgs_7 ? ActualArgs_7[key_7] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_7, ActualArgs_7, "groupBy">>;
            };
            policies: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This_1, FormalArgs_1 extends import("@prisma/client/runtime/library").Args<This_1, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_1 extends FormalArgs_1>(this: This_1, args?: { [key_1 in keyof ActualArgs_1]: key_1 extends keyof FormalArgs_1 ? ActualArgs_1[key_1] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_1, ActualArgs_1, "count">>;
                findFirst: () => <This_2, FormalArgs_2 extends import("@prisma/client/runtime/library").Args<This_2, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_2 extends FormalArgs_2>(this: This_2, args?: { [key_2 in keyof ActualArgs_2]: key_2 extends keyof FormalArgs_2 ? ActualArgs_2[key_2] : never; } & (ActualArgs_2 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_2 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_2, ActualArgs_2, "findFirst">>;
                findFirstOrThrow: () => <This_3, FormalArgs_3 extends import("@prisma/client/runtime/library").Args<This_3, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_3 extends FormalArgs_3>(this: This_3, args?: { [key_3 in keyof ActualArgs_3]: key_3 extends keyof FormalArgs_3 ? ActualArgs_3[key_3] : never; } & (ActualArgs_3 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_3 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_3, ActualArgs_3, "findFirstOrThrow">>;
                findMany: () => <This_4, FormalArgs_4 extends import("@prisma/client/runtime/library").Args<This_4, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_4 extends FormalArgs_4>(this: This_4, args?: { [key_4 in keyof ActualArgs_4]: key_4 extends keyof FormalArgs_4 ? ActualArgs_4[key_4] : never; } & (ActualArgs_4 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_4 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_4, ActualArgs_4, "findMany">>;
                findUnique: () => <This_5, FormalArgs_5 extends import("@prisma/client/runtime/library").Args<This_5, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_5 extends FormalArgs_5>(this: This_5, args: { [key_5 in keyof ActualArgs_5]: key_5 extends keyof FormalArgs_5 ? ActualArgs_5[key_5] : never; } & (ActualArgs_5 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_5 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_5, ActualArgs_5, "findUnique">>;
                findUniqueOrThrow: () => <This_6, FormalArgs_6 extends import("@prisma/client/runtime/library").Args<This_6, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_6 extends FormalArgs_6>(this: This_6, args: { [key_6 in keyof ActualArgs_6]: key_6 extends keyof FormalArgs_6 ? ActualArgs_6[key_6] : never; } & (ActualArgs_6 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_6 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_6, ActualArgs_6, "findUniqueOrThrow">>;
                groupBy: () => <This_7, FormalArgs_7 extends import("@prisma/client/runtime/library").Args<This_7, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_7 extends FormalArgs_7>(this: This_7, args: { [key_7 in keyof ActualArgs_7]: key_7 extends keyof FormalArgs_7 ? ActualArgs_7[key_7] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_7, ActualArgs_7, "groupBy">>;
            };
            product_review_reports: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This_1, FormalArgs_1 extends import("@prisma/client/runtime/library").Args<This_1, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_1 extends FormalArgs_1>(this: This_1, args?: { [key_1 in keyof ActualArgs_1]: key_1 extends keyof FormalArgs_1 ? ActualArgs_1[key_1] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_1, ActualArgs_1, "count">>;
                findFirst: () => <This_2, FormalArgs_2 extends import("@prisma/client/runtime/library").Args<This_2, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_2 extends FormalArgs_2>(this: This_2, args?: { [key_2 in keyof ActualArgs_2]: key_2 extends keyof FormalArgs_2 ? ActualArgs_2[key_2] : never; } & (ActualArgs_2 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_2 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_2, ActualArgs_2, "findFirst">>;
                findFirstOrThrow: () => <This_3, FormalArgs_3 extends import("@prisma/client/runtime/library").Args<This_3, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_3 extends FormalArgs_3>(this: This_3, args?: { [key_3 in keyof ActualArgs_3]: key_3 extends keyof FormalArgs_3 ? ActualArgs_3[key_3] : never; } & (ActualArgs_3 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_3 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_3, ActualArgs_3, "findFirstOrThrow">>;
                findMany: () => <This_4, FormalArgs_4 extends import("@prisma/client/runtime/library").Args<This_4, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_4 extends FormalArgs_4>(this: This_4, args?: { [key_4 in keyof ActualArgs_4]: key_4 extends keyof FormalArgs_4 ? ActualArgs_4[key_4] : never; } & (ActualArgs_4 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_4 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_4, ActualArgs_4, "findMany">>;
                findUnique: () => <This_5, FormalArgs_5 extends import("@prisma/client/runtime/library").Args<This_5, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_5 extends FormalArgs_5>(this: This_5, args: { [key_5 in keyof ActualArgs_5]: key_5 extends keyof FormalArgs_5 ? ActualArgs_5[key_5] : never; } & (ActualArgs_5 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_5 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_5, ActualArgs_5, "findUnique">>;
                findUniqueOrThrow: () => <This_6, FormalArgs_6 extends import("@prisma/client/runtime/library").Args<This_6, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_6 extends FormalArgs_6>(this: This_6, args: { [key_6 in keyof ActualArgs_6]: key_6 extends keyof FormalArgs_6 ? ActualArgs_6[key_6] : never; } & (ActualArgs_6 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_6 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_6, ActualArgs_6, "findUniqueOrThrow">>;
                groupBy: () => <This_7, FormalArgs_7 extends import("@prisma/client/runtime/library").Args<This_7, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_7 extends FormalArgs_7>(this: This_7, args: { [key_7 in keyof ActualArgs_7]: key_7 extends keyof FormalArgs_7 ? ActualArgs_7[key_7] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_7, ActualArgs_7, "groupBy">>;
            };
            product_review_votes: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This_1, FormalArgs_1 extends import("@prisma/client/runtime/library").Args<This_1, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_1 extends FormalArgs_1>(this: This_1, args?: { [key_1 in keyof ActualArgs_1]: key_1 extends keyof FormalArgs_1 ? ActualArgs_1[key_1] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_1, ActualArgs_1, "count">>;
                findFirst: () => <This_2, FormalArgs_2 extends import("@prisma/client/runtime/library").Args<This_2, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_2 extends FormalArgs_2>(this: This_2, args?: { [key_2 in keyof ActualArgs_2]: key_2 extends keyof FormalArgs_2 ? ActualArgs_2[key_2] : never; } & (ActualArgs_2 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_2 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_2, ActualArgs_2, "findFirst">>;
                findFirstOrThrow: () => <This_3, FormalArgs_3 extends import("@prisma/client/runtime/library").Args<This_3, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_3 extends FormalArgs_3>(this: This_3, args?: { [key_3 in keyof ActualArgs_3]: key_3 extends keyof FormalArgs_3 ? ActualArgs_3[key_3] : never; } & (ActualArgs_3 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_3 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_3, ActualArgs_3, "findFirstOrThrow">>;
                findMany: () => <This_4, FormalArgs_4 extends import("@prisma/client/runtime/library").Args<This_4, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_4 extends FormalArgs_4>(this: This_4, args?: { [key_4 in keyof ActualArgs_4]: key_4 extends keyof FormalArgs_4 ? ActualArgs_4[key_4] : never; } & (ActualArgs_4 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_4 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_4, ActualArgs_4, "findMany">>;
                findUnique: () => <This_5, FormalArgs_5 extends import("@prisma/client/runtime/library").Args<This_5, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_5 extends FormalArgs_5>(this: This_5, args: { [key_5 in keyof ActualArgs_5]: key_5 extends keyof FormalArgs_5 ? ActualArgs_5[key_5] : never; } & (ActualArgs_5 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_5 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_5, ActualArgs_5, "findUnique">>;
                findUniqueOrThrow: () => <This_6, FormalArgs_6 extends import("@prisma/client/runtime/library").Args<This_6, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_6 extends FormalArgs_6>(this: This_6, args: { [key_6 in keyof ActualArgs_6]: key_6 extends keyof FormalArgs_6 ? ActualArgs_6[key_6] : never; } & (ActualArgs_6 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_6 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_6, ActualArgs_6, "findUniqueOrThrow">>;
                groupBy: () => <This_7, FormalArgs_7 extends import("@prisma/client/runtime/library").Args<This_7, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_7 extends FormalArgs_7>(this: This_7, args: { [key_7 in keyof ActualArgs_7]: key_7 extends keyof FormalArgs_7 ? ActualArgs_7[key_7] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_7, ActualArgs_7, "groupBy">>;
            };
            product_reviews: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This_1, FormalArgs_1 extends import("@prisma/client/runtime/library").Args<This_1, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_1 extends FormalArgs_1>(this: This_1, args?: { [key_1 in keyof ActualArgs_1]: key_1 extends keyof FormalArgs_1 ? ActualArgs_1[key_1] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_1, ActualArgs_1, "count">>;
                findFirst: () => <This_2, FormalArgs_2 extends import("@prisma/client/runtime/library").Args<This_2, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_2 extends FormalArgs_2>(this: This_2, args?: { [key_2 in keyof ActualArgs_2]: key_2 extends keyof FormalArgs_2 ? ActualArgs_2[key_2] : never; } & (ActualArgs_2 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_2 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_2, ActualArgs_2, "findFirst">>;
                findFirstOrThrow: () => <This_3, FormalArgs_3 extends import("@prisma/client/runtime/library").Args<This_3, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_3 extends FormalArgs_3>(this: This_3, args?: { [key_3 in keyof ActualArgs_3]: key_3 extends keyof FormalArgs_3 ? ActualArgs_3[key_3] : never; } & (ActualArgs_3 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_3 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_3, ActualArgs_3, "findFirstOrThrow">>;
                findMany: () => <This_4, FormalArgs_4 extends import("@prisma/client/runtime/library").Args<This_4, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_4 extends FormalArgs_4>(this: This_4, args?: { [key_4 in keyof ActualArgs_4]: key_4 extends keyof FormalArgs_4 ? ActualArgs_4[key_4] : never; } & (ActualArgs_4 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_4 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_4, ActualArgs_4, "findMany">>;
                findUnique: () => <This_5, FormalArgs_5 extends import("@prisma/client/runtime/library").Args<This_5, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_5 extends FormalArgs_5>(this: This_5, args: { [key_5 in keyof ActualArgs_5]: key_5 extends keyof FormalArgs_5 ? ActualArgs_5[key_5] : never; } & (ActualArgs_5 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_5 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_5, ActualArgs_5, "findUnique">>;
                findUniqueOrThrow: () => <This_6, FormalArgs_6 extends import("@prisma/client/runtime/library").Args<This_6, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_6 extends FormalArgs_6>(this: This_6, args: { [key_6 in keyof ActualArgs_6]: key_6 extends keyof FormalArgs_6 ? ActualArgs_6[key_6] : never; } & (ActualArgs_6 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_6 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_6, ActualArgs_6, "findUniqueOrThrow">>;
                groupBy: () => <This_7, FormalArgs_7 extends import("@prisma/client/runtime/library").Args<This_7, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_7 extends FormalArgs_7>(this: This_7, args: { [key_7 in keyof ActualArgs_7]: key_7 extends keyof FormalArgs_7 ? ActualArgs_7[key_7] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_7, ActualArgs_7, "groupBy">>;
            };
            product_views: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This_1, FormalArgs_1 extends import("@prisma/client/runtime/library").Args<This_1, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_1 extends FormalArgs_1>(this: This_1, args?: { [key_1 in keyof ActualArgs_1]: key_1 extends keyof FormalArgs_1 ? ActualArgs_1[key_1] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_1, ActualArgs_1, "count">>;
                findFirst: () => <This_2, FormalArgs_2 extends import("@prisma/client/runtime/library").Args<This_2, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_2 extends FormalArgs_2>(this: This_2, args?: { [key_2 in keyof ActualArgs_2]: key_2 extends keyof FormalArgs_2 ? ActualArgs_2[key_2] : never; } & (ActualArgs_2 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_2 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_2, ActualArgs_2, "findFirst">>;
                findFirstOrThrow: () => <This_3, FormalArgs_3 extends import("@prisma/client/runtime/library").Args<This_3, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_3 extends FormalArgs_3>(this: This_3, args?: { [key_3 in keyof ActualArgs_3]: key_3 extends keyof FormalArgs_3 ? ActualArgs_3[key_3] : never; } & (ActualArgs_3 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_3 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_3, ActualArgs_3, "findFirstOrThrow">>;
                findMany: () => <This_4, FormalArgs_4 extends import("@prisma/client/runtime/library").Args<This_4, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_4 extends FormalArgs_4>(this: This_4, args?: { [key_4 in keyof ActualArgs_4]: key_4 extends keyof FormalArgs_4 ? ActualArgs_4[key_4] : never; } & (ActualArgs_4 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_4 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_4, ActualArgs_4, "findMany">>;
                findUnique: () => <This_5, FormalArgs_5 extends import("@prisma/client/runtime/library").Args<This_5, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_5 extends FormalArgs_5>(this: This_5, args: { [key_5 in keyof ActualArgs_5]: key_5 extends keyof FormalArgs_5 ? ActualArgs_5[key_5] : never; } & (ActualArgs_5 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_5 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_5, ActualArgs_5, "findUnique">>;
                findUniqueOrThrow: () => <This_6, FormalArgs_6 extends import("@prisma/client/runtime/library").Args<This_6, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_6 extends FormalArgs_6>(this: This_6, args: { [key_6 in keyof ActualArgs_6]: key_6 extends keyof FormalArgs_6 ? ActualArgs_6[key_6] : never; } & (ActualArgs_6 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_6 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_6, ActualArgs_6, "findUniqueOrThrow">>;
                groupBy: () => <This_7, FormalArgs_7 extends import("@prisma/client/runtime/library").Args<This_7, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_7 extends FormalArgs_7>(this: This_7, args: { [key_7 in keyof ActualArgs_7]: key_7 extends keyof FormalArgs_7 ? ActualArgs_7[key_7] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_7, ActualArgs_7, "groupBy">>;
            };
            products: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This_1, FormalArgs_1 extends import("@prisma/client/runtime/library").Args<This_1, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_1 extends FormalArgs_1>(this: This_1, args?: { [key_1 in keyof ActualArgs_1]: key_1 extends keyof FormalArgs_1 ? ActualArgs_1[key_1] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_1, ActualArgs_1, "count">>;
                findFirst: () => <This_2, FormalArgs_2 extends import("@prisma/client/runtime/library").Args<This_2, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_2 extends FormalArgs_2>(this: This_2, args?: { [key_2 in keyof ActualArgs_2]: key_2 extends keyof FormalArgs_2 ? ActualArgs_2[key_2] : never; } & (ActualArgs_2 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_2 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_2, ActualArgs_2, "findFirst">>;
                findFirstOrThrow: () => <This_3, FormalArgs_3 extends import("@prisma/client/runtime/library").Args<This_3, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_3 extends FormalArgs_3>(this: This_3, args?: { [key_3 in keyof ActualArgs_3]: key_3 extends keyof FormalArgs_3 ? ActualArgs_3[key_3] : never; } & (ActualArgs_3 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_3 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_3, ActualArgs_3, "findFirstOrThrow">>;
                findMany: () => <This_4, FormalArgs_4 extends import("@prisma/client/runtime/library").Args<This_4, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_4 extends FormalArgs_4>(this: This_4, args?: { [key_4 in keyof ActualArgs_4]: key_4 extends keyof FormalArgs_4 ? ActualArgs_4[key_4] : never; } & (ActualArgs_4 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_4 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_4, ActualArgs_4, "findMany">>;
                findUnique: () => <This_5, FormalArgs_5 extends import("@prisma/client/runtime/library").Args<This_5, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_5 extends FormalArgs_5>(this: This_5, args: { [key_5 in keyof ActualArgs_5]: key_5 extends keyof FormalArgs_5 ? ActualArgs_5[key_5] : never; } & (ActualArgs_5 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_5 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_5, ActualArgs_5, "findUnique">>;
                findUniqueOrThrow: () => <This_6, FormalArgs_6 extends import("@prisma/client/runtime/library").Args<This_6, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_6 extends FormalArgs_6>(this: This_6, args: { [key_6 in keyof ActualArgs_6]: key_6 extends keyof FormalArgs_6 ? ActualArgs_6[key_6] : never; } & (ActualArgs_6 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_6 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_6, ActualArgs_6, "findUniqueOrThrow">>;
                groupBy: () => <This_7, FormalArgs_7 extends import("@prisma/client/runtime/library").Args<This_7, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_7 extends FormalArgs_7>(this: This_7, args: { [key_7 in keyof ActualArgs_7]: key_7 extends keyof FormalArgs_7 ? ActualArgs_7[key_7] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_7, ActualArgs_7, "groupBy">>;
            };
            projects: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This_1, FormalArgs_1 extends import("@prisma/client/runtime/library").Args<This_1, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_1 extends FormalArgs_1>(this: This_1, args?: { [key_1 in keyof ActualArgs_1]: key_1 extends keyof FormalArgs_1 ? ActualArgs_1[key_1] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_1, ActualArgs_1, "count">>;
                findFirst: () => <This_2, FormalArgs_2 extends import("@prisma/client/runtime/library").Args<This_2, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_2 extends FormalArgs_2>(this: This_2, args?: { [key_2 in keyof ActualArgs_2]: key_2 extends keyof FormalArgs_2 ? ActualArgs_2[key_2] : never; } & (ActualArgs_2 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_2 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_2, ActualArgs_2, "findFirst">>;
                findFirstOrThrow: () => <This_3, FormalArgs_3 extends import("@prisma/client/runtime/library").Args<This_3, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_3 extends FormalArgs_3>(this: This_3, args?: { [key_3 in keyof ActualArgs_3]: key_3 extends keyof FormalArgs_3 ? ActualArgs_3[key_3] : never; } & (ActualArgs_3 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_3 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_3, ActualArgs_3, "findFirstOrThrow">>;
                findMany: () => <This_4, FormalArgs_4 extends import("@prisma/client/runtime/library").Args<This_4, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_4 extends FormalArgs_4>(this: This_4, args?: { [key_4 in keyof ActualArgs_4]: key_4 extends keyof FormalArgs_4 ? ActualArgs_4[key_4] : never; } & (ActualArgs_4 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_4 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_4, ActualArgs_4, "findMany">>;
                findUnique: () => <This_5, FormalArgs_5 extends import("@prisma/client/runtime/library").Args<This_5, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_5 extends FormalArgs_5>(this: This_5, args: { [key_5 in keyof ActualArgs_5]: key_5 extends keyof FormalArgs_5 ? ActualArgs_5[key_5] : never; } & (ActualArgs_5 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_5 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_5, ActualArgs_5, "findUnique">>;
                findUniqueOrThrow: () => <This_6, FormalArgs_6 extends import("@prisma/client/runtime/library").Args<This_6, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_6 extends FormalArgs_6>(this: This_6, args: { [key_6 in keyof ActualArgs_6]: key_6 extends keyof FormalArgs_6 ? ActualArgs_6[key_6] : never; } & (ActualArgs_6 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_6 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_6, ActualArgs_6, "findUniqueOrThrow">>;
                groupBy: () => <This_7, FormalArgs_7 extends import("@prisma/client/runtime/library").Args<This_7, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_7 extends FormalArgs_7>(this: This_7, args: { [key_7 in keyof ActualArgs_7]: key_7 extends keyof FormalArgs_7 ? ActualArgs_7[key_7] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_7, ActualArgs_7, "groupBy">>;
            };
            promotions: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This_1, FormalArgs_1 extends import("@prisma/client/runtime/library").Args<This_1, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_1 extends FormalArgs_1>(this: This_1, args?: { [key_1 in keyof ActualArgs_1]: key_1 extends keyof FormalArgs_1 ? ActualArgs_1[key_1] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_1, ActualArgs_1, "count">>;
                findFirst: () => <This_2, FormalArgs_2 extends import("@prisma/client/runtime/library").Args<This_2, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_2 extends FormalArgs_2>(this: This_2, args?: { [key_2 in keyof ActualArgs_2]: key_2 extends keyof FormalArgs_2 ? ActualArgs_2[key_2] : never; } & (ActualArgs_2 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_2 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_2, ActualArgs_2, "findFirst">>;
                findFirstOrThrow: () => <This_3, FormalArgs_3 extends import("@prisma/client/runtime/library").Args<This_3, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_3 extends FormalArgs_3>(this: This_3, args?: { [key_3 in keyof ActualArgs_3]: key_3 extends keyof FormalArgs_3 ? ActualArgs_3[key_3] : never; } & (ActualArgs_3 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_3 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_3, ActualArgs_3, "findFirstOrThrow">>;
                findMany: () => <This_4, FormalArgs_4 extends import("@prisma/client/runtime/library").Args<This_4, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_4 extends FormalArgs_4>(this: This_4, args?: { [key_4 in keyof ActualArgs_4]: key_4 extends keyof FormalArgs_4 ? ActualArgs_4[key_4] : never; } & (ActualArgs_4 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_4 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_4, ActualArgs_4, "findMany">>;
                findUnique: () => <This_5, FormalArgs_5 extends import("@prisma/client/runtime/library").Args<This_5, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_5 extends FormalArgs_5>(this: This_5, args: { [key_5 in keyof ActualArgs_5]: key_5 extends keyof FormalArgs_5 ? ActualArgs_5[key_5] : never; } & (ActualArgs_5 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_5 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_5, ActualArgs_5, "findUnique">>;
                findUniqueOrThrow: () => <This_6, FormalArgs_6 extends import("@prisma/client/runtime/library").Args<This_6, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_6 extends FormalArgs_6>(this: This_6, args: { [key_6 in keyof ActualArgs_6]: key_6 extends keyof FormalArgs_6 ? ActualArgs_6[key_6] : never; } & (ActualArgs_6 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_6 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_6, ActualArgs_6, "findUniqueOrThrow">>;
                groupBy: () => <This_7, FormalArgs_7 extends import("@prisma/client/runtime/library").Args<This_7, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_7 extends FormalArgs_7>(this: This_7, args: { [key_7 in keyof ActualArgs_7]: key_7 extends keyof FormalArgs_7 ? ActualArgs_7[key_7] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_7, ActualArgs_7, "groupBy">>;
            };
            redemption_history: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This_1, FormalArgs_1 extends import("@prisma/client/runtime/library").Args<This_1, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_1 extends FormalArgs_1>(this: This_1, args?: { [key_1 in keyof ActualArgs_1]: key_1 extends keyof FormalArgs_1 ? ActualArgs_1[key_1] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_1, ActualArgs_1, "count">>;
                findFirst: () => <This_2, FormalArgs_2 extends import("@prisma/client/runtime/library").Args<This_2, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_2 extends FormalArgs_2>(this: This_2, args?: { [key_2 in keyof ActualArgs_2]: key_2 extends keyof FormalArgs_2 ? ActualArgs_2[key_2] : never; } & (ActualArgs_2 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_2 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_2, ActualArgs_2, "findFirst">>;
                findFirstOrThrow: () => <This_3, FormalArgs_3 extends import("@prisma/client/runtime/library").Args<This_3, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_3 extends FormalArgs_3>(this: This_3, args?: { [key_3 in keyof ActualArgs_3]: key_3 extends keyof FormalArgs_3 ? ActualArgs_3[key_3] : never; } & (ActualArgs_3 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_3 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_3, ActualArgs_3, "findFirstOrThrow">>;
                findMany: () => <This_4, FormalArgs_4 extends import("@prisma/client/runtime/library").Args<This_4, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_4 extends FormalArgs_4>(this: This_4, args?: { [key_4 in keyof ActualArgs_4]: key_4 extends keyof FormalArgs_4 ? ActualArgs_4[key_4] : never; } & (ActualArgs_4 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_4 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_4, ActualArgs_4, "findMany">>;
                findUnique: () => <This_5, FormalArgs_5 extends import("@prisma/client/runtime/library").Args<This_5, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_5 extends FormalArgs_5>(this: This_5, args: { [key_5 in keyof ActualArgs_5]: key_5 extends keyof FormalArgs_5 ? ActualArgs_5[key_5] : never; } & (ActualArgs_5 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_5 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_5, ActualArgs_5, "findUnique">>;
                findUniqueOrThrow: () => <This_6, FormalArgs_6 extends import("@prisma/client/runtime/library").Args<This_6, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_6 extends FormalArgs_6>(this: This_6, args: { [key_6 in keyof ActualArgs_6]: key_6 extends keyof FormalArgs_6 ? ActualArgs_6[key_6] : never; } & (ActualArgs_6 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_6 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_6, ActualArgs_6, "findUniqueOrThrow">>;
                groupBy: () => <This_7, FormalArgs_7 extends import("@prisma/client/runtime/library").Args<This_7, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_7 extends FormalArgs_7>(this: This_7, args: { [key_7 in keyof ActualArgs_7]: key_7 extends keyof FormalArgs_7 ? ActualArgs_7[key_7] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_7, ActualArgs_7, "groupBy">>;
            };
            refunds: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This_1, FormalArgs_1 extends import("@prisma/client/runtime/library").Args<This_1, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_1 extends FormalArgs_1>(this: This_1, args?: { [key_1 in keyof ActualArgs_1]: key_1 extends keyof FormalArgs_1 ? ActualArgs_1[key_1] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_1, ActualArgs_1, "count">>;
                findFirst: () => <This_2, FormalArgs_2 extends import("@prisma/client/runtime/library").Args<This_2, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_2 extends FormalArgs_2>(this: This_2, args?: { [key_2 in keyof ActualArgs_2]: key_2 extends keyof FormalArgs_2 ? ActualArgs_2[key_2] : never; } & (ActualArgs_2 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_2 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_2, ActualArgs_2, "findFirst">>;
                findFirstOrThrow: () => <This_3, FormalArgs_3 extends import("@prisma/client/runtime/library").Args<This_3, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_3 extends FormalArgs_3>(this: This_3, args?: { [key_3 in keyof ActualArgs_3]: key_3 extends keyof FormalArgs_3 ? ActualArgs_3[key_3] : never; } & (ActualArgs_3 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_3 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_3, ActualArgs_3, "findFirstOrThrow">>;
                findMany: () => <This_4, FormalArgs_4 extends import("@prisma/client/runtime/library").Args<This_4, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_4 extends FormalArgs_4>(this: This_4, args?: { [key_4 in keyof ActualArgs_4]: key_4 extends keyof FormalArgs_4 ? ActualArgs_4[key_4] : never; } & (ActualArgs_4 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_4 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_4, ActualArgs_4, "findMany">>;
                findUnique: () => <This_5, FormalArgs_5 extends import("@prisma/client/runtime/library").Args<This_5, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_5 extends FormalArgs_5>(this: This_5, args: { [key_5 in keyof ActualArgs_5]: key_5 extends keyof FormalArgs_5 ? ActualArgs_5[key_5] : never; } & (ActualArgs_5 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_5 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_5, ActualArgs_5, "findUnique">>;
                findUniqueOrThrow: () => <This_6, FormalArgs_6 extends import("@prisma/client/runtime/library").Args<This_6, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_6 extends FormalArgs_6>(this: This_6, args: { [key_6 in keyof ActualArgs_6]: key_6 extends keyof FormalArgs_6 ? ActualArgs_6[key_6] : never; } & (ActualArgs_6 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_6 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_6, ActualArgs_6, "findUniqueOrThrow">>;
                groupBy: () => <This_7, FormalArgs_7 extends import("@prisma/client/runtime/library").Args<This_7, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_7 extends FormalArgs_7>(this: This_7, args: { [key_7 in keyof ActualArgs_7]: key_7 extends keyof FormalArgs_7 ? ActualArgs_7[key_7] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_7, ActualArgs_7, "groupBy">>;
            };
            search_queries: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This_1, FormalArgs_1 extends import("@prisma/client/runtime/library").Args<This_1, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_1 extends FormalArgs_1>(this: This_1, args?: { [key_1 in keyof ActualArgs_1]: key_1 extends keyof FormalArgs_1 ? ActualArgs_1[key_1] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_1, ActualArgs_1, "count">>;
                findFirst: () => <This_2, FormalArgs_2 extends import("@prisma/client/runtime/library").Args<This_2, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_2 extends FormalArgs_2>(this: This_2, args?: { [key_2 in keyof ActualArgs_2]: key_2 extends keyof FormalArgs_2 ? ActualArgs_2[key_2] : never; } & (ActualArgs_2 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_2 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_2, ActualArgs_2, "findFirst">>;
                findFirstOrThrow: () => <This_3, FormalArgs_3 extends import("@prisma/client/runtime/library").Args<This_3, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_3 extends FormalArgs_3>(this: This_3, args?: { [key_3 in keyof ActualArgs_3]: key_3 extends keyof FormalArgs_3 ? ActualArgs_3[key_3] : never; } & (ActualArgs_3 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_3 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_3, ActualArgs_3, "findFirstOrThrow">>;
                findMany: () => <This_4, FormalArgs_4 extends import("@prisma/client/runtime/library").Args<This_4, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_4 extends FormalArgs_4>(this: This_4, args?: { [key_4 in keyof ActualArgs_4]: key_4 extends keyof FormalArgs_4 ? ActualArgs_4[key_4] : never; } & (ActualArgs_4 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_4 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_4, ActualArgs_4, "findMany">>;
                findUnique: () => <This_5, FormalArgs_5 extends import("@prisma/client/runtime/library").Args<This_5, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_5 extends FormalArgs_5>(this: This_5, args: { [key_5 in keyof ActualArgs_5]: key_5 extends keyof FormalArgs_5 ? ActualArgs_5[key_5] : never; } & (ActualArgs_5 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_5 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_5, ActualArgs_5, "findUnique">>;
                findUniqueOrThrow: () => <This_6, FormalArgs_6 extends import("@prisma/client/runtime/library").Args<This_6, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_6 extends FormalArgs_6>(this: This_6, args: { [key_6 in keyof ActualArgs_6]: key_6 extends keyof FormalArgs_6 ? ActualArgs_6[key_6] : never; } & (ActualArgs_6 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_6 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_6, ActualArgs_6, "findUniqueOrThrow">>;
                groupBy: () => <This_7, FormalArgs_7 extends import("@prisma/client/runtime/library").Args<This_7, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_7 extends FormalArgs_7>(this: This_7, args: { [key_7 in keyof ActualArgs_7]: key_7 extends keyof FormalArgs_7 ? ActualArgs_7[key_7] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_7, ActualArgs_7, "groupBy">>;
            };
            service_booking_items: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This_1, FormalArgs_1 extends import("@prisma/client/runtime/library").Args<This_1, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_1 extends FormalArgs_1>(this: This_1, args?: { [key_1 in keyof ActualArgs_1]: key_1 extends keyof FormalArgs_1 ? ActualArgs_1[key_1] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_1, ActualArgs_1, "count">>;
                findFirst: () => <This_2, FormalArgs_2 extends import("@prisma/client/runtime/library").Args<This_2, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_2 extends FormalArgs_2>(this: This_2, args?: { [key_2 in keyof ActualArgs_2]: key_2 extends keyof FormalArgs_2 ? ActualArgs_2[key_2] : never; } & (ActualArgs_2 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_2 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_2, ActualArgs_2, "findFirst">>;
                findFirstOrThrow: () => <This_3, FormalArgs_3 extends import("@prisma/client/runtime/library").Args<This_3, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_3 extends FormalArgs_3>(this: This_3, args?: { [key_3 in keyof ActualArgs_3]: key_3 extends keyof FormalArgs_3 ? ActualArgs_3[key_3] : never; } & (ActualArgs_3 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_3 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_3, ActualArgs_3, "findFirstOrThrow">>;
                findMany: () => <This_4, FormalArgs_4 extends import("@prisma/client/runtime/library").Args<This_4, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_4 extends FormalArgs_4>(this: This_4, args?: { [key_4 in keyof ActualArgs_4]: key_4 extends keyof FormalArgs_4 ? ActualArgs_4[key_4] : never; } & (ActualArgs_4 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_4 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_4, ActualArgs_4, "findMany">>;
                findUnique: () => <This_5, FormalArgs_5 extends import("@prisma/client/runtime/library").Args<This_5, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_5 extends FormalArgs_5>(this: This_5, args: { [key_5 in keyof ActualArgs_5]: key_5 extends keyof FormalArgs_5 ? ActualArgs_5[key_5] : never; } & (ActualArgs_5 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_5 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_5, ActualArgs_5, "findUnique">>;
                findUniqueOrThrow: () => <This_6, FormalArgs_6 extends import("@prisma/client/runtime/library").Args<This_6, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_6 extends FormalArgs_6>(this: This_6, args: { [key_6 in keyof ActualArgs_6]: key_6 extends keyof FormalArgs_6 ? ActualArgs_6[key_6] : never; } & (ActualArgs_6 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_6 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_6, ActualArgs_6, "findUniqueOrThrow">>;
                groupBy: () => <This_7, FormalArgs_7 extends import("@prisma/client/runtime/library").Args<This_7, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_7 extends FormalArgs_7>(this: This_7, args: { [key_7 in keyof ActualArgs_7]: key_7 extends keyof FormalArgs_7 ? ActualArgs_7[key_7] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_7, ActualArgs_7, "groupBy">>;
            };
            service_bookings: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This_1, FormalArgs_1 extends import("@prisma/client/runtime/library").Args<This_1, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_1 extends FormalArgs_1>(this: This_1, args?: { [key_1 in keyof ActualArgs_1]: key_1 extends keyof FormalArgs_1 ? ActualArgs_1[key_1] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_1, ActualArgs_1, "count">>;
                findFirst: () => <This_2, FormalArgs_2 extends import("@prisma/client/runtime/library").Args<This_2, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_2 extends FormalArgs_2>(this: This_2, args?: { [key_2 in keyof ActualArgs_2]: key_2 extends keyof FormalArgs_2 ? ActualArgs_2[key_2] : never; } & (ActualArgs_2 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_2 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_2, ActualArgs_2, "findFirst">>;
                findFirstOrThrow: () => <This_3, FormalArgs_3 extends import("@prisma/client/runtime/library").Args<This_3, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_3 extends FormalArgs_3>(this: This_3, args?: { [key_3 in keyof ActualArgs_3]: key_3 extends keyof FormalArgs_3 ? ActualArgs_3[key_3] : never; } & (ActualArgs_3 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_3 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_3, ActualArgs_3, "findFirstOrThrow">>;
                findMany: () => <This_4, FormalArgs_4 extends import("@prisma/client/runtime/library").Args<This_4, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_4 extends FormalArgs_4>(this: This_4, args?: { [key_4 in keyof ActualArgs_4]: key_4 extends keyof FormalArgs_4 ? ActualArgs_4[key_4] : never; } & (ActualArgs_4 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_4 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_4, ActualArgs_4, "findMany">>;
                findUnique: () => <This_5, FormalArgs_5 extends import("@prisma/client/runtime/library").Args<This_5, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_5 extends FormalArgs_5>(this: This_5, args: { [key_5 in keyof ActualArgs_5]: key_5 extends keyof FormalArgs_5 ? ActualArgs_5[key_5] : never; } & (ActualArgs_5 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_5 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_5, ActualArgs_5, "findUnique">>;
                findUniqueOrThrow: () => <This_6, FormalArgs_6 extends import("@prisma/client/runtime/library").Args<This_6, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_6 extends FormalArgs_6>(this: This_6, args: { [key_6 in keyof ActualArgs_6]: key_6 extends keyof FormalArgs_6 ? ActualArgs_6[key_6] : never; } & (ActualArgs_6 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_6 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_6, ActualArgs_6, "findUniqueOrThrow">>;
                groupBy: () => <This_7, FormalArgs_7 extends import("@prisma/client/runtime/library").Args<This_7, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_7 extends FormalArgs_7>(this: This_7, args: { [key_7 in keyof ActualArgs_7]: key_7 extends keyof FormalArgs_7 ? ActualArgs_7[key_7] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_7, ActualArgs_7, "groupBy">>;
            };
            service_items: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This_1, FormalArgs_1 extends import("@prisma/client/runtime/library").Args<This_1, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_1 extends FormalArgs_1>(this: This_1, args?: { [key_1 in keyof ActualArgs_1]: key_1 extends keyof FormalArgs_1 ? ActualArgs_1[key_1] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_1, ActualArgs_1, "count">>;
                findFirst: () => <This_2, FormalArgs_2 extends import("@prisma/client/runtime/library").Args<This_2, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_2 extends FormalArgs_2>(this: This_2, args?: { [key_2 in keyof ActualArgs_2]: key_2 extends keyof FormalArgs_2 ? ActualArgs_2[key_2] : never; } & (ActualArgs_2 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_2 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_2, ActualArgs_2, "findFirst">>;
                findFirstOrThrow: () => <This_3, FormalArgs_3 extends import("@prisma/client/runtime/library").Args<This_3, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_3 extends FormalArgs_3>(this: This_3, args?: { [key_3 in keyof ActualArgs_3]: key_3 extends keyof FormalArgs_3 ? ActualArgs_3[key_3] : never; } & (ActualArgs_3 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_3 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_3, ActualArgs_3, "findFirstOrThrow">>;
                findMany: () => <This_4, FormalArgs_4 extends import("@prisma/client/runtime/library").Args<This_4, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_4 extends FormalArgs_4>(this: This_4, args?: { [key_4 in keyof ActualArgs_4]: key_4 extends keyof FormalArgs_4 ? ActualArgs_4[key_4] : never; } & (ActualArgs_4 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_4 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_4, ActualArgs_4, "findMany">>;
                findUnique: () => <This_5, FormalArgs_5 extends import("@prisma/client/runtime/library").Args<This_5, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_5 extends FormalArgs_5>(this: This_5, args: { [key_5 in keyof ActualArgs_5]: key_5 extends keyof FormalArgs_5 ? ActualArgs_5[key_5] : never; } & (ActualArgs_5 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_5 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_5, ActualArgs_5, "findUnique">>;
                findUniqueOrThrow: () => <This_6, FormalArgs_6 extends import("@prisma/client/runtime/library").Args<This_6, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_6 extends FormalArgs_6>(this: This_6, args: { [key_6 in keyof ActualArgs_6]: key_6 extends keyof FormalArgs_6 ? ActualArgs_6[key_6] : never; } & (ActualArgs_6 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_6 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_6, ActualArgs_6, "findUniqueOrThrow">>;
                groupBy: () => <This_7, FormalArgs_7 extends import("@prisma/client/runtime/library").Args<This_7, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_7 extends FormalArgs_7>(this: This_7, args: { [key_7 in keyof ActualArgs_7]: key_7 extends keyof FormalArgs_7 ? ActualArgs_7[key_7] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_7, ActualArgs_7, "groupBy">>;
            };
            service_payments: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This_1, FormalArgs_1 extends import("@prisma/client/runtime/library").Args<This_1, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_1 extends FormalArgs_1>(this: This_1, args?: { [key_1 in keyof ActualArgs_1]: key_1 extends keyof FormalArgs_1 ? ActualArgs_1[key_1] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_1, ActualArgs_1, "count">>;
                findFirst: () => <This_2, FormalArgs_2 extends import("@prisma/client/runtime/library").Args<This_2, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_2 extends FormalArgs_2>(this: This_2, args?: { [key_2 in keyof ActualArgs_2]: key_2 extends keyof FormalArgs_2 ? ActualArgs_2[key_2] : never; } & (ActualArgs_2 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_2 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_2, ActualArgs_2, "findFirst">>;
                findFirstOrThrow: () => <This_3, FormalArgs_3 extends import("@prisma/client/runtime/library").Args<This_3, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_3 extends FormalArgs_3>(this: This_3, args?: { [key_3 in keyof ActualArgs_3]: key_3 extends keyof FormalArgs_3 ? ActualArgs_3[key_3] : never; } & (ActualArgs_3 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_3 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_3, ActualArgs_3, "findFirstOrThrow">>;
                findMany: () => <This_4, FormalArgs_4 extends import("@prisma/client/runtime/library").Args<This_4, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_4 extends FormalArgs_4>(this: This_4, args?: { [key_4 in keyof ActualArgs_4]: key_4 extends keyof FormalArgs_4 ? ActualArgs_4[key_4] : never; } & (ActualArgs_4 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_4 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_4, ActualArgs_4, "findMany">>;
                findUnique: () => <This_5, FormalArgs_5 extends import("@prisma/client/runtime/library").Args<This_5, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_5 extends FormalArgs_5>(this: This_5, args: { [key_5 in keyof ActualArgs_5]: key_5 extends keyof FormalArgs_5 ? ActualArgs_5[key_5] : never; } & (ActualArgs_5 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_5 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_5, ActualArgs_5, "findUnique">>;
                findUniqueOrThrow: () => <This_6, FormalArgs_6 extends import("@prisma/client/runtime/library").Args<This_6, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_6 extends FormalArgs_6>(this: This_6, args: { [key_6 in keyof ActualArgs_6]: key_6 extends keyof FormalArgs_6 ? ActualArgs_6[key_6] : never; } & (ActualArgs_6 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_6 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_6, ActualArgs_6, "findUniqueOrThrow">>;
                groupBy: () => <This_7, FormalArgs_7 extends import("@prisma/client/runtime/library").Args<This_7, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_7 extends FormalArgs_7>(this: This_7, args: { [key_7 in keyof ActualArgs_7]: key_7 extends keyof FormalArgs_7 ? ActualArgs_7[key_7] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_7, ActualArgs_7, "groupBy">>;
            };
            service_status_history: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This_1, FormalArgs_1 extends import("@prisma/client/runtime/library").Args<This_1, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_1 extends FormalArgs_1>(this: This_1, args?: { [key_1 in keyof ActualArgs_1]: key_1 extends keyof FormalArgs_1 ? ActualArgs_1[key_1] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_1, ActualArgs_1, "count">>;
                findFirst: () => <This_2, FormalArgs_2 extends import("@prisma/client/runtime/library").Args<This_2, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_2 extends FormalArgs_2>(this: This_2, args?: { [key_2 in keyof ActualArgs_2]: key_2 extends keyof FormalArgs_2 ? ActualArgs_2[key_2] : never; } & (ActualArgs_2 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_2 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_2, ActualArgs_2, "findFirst">>;
                findFirstOrThrow: () => <This_3, FormalArgs_3 extends import("@prisma/client/runtime/library").Args<This_3, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_3 extends FormalArgs_3>(this: This_3, args?: { [key_3 in keyof ActualArgs_3]: key_3 extends keyof FormalArgs_3 ? ActualArgs_3[key_3] : never; } & (ActualArgs_3 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_3 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_3, ActualArgs_3, "findFirstOrThrow">>;
                findMany: () => <This_4, FormalArgs_4 extends import("@prisma/client/runtime/library").Args<This_4, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_4 extends FormalArgs_4>(this: This_4, args?: { [key_4 in keyof ActualArgs_4]: key_4 extends keyof FormalArgs_4 ? ActualArgs_4[key_4] : never; } & (ActualArgs_4 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_4 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_4, ActualArgs_4, "findMany">>;
                findUnique: () => <This_5, FormalArgs_5 extends import("@prisma/client/runtime/library").Args<This_5, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_5 extends FormalArgs_5>(this: This_5, args: { [key_5 in keyof ActualArgs_5]: key_5 extends keyof FormalArgs_5 ? ActualArgs_5[key_5] : never; } & (ActualArgs_5 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_5 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_5, ActualArgs_5, "findUnique">>;
                findUniqueOrThrow: () => <This_6, FormalArgs_6 extends import("@prisma/client/runtime/library").Args<This_6, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_6 extends FormalArgs_6>(this: This_6, args: { [key_6 in keyof ActualArgs_6]: key_6 extends keyof FormalArgs_6 ? ActualArgs_6[key_6] : never; } & (ActualArgs_6 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_6 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_6, ActualArgs_6, "findUniqueOrThrow">>;
                groupBy: () => <This_7, FormalArgs_7 extends import("@prisma/client/runtime/library").Args<This_7, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_7 extends FormalArgs_7>(this: This_7, args: { [key_7 in keyof ActualArgs_7]: key_7 extends keyof FormalArgs_7 ? ActualArgs_7[key_7] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_7, ActualArgs_7, "groupBy">>;
            };
            service_types: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This_1, FormalArgs_1 extends import("@prisma/client/runtime/library").Args<This_1, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_1 extends FormalArgs_1>(this: This_1, args?: { [key_1 in keyof ActualArgs_1]: key_1 extends keyof FormalArgs_1 ? ActualArgs_1[key_1] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_1, ActualArgs_1, "count">>;
                findFirst: () => <This_2, FormalArgs_2 extends import("@prisma/client/runtime/library").Args<This_2, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_2 extends FormalArgs_2>(this: This_2, args?: { [key_2 in keyof ActualArgs_2]: key_2 extends keyof FormalArgs_2 ? ActualArgs_2[key_2] : never; } & (ActualArgs_2 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_2 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_2, ActualArgs_2, "findFirst">>;
                findFirstOrThrow: () => <This_3, FormalArgs_3 extends import("@prisma/client/runtime/library").Args<This_3, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_3 extends FormalArgs_3>(this: This_3, args?: { [key_3 in keyof ActualArgs_3]: key_3 extends keyof FormalArgs_3 ? ActualArgs_3[key_3] : never; } & (ActualArgs_3 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_3 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_3, ActualArgs_3, "findFirstOrThrow">>;
                findMany: () => <This_4, FormalArgs_4 extends import("@prisma/client/runtime/library").Args<This_4, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_4 extends FormalArgs_4>(this: This_4, args?: { [key_4 in keyof ActualArgs_4]: key_4 extends keyof FormalArgs_4 ? ActualArgs_4[key_4] : never; } & (ActualArgs_4 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_4 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_4, ActualArgs_4, "findMany">>;
                findUnique: () => <This_5, FormalArgs_5 extends import("@prisma/client/runtime/library").Args<This_5, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_5 extends FormalArgs_5>(this: This_5, args: { [key_5 in keyof ActualArgs_5]: key_5 extends keyof FormalArgs_5 ? ActualArgs_5[key_5] : never; } & (ActualArgs_5 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_5 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_5, ActualArgs_5, "findUnique">>;
                findUniqueOrThrow: () => <This_6, FormalArgs_6 extends import("@prisma/client/runtime/library").Args<This_6, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_6 extends FormalArgs_6>(this: This_6, args: { [key_6 in keyof ActualArgs_6]: key_6 extends keyof FormalArgs_6 ? ActualArgs_6[key_6] : never; } & (ActualArgs_6 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_6 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_6, ActualArgs_6, "findUniqueOrThrow">>;
                groupBy: () => <This_7, FormalArgs_7 extends import("@prisma/client/runtime/library").Args<This_7, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_7 extends FormalArgs_7>(this: This_7, args: { [key_7 in keyof ActualArgs_7]: key_7 extends keyof FormalArgs_7 ? ActualArgs_7[key_7] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_7, ActualArgs_7, "groupBy">>;
            };
            service_views: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This_1, FormalArgs_1 extends import("@prisma/client/runtime/library").Args<This_1, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_1 extends FormalArgs_1>(this: This_1, args?: { [key_1 in keyof ActualArgs_1]: key_1 extends keyof FormalArgs_1 ? ActualArgs_1[key_1] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_1, ActualArgs_1, "count">>;
                findFirst: () => <This_2, FormalArgs_2 extends import("@prisma/client/runtime/library").Args<This_2, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_2 extends FormalArgs_2>(this: This_2, args?: { [key_2 in keyof ActualArgs_2]: key_2 extends keyof FormalArgs_2 ? ActualArgs_2[key_2] : never; } & (ActualArgs_2 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_2 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_2, ActualArgs_2, "findFirst">>;
                findFirstOrThrow: () => <This_3, FormalArgs_3 extends import("@prisma/client/runtime/library").Args<This_3, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_3 extends FormalArgs_3>(this: This_3, args?: { [key_3 in keyof ActualArgs_3]: key_3 extends keyof FormalArgs_3 ? ActualArgs_3[key_3] : never; } & (ActualArgs_3 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_3 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_3, ActualArgs_3, "findFirstOrThrow">>;
                findMany: () => <This_4, FormalArgs_4 extends import("@prisma/client/runtime/library").Args<This_4, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_4 extends FormalArgs_4>(this: This_4, args?: { [key_4 in keyof ActualArgs_4]: key_4 extends keyof FormalArgs_4 ? ActualArgs_4[key_4] : never; } & (ActualArgs_4 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_4 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_4, ActualArgs_4, "findMany">>;
                findUnique: () => <This_5, FormalArgs_5 extends import("@prisma/client/runtime/library").Args<This_5, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_5 extends FormalArgs_5>(this: This_5, args: { [key_5 in keyof ActualArgs_5]: key_5 extends keyof FormalArgs_5 ? ActualArgs_5[key_5] : never; } & (ActualArgs_5 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_5 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_5, ActualArgs_5, "findUnique">>;
                findUniqueOrThrow: () => <This_6, FormalArgs_6 extends import("@prisma/client/runtime/library").Args<This_6, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_6 extends FormalArgs_6>(this: This_6, args: { [key_6 in keyof ActualArgs_6]: key_6 extends keyof FormalArgs_6 ? ActualArgs_6[key_6] : never; } & (ActualArgs_6 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_6 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_6, ActualArgs_6, "findUniqueOrThrow">>;
                groupBy: () => <This_7, FormalArgs_7 extends import("@prisma/client/runtime/library").Args<This_7, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_7 extends FormalArgs_7>(this: This_7, args: { [key_7 in keyof ActualArgs_7]: key_7 extends keyof FormalArgs_7 ? ActualArgs_7[key_7] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_7, ActualArgs_7, "groupBy">>;
            };
            services: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This_1, FormalArgs_1 extends import("@prisma/client/runtime/library").Args<This_1, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_1 extends FormalArgs_1>(this: This_1, args?: { [key_1 in keyof ActualArgs_1]: key_1 extends keyof FormalArgs_1 ? ActualArgs_1[key_1] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_1, ActualArgs_1, "count">>;
                findFirst: () => <This_2, FormalArgs_2 extends import("@prisma/client/runtime/library").Args<This_2, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_2 extends FormalArgs_2>(this: This_2, args?: { [key_2 in keyof ActualArgs_2]: key_2 extends keyof FormalArgs_2 ? ActualArgs_2[key_2] : never; } & (ActualArgs_2 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_2 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_2, ActualArgs_2, "findFirst">>;
                findFirstOrThrow: () => <This_3, FormalArgs_3 extends import("@prisma/client/runtime/library").Args<This_3, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_3 extends FormalArgs_3>(this: This_3, args?: { [key_3 in keyof ActualArgs_3]: key_3 extends keyof FormalArgs_3 ? ActualArgs_3[key_3] : never; } & (ActualArgs_3 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_3 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_3, ActualArgs_3, "findFirstOrThrow">>;
                findMany: () => <This_4, FormalArgs_4 extends import("@prisma/client/runtime/library").Args<This_4, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_4 extends FormalArgs_4>(this: This_4, args?: { [key_4 in keyof ActualArgs_4]: key_4 extends keyof FormalArgs_4 ? ActualArgs_4[key_4] : never; } & (ActualArgs_4 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_4 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_4, ActualArgs_4, "findMany">>;
                findUnique: () => <This_5, FormalArgs_5 extends import("@prisma/client/runtime/library").Args<This_5, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_5 extends FormalArgs_5>(this: This_5, args: { [key_5 in keyof ActualArgs_5]: key_5 extends keyof FormalArgs_5 ? ActualArgs_5[key_5] : never; } & (ActualArgs_5 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_5 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_5, ActualArgs_5, "findUnique">>;
                findUniqueOrThrow: () => <This_6, FormalArgs_6 extends import("@prisma/client/runtime/library").Args<This_6, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_6 extends FormalArgs_6>(this: This_6, args: { [key_6 in keyof ActualArgs_6]: key_6 extends keyof FormalArgs_6 ? ActualArgs_6[key_6] : never; } & (ActualArgs_6 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_6 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_6, ActualArgs_6, "findUniqueOrThrow">>;
                groupBy: () => <This_7, FormalArgs_7 extends import("@prisma/client/runtime/library").Args<This_7, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_7 extends FormalArgs_7>(this: This_7, args: { [key_7 in keyof ActualArgs_7]: key_7 extends keyof FormalArgs_7 ? ActualArgs_7[key_7] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_7, ActualArgs_7, "groupBy">>;
            };
            site_settings: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This_1, FormalArgs_1 extends import("@prisma/client/runtime/library").Args<This_1, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_1 extends FormalArgs_1>(this: This_1, args?: { [key_1 in keyof ActualArgs_1]: key_1 extends keyof FormalArgs_1 ? ActualArgs_1[key_1] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_1, ActualArgs_1, "count">>;
                findFirst: () => <This_2, FormalArgs_2 extends import("@prisma/client/runtime/library").Args<This_2, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_2 extends FormalArgs_2>(this: This_2, args?: { [key_2 in keyof ActualArgs_2]: key_2 extends keyof FormalArgs_2 ? ActualArgs_2[key_2] : never; } & (ActualArgs_2 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_2 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_2, ActualArgs_2, "findFirst">>;
                findFirstOrThrow: () => <This_3, FormalArgs_3 extends import("@prisma/client/runtime/library").Args<This_3, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_3 extends FormalArgs_3>(this: This_3, args?: { [key_3 in keyof ActualArgs_3]: key_3 extends keyof FormalArgs_3 ? ActualArgs_3[key_3] : never; } & (ActualArgs_3 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_3 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_3, ActualArgs_3, "findFirstOrThrow">>;
                findMany: () => <This_4, FormalArgs_4 extends import("@prisma/client/runtime/library").Args<This_4, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_4 extends FormalArgs_4>(this: This_4, args?: { [key_4 in keyof ActualArgs_4]: key_4 extends keyof FormalArgs_4 ? ActualArgs_4[key_4] : never; } & (ActualArgs_4 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_4 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_4, ActualArgs_4, "findMany">>;
                findUnique: () => <This_5, FormalArgs_5 extends import("@prisma/client/runtime/library").Args<This_5, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_5 extends FormalArgs_5>(this: This_5, args: { [key_5 in keyof ActualArgs_5]: key_5 extends keyof FormalArgs_5 ? ActualArgs_5[key_5] : never; } & (ActualArgs_5 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_5 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_5, ActualArgs_5, "findUnique">>;
                findUniqueOrThrow: () => <This_6, FormalArgs_6 extends import("@prisma/client/runtime/library").Args<This_6, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_6 extends FormalArgs_6>(this: This_6, args: { [key_6 in keyof ActualArgs_6]: key_6 extends keyof FormalArgs_6 ? ActualArgs_6[key_6] : never; } & (ActualArgs_6 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_6 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_6, ActualArgs_6, "findUniqueOrThrow">>;
                groupBy: () => <This_7, FormalArgs_7 extends import("@prisma/client/runtime/library").Args<This_7, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_7 extends FormalArgs_7>(this: This_7, args: { [key_7 in keyof ActualArgs_7]: key_7 extends keyof FormalArgs_7 ? ActualArgs_7[key_7] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_7, ActualArgs_7, "groupBy">>;
            };
            site_stats: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This_1, FormalArgs_1 extends import("@prisma/client/runtime/library").Args<This_1, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_1 extends FormalArgs_1>(this: This_1, args?: { [key_1 in keyof ActualArgs_1]: key_1 extends keyof FormalArgs_1 ? ActualArgs_1[key_1] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_1, ActualArgs_1, "count">>;
                findFirst: () => <This_2, FormalArgs_2 extends import("@prisma/client/runtime/library").Args<This_2, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_2 extends FormalArgs_2>(this: This_2, args?: { [key_2 in keyof ActualArgs_2]: key_2 extends keyof FormalArgs_2 ? ActualArgs_2[key_2] : never; } & (ActualArgs_2 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_2 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_2, ActualArgs_2, "findFirst">>;
                findFirstOrThrow: () => <This_3, FormalArgs_3 extends import("@prisma/client/runtime/library").Args<This_3, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_3 extends FormalArgs_3>(this: This_3, args?: { [key_3 in keyof ActualArgs_3]: key_3 extends keyof FormalArgs_3 ? ActualArgs_3[key_3] : never; } & (ActualArgs_3 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_3 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_3, ActualArgs_3, "findFirstOrThrow">>;
                findMany: () => <This_4, FormalArgs_4 extends import("@prisma/client/runtime/library").Args<This_4, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_4 extends FormalArgs_4>(this: This_4, args?: { [key_4 in keyof ActualArgs_4]: key_4 extends keyof FormalArgs_4 ? ActualArgs_4[key_4] : never; } & (ActualArgs_4 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_4 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_4, ActualArgs_4, "findMany">>;
                findUnique: () => <This_5, FormalArgs_5 extends import("@prisma/client/runtime/library").Args<This_5, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_5 extends FormalArgs_5>(this: This_5, args: { [key_5 in keyof ActualArgs_5]: key_5 extends keyof FormalArgs_5 ? ActualArgs_5[key_5] : never; } & (ActualArgs_5 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_5 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_5, ActualArgs_5, "findUnique">>;
                findUniqueOrThrow: () => <This_6, FormalArgs_6 extends import("@prisma/client/runtime/library").Args<This_6, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_6 extends FormalArgs_6>(this: This_6, args: { [key_6 in keyof ActualArgs_6]: key_6 extends keyof FormalArgs_6 ? ActualArgs_6[key_6] : never; } & (ActualArgs_6 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_6 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_6, ActualArgs_6, "findUniqueOrThrow">>;
                groupBy: () => <This_7, FormalArgs_7 extends import("@prisma/client/runtime/library").Args<This_7, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_7 extends FormalArgs_7>(this: This_7, args: { [key_7 in keyof ActualArgs_7]: key_7 extends keyof FormalArgs_7 ? ActualArgs_7[key_7] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_7, ActualArgs_7, "groupBy">>;
            };
            software: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This_1, FormalArgs_1 extends import("@prisma/client/runtime/library").Args<This_1, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_1 extends FormalArgs_1>(this: This_1, args?: { [key_1 in keyof ActualArgs_1]: key_1 extends keyof FormalArgs_1 ? ActualArgs_1[key_1] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_1, ActualArgs_1, "count">>;
                findFirst: () => <This_2, FormalArgs_2 extends import("@prisma/client/runtime/library").Args<This_2, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_2 extends FormalArgs_2>(this: This_2, args?: { [key_2 in keyof ActualArgs_2]: key_2 extends keyof FormalArgs_2 ? ActualArgs_2[key_2] : never; } & (ActualArgs_2 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_2 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_2, ActualArgs_2, "findFirst">>;
                findFirstOrThrow: () => <This_3, FormalArgs_3 extends import("@prisma/client/runtime/library").Args<This_3, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_3 extends FormalArgs_3>(this: This_3, args?: { [key_3 in keyof ActualArgs_3]: key_3 extends keyof FormalArgs_3 ? ActualArgs_3[key_3] : never; } & (ActualArgs_3 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_3 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_3, ActualArgs_3, "findFirstOrThrow">>;
                findMany: () => <This_4, FormalArgs_4 extends import("@prisma/client/runtime/library").Args<This_4, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_4 extends FormalArgs_4>(this: This_4, args?: { [key_4 in keyof ActualArgs_4]: key_4 extends keyof FormalArgs_4 ? ActualArgs_4[key_4] : never; } & (ActualArgs_4 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_4 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_4, ActualArgs_4, "findMany">>;
                findUnique: () => <This_5, FormalArgs_5 extends import("@prisma/client/runtime/library").Args<This_5, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_5 extends FormalArgs_5>(this: This_5, args: { [key_5 in keyof ActualArgs_5]: key_5 extends keyof FormalArgs_5 ? ActualArgs_5[key_5] : never; } & (ActualArgs_5 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_5 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_5, ActualArgs_5, "findUnique">>;
                findUniqueOrThrow: () => <This_6, FormalArgs_6 extends import("@prisma/client/runtime/library").Args<This_6, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_6 extends FormalArgs_6>(this: This_6, args: { [key_6 in keyof ActualArgs_6]: key_6 extends keyof FormalArgs_6 ? ActualArgs_6[key_6] : never; } & (ActualArgs_6 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_6 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_6, ActualArgs_6, "findUniqueOrThrow">>;
                groupBy: () => <This_7, FormalArgs_7 extends import("@prisma/client/runtime/library").Args<This_7, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_7 extends FormalArgs_7>(this: This_7, args: { [key_7 in keyof ActualArgs_7]: key_7 extends keyof FormalArgs_7 ? ActualArgs_7[key_7] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_7, ActualArgs_7, "groupBy">>;
            };
            system_configs: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This_1, FormalArgs_1 extends import("@prisma/client/runtime/library").Args<This_1, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_1 extends FormalArgs_1>(this: This_1, args?: { [key_1 in keyof ActualArgs_1]: key_1 extends keyof FormalArgs_1 ? ActualArgs_1[key_1] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_1, ActualArgs_1, "count">>;
                findFirst: () => <This_2, FormalArgs_2 extends import("@prisma/client/runtime/library").Args<This_2, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_2 extends FormalArgs_2>(this: This_2, args?: { [key_2 in keyof ActualArgs_2]: key_2 extends keyof FormalArgs_2 ? ActualArgs_2[key_2] : never; } & (ActualArgs_2 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_2 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_2, ActualArgs_2, "findFirst">>;
                findFirstOrThrow: () => <This_3, FormalArgs_3 extends import("@prisma/client/runtime/library").Args<This_3, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_3 extends FormalArgs_3>(this: This_3, args?: { [key_3 in keyof ActualArgs_3]: key_3 extends keyof FormalArgs_3 ? ActualArgs_3[key_3] : never; } & (ActualArgs_3 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_3 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_3, ActualArgs_3, "findFirstOrThrow">>;
                findMany: () => <This_4, FormalArgs_4 extends import("@prisma/client/runtime/library").Args<This_4, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_4 extends FormalArgs_4>(this: This_4, args?: { [key_4 in keyof ActualArgs_4]: key_4 extends keyof FormalArgs_4 ? ActualArgs_4[key_4] : never; } & (ActualArgs_4 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_4 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_4, ActualArgs_4, "findMany">>;
                findUnique: () => <This_5, FormalArgs_5 extends import("@prisma/client/runtime/library").Args<This_5, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_5 extends FormalArgs_5>(this: This_5, args: { [key_5 in keyof ActualArgs_5]: key_5 extends keyof FormalArgs_5 ? ActualArgs_5[key_5] : never; } & (ActualArgs_5 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_5 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_5, ActualArgs_5, "findUnique">>;
                findUniqueOrThrow: () => <This_6, FormalArgs_6 extends import("@prisma/client/runtime/library").Args<This_6, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_6 extends FormalArgs_6>(this: This_6, args: { [key_6 in keyof ActualArgs_6]: key_6 extends keyof FormalArgs_6 ? ActualArgs_6[key_6] : never; } & (ActualArgs_6 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_6 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_6, ActualArgs_6, "findUniqueOrThrow">>;
                groupBy: () => <This_7, FormalArgs_7 extends import("@prisma/client/runtime/library").Args<This_7, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_7 extends FormalArgs_7>(this: This_7, args: { [key_7 in keyof ActualArgs_7]: key_7 extends keyof FormalArgs_7 ? ActualArgs_7[key_7] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_7, ActualArgs_7, "groupBy">>;
            };
            technician_schedules: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This_1, FormalArgs_1 extends import("@prisma/client/runtime/library").Args<This_1, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_1 extends FormalArgs_1>(this: This_1, args?: { [key_1 in keyof ActualArgs_1]: key_1 extends keyof FormalArgs_1 ? ActualArgs_1[key_1] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_1, ActualArgs_1, "count">>;
                findFirst: () => <This_2, FormalArgs_2 extends import("@prisma/client/runtime/library").Args<This_2, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_2 extends FormalArgs_2>(this: This_2, args?: { [key_2 in keyof ActualArgs_2]: key_2 extends keyof FormalArgs_2 ? ActualArgs_2[key_2] : never; } & (ActualArgs_2 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_2 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_2, ActualArgs_2, "findFirst">>;
                findFirstOrThrow: () => <This_3, FormalArgs_3 extends import("@prisma/client/runtime/library").Args<This_3, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_3 extends FormalArgs_3>(this: This_3, args?: { [key_3 in keyof ActualArgs_3]: key_3 extends keyof FormalArgs_3 ? ActualArgs_3[key_3] : never; } & (ActualArgs_3 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_3 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_3, ActualArgs_3, "findFirstOrThrow">>;
                findMany: () => <This_4, FormalArgs_4 extends import("@prisma/client/runtime/library").Args<This_4, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_4 extends FormalArgs_4>(this: This_4, args?: { [key_4 in keyof ActualArgs_4]: key_4 extends keyof FormalArgs_4 ? ActualArgs_4[key_4] : never; } & (ActualArgs_4 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_4 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_4, ActualArgs_4, "findMany">>;
                findUnique: () => <This_5, FormalArgs_5 extends import("@prisma/client/runtime/library").Args<This_5, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_5 extends FormalArgs_5>(this: This_5, args: { [key_5 in keyof ActualArgs_5]: key_5 extends keyof FormalArgs_5 ? ActualArgs_5[key_5] : never; } & (ActualArgs_5 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_5 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_5, ActualArgs_5, "findUnique">>;
                findUniqueOrThrow: () => <This_6, FormalArgs_6 extends import("@prisma/client/runtime/library").Args<This_6, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_6 extends FormalArgs_6>(this: This_6, args: { [key_6 in keyof ActualArgs_6]: key_6 extends keyof FormalArgs_6 ? ActualArgs_6[key_6] : never; } & (ActualArgs_6 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_6 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_6, ActualArgs_6, "findUniqueOrThrow">>;
                groupBy: () => <This_7, FormalArgs_7 extends import("@prisma/client/runtime/library").Args<This_7, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_7 extends FormalArgs_7>(this: This_7, args: { [key_7 in keyof ActualArgs_7]: key_7 extends keyof FormalArgs_7 ? ActualArgs_7[key_7] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_7, ActualArgs_7, "groupBy">>;
            };
            technicians: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This_1, FormalArgs_1 extends import("@prisma/client/runtime/library").Args<This_1, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_1 extends FormalArgs_1>(this: This_1, args?: { [key_1 in keyof ActualArgs_1]: key_1 extends keyof FormalArgs_1 ? ActualArgs_1[key_1] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_1, ActualArgs_1, "count">>;
                findFirst: () => <This_2, FormalArgs_2 extends import("@prisma/client/runtime/library").Args<This_2, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_2 extends FormalArgs_2>(this: This_2, args?: { [key_2 in keyof ActualArgs_2]: key_2 extends keyof FormalArgs_2 ? ActualArgs_2[key_2] : never; } & (ActualArgs_2 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_2 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_2, ActualArgs_2, "findFirst">>;
                findFirstOrThrow: () => <This_3, FormalArgs_3 extends import("@prisma/client/runtime/library").Args<This_3, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_3 extends FormalArgs_3>(this: This_3, args?: { [key_3 in keyof ActualArgs_3]: key_3 extends keyof FormalArgs_3 ? ActualArgs_3[key_3] : never; } & (ActualArgs_3 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_3 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_3, ActualArgs_3, "findFirstOrThrow">>;
                findMany: () => <This_4, FormalArgs_4 extends import("@prisma/client/runtime/library").Args<This_4, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_4 extends FormalArgs_4>(this: This_4, args?: { [key_4 in keyof ActualArgs_4]: key_4 extends keyof FormalArgs_4 ? ActualArgs_4[key_4] : never; } & (ActualArgs_4 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_4 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_4, ActualArgs_4, "findMany">>;
                findUnique: () => <This_5, FormalArgs_5 extends import("@prisma/client/runtime/library").Args<This_5, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_5 extends FormalArgs_5>(this: This_5, args: { [key_5 in keyof ActualArgs_5]: key_5 extends keyof FormalArgs_5 ? ActualArgs_5[key_5] : never; } & (ActualArgs_5 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_5 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_5, ActualArgs_5, "findUnique">>;
                findUniqueOrThrow: () => <This_6, FormalArgs_6 extends import("@prisma/client/runtime/library").Args<This_6, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_6 extends FormalArgs_6>(this: This_6, args: { [key_6 in keyof ActualArgs_6]: key_6 extends keyof FormalArgs_6 ? ActualArgs_6[key_6] : never; } & (ActualArgs_6 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_6 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_6, ActualArgs_6, "findUniqueOrThrow">>;
                groupBy: () => <This_7, FormalArgs_7 extends import("@prisma/client/runtime/library").Args<This_7, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_7 extends FormalArgs_7>(this: This_7, args: { [key_7 in keyof ActualArgs_7]: key_7 extends keyof FormalArgs_7 ? ActualArgs_7[key_7] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_7, ActualArgs_7, "groupBy">>;
            };
            testimonials: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This_1, FormalArgs_1 extends import("@prisma/client/runtime/library").Args<This_1, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_1 extends FormalArgs_1>(this: This_1, args?: { [key_1 in keyof ActualArgs_1]: key_1 extends keyof FormalArgs_1 ? ActualArgs_1[key_1] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_1, ActualArgs_1, "count">>;
                findFirst: () => <This_2, FormalArgs_2 extends import("@prisma/client/runtime/library").Args<This_2, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_2 extends FormalArgs_2>(this: This_2, args?: { [key_2 in keyof ActualArgs_2]: key_2 extends keyof FormalArgs_2 ? ActualArgs_2[key_2] : never; } & (ActualArgs_2 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_2 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_2, ActualArgs_2, "findFirst">>;
                findFirstOrThrow: () => <This_3, FormalArgs_3 extends import("@prisma/client/runtime/library").Args<This_3, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_3 extends FormalArgs_3>(this: This_3, args?: { [key_3 in keyof ActualArgs_3]: key_3 extends keyof FormalArgs_3 ? ActualArgs_3[key_3] : never; } & (ActualArgs_3 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_3 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_3, ActualArgs_3, "findFirstOrThrow">>;
                findMany: () => <This_4, FormalArgs_4 extends import("@prisma/client/runtime/library").Args<This_4, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_4 extends FormalArgs_4>(this: This_4, args?: { [key_4 in keyof ActualArgs_4]: key_4 extends keyof FormalArgs_4 ? ActualArgs_4[key_4] : never; } & (ActualArgs_4 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_4 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_4, ActualArgs_4, "findMany">>;
                findUnique: () => <This_5, FormalArgs_5 extends import("@prisma/client/runtime/library").Args<This_5, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_5 extends FormalArgs_5>(this: This_5, args: { [key_5 in keyof ActualArgs_5]: key_5 extends keyof FormalArgs_5 ? ActualArgs_5[key_5] : never; } & (ActualArgs_5 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_5 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_5, ActualArgs_5, "findUnique">>;
                findUniqueOrThrow: () => <This_6, FormalArgs_6 extends import("@prisma/client/runtime/library").Args<This_6, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_6 extends FormalArgs_6>(this: This_6, args: { [key_6 in keyof ActualArgs_6]: key_6 extends keyof FormalArgs_6 ? ActualArgs_6[key_6] : never; } & (ActualArgs_6 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_6 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_6, ActualArgs_6, "findUniqueOrThrow">>;
                groupBy: () => <This_7, FormalArgs_7 extends import("@prisma/client/runtime/library").Args<This_7, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_7 extends FormalArgs_7>(this: This_7, args: { [key_7 in keyof ActualArgs_7]: key_7 extends keyof FormalArgs_7 ? ActualArgs_7[key_7] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_7, ActualArgs_7, "groupBy">>;
            };
            users: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This_1, FormalArgs_1 extends import("@prisma/client/runtime/library").Args<This_1, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_1 extends FormalArgs_1>(this: This_1, args?: { [key_1 in keyof ActualArgs_1]: key_1 extends keyof FormalArgs_1 ? ActualArgs_1[key_1] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_1, ActualArgs_1, "count">>;
                findFirst: () => <This_2, FormalArgs_2 extends import("@prisma/client/runtime/library").Args<This_2, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_2 extends FormalArgs_2>(this: This_2, args?: { [key_2 in keyof ActualArgs_2]: key_2 extends keyof FormalArgs_2 ? ActualArgs_2[key_2] : never; } & (ActualArgs_2 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_2 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_2, ActualArgs_2, "findFirst">>;
                findFirstOrThrow: () => <This_3, FormalArgs_3 extends import("@prisma/client/runtime/library").Args<This_3, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_3 extends FormalArgs_3>(this: This_3, args?: { [key_3 in keyof ActualArgs_3]: key_3 extends keyof FormalArgs_3 ? ActualArgs_3[key_3] : never; } & (ActualArgs_3 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_3 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_3, ActualArgs_3, "findFirstOrThrow">>;
                findMany: () => <This_4, FormalArgs_4 extends import("@prisma/client/runtime/library").Args<This_4, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_4 extends FormalArgs_4>(this: This_4, args?: { [key_4 in keyof ActualArgs_4]: key_4 extends keyof FormalArgs_4 ? ActualArgs_4[key_4] : never; } & (ActualArgs_4 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_4 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_4, ActualArgs_4, "findMany">>;
                findUnique: () => <This_5, FormalArgs_5 extends import("@prisma/client/runtime/library").Args<This_5, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_5 extends FormalArgs_5>(this: This_5, args: { [key_5 in keyof ActualArgs_5]: key_5 extends keyof FormalArgs_5 ? ActualArgs_5[key_5] : never; } & (ActualArgs_5 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_5 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_5, ActualArgs_5, "findUnique">>;
                findUniqueOrThrow: () => <This_6, FormalArgs_6 extends import("@prisma/client/runtime/library").Args<This_6, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_6 extends FormalArgs_6>(this: This_6, args: { [key_6 in keyof ActualArgs_6]: key_6 extends keyof FormalArgs_6 ? ActualArgs_6[key_6] : never; } & (ActualArgs_6 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_6 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_6, ActualArgs_6, "findUniqueOrThrow">>;
                groupBy: () => <This_7, FormalArgs_7 extends import("@prisma/client/runtime/library").Args<This_7, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_7 extends FormalArgs_7>(this: This_7, args: { [key_7 in keyof ActualArgs_7]: key_7 extends keyof FormalArgs_7 ? ActualArgs_7[key_7] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_7, ActualArgs_7, "groupBy">>;
            };
            webhooks: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This_1, FormalArgs_1 extends import("@prisma/client/runtime/library").Args<This_1, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_1 extends FormalArgs_1>(this: This_1, args?: { [key_1 in keyof ActualArgs_1]: key_1 extends keyof FormalArgs_1 ? ActualArgs_1[key_1] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_1, ActualArgs_1, "count">>;
                findFirst: () => <This_2, FormalArgs_2 extends import("@prisma/client/runtime/library").Args<This_2, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_2 extends FormalArgs_2>(this: This_2, args?: { [key_2 in keyof ActualArgs_2]: key_2 extends keyof FormalArgs_2 ? ActualArgs_2[key_2] : never; } & (ActualArgs_2 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_2 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_2, ActualArgs_2, "findFirst">>;
                findFirstOrThrow: () => <This_3, FormalArgs_3 extends import("@prisma/client/runtime/library").Args<This_3, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_3 extends FormalArgs_3>(this: This_3, args?: { [key_3 in keyof ActualArgs_3]: key_3 extends keyof FormalArgs_3 ? ActualArgs_3[key_3] : never; } & (ActualArgs_3 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_3 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_3, ActualArgs_3, "findFirstOrThrow">>;
                findMany: () => <This_4, FormalArgs_4 extends import("@prisma/client/runtime/library").Args<This_4, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_4 extends FormalArgs_4>(this: This_4, args?: { [key_4 in keyof ActualArgs_4]: key_4 extends keyof FormalArgs_4 ? ActualArgs_4[key_4] : never; } & (ActualArgs_4 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_4 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_4, ActualArgs_4, "findMany">>;
                findUnique: () => <This_5, FormalArgs_5 extends import("@prisma/client/runtime/library").Args<This_5, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_5 extends FormalArgs_5>(this: This_5, args: { [key_5 in keyof ActualArgs_5]: key_5 extends keyof FormalArgs_5 ? ActualArgs_5[key_5] : never; } & (ActualArgs_5 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_5 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_5, ActualArgs_5, "findUnique">>;
                findUniqueOrThrow: () => <This_6, FormalArgs_6 extends import("@prisma/client/runtime/library").Args<This_6, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_6 extends FormalArgs_6>(this: This_6, args: { [key_6 in keyof ActualArgs_6]: key_6 extends keyof FormalArgs_6 ? ActualArgs_6[key_6] : never; } & (ActualArgs_6 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_6 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_6, ActualArgs_6, "findUniqueOrThrow">>;
                groupBy: () => <This_7, FormalArgs_7 extends import("@prisma/client/runtime/library").Args<This_7, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_7 extends FormalArgs_7>(this: This_7, args: { [key_7 in keyof ActualArgs_7]: key_7 extends keyof FormalArgs_7 ? ActualArgs_7[key_7] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_7, ActualArgs_7, "groupBy">>;
            };
            wishlist_items: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This_1, FormalArgs_1 extends import("@prisma/client/runtime/library").Args<This_1, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_1 extends FormalArgs_1>(this: This_1, args?: { [key_1 in keyof ActualArgs_1]: key_1 extends keyof FormalArgs_1 ? ActualArgs_1[key_1] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_1, ActualArgs_1, "count">>;
                findFirst: () => <This_2, FormalArgs_2 extends import("@prisma/client/runtime/library").Args<This_2, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_2 extends FormalArgs_2>(this: This_2, args?: { [key_2 in keyof ActualArgs_2]: key_2 extends keyof FormalArgs_2 ? ActualArgs_2[key_2] : never; } & (ActualArgs_2 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_2 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_2, ActualArgs_2, "findFirst">>;
                findFirstOrThrow: () => <This_3, FormalArgs_3 extends import("@prisma/client/runtime/library").Args<This_3, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_3 extends FormalArgs_3>(this: This_3, args?: { [key_3 in keyof ActualArgs_3]: key_3 extends keyof FormalArgs_3 ? ActualArgs_3[key_3] : never; } & (ActualArgs_3 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_3 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_3, ActualArgs_3, "findFirstOrThrow">>;
                findMany: () => <This_4, FormalArgs_4 extends import("@prisma/client/runtime/library").Args<This_4, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_4 extends FormalArgs_4>(this: This_4, args?: { [key_4 in keyof ActualArgs_4]: key_4 extends keyof FormalArgs_4 ? ActualArgs_4[key_4] : never; } & (ActualArgs_4 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_4 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_4, ActualArgs_4, "findMany">>;
                findUnique: () => <This_5, FormalArgs_5 extends import("@prisma/client/runtime/library").Args<This_5, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_5 extends FormalArgs_5>(this: This_5, args: { [key_5 in keyof ActualArgs_5]: key_5 extends keyof FormalArgs_5 ? ActualArgs_5[key_5] : never; } & (ActualArgs_5 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_5 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_5, ActualArgs_5, "findUnique">>;
                findUniqueOrThrow: () => <This_6, FormalArgs_6 extends import("@prisma/client/runtime/library").Args<This_6, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_6 extends FormalArgs_6>(this: This_6, args: { [key_6 in keyof ActualArgs_6]: key_6 extends keyof FormalArgs_6 ? ActualArgs_6[key_6] : never; } & (ActualArgs_6 extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs_6 extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_6, ActualArgs_6, "findUniqueOrThrow">>;
                groupBy: () => <This_7, FormalArgs_7 extends import("@prisma/client/runtime/library").Args<This_7, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs_7 extends FormalArgs_7>(this: This_7, args: { [key_7 in keyof ActualArgs_7]: key_7 extends keyof FormalArgs_7 ? ActualArgs_7[key_7] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This_7, ActualArgs_7, "groupBy">>;
            };
        };
        query: {};
        client: {
            $accelerate: () => {
                invalidate: (input: import("@prisma/extension-accelerate").AccelerateInvalidateInput) => Promise<{
                    requestId: string;
                }>;
                invalidateAll: () => Promise<{
                    requestId: string;
                }>;
            };
        };
    }>;
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
}
