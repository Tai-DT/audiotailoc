import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

export interface ShippingAddress {
  name: string;
  phone: string;
  address: string;
  ward: string;
  district: string;
  province: string;
  country: string;
  postalCode?: string;
}

export interface ShippingPackage {
  weight: number; // in grams
  length: number; // in cm
  width: number; // in cm
  height: number; // in cm
  value: number; // in VND
  items: Array<{
    name: string;
    quantity: number;
    value: number;
  }>;
}

export interface ShippingRate {
  carrierId: string;
  carrierName: string;
  serviceName: string;
  serviceCode: string;
  cost: number;
  estimatedDays: number;
  currency: string;
  description?: string;
}

export interface ShippingLabel {
  trackingNumber: string;
  labelUrl: string;
  carrierId: string;
  serviceName: string;
  cost: number;
  estimatedDelivery: Date;
}

export interface TrackingInfo {
  trackingNumber: string;
  status: 'PENDING' | 'PICKED_UP' | 'IN_TRANSIT' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'EXCEPTION' | 'RETURNED';
  statusDescription: string;
  estimatedDelivery?: Date;
  actualDelivery?: Date;
  events: Array<{
    timestamp: Date;
    status: string;
    description: string;
    location?: string;
  }>;
}

@Injectable()
export class ShippingService {
  private readonly logger = new Logger(ShippingService.name);

  constructor(
    private readonly config: ConfigService,
    private readonly httpService: HttpService
  ) {}

  // Get shipping rates from multiple carriers
  async getShippingRates(
    fromAddress: ShippingAddress,
    toAddress: ShippingAddress,
    packages: ShippingPackage[]
  ): Promise<ShippingRate[]> {
    try {
      const rates: ShippingRate[] = [];

      // Get rates from different carriers
      const [giaoHangNhanhRates, giaoHangTietKiemRates, viettelPostRates] = await Promise.allSettled([
        this.getGiaoHangNhanhRates(fromAddress, toAddress, packages),
        this.getGiaoHangTietKiemRates(fromAddress, toAddress, packages),
        this.getViettelPostRates(fromAddress, toAddress, packages),
      ]);

      if (giaoHangNhanhRates.status === 'fulfilled') {
        rates.push(...giaoHangNhanhRates.value);
      }

      if (giaoHangTietKiemRates.status === 'fulfilled') {
        rates.push(...giaoHangTietKiemRates.value);
      }

      if (viettelPostRates.status === 'fulfilled') {
        rates.push(...viettelPostRates.value);
      }

      // Sort by cost
      return rates.sort((a, b) => a.cost - b.cost);

    } catch (error) {
      this.logger.error('Failed to get shipping rates:', error);
      throw error;
    }
  }

  // Create shipping label
  async createShippingLabel(
    carrierId: string,
    serviceCode: string,
    fromAddress: ShippingAddress,
    toAddress: ShippingAddress,
    packages: ShippingPackage[],
    orderId: string
  ): Promise<ShippingLabel> {
    try {
      switch (carrierId) {
        case 'ghn':
          return this.createGiaoHangNhanhLabel(serviceCode, fromAddress, toAddress, packages, orderId);
        case 'ghtk':
          return this.createGiaoHangTietKiemLabel(serviceCode, fromAddress, toAddress, packages, orderId);
        case 'vtp':
          return this.createViettelPostLabel(serviceCode, fromAddress, toAddress, packages, orderId);
        default:
          throw new Error(`Unsupported carrier: ${carrierId}`);
      }
    } catch (error) {
      this.logger.error('Failed to create shipping label:', error);
      throw error;
    }
  }

  // Track shipment
  async trackShipment(trackingNumber: string, carrierId?: string): Promise<TrackingInfo> {
    try {
      if (carrierId) {
        switch (carrierId) {
          case 'ghn':
            return this.trackGiaoHangNhanh(trackingNumber);
          case 'ghtk':
            return this.trackGiaoHangTietKiem(trackingNumber);
          case 'vtp':
            return this.trackViettelPost(trackingNumber);
        }
      }

      // Try all carriers if carrierId not specified
      const trackingPromises = [
        this.trackGiaoHangNhanh(trackingNumber).catch(() => null),
        this.trackGiaoHangTietKiem(trackingNumber).catch(() => null),
        this.trackViettelPost(trackingNumber).catch(() => null),
      ];

      const results = await Promise.allSettled(trackingPromises);
      const successfulResult = results.find(result => 
        result.status === 'fulfilled' && result.value !== null
      );

      if (successfulResult && successfulResult.status === 'fulfilled') {
        return successfulResult.value;
      }

      throw new Error('Tracking number not found');

    } catch (error) {
      this.logger.error('Failed to track shipment:', error);
      throw error;
    }
  }

