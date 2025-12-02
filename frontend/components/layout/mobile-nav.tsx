'use client';

import React from 'react';
import Link from 'next/link';
import {
  Menu,
  Search,
  Heart,
  ShoppingBag,
  Mic as MicIcon,
  Speaker as SpeakerIcon,
  SlidersHorizontal,
  PackageSearch,
  ChevronRight,
  Package,
  Wrench,
  Info,
  BookOpen,
  Mail,
  Home,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

interface Category {
  id: string;
  name: string;
  slug?: string;
  parentId?: string | null;
  children?: Category[];
}

interface ServiceType {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

interface Service {
  id: string;
  name: string;
  slug?: string;
}

interface MobileNavProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleSearch: (e: React.FormEvent<HTMLFormElement>) => void;
  categories?: Category[];
  serviceTypes?: ServiceType[];
  servicesByType?: Record<string, Service[]>;
  isAuthenticated: boolean;
  wishlistCount?: { count: number };
}

const quickCategories = [
  { label: 'Mic', href: '/products?category=mic', icon: MicIcon },
  { label: 'Loa', href: '/products?category=loa', icon: SpeakerIcon },
  { label: 'Mixer', href: '/products?category=mixer', icon: SlidersHorizontal },
  { label: 'Thanh Lý', href: '/products?category=thanh-ly', icon: PackageSearch },
];

export function MobileNav({
  searchQuery,
  setSearchQuery,
  handleSearch,
  categories = [],
  serviceTypes = [],
  servicesByType = {},
  isAuthenticated,
  wishlistCount,
}: MobileNavProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [openCategories, setOpenCategories] = React.useState<Record<string, boolean>>({});
  const [openServiceTypes, setOpenServiceTypes] = React.useState<Record<string, boolean>>({});

  const toggleCategory = (categoryId: string) => {
    setOpenCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  const toggleServiceType = (serviceTypeId: string) => {
    setOpenServiceTypes((prev) => ({
      ...prev,
      [serviceTypeId]: !prev[serviceTypeId],
    }));
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden h-9 w-9 sm:h-10 sm:w-10"
          aria-label="Open mobile menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[85vw] sm:w-[400px] p-0">
        <SheetHeader className="border-b p-4">
          <SheetTitle className="text-left">Menu</SheetTitle>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-80px)]">
          <div className="space-y-4 p-4">
            {/* Search Form */}
            <form onSubmit={handleSearch} className="space-y-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Tìm kiếm..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </form>

            <Separator />

            {/* Quick Category Access */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase">
                Danh mục nổi bật
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {quickCategories.map((item) => (
                  <SheetClose key={item.label} asChild>
                    <Link
                      href={item.href}
                      className="group flex items-center gap-2 rounded-lg border bg-card p-3 transition-all hover:border-primary hover:bg-primary/5"
                    >
                      <item.icon className="h-4 w-4 text-primary flex-shrink-0" />
                      <span className="text-sm font-medium">{item.label}</span>
                    </Link>
                  </SheetClose>
                ))}
              </div>
            </div>

            <Separator />

            {/* Main Navigation */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase">
                Điều hướng
              </h3>
              <nav className="space-y-1">
                <SheetClose asChild>
                  <Link
                    href="/"
                    className="flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                  >
                    <div className="flex items-center gap-3">
                      <Home className="h-4 w-4" />
                      <span>Trang chủ</span>
                    </div>
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </SheetClose>

                {/* Products with Categories */}
                <Collapsible
                  open={openCategories['products']}
                  onOpenChange={() => toggleCategory('products')}
                >
                  <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground">
                    <div className="flex items-center gap-3">
                      <Package className="h-4 w-4" />
                      <span>Sản phẩm</span>
                    </div>
                    <ChevronRight
                      className={`h-4 w-4 transition-transform ${
                        openCategories['products'] ? 'rotate-90' : ''
                      }`}
                    />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-1 pl-6 pt-1">
                    <SheetClose asChild>
                      <Link
                        href="/products"
                        className="block rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                      >
                        Tất cả sản phẩm
                      </Link>
                    </SheetClose>
                    {categories.map((category) => (
                      <SheetClose key={category.id} asChild>
                        <Link
                          href={`/products?category=${category.slug}`}
                          className="block rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                        >
                          {category.name}
                          {category.children && category.children.length > 0 && (
                            <Badge variant="secondary" className="ml-2 text-xs">
                              {category.children.length}
                            </Badge>
                          )}
                        </Link>
                      </SheetClose>
                    ))}
                  </CollapsibleContent>
                </Collapsible>

                {/* Services with Types */}
                <Collapsible
                  open={openServiceTypes['services']}
                  onOpenChange={() => toggleServiceType('services')}
                >
                  <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground">
                    <div className="flex items-center gap-3">
                      <Wrench className="h-4 w-4" />
                      <span>Dịch vụ</span>
                    </div>
                    <ChevronRight
                      className={`h-4 w-4 transition-transform ${
                        openServiceTypes['services'] ? 'rotate-90' : ''
                      }`}
                    />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-1 pl-6 pt-1">
                    <SheetClose asChild>
                      <Link
                        href="/services"
                        className="block rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                      >
                        Tất cả dịch vụ
                      </Link>
                    </SheetClose>
                    {serviceTypes.map((serviceType) => (
                      <SheetClose key={serviceType.id} asChild>
                        <Link
                          href={`/services?type=${serviceType.slug}`}
                          className="block rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                        >
                          {serviceType.name}
                          {servicesByType[serviceType.id] && (
                            <Badge variant="secondary" className="ml-2 text-xs">
                              {servicesByType[serviceType.id].length}
                            </Badge>
                          )}
                        </Link>
                      </SheetClose>
                    ))}
                  </CollapsibleContent>
                </Collapsible>

                {/* Other Navigation Links */}
                <SheetClose asChild>
                  <Link
                    href="/about"
                    className="flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                  >
                    <div className="flex items-center gap-3">
                      <Info className="h-4 w-4" />
                      <span>Giới thiệu</span>
                    </div>
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </SheetClose>

                <SheetClose asChild>
                  <Link
                    href="/blog"
                    className="flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                  >
                    <div className="flex items-center gap-3">
                      <BookOpen className="h-4 w-4" />
                      <span>Blog</span>
                    </div>
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </SheetClose>

                <SheetClose asChild>
                  <Link
                    href="/contact"
                    className="flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                  >
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4" />
                      <span>Liên hệ</span>
                    </div>
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </SheetClose>

                {/* Wishlist & Orders for authenticated users */}
                {isAuthenticated && (
                  <>
                    <SheetClose asChild>
                      <Link
                        href="/wishlist"
                        className="flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                      >
                        <div className="flex items-center gap-3">
                          <Heart className="h-4 w-4" />
                          <span>Yêu thích</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {wishlistCount && wishlistCount.count > 0 && (
                            <Badge variant="secondary">{wishlistCount.count}</Badge>
                          )}
                          <ChevronRight className="h-4 w-4" />
                        </div>
                      </Link>
                    </SheetClose>

                    <SheetClose asChild>
                      <Link
                        href="/orders"
                        className="flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                      >
                        <div className="flex items-center gap-3">
                          <ShoppingBag className="h-4 w-4" />
                          <span>Đơn hàng</span>
                        </div>
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    </SheetClose>
                  </>
                )}
              </nav>
            </div>

            {/* Auth Actions for non-authenticated users */}
            {!isAuthenticated && (
              <>
                <Separator />
                <div className="space-y-2">
                  <SheetClose asChild>
                    <Button variant="outline" className="w-full" asChild>
                      <Link href="/auth/login">Đăng nhập</Link>
                    </Button>
                  </SheetClose>
                  <SheetClose asChild>
                    <Button className="w-full" asChild>
                      <Link href="/register">Đăng ký</Link>
                    </Button>
                  </SheetClose>
                </div>
              </>
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
