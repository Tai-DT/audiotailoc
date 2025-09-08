"use client"

import { useEffect, useRef, useState } from 'react'
import { Input } from './input'
import { Button } from './button'
import { MapPin, X, Search } from 'lucide-react'
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
  const mapRef = useRef<HTMLDivElement>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const geocoderRef = useRef<any>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapInstanceRef = useRef<any>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const markerRef = useRef<any>(null)

  const [searchValue, setSearchValue] = useState(value)
  const [isMapVisible, setIsMapVisible] = useState(false)
  const [selectedAddress, setSelectedAddress] = useState(value)
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null)
  const [suggestions, setSuggestions] = useState<Array<{description: string, place_id: string}>>([])
  const [showSuggestions, setShowSuggestions] = useState(false)

  // Debounce search function
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null)

    const searchAddress = async (query: string) => {
    if (query.length < 3) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }

    try {
      const response = await apiClient.geocodeAddress(query)
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

  const handleSuggestionSelect = (suggestion: {description: string, place_id: string}) => {
    setSearchValue(suggestion.description)
    setSelectedAddress(suggestion.description)
    setShowSuggestions(false)
    setSuggestions([])

    // You can add place detail API call here if needed
    onChange?.(suggestion.description, undefined)
  }

  // Initialize Goong Map
  useEffect(() => {
    if (!isMapVisible || !mapRef.current) return

    const initializeMap = async () => {
      try {
        // Load Goong JS
        if (!window.goongjs) {
          await loadGoongJS()
        }

        // Initialize map
        const map = new window.goongjs.Map({
          container: mapRef.current,
          style: 'https://tiles.goong.io/assets/goong_map_web.json?api_key=8qzxZAuxcsctSlmOszInchP1A5lxlCsYeKGh900u',
          center: [105.8342, 21.0278], // Hanoi coordinates
          zoom: 10
        })

        mapInstanceRef.current = map

        // Add marker
        const marker = new window.goongjs.Marker()
          .setLngLat([105.8342, 21.0278])
          .addTo(map)

        markerRef.current = marker

        // Add click event to map
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        map.on('click', (e: any) => {
          const { lng, lat } = e.lngLat
          marker.setLngLat([lng, lat])
          reverseGeocode(lng, lat)
        })

      } catch (error) {
        console.error('Failed to initialize Goong Map:', error)
      }
    }

    const loadGoongJS = () => {
      return new Promise((resolve, reject) => {
        if (window.goongjs) {
          resolve(window.goongjs)
          return
        }

        const script = document.createElement('script')
        script.src = 'https://cdn.jsdelivr.net/npm/@goongmaps/goong-js@1.0.9/dist/goong-js.js'
        script.onload = () => resolve(window.goongjs)
        script.onerror = reject
        document.head.appendChild(script)
      })
    }

    initializeMap()

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
    }
  }, [isMapVisible])

  // Initialize Geocoder
  useEffect(() => {
    if (!isMapVisible) return

    const initializeGeocoder = async () => {
      try {
        // Load Goong Geocoder
        if (!window.GoongGeocoder) {
          await loadGoongGeocoder()
        }

        const geocoder = new window.GoongGeocoder({
          accessToken: '8qzxZAuxcsctSlmOszInchP1A5lxlCsYeKGh900u',
          placeholder: 'Tìm kiếm địa chỉ...',
          mapboxgl: window.goongjs
        })

        geocoderRef.current = geocoder

        // Add geocoder to map
        if (mapInstanceRef.current) {
          mapInstanceRef.current.addControl(geocoder)
        }

        // Listen for result
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        geocoder.on('result', (e: any) => {
          const { result } = e
          const address = result.place_name
          const [lng, lat] = result.center

          setSelectedAddress(address)
          setCoordinates({ lat, lng })

          if (markerRef.current) {
            markerRef.current.setLngLat([lng, lat])
          }

          if (mapInstanceRef.current) {
            mapInstanceRef.current.flyTo({
              center: [lng, lat],
              zoom: 15
            })
          }
        })

      } catch (error) {
        console.error('Failed to initialize Goong Geocoder:', error)
      }
    }

    const loadGoongGeocoder = () => {
      return new Promise((resolve, reject) => {
        if (window.GoongGeocoder) {
          resolve(window.GoongGeocoder)
          return
        }

        const script = document.createElement('script')
        script.src = 'https://cdn.jsdelivr.net/npm/@goongmaps/goong-geocoder@1.1.1/dist/goong-geocoder.min.js'
        script.onload = () => resolve(window.GoongGeocoder)
        script.onerror = reject
        document.head.appendChild(script)
      })
    }

    initializeGeocoder()

    return () => {
      if (geocoderRef.current && mapInstanceRef.current) {
        mapInstanceRef.current.removeControl(geocoderRef.current)
        geocoderRef.current = null
      }
    }
  }, [isMapVisible])

  const reverseGeocode = async (lng: number, lat: number) => {
    try {
      const response = await fetch(
        `https://rsapi.goong.io/Geocode?latlng=${lat},${lng}&api_key=8qzxZAuxcsctSlmOszInchP1A5lxlCsYeKGh900u`
      )
      const data = await response.json()

      if (data.results && data.results.length > 0) {
        const address = data.results[0].formatted_address
        setSelectedAddress(address)
        setCoordinates({ lat, lng })
      }
    } catch (error) {
      console.error('Reverse geocoding failed:', error)
    }
  }

  const handleConfirmAddress = () => {
    if (selectedAddress && coordinates) {
      setSearchValue(selectedAddress)
      onChange?.(selectedAddress, coordinates)
      setIsMapVisible(false)
    }
  }

  const handleCancel = () => {
    setSelectedAddress(value)
    setIsMapVisible(false)
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="relative">
        <Input
          value={searchValue}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder={placeholder}
          className="pr-10"
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute right-1 top-1 h-8 w-8 p-0"
          onClick={() => setIsMapVisible(!isMapVisible)}
        >
          <MapPin className="h-4 w-4" />
        </Button>

        {/* Suggestions Dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                type="button"
                className="w-full px-4 py-2 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
                onClick={() => handleSuggestionSelect(suggestion)}
              >
                <div className="flex items-center">
                  <Search className="w-4 h-4 mr-2 text-gray-400" />
                  <span className="text-sm">{suggestion.description}</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {isMapVisible && (
        <div className="border rounded-lg p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium">Chọn địa chỉ trên bản đồ</h4>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleCancel}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div
            ref={mapRef}
            className="w-full h-64 rounded-lg border min-h-[256px]"
          />

          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">
              {selectedAddress ? (
                <div>
                  <strong>Địa chỉ đã chọn:</strong> {selectedAddress}
                </div>
              ) : (
                'Chưa chọn địa chỉ'
              )}
            </div>
            {coordinates && (
              <div className="text-xs text-muted-foreground">
                <strong>Tọa độ:</strong> {coordinates.lat.toFixed(6)}, {coordinates.lng.toFixed(6)}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCancel}
            >
              Hủy
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleConfirmAddress}
              disabled={!selectedAddress}
            >
              Xác nhận
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
