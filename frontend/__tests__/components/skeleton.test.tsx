/**
 * Unit tests for Skeleton component
 */
import React from 'react';
import { render } from '@testing-library/react';
import { Skeleton } from '@/components/ui/skeleton';

describe('Skeleton', () => {
  it('should render skeleton', () => {
    const { container } = render(<Skeleton />);
    expect(container.firstChild).toHaveClass('bg-accent');
    expect(container.firstChild).toHaveClass('animate-pulse');
    expect(container.firstChild).toHaveAttribute('data-slot', 'skeleton');
  });

  it('should accept custom className', () => {
    const { container } = render(<Skeleton className="w-[100px] h-[20px]" />);
    expect(container.firstChild).toHaveClass('w-[100px]');
    expect(container.firstChild).toHaveClass('h-[20px]');
  });
});
