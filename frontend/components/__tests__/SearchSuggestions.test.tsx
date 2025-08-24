import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SearchSuggestions from '../SearchSuggestions'

// Mock fetch
const mockFetch = jest.fn()
global.fetch = mockFetch

describe('SearchSuggestions', () => {
  const mockOnSearch = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    mockFetch.mockClear()
  })

  it('renders search input with placeholder', () => {
    render(<SearchSuggestions onSearch={mockOnSearch} placeholder="Search products..." />)

    const input = screen.getByPlaceholderText('Search products...')
    expect(input).toBeInTheDocument()
  })

  it('shows popular searches when input is focused and empty', async () => {
    const mockPopularSearches = ['tai nghe', 'loa bluetooth', 'ampli']
    
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockPopularSearches,
    })

    render(<SearchSuggestions onSearch={mockOnSearch} />)

    const input = screen.getByRole('textbox')
    fireEvent.focus(input)

    await waitFor(() => {
      expect(screen.getByText('Tìm kiếm phổ biến')).toBeInTheDocument()
      expect(screen.getByText('tai nghe')).toBeInTheDocument()
      expect(screen.getByText('loa bluetooth')).toBeInTheDocument()
      expect(screen.getByText('ampli')).toBeInTheDocument()
    })
  })

  it('fetches and displays suggestions when typing', async () => {
    const user = userEvent.setup()
    const mockSuggestions = ['Sony WH-1000XM4', 'Sony WH-CH720N']

    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [], // Popular searches
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockSuggestions,
      })

    render(<SearchSuggestions onSearch={mockOnSearch} />)

    const input = screen.getByRole('textbox')
    await user.type(input, 'sony')

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/catalog/search/suggestions?q=sony&limit=5')
    })

    await waitFor(() => {
      expect(screen.getByText('Gợi ý tìm kiếm')).toBeInTheDocument()
      expect(screen.getByText('Sony WH-1000XM4')).toBeInTheDocument()
      expect(screen.getByText('Sony WH-CH720N')).toBeInTheDocument()
    })
  })

  it('calls onSearch when suggestion is clicked', async () => {
    const user = userEvent.setup()
    const mockSuggestions = ['Sony WH-1000XM4']

    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockSuggestions,
      })

    render(<SearchSuggestions onSearch={mockOnSearch} />)

    const input = screen.getByRole('textbox')
    await user.type(input, 'sony')

    await waitFor(() => {
      expect(screen.getByText('Sony WH-1000XM4')).toBeInTheDocument()
    })

    const suggestion = screen.getByText('Sony WH-1000XM4')
    await user.click(suggestion)

    expect(mockOnSearch).toHaveBeenCalledWith('Sony WH-1000XM4')
  })

  it('calls onSearch when Enter is pressed', async () => {
    const user = userEvent.setup()

    render(<SearchSuggestions onSearch={mockOnSearch} />)

    const input = screen.getByRole('textbox')
    await user.type(input, 'test query')
    await user.keyboard('{Enter}')

    expect(mockOnSearch).toHaveBeenCalledWith('test query')
  })

  it('navigates suggestions with arrow keys', async () => {
    const user = userEvent.setup()
    const mockSuggestions = ['Suggestion 1', 'Suggestion 2', 'Suggestion 3']

    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockSuggestions,
      })

    render(<SearchSuggestions onSearch={mockOnSearch} />)

    const input = screen.getByRole('textbox')
    await user.type(input, 'test')

    await waitFor(() => {
      expect(screen.getByText('Suggestion 1')).toBeInTheDocument()
    })

    // Navigate down
    await user.keyboard('{ArrowDown}')
    await user.keyboard('{ArrowDown}')

    // Press Enter on second suggestion
    await user.keyboard('{Enter}')

    expect(mockOnSearch).toHaveBeenCalledWith('Suggestion 2')
  })

  it('closes suggestions when Escape is pressed', async () => {
    const user = userEvent.setup()

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ['popular search'],
    })

    render(<SearchSuggestions onSearch={mockOnSearch} />)

    const input = screen.getByRole('textbox')
    fireEvent.focus(input)

    await waitFor(() => {
      expect(screen.getByText('popular search')).toBeInTheDocument()
    })

    await user.keyboard('{Escape}')

    await waitFor(() => {
      expect(screen.queryByText('popular search')).not.toBeInTheDocument()
    })
  })

  it('shows loading state while fetching suggestions', async () => {
    const user = userEvent.setup()

    // Mock a delayed response
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      })
      .mockImplementationOnce(() => new Promise(resolve => setTimeout(resolve, 100)))

    render(<SearchSuggestions onSearch={mockOnSearch} />)

    const input = screen.getByRole('textbox')
    await user.type(input, 'test')

    await waitFor(() => {
      expect(screen.getByText('Đang tìm kiếm...')).toBeInTheDocument()
    })
  })

  it('handles fetch errors gracefully', async () => {
    const user = userEvent.setup()

    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      })
      .mockRejectedValueOnce(new Error('Network error'))

    render(<SearchSuggestions onSearch={mockOnSearch} />)

    const input = screen.getByRole('textbox')
    await user.type(input, 'test')

    // Should not crash and should not show suggestions
    await waitFor(() => {
      expect(screen.queryByText('Gợi ý tìm kiếm')).not.toBeInTheDocument()
    })
  })

  it('debounces search requests', async () => {
    const user = userEvent.setup()

    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => [],
    })

    render(<SearchSuggestions onSearch={mockOnSearch} />)

    const input = screen.getByRole('textbox')
    
    // Type quickly
    await user.type(input, 'test')

    // Should only make one request after debounce delay
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledTimes(2) // 1 for popular searches, 1 for suggestions
    })
  })

  it('shows "no suggestions" message when no results found', async () => {
    const user = userEvent.setup()

    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      })

    render(<SearchSuggestions onSearch={mockOnSearch} />)

    const input = screen.getByRole('textbox')
    await user.type(input, 'nonexistent')

    await waitFor(() => {
      expect(screen.getByText('Không tìm thấy gợi ý nào')).toBeInTheDocument()
    })
  })
})
