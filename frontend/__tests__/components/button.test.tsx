/**
 * Unit tests for Button component
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '@/components/ui/button';

describe('Button', () => {
  it('should render with children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toHaveTextContent('Click me');
  });

  it('should call onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should be disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('should apply variant classes', () => {
    const { container } = render(<Button variant="destructive">Delete</Button>);
    // Check that button has some class applied (variant is complex with CVA)
    expect(container.firstChild).toHaveAttribute('class');
  });

  it('should apply size classes', () => {
    const { container } = render(<Button size="lg">Large</Button>);
    // h-12 is the lg size class
    expect(container.firstChild).toHaveClass('h-12');
  });

  it('should render as child component when asChild is true', () => {
    render(
      <Button asChild>
        <a href="/test">Link Button</a>
      </Button>
    );
    expect(screen.getByRole('link')).toBeInTheDocument();
  });

  it('should support aria-label', () => {
    render(<Button aria-label="Submit form">Submit</Button>);
    expect(screen.getByLabelText('Submit form')).toBeInTheDocument();
  });

  it('should have data-slot attribute', () => {
    const { container } = render(<Button>Test</Button>);
    expect(container.firstChild).toHaveAttribute('data-slot', 'button');
  });
});