  // Giao Hang Nhanh (GHN) Integration
  private async getGiaoHangNhanhRates(
    fromAddress: ShippingAddress,
    toAddress: ShippingAddress,
    packages: ShippingPackage[]
  ): Promise<ShippingRate[]> {
    const apiKey = this.config.get<string>('GHN_API_KEY');
    const shopId = this.config.get<string>('GHN_SHOP_ID');

    if (!apiKey || !shopId) {
      return [];
    }

    try {
      // Get available services
      const servicesResponse = await firstValueFrom(
        this.httpService.post('https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/available-services', {
          shop_id: parseInt(shopId),
          from_district: fromAddress.district,
          to_district: toAddress.district,
        }, {
          headers: {
            'Token': apiKey,
            'Content-Type': 'application/json',
          },
        })
      );

      const services = servicesResponse.data.data;
      const rates: ShippingRate[] = [];

      // Get fee for each service
      for (const service of services) {
        try {
          const feeResponse = await firstValueFrom(
            this.httpService.post('https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee', {
              service_id: service.service_id,
              insurance_value: packages.reduce((sum, pkg) => sum + pkg.value, 0),
              coupon: null,
              from_district_id: fromAddress.district,
              to_district_id: toAddress.district,
              to_ward_code: toAddress.ward,
              height: Math.max(...packages.map(p => p.height)),
              length: Math.max(...packages.map(p => p.length)),
              weight: packages.reduce((sum, pkg) => sum + pkg.weight, 0),
              width: Math.max(...packages.map(p => p.width)),
            }, {
              headers: {
                'Token': apiKey,
                'Content-Type': 'application/json',
              },
            })
          );

          rates.push({
            carrierId: 'ghn',
            carrierName: 'Giao Hàng Nhanh',
            serviceName: service.short_name,
            serviceCode: service.service_id.toString(),
            cost: feeResponse.data.data.total,
            estimatedDays: service.service_type_id === 2 ? 1 : 3, // Express vs Standard
            currency: 'VND',
            description: service.short_name,
          });
        } catch (error) {
          this.logger.warn(`Failed to get GHN fee for service ${service.service_id}:`, error);
        }
      }

      return rates;
    } catch (error) {
      this.logger.error('GHN API error:', error);
      return [];
    }
  }

  private async createGiaoHangNhanhLabel(
    serviceCode: string,
    fromAddress: ShippingAddress,
    toAddress: ShippingAddress,
    packages: ShippingPackage[],
    orderId: string
  ): Promise<ShippingLabel> {
    const apiKey = this.config.get<string>('GHN_API_KEY');
    const shopId = this.config.get<string>('GHN_SHOP_ID');

    const response = await firstValueFrom(
      this.httpService.post('https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/create', {
        payment_type_id: 2, // Người gửi trả phí
        note: `Đơn hàng #${orderId}`,
        required_note: 'KHONGCHOXEMHANG',
        return_phone: fromAddress.phone,
        return_address: fromAddress.address,
        return_district_id: fromAddress.district,
        return_ward_code: fromAddress.ward,
        client_order_code: orderId,
        to_name: toAddress.name,
        to_phone: toAddress.phone,
        to_address: toAddress.address,
        to_ward_code: toAddress.ward,
        to_district_id: toAddress.district,
        cod_amount: 0,
        content: packages.map(p => p.items.map(i => i.name).join(', ')).join('; '),
        weight: packages.reduce((sum, pkg) => sum + pkg.weight, 0),
        length: Math.max(...packages.map(p => p.length)),
        width: Math.max(...packages.map(p => p.width)),
        height: Math.max(...packages.map(p => p.height)),
        pick_station_id: null,
        deliver_station_id: null,
        insurance_value: packages.reduce((sum, pkg) => sum + pkg.value, 0),
        service_id: parseInt(serviceCode),
        service_type_id: 2,
        coupon: null,
        pick_shift: [2], // Ca chiều
        items: packages.flatMap(pkg => pkg.items.map(item => ({
          name: item.name,
          code: '',
          quantity: item.quantity,
          price: item.value,
          length: pkg.length,
          width: pkg.width,
          height: pkg.height,
          weight: pkg.weight / pkg.items.length,
        }))),
      }, {
        headers: {
          'Token': apiKey,
          'ShopId': shopId,
          'Content-Type': 'application/json',
        },
      })
    );

    const data = response.data.data;

    return {
      trackingNumber: data.order_code,
      labelUrl: `https://dev-online-gateway.ghn.vn/shiip/public-api/v2/a5/gen-token?token=${apiKey}&order_codes=${data.order_code}`,
      carrierId: 'ghn',
      serviceName: 'Giao Hàng Nhanh',
      cost: data.total_fee,
      estimatedDelivery: new Date(data.expected_delivery_time),
    };
  }

