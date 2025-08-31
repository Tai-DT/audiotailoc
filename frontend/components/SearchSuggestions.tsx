"use client"

import { useState, useEffect, useRef, useCallback } from 'react';
import { Input } from '@/components/ui/input';

interface SearchSuggestionsProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
}

export default function SearchSuggestions({ 
  onSearch, 
  placeholder = "Tìm kiếm sản phẩm...", 
  className = "" 
}: SearchSuggestionsProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [popularSearches, setPopularSearches] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  const base = process.env.NEXT_PUBLIC_API_BASE_URL;

  const fetchPopularSearches = useCallback(async () => {
    try {
      // Use categories as popular search seeds (proxy or direct)
      const response = await fetch(`/api/search/products?q=`);
      if (response.ok) {
        const data = await response.json();
        const names = (Array.isArray(data.items) ? data.items : []).map((p: any) => p?.name).filter(Boolean);
        setPopularSearches((names.slice(0, 8).length ? names.slice(0, 8) : ["tai nghe", "loa bluetooth", "soundbar", "ampli", "micro"]))
      } else {
        setPopularSearches(["tai nghe", "loa bluetooth", "soundbar", "ampli", "micro"]);
      }
    } catch (error) {
      console.error('Failed to fetch popular searches:', error);
      setPopularSearches(["tai nghe", "loa bluetooth", "soundbar", "ampli", "micro"]);
    }
  }, [base]);

  const fetchSuggestions = useCallback(async (q: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/search/products?q=${encodeURIComponent(q)}`);
      if (response.ok) {
        const data = await response.json();
        const items = Array.isArray(data?.items) ? data.items : [];
        setSuggestions(items.map((it: any) => it?.name).filter(Boolean));
      } else {
        setSuggestions([]);
      }
    } catch (error) {
      console.error('Failed to fetch suggestions:', error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  }, [base]);

  // Fetch popular searches on mount
  useEffect(() => {
    fetchPopularSearches();
  }, [fetchPopularSearches]);

  // Fetch suggestions when query changes
  useEffect(() => {
    if (query.length >= 2) {
      const timeoutId = setTimeout(() => {
        fetchSuggestions(query);
      }, 300); // Debounce

      return () => clearTimeout(timeoutId);
    } else {
      setSuggestions([]);
    }
  }, [query, fetchSuggestions]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setSelectedIndex(-1);
    setIsOpen(true);
  };

  const handleInputFocus = () => {
    setIsOpen(true);
  };

  const handleInputBlur = () => {
    // Delay closing to allow clicking on suggestions
    setTimeout(() => setIsOpen(false), 200);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const allSuggestions = query.length >= 2 ? suggestions : popularSearches;
    
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => 
        prev < allSuggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => prev > -1 ? prev - 1 : -1);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && allSuggestions[selectedIndex]) {
        handleSearch(allSuggestions[selectedIndex]);
      } else if (query.trim()) {
        handleSearch(query.trim());
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    setIsOpen(false);
    onSearch(searchQuery);
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSearch(suggestion);
  };

  const allSuggestions = query.length >= 2 ? suggestions : popularSearches;
  const showSuggestions = isOpen && (allSuggestions.length > 0 || query.length >= 2);

  return (
    <div className={`relative ${className}`}>
      <Input
        ref={inputRef}
        type="text"
        value={query}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="w-full"
      />

      {showSuggestions && (
        <div
          ref={suggestionsRef}
          className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-80 overflow-y-auto"
        >
          {query.length >= 2 ? (
            // Search suggestions
            <>
              {isLoading ? (
                <div className="p-3 text-center text-gray-500">
                  <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <span className="ml-2">Đang tìm kiếm...</span>
                </div>
              ) : suggestions.length > 0 ? (
                <>
                  <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b">
                    Gợi ý tìm kiếm
                  </div>
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={suggestion}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className={`w-full text-left px-3 py-2 hover:bg-gray-50 transition-colors ${
                        selectedIndex === index ? 'bg-blue-50 text-blue-700' : ''
                      }`}
                    >
                      <div className="flex items-center">
                        <span className="text-gray-400 mr-2">🔍</span>
                        <span>{suggestion}</span>
                      </div>
                    </button>
                  ))}
                </>
              ) : (
                <div className="p-3 text-center text-gray-500">
                  Không tìm thấy gợi ý nào
                </div>
              )}
            </>
          ) : (
            // Popular searches
            popularSearches.length > 0 && (
              <>
                <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b">
                  Tìm kiếm phổ biến
                </div>
                {popularSearches.map((search, index) => (
                  <button
                    key={search}
                    onClick={() => handleSuggestionClick(search)}
                    className={`w-full text-left px-3 py-2 hover:bg-gray-50 transition-colors ${
                      selectedIndex === index ? 'bg-blue-50 text-blue-700' : ''
                    }`}
                  >
                    <div className="flex items-center">
                      <span className="text-gray-400 mr-2">🔥</span>
                      <span>{search}</span>
                    </div>
                  </button>
                ))}
              </>
            )
          )}

          {/* Quick search button */}
          {query.trim() && (
            <>
              <div className="border-t border-gray-100"></div>
              <button
                onClick={() => handleSearch(query.trim())}
                className={`w-full text-left px-3 py-2 hover:bg-gray-50 transition-colors font-medium ${
                  selectedIndex === allSuggestions.length ? 'bg-blue-50 text-blue-700' : ''
                }`}
              >
                <div className="flex items-center">
                  <span className="text-blue-600 mr-2">⏎</span>
                  <span>Tìm kiếm &quot;{query.trim()}&quot;</span>
                </div>
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
