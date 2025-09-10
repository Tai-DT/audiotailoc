'use client';

export default function CheckoutLoading() {
  return (
    <div className="container mx-auto px-4 py-8 animate-pulse">
      <div className="h-8 w-48 bg-gray-200 rounded mb-6" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="h-96 bg-gray-200 rounded" />
          <div className="h-20 bg-gray-200 rounded" />
        </div>
        <div className="h-80 bg-gray-200 rounded" />
      </div>
    </div>
  );
}
