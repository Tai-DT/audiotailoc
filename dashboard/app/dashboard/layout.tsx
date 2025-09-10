'use client';

import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { ProtectedRoute } from '@/components/auth/protected-route';

export default function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div suppressHydrationWarning>
        <DashboardLayout>
          {children}
        </DashboardLayout>
      </div>
    </ProtectedRoute>
  );
}
