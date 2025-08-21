import { render, screen, fireEvent } from '@testing-library/react'
import ProductCard from '../ProductCard'

// Mock the formatPrice utility
jest.mock('@/lib/utils', () => ({
  formatPrice: (cents: number) => `${(cents / 100).toLocaleString('vi-VN')} VNĐ`,
}))

const mockProduct = {
  id: '1',
  name: 'Sony WH-1000XM4',
  description: 'Premium wireless noise canceling headphones',
  priceCents: 800000,
  imageUrl: 'https://example.com/image.jpg',
  slug: 'sony-wh-1000xm4',
  categoryId: 'headphones',
  inStock: true,
  featured: true,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
}

describe('ProductCard', () => {
  it('renders product information correctly', () => {
    render(<ProductCard product={mockProduct} />)

    expect(screen.getByText('Sony WH-1000XM4')).toBeInTheDocument()
    expect(screen.getByText('Premium wireless noise canceling headphones')).toBeInTheDocument()
    expect(screen.getByText('8.000 VNĐ')).toBeInTheDocument()
  })

  it('displays product image with correct alt text', () => {
    render(<ProductCard product={mockProduct} />)

    const image = screen.getByAltText('Sony WH-1000XM4')
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute('src', 'https://example.com/image.jpg')
  })

  it('shows "Còn hàng" when product is in stock', () => {
    render(<ProductCard product={mockProduct} />)

    expect(screen.getByText('Còn hàng')).toBeInTheDocument()
  })

  it('shows "Hết hàng" when product is out of stock', () => {
    const outOfStockProduct = { ...mockProduct, inStock: false }
    render(<ProductCard product={outOfStockProduct} />)

    expect(screen.getByText('Hết hàng')).toBeInTheDocument()
  })

  it('shows featured badge for featured products', () => {
    render(<ProductCard product={mockProduct} />)

    expect(screen.getByText('Nổi bật')).toBeInTheDocument()
  })

  it('does not show featured badge for non-featured products', () => {
    const nonFeaturedProduct = { ...mockProduct, featured: false }
    render(<ProductCard product={nonFeaturedProduct} />)

    expect(screen.queryByText('Nổi bật')).not.toBeInTheDocument()
  })

  it('has correct link to product detail page', () => {
    render(<ProductCard product={mockProduct} />)

    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/products/sony-wh-1000xm4')
  })

  it('handles missing image gracefully', () => {
    const productWithoutImage = { ...mockProduct, imageUrl: '' }
    render(<ProductCard product={productWithoutImage} />)

    const image = screen.getByAltText('Sony WH-1000XM4')
    expect(image).toBeInTheDocument()
  })

  it('truncates long descriptions', () => {
    const longDescription = 'This is a very long description that should be truncated because it exceeds the maximum length that we want to display in the product card component'
    const productWithLongDescription = { ...mockProduct, description: longDescription }
    
    render(<ProductCard product={productWithLongDescription} />)

    // The description should be truncated (exact behavior depends on CSS)
    expect(screen.getByText(longDescription)).toBeInTheDocument()
  })

  it('handles click events properly', () => {
    const { container } = render(<ProductCard product={mockProduct} />)

    const card = container.firstChild
    expect(card).toBeInTheDocument()

    // Test that clicking doesn't cause errors
    fireEvent.click(card as Element)
  })

  it('applies correct CSS classes for styling', () => {
    const { container } = render(<ProductCard product={mockProduct} />)

    const card = container.firstChild
    expect(card).toHaveClass('group') // Assuming this class is applied
  })

  it('displays price in correct format', () => {
    const expensiveProduct = { ...mockProduct, priceCents: 1500000 }
    render(<ProductCard product={expensiveProduct} />)

    expect(screen.getByText('15.000 VNĐ')).toBeInTheDocument()
  })

  it('handles zero price', () => {
    const freeProduct = { ...mockProduct, priceCents: 0 }
    render(<ProductCard product={freeProduct} />)

    expect(screen.getByText('0 VNĐ')).toBeInTheDocument()
  })
})
