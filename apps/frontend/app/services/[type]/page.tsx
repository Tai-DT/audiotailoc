import ServiceRequestForm from './service-form';

export default function Page({ params }: { params: Promise<{ type: string }> }) {
  // Next.js app router can provide params as a Promise in some environments
  // so we normalize by awaiting in an async IIFE inside a client component.
  // Here we pass the raw promise down; the client will resolve via use().
  return <ServiceRequestForm params={params} />;
}