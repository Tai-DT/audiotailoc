import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 200,
  duration: '30s',
};

export function checkout() {
  // Create guest cart
  let res = http.post(`${__ENV.TARGET}/cart/guest`);
  check(res, { 'created cart': r => r.status === 201 || r.status === 200 });
  const cartId = JSON.parse(res.body).id;

  // Add item to cart
  res = http.post(`${__ENV.TARGET}/cart/guest/${cartId}/add`, JSON.stringify({ productId: __ENV.PRODUCT_ID, quantity: 1 }), { headers: { 'Content-Type': 'application/json' } });
  check(res, { 'added to cart': r => r.status === 200 });

  // Attempt checkout
  const idemp = `k6-${__VU}-${Date.now()}`;
  res = http.post(`${__ENV.TARGET}/checkout/create-order`, JSON.stringify({ cartId, customerEmail: `k6+${__VU}@test.local` }), { headers: { 'Content-Type': 'application/json', 'Idempotency-Key': idemp } });
  check(res, { 'checkout accepted': r => r.status === 200 || r.status === 201 });

  sleep(1);
}