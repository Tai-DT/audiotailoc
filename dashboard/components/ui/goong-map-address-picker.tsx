"use client"

import { useRef, useState } from 'react'
import { Input } from './input'
import { Search } from 'lucide-react'
import { apiClient } from '@/lib/api-client'

interface GoongMapAddressPickerProps {
  value?: string
  onChange?: (address: string, coordinates?: { lat: number; lng: number }) => void
  placeholder?: string
  className?: string
}

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    goongjs: any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    GoongGeocoder: any
  }
}

export function GoongMapAddressPicker({
  value = '',
  onChange,
  placeholder = 'Nhập địa chỉ giao hàng',
  className
}: GoongMapAddressPickerProps) {
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const [searchValue, setSearchValue] = useState(value)
  const [suggestions, setSuggestions] = useState<Array<{ description: string, place_id: string }>>([])
  const [showSuggestions, setShowSuggestions] = useState(false)

  // Debounce search function
  const searchAddress = async (query: string) => {
    if (query.length < 3) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }

    try {
      const response = await apiClient.searchPlaces(query)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data = response.data as any

      if (data?.predictions) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setSuggestions(data.predictions.map((item: any) => ({
          description: item.description,
          place_id: item.place_id
        })))
        setShowSuggestions(true)
      }
    } catch (error) {
      console.error('Search failed:', error)
      setSuggestions([])
    }
  }

  const handleSearchChange = (value: string) => {
    setSearchValue(value)
    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }

    // Set new timeout for debounced search
    searchTimeoutRef.current = setTimeout(() => {
      searchAddress(value)
    }, 300)
  }

  const handleSuggestionSelect = async (suggestion: { description: string, place_id: string }) => {
    setSearchValue(suggestion.description)
    setShowSuggestions(false)
    setSuggestions([])

    // Fetch place details to get coordinates
    try {
      const response = await apiClient.getPlaceDetail(suggestion.place_id)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data = response.data as any

      if (data?.result?.geometry?.location) {
        const { lat, lng } = data.result.geometry.location
        onChange?.(suggestion.description, { lat, lng })
      } else {
        onChange?.(suggestion.description, undefined)
      }
    } catch (error) {
      console.error('Failed to get place details:', error)
      onChange?.(suggestion.description, undefined)
    }
  }

  // Cleanup search timeout on unmount
  // (no external scripts or map lifecycle in text-only mode)
  const cleanup = () => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }
  }

  return (
    <div className={`space-y-2 ${className}`} onBlur={cleanup}>
      <div className="relative">
        <Input
          value={searchValue}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder={placeholder}
          className="pr-3"
        />

        {/* Suggestions Dropdown (theme-friendly colors) */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-popover border rounded-md shadow-sm max-h-60 overflow-auto">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                type="button"
                className="w-full px-4 py-2 text-left hover:bg-accent/5 focus:bg-accent/5 focus:outline-none"
                onClick={() => handleSuggestionSelect(suggestion)}
              >
                <div className="flex items-center">
                  <Search className="w-4 h-4 mr-2 text-muted-foreground" />
                  <span className="text-sm text-foreground">{suggestion.description}</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
