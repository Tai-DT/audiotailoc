import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class FaqService {
    constructor(private readonly prisma: PrismaService) { }

    async findAll() {
        return this.prisma.faqs.findMany({
            where: { isActive: true },
            orderBy: { displayOrder: 'asc' },
        });
    }

    async findOne(id: string) {
        const faq = await this.prisma.faqs.findUnique({ where: { id } });
        if (!faq) {
            throw new NotFoundException(`FAQ with id "${id}" not found`);
        }
        return faq;
    }

    async create(data: {
        question: string;
        answer: string;
        category?: string;
        displayOrder?: number;
        isActive?: boolean;
    }) {
        return this.prisma.faqs.create({ data });
    }

    async update(
        id: string,
        data: {
            question?: string;
            answer?: string;
            category?: string;
            displayOrder?: number;
            isActive?: boolean;
        },
    ) {
        await this.findOne(id); // throws if not found
        return this.prisma.faqs.update({ where: { id }, data });
    }

    async remove(id: string) {
        await this.findOne(id);
        return this.prisma.faqs.delete({ where: { id } });
    }
}
