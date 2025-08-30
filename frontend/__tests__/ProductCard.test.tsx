import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProductCard from '../components/ProductCard';

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    pathname: '/',
    query: '',
    asPath: '/',
  }),
}));

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />,
}));

describe('ProductCard', () => {
  const mockProduct = {
    id: '1',
    slug: 'test-product',
    name: 'Test Product',
    description: 'This is a test product',
    priceCents: 100000, // 1,000 VND
    imageUrl: '/test-image.jpg',
    inStock: true,
    featured: true,
  };

  it('renders product information correctly', () => {
    render(<ProductCard product={mockProduct} />);

    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('This is a test product')).toBeInTheDocument();
    expect(screen.getByText('1,000')).toBeInTheDocument();
  });

  it('displays featured badge when product is featured', () => {
    render(<ProductCard product={mockProduct} />);

    expect(screen.getByText('Nổi bật')).toBeInTheDocument();
  });

  it('shows stock status correctly', () => {
    render(<ProductCard product={mockProduct} />);

    expect(screen.getByText('Còn hàng')).toBeInTheDocument();
  });

  it('formats price correctly', () => {
    render(<ProductCard product={mockProduct} />);

    expect(screen.getByText('1,000')).toBeInTheDocument();
  });
});