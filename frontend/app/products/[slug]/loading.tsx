'use client';

export default function LoadingProductPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 animate-pulse">
        <div className="h-4 w-40 bg-gray-200 rounded mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-4">
            <div className="aspect-square bg-gray-200 rounded-lg" />
            <div className="grid grid-cols-4 gap-2">
              <div className="aspect-square bg-gray-200 rounded" />
              <div className="aspect-square bg-gray-200 rounded" />
              <div className="aspect-square bg-gray-200 rounded" />
              <div className="aspect-square bg-gray-200 rounded" />
            </div>
          </div>
          <div className="space-y-4">
            <div className="h-6 w-56 bg-gray-200 rounded" />
            <div className="h-8 w-40 bg-gray-200 rounded" />
            <div className="h-4 w-full bg-gray-200 rounded" />
            <div className="h-4 w-5/6 bg-gray-200 rounded" />
            <div className="h-10 w-full bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}
