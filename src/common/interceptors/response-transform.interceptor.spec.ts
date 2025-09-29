import { ResponseTransformInterceptor } from './response-transform.interceptor';

describe('ResponseTransformInterceptor', () => {
  it('serializes Date instances to ISO strings', () => {
    const interceptor = new ResponseTransformInterceptor<any>();

    const input = {
      id: '1',
      scheduledAt: new Date('2025-09-24T00:00:00.000Z'),
      nested: {
        createdAt: new Date('2025-09-23T02:00:00.000Z'),
        arr: [new Date('2025-09-22T00:00:00.000Z')]
      }
    };

    // access private method for test purposes
    const serialized = (interceptor as any).serializeBigInt(input);

    expect(serialized).toEqual({
      id: '1',
      scheduledAt: '2025-09-24T00:00:00.000Z',
      nested: {
        createdAt: '2025-09-23T02:00:00.000Z',
        arr: ['2025-09-22T00:00:00.000Z']
      }
    });
  });
});
