/**
 * Unit tests for Separator component
 */
import React from 'react';
import { render } from '@testing-library/react';
import { Separator } from '@/components/ui/separator';

describe('Separator', () => {
  it('should render separator', () => {
    const { container } = render(<Separator />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should have data-slot attribute', () => {
    const { container } = render(<Separator />);
    expect(container.firstChild).toHaveAttribute('data-slot', 'separator');
  });

  it('should have bg-border styling', () => {
    const { container } = render(<Separator />);
    expect(container.firstChild).toHaveClass('bg-border');
  });

  it('should accept custom className', () => {
    const { container } = render(<Separator className="my-separator" />);
    expect(container.firstChild).toHaveClass('my-separator');
  });

  it('should have shrink-0 class', () => {
    const { container } = render(<Separator />);
    expect(container.firstChild).toHaveClass('shrink-0');
  });

  it('should render horizontal orientation by default', () => {
    const { container } = render(<Separator />);
    expect(container.firstChild).toHaveAttribute('data-orientation', 'horizontal');
  });

  it('should render vertical orientation', () => {
    const { container } = render(<Separator orientation="vertical" />);
    expect(container.firstChild).toHaveAttribute('data-orientation', 'vertical');
  });
});
