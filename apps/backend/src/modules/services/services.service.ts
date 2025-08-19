import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { MailService } from '../notifications/mail.service';

export interface CreateServiceRequestDto {
  name: string;
  phone: string;
  email?: string;
  address?: string;
  serviceType: 'REPAIR' | 'RENTAL' | 'INSTALLATION' | 'TV_INSTALLATION';
  message?: string;
}

@Injectable()
export class ServicesService {
  constructor(private readonly prisma: PrismaService, private readonly mail: MailService) {}

  async createRequest(input: CreateServiceRequestDto) {
    const req = await this.prisma.serviceRequest.create({
      data: {
        name: input.name,
        phone: input.phone,
        email: input.email || null,
        address: input.address || null,
        serviceType: input.serviceType,
        message: input.message || null,
        status: 'NEW',
      },
    });
    await this.mail.send(
      'support@audiotailoc.com',
      `[Service] ${input.serviceType} request from ${input.name}`,
      `Phone: ${input.phone}\nEmail: ${input.email || ''}\nAddress: ${input.address || ''}\nMessage: ${input.message || ''}`,
    );
    return { id: req.id };
  }

  async listRequests() {
    return this.prisma.serviceRequest.findMany({ orderBy: { createdAt: 'desc' } });
  }
}

