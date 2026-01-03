/**
 * Unit tests for Alert component
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

describe('Alert', () => {
  it('should render Alert with children', () => {
    render(<Alert>Alert message</Alert>);
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('should render Alert with title and description', () => {
    render(
      <Alert>
        <AlertTitle>Warning</AlertTitle>
        <AlertDescription>This is a warning message</AlertDescription>
      </Alert>
    );
    expect(screen.getByText('Warning')).toBeInTheDocument();
    expect(screen.getByText('This is a warning message')).toBeInTheDocument();
  });

  it('should apply default variant styling', () => {
    const { container } = render(<Alert>Default</Alert>);
    expect(container.firstChild).toHaveClass('bg-card');
  });

  it('should apply destructive variant', () => {
    const { container } = render(<Alert variant="destructive">Error</Alert>);
    expect(container.firstChild).toHaveClass('text-destructive');
  });

  it('should accept custom className', () => {
    const { container } = render(<Alert className="custom-alert">Custom</Alert>);
    expect(container.firstChild).toHaveClass('custom-alert');
  });

  it('should have data-slot attribute', () => {
    const { container } = render(<Alert>Test</Alert>);
    expect(container.firstChild).toHaveAttribute('data-slot', 'alert');
  });
});

describe('AlertTitle', () => {
  it('should render title text', () => {
    render(
      <Alert>
        <AlertTitle>My Title</AlertTitle>
      </Alert>
    );
    expect(screen.getByText('My Title')).toBeInTheDocument();
  });

  it('should have font-medium styling', () => {
    render(
      <Alert>
        <AlertTitle>Styled Title</AlertTitle>
      </Alert>
    );
    expect(screen.getByText('Styled Title')).toHaveClass('font-medium');
  });
});

describe('AlertDescription', () => {
  it('should render description text', () => {
    render(
      <Alert>
        <AlertDescription>Description text</AlertDescription>
      </Alert>
    );
    expect(screen.getByText('Description text')).toBeInTheDocument();
  });

  it('should have text-sm styling', () => {
    render(
      <Alert>
        <AlertDescription>Small text</AlertDescription>
      </Alert>
    );
    expect(screen.getByText('Small text')).toHaveClass('text-sm');
  });
});
