import Link from 'next/link';
import Image from 'next/image';
import { Phone, Mail, Clock } from 'lucide-react';

/**
 * HeaderStatic - Server Component
 * Contains all static content that doesn't need client-side JavaScript.
 * This renders instantly on the server for fast FCP/LCP.
 */
export function HeaderStatic() {
  return (
    <>
      {/* Top info bar - Completely static */}
      <div className="hidden lg:block border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between text-xs py-2 text-muted-foreground">
            <div className="flex items-center space-x-4 lg:space-x-6">
              <a 
                href="tel:0768426262" 
                className="flex items-center space-x-1.5 hover:text-primary transition-colors group"
              >
                <Phone className="h-3.5 w-3.5 text-primary group-hover:scale-110 transition-transform" />
                <span className="font-medium">Hotline: 0768 426 262</span>
              </a>
              <a 
                href="mailto:support@audiotailoc.com"
                className="hidden xl:flex items-center space-x-1.5 hover:text-primary transition-colors group"
              >
                <Mail className="h-3.5 w-3.5 text-primary group-hover:scale-110 transition-transform" />
                <span>support@audiotailoc.com</span>
              </a>
              <span className="hidden xl:flex items-center space-x-1.5 text-muted-foreground">
                <Clock className="h-3.5 w-3.5 text-accent" />
                <span>08:00 - 21:00 (T2 - CN)</span>
              </span>
            </div>
            <div className="flex items-center space-x-4 lg:space-x-6">
              <Link href="/shipping" className="hover:text-primary transition-colors hover:underline text-xs">
                Chính sách giao hàng
              </Link>
              <Link href="/warranty" className="hover:text-primary transition-colors hover:underline text-xs">
                Bảo hành & đổi trả
              </Link>
              <Link href="/support" className="hover:text-primary transition-colors hover:underline text-xs">
                Hỗ trợ kỹ thuật
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Logo - Static, renders immediately */}
      <div className="container mx-auto px-4">
        <div className="flex h-14 items-center justify-between gap-2 sm:gap-4">
          <Link href="/" className="flex items-center space-x-3 shrink-0 group">
            <div className="relative h-8 w-28 sm:h-9 sm:w-36 transition-transform group-hover:scale-105">
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
        </div>
      </div>
    </>
  );
}

/**
 * Static Navigation Links - Used by both Header and its server shell
 */
export const PRIMARY_NAV_LINKS = [
  { href: '/about', label: 'Giới thiệu' },
  { href: '/du-an', label: 'Dự án' },
  { href: '/blog', label: 'Blog' },
  { href: '/support', label: 'Hỗ trợ' },
  { href: '/contact', label: 'Liên hệ' },
] as const;

export const SUB_NAV_LINKS = [
  { label: 'Micro', href: '/products?category=micro-karaoke-khong-day' },
  { label: 'Loa', href: '/products?category=loa-loa-sub' },
  { label: 'Mixer', href: '/products?category=mixer-vang-so' },
  { label: 'Thanh Lý', href: '/products?category=hang-thanh-ly-hang-cu' },
] as const;
