import { OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
export declare class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    constructor();
    getAcceleratedClient(): import("@prisma/client/runtime/library").DynamicClientExtensionThis<import(".prisma/client").Prisma.TypeMap<import("@prisma/client/runtime/library").InternalArgs & {
        result: {};
        model: {
            $allModels: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "count">>;
                findFirst: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirst"> | null>;
                findFirstOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirstOrThrow">>;
                findMany: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findMany">>;
                findUnique: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUnique"> | null>;
                findUniqueOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUniqueOrThrow">>;
                groupBy: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "groupBy">>;
            };
            user: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "count">>;
                findFirst: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirst"> | null>;
                findFirstOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirstOrThrow">>;
                findMany: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findMany">>;
                findUnique: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUnique"> | null>;
                findUniqueOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUniqueOrThrow">>;
                groupBy: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "groupBy">>;
            };
            product: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "count">>;
                findFirst: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirst"> | null>;
                findFirstOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirstOrThrow">>;
                findMany: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findMany">>;
                findUnique: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUnique"> | null>;
                findUniqueOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUniqueOrThrow">>;
                groupBy: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "groupBy">>;
            };
            category: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "count">>;
                findFirst: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirst"> | null>;
                findFirstOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirstOrThrow">>;
                findMany: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findMany">>;
                findUnique: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUnique"> | null>;
                findUniqueOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUniqueOrThrow">>;
                groupBy: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "groupBy">>;
            };
            cart: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "count">>;
                findFirst: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirst"> | null>;
                findFirstOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirstOrThrow">>;
                findMany: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findMany">>;
                findUnique: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUnique"> | null>;
                findUniqueOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUniqueOrThrow">>;
                groupBy: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "groupBy">>;
            };
            cartItem: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "count">>;
                findFirst: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirst"> | null>;
                findFirstOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirstOrThrow">>;
                findMany: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findMany">>;
                findUnique: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUnique"> | null>;
                findUniqueOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUniqueOrThrow">>;
                groupBy: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "groupBy">>;
            };
            order: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "count">>;
                findFirst: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirst"> | null>;
                findFirstOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirstOrThrow">>;
                findMany: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findMany">>;
                findUnique: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUnique"> | null>;
                findUniqueOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUniqueOrThrow">>;
                groupBy: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "groupBy">>;
            };
            orderItem: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "count">>;
                findFirst: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirst"> | null>;
                findFirstOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirstOrThrow">>;
                findMany: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findMany">>;
                findUnique: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUnique"> | null>;
                findUniqueOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUniqueOrThrow">>;
                groupBy: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "groupBy">>;
            };
            payment: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "count">>;
                findFirst: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirst"> | null>;
                findFirstOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirstOrThrow">>;
                findMany: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findMany">>;
                findUnique: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUnique"> | null>;
                findUniqueOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUniqueOrThrow">>;
                groupBy: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "groupBy">>;
            };
            refund: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "count">>;
                findFirst: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirst"> | null>;
                findFirstOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirstOrThrow">>;
                findMany: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findMany">>;
                findUnique: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUnique"> | null>;
                findUniqueOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUniqueOrThrow">>;
                groupBy: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "groupBy">>;
            };
            serviceType: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "count">>;
                findFirst: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirst"> | null>;
                findFirstOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirstOrThrow">>;
                findMany: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findMany">>;
                findUnique: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUnique"> | null>;
                findUniqueOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUniqueOrThrow">>;
                groupBy: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "groupBy">>;
            };
            service: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "count">>;
                findFirst: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirst"> | null>;
                findFirstOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirstOrThrow">>;
                findMany: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findMany">>;
                findUnique: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUnique"> | null>;
                findUniqueOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUniqueOrThrow">>;
                groupBy: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "groupBy">>;
            };
            inventory: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "count">>;
                findFirst: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirst"> | null>;
                findFirstOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirstOrThrow">>;
                findMany: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findMany">>;
                findUnique: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUnique"> | null>;
                findUniqueOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUniqueOrThrow">>;
                groupBy: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "groupBy">>;
            };
            inventoryMovement: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "count">>;
                findFirst: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirst"> | null>;
                findFirstOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirstOrThrow">>;
                findMany: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findMany">>;
                findUnique: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUnique"> | null>;
                findUniqueOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUniqueOrThrow">>;
                groupBy: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "groupBy">>;
            };
            inventoryAlert: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "count">>;
                findFirst: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirst"> | null>;
                findFirstOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirstOrThrow">>;
                findMany: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findMany">>;
                findUnique: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUnique"> | null>;
                findUniqueOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUniqueOrThrow">>;
                groupBy: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "groupBy">>;
            };
            inventoryReport: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "count">>;
                findFirst: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirst"> | null>;
                findFirstOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirstOrThrow">>;
                findMany: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findMany">>;
                findUnique: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUnique"> | null>;
                findUniqueOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUniqueOrThrow">>;
                groupBy: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "groupBy">>;
            };
            wishlistItem: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "count">>;
                findFirst: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirst"> | null>;
                findFirstOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirstOrThrow">>;
                findMany: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findMany">>;
                findUnique: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUnique"> | null>;
                findUniqueOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUniqueOrThrow">>;
                groupBy: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "groupBy">>;
            };
            productReview: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "count">>;
                findFirst: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirst"> | null>;
                findFirstOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirstOrThrow">>;
                findMany: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findMany">>;
                findUnique: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUnique"> | null>;
                findUniqueOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUniqueOrThrow">>;
                groupBy: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "groupBy">>;
            };
            productReviewVote: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "count">>;
                findFirst: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirst"> | null>;
                findFirstOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirstOrThrow">>;
                findMany: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findMany">>;
                findUnique: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUnique"> | null>;
                findUniqueOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUniqueOrThrow">>;
                groupBy: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "groupBy">>;
            };
            productReviewReport: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "count">>;
                findFirst: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirst"> | null>;
                findFirstOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirstOrThrow">>;
                findMany: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findMany">>;
                findUnique: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUnique"> | null>;
                findUniqueOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUniqueOrThrow">>;
                groupBy: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "groupBy">>;
            };
            page: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "count">>;
                findFirst: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirst"> | null>;
                findFirstOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirstOrThrow">>;
                findMany: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findMany">>;
                findUnique: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUnique"> | null>;
                findUniqueOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUniqueOrThrow">>;
                groupBy: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "groupBy">>;
            };
            searchQuery: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "count">>;
                findFirst: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirst"> | null>;
                findFirstOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirstOrThrow">>;
                findMany: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findMany">>;
                findUnique: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUnique"> | null>;
                findUniqueOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUniqueOrThrow">>;
                groupBy: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "groupBy">>;
            };
            productView: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "count">>;
                findFirst: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirst"> | null>;
                findFirstOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirstOrThrow">>;
                findMany: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findMany">>;
                findUnique: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUnique"> | null>;
                findUniqueOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUniqueOrThrow">>;
                groupBy: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "groupBy">>;
            };
            serviceView: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "count">>;
                findFirst: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirst"> | null>;
                findFirstOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirstOrThrow">>;
                findMany: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findMany">>;
                findUnique: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUnique"> | null>;
                findUniqueOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUniqueOrThrow">>;
                groupBy: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "groupBy">>;
            };
            customerQuestion: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "count">>;
                findFirst: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirst"> | null>;
                findFirstOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirstOrThrow">>;
                findMany: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findMany">>;
                findUnique: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUnique"> | null>;
                findUniqueOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUniqueOrThrow">>;
                groupBy: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "groupBy">>;
            };
            technician: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "count">>;
                findFirst: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirst"> | null>;
                findFirstOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirstOrThrow">>;
                findMany: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findMany">>;
                findUnique: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUnique"> | null>;
                findUniqueOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUniqueOrThrow">>;
                groupBy: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "groupBy">>;
            };
            serviceItem: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "count">>;
                findFirst: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirst"> | null>;
                findFirstOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirstOrThrow">>;
                findMany: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findMany">>;
                findUnique: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUnique"> | null>;
                findUniqueOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUniqueOrThrow">>;
                groupBy: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "groupBy">>;
            };
            serviceBooking: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "count">>;
                findFirst: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirst"> | null>;
                findFirstOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirstOrThrow">>;
                findMany: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findMany">>;
                findUnique: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUnique"> | null>;
                findUniqueOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUniqueOrThrow">>;
                groupBy: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "groupBy">>;
            };
            serviceBookingItem: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "count">>;
                findFirst: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirst"> | null>;
                findFirstOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirstOrThrow">>;
                findMany: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findMany">>;
                findUnique: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUnique"> | null>;
                findUniqueOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUniqueOrThrow">>;
                groupBy: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "groupBy">>;
            };
            technicianSchedule: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "count">>;
                findFirst: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirst"> | null>;
                findFirstOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirstOrThrow">>;
                findMany: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findMany">>;
                findUnique: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUnique"> | null>;
                findUniqueOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUniqueOrThrow">>;
                groupBy: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "groupBy">>;
            };
            serviceStatusHistory: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "count">>;
                findFirst: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirst"> | null>;
                findFirstOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirstOrThrow">>;
                findMany: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findMany">>;
                findUnique: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUnique"> | null>;
                findUniqueOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUniqueOrThrow">>;
                groupBy: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "groupBy">>;
            };
            servicePayment: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "count">>;
                findFirst: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirst"> | null>;
                findFirstOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirstOrThrow">>;
                findMany: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findMany">>;
                findUnique: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUnique"> | null>;
                findUniqueOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUniqueOrThrow">>;
                groupBy: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "groupBy">>;
            };
            promotion: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "count">>;
                findFirst: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirst"> | null>;
                findFirstOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirstOrThrow">>;
                findMany: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findMany">>;
                findUnique: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUnique"> | null>;
                findUniqueOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUniqueOrThrow">>;
                groupBy: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "groupBy">>;
            };
            banner: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "count">>;
                findFirst: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirst"> | null>;
                findFirstOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirstOrThrow">>;
                findMany: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findMany">>;
                findUnique: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUnique"> | null>;
                findUniqueOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUniqueOrThrow">>;
                groupBy: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "groupBy">>;
            };
            systemConfig: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "count">>;
                findFirst: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirst"> | null>;
                findFirstOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirstOrThrow">>;
                findMany: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findMany">>;
                findUnique: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUnique"> | null>;
                findUniqueOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUniqueOrThrow">>;
                groupBy: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "groupBy">>;
            };
            loyaltyAccount: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "count">>;
                findFirst: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirst"> | null>;
                findFirstOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirstOrThrow">>;
                findMany: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findMany">>;
                findUnique: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUnique"> | null>;
                findUniqueOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUniqueOrThrow">>;
                groupBy: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "groupBy">>;
            };
            pointTransaction: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "count">>;
                findFirst: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirst"> | null>;
                findFirstOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirstOrThrow">>;
                findMany: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findMany">>;
                findUnique: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUnique"> | null>;
                findUniqueOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUniqueOrThrow">>;
                groupBy: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "groupBy">>;
            };
            redemptionHistory: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "count">>;
                findFirst: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirst"> | null>;
                findFirstOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirstOrThrow">>;
                findMany: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findMany">>;
                findUnique: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUnique"> | null>;
                findUniqueOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUniqueOrThrow">>;
                groupBy: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "groupBy">>;
            };
            loyaltyReward: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "count">>;
                findFirst: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirst"> | null>;
                findFirstOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirstOrThrow">>;
                findMany: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findMany">>;
                findUnique: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUnique"> | null>;
                findUniqueOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUniqueOrThrow">>;
                groupBy: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "groupBy">>;
            };
            webhook: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "count">>;
                findFirst: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirst"> | null>;
                findFirstOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirstOrThrow">>;
                findMany: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findMany">>;
                findUnique: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUnique"> | null>;
                findUniqueOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUniqueOrThrow">>;
                groupBy: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "groupBy">>;
            };
            knowledgeBaseEntry: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "count">>;
                findFirst: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirst"> | null>;
                findFirstOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirstOrThrow">>;
                findMany: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findMany">>;
                findUnique: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUnique"> | null>;
                findUniqueOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUniqueOrThrow">>;
                groupBy: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "groupBy">>;
            };
            paymentIntent: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "count">>;
                findFirst: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirst"> | null>;
                findFirstOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirstOrThrow">>;
                findMany: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findMany">>;
                findUnique: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUnique"> | null>;
                findUniqueOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUniqueOrThrow">>;
                groupBy: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "groupBy">>;
            };
            project: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "count">>;
                findFirst: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirst"> | null>;
                findFirstOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirstOrThrow">>;
                findMany: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findMany">>;
                findUnique: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUnique"> | null>;
                findUniqueOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUniqueOrThrow">>;
                groupBy: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "groupBy">>;
            };
            activityLog: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "count">>;
                findFirst: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirst"> | null>;
                findFirstOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirstOrThrow">>;
                findMany: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findMany">>;
                findUnique: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUnique"> | null>;
                findUniqueOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUniqueOrThrow">>;
                groupBy: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "groupBy">>;
            };
            campaign: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "count">>;
                findFirst: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirst"> | null>;
                findFirstOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirstOrThrow">>;
                findMany: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findMany">>;
                findUnique: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUnique"> | null>;
                findUniqueOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUniqueOrThrow">>;
                groupBy: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "groupBy">>;
            };
            campaignRecipient: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "count">>;
                findFirst: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirst"> | null>;
                findFirstOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirstOrThrow">>;
                findMany: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findMany">>;
                findUnique: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUnique"> | null>;
                findUniqueOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUniqueOrThrow">>;
                groupBy: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "groupBy">>;
            };
            campaignOpen: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "count">>;
                findFirst: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirst"> | null>;
                findFirstOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirstOrThrow">>;
                findMany: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findMany">>;
                findUnique: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUnique"> | null>;
                findUniqueOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUniqueOrThrow">>;
                groupBy: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "groupBy">>;
            };
            campaignClick: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "count">>;
                findFirst: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirst"> | null>;
                findFirstOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirstOrThrow">>;
                findMany: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findMany">>;
                findUnique: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUnique"> | null>;
                findUniqueOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUniqueOrThrow">>;
                groupBy: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "groupBy">>;
            };
            emailLog: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "count">>;
                findFirst: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirst"> | null>;
                findFirstOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirstOrThrow">>;
                findMany: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findMany">>;
                findUnique: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUnique"> | null>;
                findUniqueOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUniqueOrThrow">>;
                groupBy: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "groupBy">>;
            };
            site_settings: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "count">>;
                findFirst: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirst"> | null>;
                findFirstOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirstOrThrow">>;
                findMany: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findMany">>;
                findUnique: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUnique"> | null>;
                findUniqueOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUniqueOrThrow">>;
                groupBy: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "groupBy">>;
            };
            software: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "count">>;
                findFirst: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirst"> | null>;
                findFirstOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirstOrThrow">>;
                findMany: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findMany">>;
                findUnique: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUnique"> | null>;
                findUniqueOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUniqueOrThrow">>;
                groupBy: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "groupBy">>;
            };
            blog_articles: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "count">>;
                findFirst: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirst"> | null>;
                findFirstOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirstOrThrow">>;
                findMany: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findMany">>;
                findUnique: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUnique"> | null>;
                findUniqueOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUniqueOrThrow">>;
                groupBy: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "groupBy">>;
            };
            blog_categories: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "count">>;
                findFirst: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirst"> | null>;
                findFirstOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirstOrThrow">>;
                findMany: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findMany">>;
                findUnique: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUnique"> | null>;
                findUniqueOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUniqueOrThrow">>;
                groupBy: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "groupBy">>;
            };
            blog_comments: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "count">>;
                findFirst: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirst"> | null>;
                findFirstOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirstOrThrow">>;
                findMany: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findMany">>;
                findUnique: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUnique"> | null>;
                findUniqueOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUniqueOrThrow">>;
                groupBy: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "groupBy">>;
            };
            email_templates: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "count">>;
                findFirst: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirst"> | null>;
                findFirstOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirstOrThrow">>;
                findMany: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findMany">>;
                findUnique: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUnique"> | null>;
                findUniqueOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUniqueOrThrow">>;
                groupBy: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "groupBy">>;
            };
            newsletter_subscriptions: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "count">>;
                findFirst: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirst"> | null>;
                findFirstOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirstOrThrow">>;
                findMany: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findMany">>;
                findUnique: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUnique"> | null>;
                findUniqueOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUniqueOrThrow">>;
                groupBy: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "groupBy">>;
            };
            policies: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "count">>;
                findFirst: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirst"> | null>;
                findFirstOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirstOrThrow">>;
                findMany: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findMany">>;
                findUnique: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUnique"> | null>;
                findUniqueOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUniqueOrThrow">>;
                groupBy: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "groupBy">>;
            };
            site_stats: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "count">>;
                findFirst: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirst"> | null>;
                findFirstOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirstOrThrow">>;
                findMany: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findMany">>;
                findUnique: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUnique"> | null>;
                findUniqueOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUniqueOrThrow">>;
                groupBy: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "groupBy">>;
            };
            testimonials: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "count">>;
                findFirst: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirst"> | null>;
                findFirstOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirstOrThrow">>;
                findMany: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findMany">>;
                findUnique: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUnique"> | null>;
                findUniqueOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUniqueOrThrow">>;
                groupBy: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "groupBy">>;
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
                count: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "count">>;
                findFirst: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirst"> | null>;
                findFirstOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirstOrThrow">>;
                findMany: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findMany">>;
                findUnique: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUnique"> | null>;
                findUniqueOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUniqueOrThrow">>;
                groupBy: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "groupBy">>;
            };
            user: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "count">>;
                findFirst: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirst"> | null>;
                findFirstOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirstOrThrow">>;
                findMany: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findMany">>;
                findUnique: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUnique"> | null>;
                findUniqueOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUniqueOrThrow">>;
                groupBy: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "groupBy">>;
            };
            product: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "count">>;
                findFirst: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirst"> | null>;
                findFirstOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirstOrThrow">>;
                findMany: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findMany">>;
                findUnique: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUnique"> | null>;
                findUniqueOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUniqueOrThrow">>;
                groupBy: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "groupBy">>;
            };
            category: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "count">>;
                findFirst: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirst"> | null>;
                findFirstOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirstOrThrow">>;
                findMany: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findMany">>;
                findUnique: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUnique"> | null>;
                findUniqueOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUniqueOrThrow">>;
                groupBy: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "groupBy">>;
            };
            cart: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "count">>;
                findFirst: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirst"> | null>;
                findFirstOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirstOrThrow">>;
                findMany: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findMany">>;
                findUnique: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUnique"> | null>;
                findUniqueOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUniqueOrThrow">>;
                groupBy: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "groupBy">>;
            };
            cartItem: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "count">>;
                findFirst: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirst"> | null>;
                findFirstOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirstOrThrow">>;
                findMany: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findMany">>;
                findUnique: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUnique"> | null>;
                findUniqueOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUniqueOrThrow">>;
                groupBy: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "groupBy">>;
            };
            order: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "count">>;
                findFirst: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirst"> | null>;
                findFirstOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirstOrThrow">>;
                findMany: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findMany">>;
                findUnique: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUnique"> | null>;
                findUniqueOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUniqueOrThrow">>;
                groupBy: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "groupBy">>;
            };
            orderItem: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "count">>;
                findFirst: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirst"> | null>;
                findFirstOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirstOrThrow">>;
                findMany: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findMany">>;
                findUnique: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUnique"> | null>;
                findUniqueOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUniqueOrThrow">>;
                groupBy: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "groupBy">>;
            };
            payment: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "count">>;
                findFirst: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirst"> | null>;
                findFirstOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirstOrThrow">>;
                findMany: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findMany">>;
                findUnique: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUnique"> | null>;
                findUniqueOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUniqueOrThrow">>;
                groupBy: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "groupBy">>;
            };
            refund: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "count">>;
                findFirst: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirst"> | null>;
                findFirstOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirstOrThrow">>;
                findMany: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findMany">>;
                findUnique: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUnique"> | null>;
                findUniqueOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUniqueOrThrow">>;
                groupBy: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "groupBy">>;
            };
            serviceType: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "count">>;
                findFirst: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirst"> | null>;
                findFirstOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirstOrThrow">>;
                findMany: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findMany">>;
                findUnique: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUnique"> | null>;
                findUniqueOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUniqueOrThrow">>;
                groupBy: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "groupBy">>;
            };
            service: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "count">>;
                findFirst: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirst"> | null>;
                findFirstOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirstOrThrow">>;
                findMany: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findMany">>;
                findUnique: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUnique"> | null>;
                findUniqueOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUniqueOrThrow">>;
                groupBy: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "groupBy">>;
            };
            inventory: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "count">>;
                findFirst: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirst"> | null>;
                findFirstOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirstOrThrow">>;
                findMany: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findMany">>;
                findUnique: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUnique"> | null>;
                findUniqueOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUniqueOrThrow">>;
                groupBy: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "groupBy">>;
            };
            inventoryMovement: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "count">>;
                findFirst: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirst"> | null>;
                findFirstOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirstOrThrow">>;
                findMany: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findMany">>;
                findUnique: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUnique"> | null>;
                findUniqueOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUniqueOrThrow">>;
                groupBy: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "groupBy">>;
            };
            inventoryAlert: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "count">>;
                findFirst: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirst"> | null>;
                findFirstOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirstOrThrow">>;
                findMany: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findMany">>;
                findUnique: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUnique"> | null>;
                findUniqueOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUniqueOrThrow">>;
                groupBy: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "groupBy">>;
            };
            inventoryReport: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "count">>;
                findFirst: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirst"> | null>;
                findFirstOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirstOrThrow">>;
                findMany: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findMany">>;
                findUnique: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUnique"> | null>;
                findUniqueOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUniqueOrThrow">>;
                groupBy: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "groupBy">>;
            };
            wishlistItem: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "count">>;
                findFirst: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirst"> | null>;
                findFirstOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirstOrThrow">>;
                findMany: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findMany">>;
                findUnique: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUnique"> | null>;
                findUniqueOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUniqueOrThrow">>;
                groupBy: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "groupBy">>;
            };
            productReview: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "count">>;
                findFirst: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirst"> | null>;
                findFirstOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirstOrThrow">>;
                findMany: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findMany">>;
                findUnique: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUnique"> | null>;
                findUniqueOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUniqueOrThrow">>;
                groupBy: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "groupBy">>;
            };
            productReviewVote: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "count">>;
                findFirst: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirst"> | null>;
                findFirstOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirstOrThrow">>;
                findMany: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findMany">>;
                findUnique: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUnique"> | null>;
                findUniqueOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUniqueOrThrow">>;
                groupBy: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "groupBy">>;
            };
            productReviewReport: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "count">>;
                findFirst: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirst"> | null>;
                findFirstOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirstOrThrow">>;
                findMany: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findMany">>;
                findUnique: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUnique"> | null>;
                findUniqueOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUniqueOrThrow">>;
                groupBy: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "groupBy">>;
            };
            page: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "count">>;
                findFirst: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirst"> | null>;
                findFirstOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirstOrThrow">>;
                findMany: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findMany">>;
                findUnique: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUnique"> | null>;
                findUniqueOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUniqueOrThrow">>;
                groupBy: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "groupBy">>;
            };
            searchQuery: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "count">>;
                findFirst: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirst"> | null>;
                findFirstOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirstOrThrow">>;
                findMany: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findMany">>;
                findUnique: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUnique"> | null>;
                findUniqueOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUniqueOrThrow">>;
                groupBy: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "groupBy">>;
            };
            productView: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "count">>;
                findFirst: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirst"> | null>;
                findFirstOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirstOrThrow">>;
                findMany: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findMany">>;
                findUnique: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUnique"> | null>;
                findUniqueOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUniqueOrThrow">>;
                groupBy: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "groupBy">>;
            };
            serviceView: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "count">>;
                findFirst: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirst"> | null>;
                findFirstOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirstOrThrow">>;
                findMany: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findMany">>;
                findUnique: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUnique"> | null>;
                findUniqueOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUniqueOrThrow">>;
                groupBy: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "groupBy">>;
            };
            customerQuestion: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "count">>;
                findFirst: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirst"> | null>;
                findFirstOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirstOrThrow">>;
                findMany: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findMany">>;
                findUnique: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUnique"> | null>;
                findUniqueOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUniqueOrThrow">>;
                groupBy: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "groupBy">>;
            };
            technician: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "count">>;
                findFirst: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirst"> | null>;
                findFirstOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirstOrThrow">>;
                findMany: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findMany">>;
                findUnique: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUnique"> | null>;
                findUniqueOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUniqueOrThrow">>;
                groupBy: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "groupBy">>;
            };
            serviceItem: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "count">>;
                findFirst: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirst"> | null>;
                findFirstOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirstOrThrow">>;
                findMany: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findMany">>;
                findUnique: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUnique"> | null>;
                findUniqueOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUniqueOrThrow">>;
                groupBy: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "groupBy">>;
            };
            serviceBooking: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "count">>;
                findFirst: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirst"> | null>;
                findFirstOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirstOrThrow">>;
                findMany: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findMany">>;
                findUnique: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUnique"> | null>;
                findUniqueOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUniqueOrThrow">>;
                groupBy: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "groupBy">>;
            };
            serviceBookingItem: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "count">>;
                findFirst: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirst"> | null>;
                findFirstOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirstOrThrow">>;
                findMany: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findMany">>;
                findUnique: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUnique"> | null>;
                findUniqueOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUniqueOrThrow">>;
                groupBy: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "groupBy">>;
            };
            technicianSchedule: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "count">>;
                findFirst: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirst"> | null>;
                findFirstOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirstOrThrow">>;
                findMany: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findMany">>;
                findUnique: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUnique"> | null>;
                findUniqueOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUniqueOrThrow">>;
                groupBy: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "groupBy">>;
            };
            serviceStatusHistory: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "count">>;
                findFirst: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirst"> | null>;
                findFirstOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirstOrThrow">>;
                findMany: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findMany">>;
                findUnique: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUnique"> | null>;
                findUniqueOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUniqueOrThrow">>;
                groupBy: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "groupBy">>;
            };
            servicePayment: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "count">>;
                findFirst: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirst"> | null>;
                findFirstOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirstOrThrow">>;
                findMany: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findMany">>;
                findUnique: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUnique"> | null>;
                findUniqueOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUniqueOrThrow">>;
                groupBy: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "groupBy">>;
            };
            promotion: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "count">>;
                findFirst: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirst"> | null>;
                findFirstOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirstOrThrow">>;
                findMany: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findMany">>;
                findUnique: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUnique"> | null>;
                findUniqueOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUniqueOrThrow">>;
                groupBy: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "groupBy">>;
            };
            banner: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "count">>;
                findFirst: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirst"> | null>;
                findFirstOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirstOrThrow">>;
                findMany: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findMany">>;
                findUnique: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUnique"> | null>;
                findUniqueOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUniqueOrThrow">>;
                groupBy: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "groupBy">>;
            };
            systemConfig: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "count">>;
                findFirst: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirst"> | null>;
                findFirstOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirstOrThrow">>;
                findMany: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findMany">>;
                findUnique: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUnique"> | null>;
                findUniqueOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUniqueOrThrow">>;
                groupBy: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "groupBy">>;
            };
            loyaltyAccount: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "count">>;
                findFirst: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirst"> | null>;
                findFirstOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirstOrThrow">>;
                findMany: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findMany">>;
                findUnique: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUnique"> | null>;
                findUniqueOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUniqueOrThrow">>;
                groupBy: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "groupBy">>;
            };
            pointTransaction: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "count">>;
                findFirst: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirst"> | null>;
                findFirstOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirstOrThrow">>;
                findMany: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findMany">>;
                findUnique: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUnique"> | null>;
                findUniqueOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUniqueOrThrow">>;
                groupBy: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "groupBy">>;
            };
            redemptionHistory: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "count">>;
                findFirst: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirst"> | null>;
                findFirstOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirstOrThrow">>;
                findMany: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findMany">>;
                findUnique: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUnique"> | null>;
                findUniqueOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUniqueOrThrow">>;
                groupBy: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "groupBy">>;
            };
            loyaltyReward: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "count">>;
                findFirst: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirst"> | null>;
                findFirstOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirstOrThrow">>;
                findMany: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findMany">>;
                findUnique: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUnique"> | null>;
                findUniqueOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUniqueOrThrow">>;
                groupBy: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "groupBy">>;
            };
            webhook: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "count">>;
                findFirst: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirst"> | null>;
                findFirstOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirstOrThrow">>;
                findMany: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findMany">>;
                findUnique: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUnique"> | null>;
                findUniqueOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUniqueOrThrow">>;
                groupBy: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "groupBy">>;
            };
            knowledgeBaseEntry: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "count">>;
                findFirst: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirst"> | null>;
                findFirstOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirstOrThrow">>;
                findMany: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findMany">>;
                findUnique: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUnique"> | null>;
                findUniqueOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUniqueOrThrow">>;
                groupBy: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "groupBy">>;
            };
            paymentIntent: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "count">>;
                findFirst: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirst"> | null>;
                findFirstOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirstOrThrow">>;
                findMany: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findMany">>;
                findUnique: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUnique"> | null>;
                findUniqueOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUniqueOrThrow">>;
                groupBy: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "groupBy">>;
            };
            project: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "count">>;
                findFirst: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirst"> | null>;
                findFirstOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirstOrThrow">>;
                findMany: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findMany">>;
                findUnique: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUnique"> | null>;
                findUniqueOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUniqueOrThrow">>;
                groupBy: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "groupBy">>;
            };
            activityLog: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "count">>;
                findFirst: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirst"> | null>;
                findFirstOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirstOrThrow">>;
                findMany: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findMany">>;
                findUnique: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUnique"> | null>;
                findUniqueOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUniqueOrThrow">>;
                groupBy: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "groupBy">>;
            };
            campaign: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "count">>;
                findFirst: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirst"> | null>;
                findFirstOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirstOrThrow">>;
                findMany: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findMany">>;
                findUnique: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUnique"> | null>;
                findUniqueOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUniqueOrThrow">>;
                groupBy: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "groupBy">>;
            };
            campaignRecipient: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "count">>;
                findFirst: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirst"> | null>;
                findFirstOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirstOrThrow">>;
                findMany: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findMany">>;
                findUnique: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUnique"> | null>;
                findUniqueOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUniqueOrThrow">>;
                groupBy: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "groupBy">>;
            };
            campaignOpen: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "count">>;
                findFirst: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirst"> | null>;
                findFirstOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirstOrThrow">>;
                findMany: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findMany">>;
                findUnique: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUnique"> | null>;
                findUniqueOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUniqueOrThrow">>;
                groupBy: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "groupBy">>;
            };
            campaignClick: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "count">>;
                findFirst: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirst"> | null>;
                findFirstOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirstOrThrow">>;
                findMany: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findMany">>;
                findUnique: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUnique"> | null>;
                findUniqueOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUniqueOrThrow">>;
                groupBy: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "groupBy">>;
            };
            emailLog: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "count">>;
                findFirst: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirst"> | null>;
                findFirstOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirstOrThrow">>;
                findMany: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findMany">>;
                findUnique: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUnique"> | null>;
                findUniqueOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUniqueOrThrow">>;
                groupBy: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "groupBy">>;
            };
            site_settings: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "count">>;
                findFirst: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirst"> | null>;
                findFirstOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirstOrThrow">>;
                findMany: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findMany">>;
                findUnique: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUnique"> | null>;
                findUniqueOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUniqueOrThrow">>;
                groupBy: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "groupBy">>;
            };
            software: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "count">>;
                findFirst: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirst"> | null>;
                findFirstOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirstOrThrow">>;
                findMany: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findMany">>;
                findUnique: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUnique"> | null>;
                findUniqueOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUniqueOrThrow">>;
                groupBy: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "groupBy">>;
            };
            blog_articles: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "count">>;
                findFirst: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirst"> | null>;
                findFirstOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirstOrThrow">>;
                findMany: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findMany">>;
                findUnique: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUnique"> | null>;
                findUniqueOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUniqueOrThrow">>;
                groupBy: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "groupBy">>;
            };
            blog_categories: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "count">>;
                findFirst: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirst"> | null>;
                findFirstOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirstOrThrow">>;
                findMany: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findMany">>;
                findUnique: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUnique"> | null>;
                findUniqueOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUniqueOrThrow">>;
                groupBy: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "groupBy">>;
            };
            blog_comments: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "count">>;
                findFirst: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirst"> | null>;
                findFirstOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirstOrThrow">>;
                findMany: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findMany">>;
                findUnique: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUnique"> | null>;
                findUniqueOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUniqueOrThrow">>;
                groupBy: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "groupBy">>;
            };
            email_templates: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "count">>;
                findFirst: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirst"> | null>;
                findFirstOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirstOrThrow">>;
                findMany: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findMany">>;
                findUnique: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUnique"> | null>;
                findUniqueOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUniqueOrThrow">>;
                groupBy: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "groupBy">>;
            };
            newsletter_subscriptions: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "count">>;
                findFirst: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirst"> | null>;
                findFirstOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirstOrThrow">>;
                findMany: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findMany">>;
                findUnique: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUnique"> | null>;
                findUniqueOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUniqueOrThrow">>;
                groupBy: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "groupBy">>;
            };
            policies: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "count">>;
                findFirst: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirst"> | null>;
                findFirstOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirstOrThrow">>;
                findMany: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findMany">>;
                findUnique: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUnique"> | null>;
                findUniqueOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUniqueOrThrow">>;
                groupBy: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "groupBy">>;
            };
            site_stats: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "count">>;
                findFirst: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirst"> | null>;
                findFirstOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirstOrThrow">>;
                findMany: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findMany">>;
                findUnique: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUnique"> | null>;
                findUniqueOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUniqueOrThrow">>;
                groupBy: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "groupBy">>;
            };
            testimonials: {
                aggregate: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "aggregate"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "aggregate">>;
                count: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "count"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "count">>;
                findFirst: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirst"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirst"> | null>;
                findFirstOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findFirstOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findFirstOrThrow">>;
                findMany: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findMany"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args?: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findMany">>;
                findUnique: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUnique"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUnique"> | null>;
                findUniqueOrThrow: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "findUniqueOrThrow"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; } & (ActualArgs extends {
                    select: unknown;
                    include: unknown;
                } ? "Please either choose `select` or `include`." : ActualArgs extends {
                    select: unknown;
                    omit: unknown;
                } ? "Please either choose `select` or `omit`." : unknown)) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "findUniqueOrThrow">>;
                groupBy: () => <This, FormalArgs extends import("@prisma/client/runtime/library").Args<This, "groupBy"> & import("@prisma/extension-accelerate").PrismaCacheStrategy, const ActualArgs extends FormalArgs>(this: This, args: { [key in keyof ActualArgs]: key extends keyof FormalArgs ? ActualArgs[key] : never; }) => import("@prisma/extension-accelerate").AcceleratePromise<import("@prisma/client/runtime/library").Result<This, ActualArgs, "groupBy">>;
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
