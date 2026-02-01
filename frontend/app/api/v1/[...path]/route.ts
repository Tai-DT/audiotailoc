import { proxyRequest } from '../proxy-handler';

export async function GET(req: Request) {
  return proxyRequest(req, 'GET');
}

export async function POST(req: Request) {
  return proxyRequest(req, 'POST');
}

export async function PUT(req: Request) {
  return proxyRequest(req, 'PUT');
}

export async function PATCH(req: Request) {
  return proxyRequest(req, 'PATCH');
}

export async function DELETE(req: Request) {
  return proxyRequest(req, 'DELETE');
}
