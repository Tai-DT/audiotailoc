'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingCart, Heart, User, LogOut, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth, useLogout } from '@/lib/hooks/use-auth';
import { useCart } from '@/components/providers/cart-provider';
import { useWishlistCount } from '@/lib/hooks/use-wishlist';
import { ThemeToggle } from '@/components/layout/theme-toggle';

export function UserActions() {
  const { itemCount } = useCart();
  const { user } = useAuth();
  const isAuthenticated = !!user;
  const wishlistCount = useWishlistCount();
  const logoutMutation = useLogout();

  const handleLogout = (): void => {
    logoutMutation.mutate();
  };

  return (
    <div className="flex items-center space-x-1 sm:space-x-2">
      <ThemeToggle />
      
      {/* Wishlist */}
      {isAuthenticated && (
        <Link href="/wishlist" className="relative group">
          <Button variant="ghost" size="icon" className="hover:bg-tertiary hover:text-tertiary-foreground transition-all duration-300 hover-lift h-9 w-9 sm:h-10 sm:w-10">
            <Heart className="h-4 w-4 sm:h-5 sm:w-5 group-hover:text-warning transition-colors" />
            {wishlistCount > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-1 -right-1 h-4 w-4 sm:h-5 sm:w-5 rounded-full p-0 flex items-center justify-center text-xs bg-warning text-warning-foreground hover:bg-warning/90"
              >
                {wishlistCount}
              </Badge>
            )}
          </Button>
        </Link>
      )}

      {/* Cart */}
      <Link href="/cart" className="relative group">
        <Button variant="ghost" size="icon" className="hover:bg-accent hover:text-accent-foreground transition-all duration-300 hover-lift h-9 w-9 sm:h-10 sm:w-10">
          <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5 group-hover:text-accent transition-colors" />
          {itemCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-4 w-4 sm:h-5 sm:w-5 rounded-full p-0 flex items-center justify-center text-xs bg-accent text-accent-foreground hover:bg-accent/90"
            >
              {itemCount}
            </Badge>
          )}
        </Button>
      </Link>

      {/* User Menu */}
      {isAuthenticated ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 sm:h-9 sm:w-9 rounded-full">
              <Avatar className="h-8 w-8 sm:h-9 sm:w-9">
                <AvatarImage src={user?.avatar} alt={user?.name} />
                <AvatarFallback>
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user?.name}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/profile" className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                <span>Trang cá nhân</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/orders" className="cursor-pointer">
                <ShoppingBag className="mr-2 h-4 w-4" />
                <span>Đơn hàng</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/wishlist" className="cursor-pointer">
                <Heart className="mr-2 h-4 w-4" />
                <span>Danh sách yêu thích</span>
                {wishlistCount > 0 && (
                  <Badge
                    variant="secondary"
                    className="ml-auto h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                  >
                    {wishlistCount}
                  </Badge>
                )}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Đăng xuất</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <div className="hidden sm:flex items-center space-x-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/auth/login">Đăng nhập</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/register">Đăng ký</Link>
          </Button>
        </div>
      )}
    </div>
  );
}