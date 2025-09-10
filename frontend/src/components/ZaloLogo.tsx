import React from 'react';
import './ZaloLogo.css';

type Props = {
  size?: number | string; // pixel number or css size string
  alt?: string;
  className?: string;
  src?: string; // override the default public asset path
};

export default function ZaloLogo({ size = 40, alt = 'Zalo', className = '', src = '/assets/zalo-original.png' }: Props) {
  const style = typeof size === 'number' ? { width: size, height: size } : { width: size, height: 'auto' };
  return (
    <img
      src={src}
      alt={alt}
      className={`zalo-logo ${className}`}
      style={style}
      loading="lazy"
    />
  );
}
