import React from 'react';
import Link from 'next/link';
import { Phone, Mail, Clock } from 'lucide-react';

export function TopBar() {
  return (
    <div className="hidden lg:block border-b bg-gradient-primary/5">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between text-xs py-1.5 text-muted-foreground">
          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-1.5 hover:text-primary transition-colors">
              <Phone className="h-3.5 w-3.5 text-primary" />
              <span>Hotline: 0768 426 262</span>
            </span>
            <span className="hidden xl:flex items-center space-x-1.5 hover:text-primary transition-colors">
              <Mail className="h-3.5 w-3.5 text-primary" />
              <span>audiotailoc@gmail.com</span>
            </span>
            <span className="hidden xl:flex items-center space-x-1.5 hover:text-accent transition-colors">
              <Clock className="h-3.5 w-3.5 text-accent" />
              <span>08:00 - 21:00 (T2 - CN)</span>
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <Link href="/shipping" className="hover:text-primary hover-audio transition-colors">
              Chính sách giao hàng
            </Link>
            <Link href="/warranty" className="hover:text-primary hover-audio transition-colors">
              Bảo hành & đổi trả
            </Link>
            <Link href="/support" className="hover:text-primary hover-audio transition-colors">
              Hỗ trợ kỹ thuật
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}