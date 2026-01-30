'use client';

import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MapPin, Loader2, X } from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { useDebounce } from '@/hooks/use-debounce';

interface LocationPickerProps {
    value?: string;
    onChange: (address: string, coordinates?: string, placeId?: string) => void;
    placeholder?: string;
    className?: string;
}

interface PlacePrediction {
    place_id: string;
    description: string;
    structured_formatting: {
        main_text: string;
        secondary_text: string;
    };
}

interface GoongApiResponse {
    predictions?: PlacePrediction[];
    items?: PlacePrediction[];
    result?: {
        geometry?: {
            location?: {
                lat: number;
                lng: number;
            };
        };
    };
    geometry?: {
        location?: {
            lat: number;
            lng: number;
        };
    };
}

export function LocationPicker({ value, onChange, placeholder = 'Nhập địa chỉ...', className }: LocationPickerProps) {
    const [inputValue, setInputValue] = useState(value || '');
    const [predictions, setPredictions] = useState<PlacePrediction[]>([]);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    const debouncedSearch = useDebounce(inputValue, 500);

    useEffect(() => {
        setInputValue(value || '');
    }, [value]);

    useEffect(() => {
        const fetchPredictions = async () => {
            if (!debouncedSearch || debouncedSearch.length < 3) {
                setPredictions([]);
                return;
            }

            // Don't search if the input matches the current value (user selected an item)
            if (debouncedSearch === value) return;

            try {
                setLoading(true);
                const response = await apiClient.searchPlaces(debouncedSearch);
                // Backend returns Goong API format directly: { predictions: [...] } or { items: [] }
                const data = response.data as GoongApiResponse;
                if (data.predictions) {
                    setPredictions(data.predictions);
                    setIsOpen(true);
                } else if (data.items && Array.isArray(data.items)) {
                    // Handle alternative format from Goong API
                    setPredictions(data.items);
                    setIsOpen(true);
                }
            } catch (error) {
                console.error('Error fetching places:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPredictions();
    }, [debouncedSearch, value]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = async (prediction: PlacePrediction) => {
        setInputValue(prediction.description);
        setIsOpen(false);
        setLoading(true);

        try {
            const response = await apiClient.getPlaceDetail(prediction.place_id);
            // Backend returns Goong API format directly: { result: {...} }
            const data = response.data as GoongApiResponse;
            const result = data.result || data;
            const geometry = result && typeof result === 'object' && 'geometry' in result 
                ? (result as GoongApiResponse).geometry 
                : data.geometry;
            if (geometry && geometry.location) {
                const { lat, lng } = geometry.location;
                onChange(prediction.description, `${lat},${lng}`, prediction.place_id);
            } else {
                onChange(prediction.description, undefined, prediction.place_id);
            }
        } catch (error) {
            console.error('Error fetching place details:', error);
            onChange(prediction.description, undefined, prediction.place_id);
        } finally {
            setLoading(false);
        }
    };

    const handleClear = () => {
        setInputValue('');
        onChange('', undefined, undefined);
        setPredictions([]);
    };

    return (
        <div ref={wrapperRef} className={`relative ${className}`}>
            <div className="relative">
                <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                    value={inputValue}
                    onChange={(e) => {
                        setInputValue(e.target.value);
                        if (!e.target.value) setIsOpen(false);
                    }}
                    placeholder={placeholder}
                    className="pl-9 pr-8"
                />
                {inputValue && (
                    <button
                        onClick={handleClear}
                        className="absolute right-2 top-2.5 text-gray-400 hover:text-gray-600"
                    >
                        <X className="h-4 w-4" />
                    </button>
                )}
            </div>

            {isOpen && predictions.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
                    {predictions.map((prediction) => (
                        <button
                            key={prediction.place_id}
                            className="w-full text-left px-4 py-2 hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
                            onClick={() => handleSelect(prediction)}
                        >
                            <div className="font-medium text-sm">{prediction.structured_formatting.main_text}</div>
                            <div className="text-xs text-gray-500">{prediction.structured_formatting.secondary_text}</div>
                        </button>
                    ))}
                </div>
            )}

            {loading && (
                <div className="absolute right-8 top-2.5">
                    <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
                </div>
            )}
        </div>
    );
}
