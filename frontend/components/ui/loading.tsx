'use client';

import React from 'react';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}

export const Loading: React.FC<LoadingProps> = ({ 
  size = 'md', 
  text = 'Đang tải...',
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className={`animate-spin rounded-full border-b-2 border-blue-600 ${sizeClasses[size]}`}></div>
      {text && (
        <p className="mt-2 text-sm text-gray-600">{text}</p>
      )}
    </div>
  );
};

export const LoadingSpinner: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`animate-spin rounded-full border-b-2 border-blue-600 w-6 h-6 ${className}`}></div>
  );
};

export const LoadingPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Loading size="lg" text="Đang tải trang..." />
    </div>
  );
};
