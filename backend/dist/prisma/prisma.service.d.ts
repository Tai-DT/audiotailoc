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
            user: {
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
            product: {
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
            category: {
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
            cart: {
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
            cartItem: {
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
            order: {
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
            orderItem: {
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
            payment: {
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
            refund: {
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
            serviceType: {
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
            service: {
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
            notification: {
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
            inventoryMovement: {
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
            inventoryAlert: {
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
            inventoryReport: {
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
            wishlistItem: {
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
            productReview: {
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
            productReviewVote: {
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
            productReviewReport: {
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
            page: {
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
            searchQuery: {
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
            productView: {
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
            serviceView: {
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
            customerQuestion: {
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
            technician: {
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
            serviceItem: {
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
            serviceBooking: {
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
            serviceBookingItem: {
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
            technicianSchedule: {
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
            serviceStatusHistory: {
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
            servicePayment: {
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
            promotion: {
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
            banner: {
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
            systemConfig: {
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
            loyaltyAccount: {
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
            pointTransaction: {
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
            redemptionHistory: {
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
            loyaltyReward: {
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
            webhook: {
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
            knowledgeBaseEntry: {
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
            paymentIntent: {
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
            project: {
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
            activityLog: {
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
            campaign: {
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
            campaignRecipient: {
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
            campaignOpen: {
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
            campaignClick: {
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
            emailLog: {
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
            contact_messages: {
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
            user: {
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
            product: {
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
            category: {
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
            cart: {
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
            cartItem: {
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
            order: {
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
            orderItem: {
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
            payment: {
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
            refund: {
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
            serviceType: {
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
            service: {
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
            notification: {
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
            inventoryMovement: {
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
            inventoryAlert: {
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
            inventoryReport: {
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
            wishlistItem: {
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
            productReview: {
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
            productReviewVote: {
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
            productReviewReport: {
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
            page: {
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
            searchQuery: {
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
            productView: {
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
            serviceView: {
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
            customerQuestion: {
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
            technician: {
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
            serviceItem: {
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
            serviceBooking: {
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
            serviceBookingItem: {
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
            technicianSchedule: {
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
            serviceStatusHistory: {
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
            servicePayment: {
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
            promotion: {
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
            banner: {
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
            systemConfig: {
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
            loyaltyAccount: {
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
            pointTransaction: {
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
            redemptionHistory: {
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
            loyaltyReward: {
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
            webhook: {
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
            knowledgeBaseEntry: {
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
            paymentIntent: {
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
            project: {
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
            activityLog: {
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
            campaign: {
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
            campaignRecipient: {
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
            campaignOpen: {
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
            campaignClick: {
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
            emailLog: {
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
            contact_messages: {
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
