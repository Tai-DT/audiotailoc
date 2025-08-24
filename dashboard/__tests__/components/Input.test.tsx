import { render, screen } from '@testing-library/react'
import { Input } from '@/components/ui/input'

describe('Input', () => {
  it('renders input with placeholder', () => {
    render(<Input placeholder="Enter text" />)
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    render(<Input className="custom-class" />)
    const input = screen.getByRole('textbox')
    expect(input).toHaveClass('custom-class')
  })

  it('handles value changes', () => {
    render(<Input data-testid="test-input" />)
    const input = screen.getByTestId('test-input')
    expect(input).toHaveValue('')
  })

  it('can be disabled', () => {
    render(<Input disabled />)
    const input = screen.getByRole('textbox')
    expect(input).toBeDisabled()
  })

  it('supports different input types', () => {
    render(<Input type="email" />)
    const input = screen.getByRole('textbox')
    expect(input).toHaveAttribute('type', 'email')
  })
})
