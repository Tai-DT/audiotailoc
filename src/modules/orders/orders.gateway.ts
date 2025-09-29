export class OrdersGateway {
  // No-op gateway when websockets are not installed
  server: any;
  emitUpdate(_payload: unknown) {}
}

