/**
 * Unit tests for Avatar component
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

describe('Avatar', () => {
  it('should render avatar container', () => {
    const { container } = render(<Avatar />);
    expect(container.firstChild).toHaveClass('relative');
    expect(container.firstChild).toHaveClass('flex');
    expect(container.firstChild).toHaveClass('overflow-hidden');
  });

  it('should render fallback when no image', () => {
    render(
      <Avatar>
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
    );
    expect(screen.getByText('JD')).toBeInTheDocument();
  });

  it('should accept custom className', () => {
    const { container } = render(<Avatar className="custom-avatar" />);
    expect(container.firstChild).toHaveClass('custom-avatar');
  });
});
