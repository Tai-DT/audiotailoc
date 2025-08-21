import { PromotionService } from '../../src/modules/promotions/promotion.service';

describe('PromotionService', () => {
  const svc = new PromotionService({} as any);
  it('computes percent discounts', () => {
    expect(svc.computeDiscount({ type: 'PERCENT', value: 10 }, 100000)).toBe(10000);
    expect(svc.computeDiscount({ type: 'PERCENT', value: 200 }, 100000)).toBe(100000);
  });
  it('computes fixed discounts', () => {
    expect(svc.computeDiscount({ type: 'FIXED', value: 5000 }, 10000)).toBe(5000);
    expect(svc.computeDiscount({ type: 'FIXED', value: 20000 }, 10000)).toBe(10000);
  });
});

