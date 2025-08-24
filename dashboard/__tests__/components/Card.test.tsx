import { render, screen } from '@testing-library/react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'

describe('Card', () => {
  it('renders card with content', () => {
    render(
      <Card>
        <CardContent>Card content</CardContent>
      </Card>
    )
    expect(screen.getByText('Card content')).toBeInTheDocument()
  })

  it('renders card with header', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>Card Description</CardDescription>
        </CardHeader>
      </Card>
    )
    expect(screen.getByText('Card Title')).toBeInTheDocument()
    expect(screen.getByText('Card Description')).toBeInTheDocument()
  })

  it('renders card with footer', () => {
    render(
      <Card>
        <CardContent>Content</CardContent>
        <CardFooter>Footer content</CardFooter>
      </Card>
    )
    expect(screen.getByText('Footer content')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    render(<Card className="custom-card" data-testid="card" />)
    const card = screen.getByTestId('card')
    expect(card).toHaveClass('custom-card')
  })
})
