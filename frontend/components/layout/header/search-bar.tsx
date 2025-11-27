'use client';

import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

export function SearchBar() {
  const [searchQuery, setSearchQuery] = React.useState<string>('');

  const handleSearch = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    if (searchQuery.trim()) {
      // Navigate to search page with query
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <div className="hidden lg:flex lg:flex-1 lg:max-w-md xl:max-w-xl">
      <form onSubmit={handleSearch} className="relative group w-full">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center space-x-2">
          <Search className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
          {searchQuery && (
            <div className="audio-wave">
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
          )}
        </div>
        <Input
          type="text"
          placeholder="Tìm kiếm thiết bị, dịch vụ, mã sản phẩm..."
          value={searchQuery}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
          className="pl-12 pr-4 hover:border-primary focus:border-primary transition-all duration-300"
        />
      </form>
    </div>
  );
}