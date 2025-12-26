'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CustomerAdminRedirect ()
{
  const router = useRouter();

  useEffect( () =>
  {
    router.replace( '/profile' );
  }, [ router ] );

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">Đang chuyển hướng...</h2>
        <p className="text-muted-foreground">Bạn đang được chuyển đến trang hồ sơ mới.</p>
      </div>
    </div>
  );
}