  private async trackGiaoHangNhanh(trackingNumber: string): Promise<TrackingInfo> {
    const apiKey = this.config.get<string>('GHN_API_KEY');

    const response = await firstValueFrom(
      this.httpService.post('https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/detail', {
        order_code: trackingNumber,
      }, {
        headers: {
          'Token': apiKey,
          'Content-Type': 'application/json',
        },
      })
    );

    const data = response.data.data;
    
    return {
      trackingNumber,
      status: this.mapGHNStatus(data.status),
      statusDescription: data.status,
      estimatedDelivery: data.expected_delivery_time ? new Date(data.expected_delivery_time) : undefined,
      actualDelivery: data.finish_time ? new Date(data.finish_time) : undefined,
      events: data.log?.map((event: any) => ({
        timestamp: new Date(event.updated_date),
        status: event.status,
        description: event.status,
        location: event.location,
      })) || [],
    };
  }

  // Giao Hang Tiet Kiem (GHTK) Integration
  private async getGiaoHangTietKiemRates(
    fromAddress: ShippingAddress,
    toAddress: ShippingAddress,
    packages: ShippingPackage[]
  ): Promise<ShippingRate[]> {
    const apiKey = this.config.get<string>('GHTK_API_KEY');

    if (!apiKey) {
      return [];
    }

    try {
      const response = await firstValueFrom(
        this.httpService.get('https://services.giaohangtietkiem.vn/services/shipment/fee', {
          params: {
            pick_province: fromAddress.province,
            pick_district: fromAddress.district,
            province: toAddress.province,
            district: toAddress.district,
            address: toAddress.address,
            weight: packages.reduce((sum, pkg) => sum + pkg.weight, 0),
            value: packages.reduce((sum, pkg) => sum + pkg.value, 0),
            transport: 'road',
            deliver_option: 'none',
          },
          headers: {
            'Token': apiKey,
          },
        })
      );

      if (response.data.success) {
        return [{
          carrierId: 'ghtk',
          carrierName: 'Giao Hàng Tiết Kiệm',
          serviceName: 'Standard',
          serviceCode: 'standard',
          cost: response.data.fee.fee,
          estimatedDays: 3,
          currency: 'VND',
          description: 'Giao hàng tiết kiệm',
        }];
      }

      return [];
    } catch (error) {
      this.logger.error('GHTK API error:', error);
      return [];
    }
  }

  private async createGiaoHangTietKiemLabel(
    serviceCode: string,
    fromAddress: ShippingAddress,
    toAddress: ShippingAddress,
    packages: ShippingPackage[],
    orderId: string
  ): Promise<ShippingLabel> {
    const apiKey = this.config.get<string>('GHTK_API_KEY');

    const response = await firstValueFrom(
      this.httpService.post('https://services.giaohangtietkiem.vn/services/shipment/order', {
        products: packages.flatMap(pkg => pkg.items.map(item => ({
          name: item.name,
          weight: pkg.weight / pkg.items.length,
          quantity: item.quantity,
          product_code: '',
        }))),
        order: {
          id: orderId,
          pick_name: fromAddress.name,
          pick_address: fromAddress.address,
          pick_province: fromAddress.province,
          pick_district: fromAddress.district,
          pick_ward: fromAddress.ward,
          pick_tel: fromAddress.phone,
          tel: toAddress.phone,
          name: toAddress.name,
          address: toAddress.address,
          province: toAddress.province,
          district: toAddress.district,
          ward: toAddress.ward,
          hamlet: 'Khác',
          is_freeship: '1',
          pick_date: new Date().toISOString().split('T')[0],
          pick_money: 0,
          note: `Đơn hàng #${orderId}`,
          value: packages.reduce((sum, pkg) => sum + pkg.value, 0),
          transport: 'road',
          pick_option: 'cod',
          deliver_option: 'none',
          pick_session: 2,
        },
      }, {
        headers: {
          'Token': apiKey,
          'Content-Type': 'application/json',
        },
      })
    );

    const data = response.data;

    return {
      trackingNumber: data.order.label,
      labelUrl: data.order.label_id,
      carrierId: 'ghtk',
      serviceName: 'Giao Hàng Tiết Kiệm',
      cost: data.order.fee,
      estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days
    };
  }

