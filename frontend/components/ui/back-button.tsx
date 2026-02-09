'use client';

import { ArrowLeft } from 'lucide-react';

export function BackButton() {
  return (
    <button
      onClick={() => window.history.back()}
      className="mt-8 inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
    >
      <ArrowLeft className="w-4 h-4 mr-2" />
      Quay lại trang trước
    </button>
  );
}
