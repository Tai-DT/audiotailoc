import Link from 'next/link';
import Image from 'next/image';

/**
 * Static Header Shell - Server Component
 * Renders immediately on server for fast FCP
 * The full interactive Header will hydrate on top of this
 */
export function HeaderShell() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/80 shadow-sm">
      {/* Top info bar - Static */}
      <div className="hidden lg:block border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between text-xs py-2 text-muted-foreground">
            <div className="flex items-center space-x-4 lg:space-x-6">
              <a 
                href="tel:0768426262" 
                className="flex items-center space-x-1.5 hover:text-primary transition-colors"
              >
                <span className="font-medium">Hotline: 0768 426 262</span>
              </a>
              <span className="hidden xl:flex items-center space-x-1.5">
                <span>08:00 - 21:00 (T2 - CN)</span>
              </span>
            </div>
            <div className="flex items-center space-x-4 lg:space-x-6">
              <Link href="/shipping" className="hover:text-primary transition-colors text-xs">
                Chính sách giao hàng
              </Link>
              <Link href="/warranty" className="hover:text-primary transition-colors text-xs">
                Bảo hành & đổi trả
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="container mx-auto px-4">
        <div className="flex h-14 items-center justify-between gap-2 sm:gap-4">
          {/* Logo - Static, renders immediately */}
          <Link href="/" className="flex items-center space-x-3 shrink-0">
            <div className="relative h-8 w-28 sm:h-9 sm:w-36">
              <Image
                src="/images/logo/logo-light.svg"
                alt="Audio Tài Lộc"
                width={144}
                height={36}
                className="h-8 w-28 sm:h-9 sm:w-36 object-contain dark:hidden"
                priority
              />
              <Image
                src="/images/logo/logo-dark.svg"
                alt="Audio Tài Lộc"
                width={144}
                height={36}
                className="hidden h-8 w-28 sm:h-9 sm:w-36 object-contain dark:block"
                priority
              />
            </div>
          </Link>

          {/* Placeholder for navigation - will be hydrated */}
          <div className="hidden lg:flex items-center justify-center flex-1">
            <nav className="flex items-center space-x-6">
              {['Sản phẩm', 'Dịch vụ', 'Giới thiệu', 'Blog', 'Liên hệ'].map((label) => (
                <span key={label} className="text-sm text-muted-foreground">
                  {label}
                </span>
              ))}
            </nav>
          </div>

          {/* Placeholder actions */}
          <div className="flex items-center space-x-2">
            <div className="h-9 w-9 rounded-md bg-muted/50 animate-pulse" />
            <div className="h-9 w-9 rounded-md bg-muted/50 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Sub navigation placeholder */}
      <div className="border-t border-muted/50 bg-muted/30 py-2">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-2 sm:gap-3">
            {['Micro', 'Loa', 'Mixer', 'Thanh Lý'].map((label) => (
              <span
                key={label}
                className="rounded-lg border border-transparent bg-background/80 px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-medium text-muted-foreground"
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