  private async trackGiaoHangTietKiem(trackingNumber: string): Promise<TrackingInfo> {
    const apiKey = this.config.get<string>('GHTK_API_KEY');

    const response = await firstValueFrom(
      this.httpService.get(`https://services.giaohangtietkiem.vn/services/shipment/v2/${trackingNumber}`, {
        headers: {
          'Token': apiKey,
        },
      })
    );

    const data = response.data;
    
    return {
      trackingNumber,
      status: this.mapGHTKStatus(data.order.status_id),
      statusDescription: data.order.status_text,
      events: data.order.status_log?.map((event: any) => ({
        timestamp: new Date(event.time),
        status: event.status_detail,
        description: event.status_detail,
        location: event.location,
      })) || [],
    };
  }

  // Viettel Post Integration
  private async getViettelPostRates(
    _fromAddress: ShippingAddress,
    _toAddress: ShippingAddress,
    _packages: ShippingPackage[]
  ): Promise<ShippingRate[]> {
    // Viettel Post API integration would go here
    // For now, return empty array
    return [];
  }

  private async createViettelPostLabel(
    _serviceCode: string,
    _fromAddress: ShippingAddress,
    _toAddress: ShippingAddress,
    _packages: ShippingPackage[],
    _orderId: string
  ): Promise<ShippingLabel> {
    // Viettel Post label creation would go here
    throw new Error('Viettel Post integration not implemented');
  }

  private async trackViettelPost(_trackingNumber: string): Promise<TrackingInfo> {
    // Viettel Post tracking would go here
    throw new Error('Viettel Post tracking not implemented');
  }

  // Helper methods
  private mapGHNStatus(status: string): TrackingInfo['status'] {
    const statusMap: Record<string, TrackingInfo['status']> = {
      'ready_to_pick': 'PENDING',
      'picking': 'PICKED_UP',
      'cancel': 'EXCEPTION',
      'money_collect_picking': 'PICKED_UP',
      'picked': 'PICKED_UP',
      'storing': 'IN_TRANSIT',
      'transporting': 'IN_TRANSIT',
      'sorting': 'IN_TRANSIT',
      'delivering': 'OUT_FOR_DELIVERY',
      'money_collect_delivering': 'OUT_FOR_DELIVERY',
      'delivered': 'DELIVERED',
      'delivery_fail': 'EXCEPTION',
      'waiting_to_return': 'EXCEPTION',
      'return': 'RETURNED',
      'return_transporting': 'RETURNED',
      'return_sorting': 'RETURNED',
      'returning': 'RETURNED',
      'return_fail': 'EXCEPTION',
      'returned': 'RETURNED',
      'exception': 'EXCEPTION',
      'damage': 'EXCEPTION',
      'lost': 'EXCEPTION',
    };

    return statusMap[status] || 'PENDING';
  }

  private mapGHTKStatus(statusId: number): TrackingInfo['status'] {
    const statusMap: Record<number, TrackingInfo['status']> = {
      1: 'PENDING',
      2: 'PICKED_UP',
      3: 'IN_TRANSIT',
      4: 'IN_TRANSIT',
      5: 'OUT_FOR_DELIVERY',
      6: 'DELIVERED',
      7: 'EXCEPTION',
      8: 'RETURNED',
      9: 'EXCEPTION',
      10: 'EXCEPTION',
      11: 'EXCEPTION',
      12: 'EXCEPTION',
      13: 'RETURNED',
      20: 'EXCEPTION',
      21: 'EXCEPTION',
      123: 'EXCEPTION',
    };

    return statusMap[statusId] || 'PENDING';
  }
}
