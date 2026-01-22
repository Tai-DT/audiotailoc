const request = require('supertest');
const app = require('../app');

const token = 'Bearer testtoken';

describe('Dashboard API', () => {
  test('GET /api/v1/dashboard/summary returns 200 and summary', async () => {
    const res = await request(app).get('/api/v1/dashboard/summary').set('Authorization', token);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('summary');
    expect(res.body.summary).toHaveProperty('revenue');
  });

  test('GET /api/v1/dashboard/metrics returns 200', async () => {
    const res = await request(app).get('/api/v1/dashboard/metrics').set('Authorization', token);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('data');
  });

  test('POST /api/v1/dashboard/refresh validates input', async () => {
    const res = await request(app).post('/api/v1/dashboard/refresh').set('Authorization', token).send({ scope: 'invalid' });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('code', 'INVALID_INPUT');
  });

  test('POST /api/v1/dashboard/refresh accepts valid body', async () => {
    const res = await request(app).post('/api/v1/dashboard/refresh').set('Authorization', token).send({ scope: 'all' });
    expect([202, 200]).toContain(res.statusCode);
    expect(res.body).toHaveProperty('jobId');
  });
});
