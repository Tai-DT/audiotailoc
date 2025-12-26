'use client';

import React from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export function SearchBar ()
{
  const [ searchQuery, setSearchQuery ] = React.useState<string>( '' );
  const [ isFocused, setIsFocused ] = React.useState( false );

  const handleSearch = ( e: React.FormEvent<HTMLFormElement> ): void =>
  {
    e.preventDefault();

    if ( searchQuery.trim() )
    {
      window.location.href = `/search?q=${ encodeURIComponent( searchQuery ) }`;
    }
  };

  const clearSearch = () =>
  {
    setSearchQuery( '' );
  };

  return (
    <div className="hidden lg:flex lg:flex-1 lg:max-w-md xl:max-w-xl">
      <form onSubmit={handleSearch} className="relative group w-full">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center space-x-2 z-10 pointer-events-none">
          <Search className={cn(
            "h-4 w-4 transition-colors duration-300",
            isFocused ? "text-primary" : "text-muted-foreground"
          )} />
          {searchQuery && (
            <div className="audio-wave flex items-center animate-in fade-in zoom-in duration-300">
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
          )}
        </div>
        <Input
          type="text"
          placeholder="Tìm kiếm thiết bị, dịch vụ..."
          value={searchQuery}
          onFocus={() => setIsFocused( true )}
          onBlur={() => setIsFocused( false )}
          onChange={( e: React.ChangeEvent<HTMLInputElement> ) => setSearchQuery( e.target.value )}
          className={cn(
            "h-10 pl-20 pr-10 transition-all duration-300 rounded-full bg-muted/30 border-transparent",
            "hover:bg-muted/50 hover:border-primary/30",
            "focus:bg-background focus:border-primary focus:ring-2 focus:ring-primary/20"
          )}
        />
        {searchQuery && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-all duration-200"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </form>
    </div>
  );
}