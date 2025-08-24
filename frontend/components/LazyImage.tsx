import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface LazyImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  placeholder?: string;
  priority?: boolean;
  quality?: number;
  fill?: boolean;
  sizes?: string;
  onLoad?: () => void;
  onError?: () => void;
}

export function LazyImage({
  src,
  alt,
  width,
  height,
  className,
  placeholder,
  priority = false,
  quality = 75,
  fill = false,
  sizes,
  onLoad,
  onError,
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (priority) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '50px',
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [priority]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  if (hasError) {
    return (
      <div
        ref={imgRef}
        className={cn(
          'bg-gray-200 flex items-center justify-center text-gray-400 text-sm',
          className
        )}
        style={{ width, height }}
      >
        <div className="text-center">
          <div className="text-2xl mb-2">📷</div>
          <p>Không thể tải ảnh</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={imgRef} className={cn('relative overflow-hidden', className)}>
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
          <div className="text-gray-400">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400"></div>
          </div>
        </div>
      )}

      {isInView && (
        <Image
          src={src}
          alt={alt}
          width={fill ? undefined : width}
          height={fill ? undefined : height}
          fill={fill}
          sizes={sizes}
          quality={quality}
          priority={priority}
          className={cn(
            'transition-opacity duration-300',
            isLoaded ? 'opacity-100' : 'opacity-0'
          )}
          onLoad={handleLoad}
          onError={handleError}
          placeholder={placeholder ? 'blur' : 'empty'}
          blurDataURL={placeholder}
        />
      )}
    </div>
  );
}

// Optimized Product Image Component
interface ProductImageProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export function ProductImage({
  src,
  alt,
  className,
  priority = false,
  size = 'medium',
}: ProductImageProps) {
  const dimensions = {
    small: { width: 200, height: 200 },
    medium: { width: 400, height: 300 },
    large: { width: 600, height: 400 },
  };

  return (
    <LazyImage
      src={src}
      alt={alt}
      width={dimensions[size].width}
      height={dimensions[size].height}
      className={cn('rounded-lg object-cover', className)}
      priority={priority}
      sizes={`(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw`}
      placeholder="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
    />
  );
}

