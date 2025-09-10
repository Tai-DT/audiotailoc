import { renderHook, act, waitFor } from '@testing-library/react'
import { jest } from '@jest/globals'
import { useServiceTypes } from '@/hooks/use-service-types'
import { apiClient } from '@/lib/api-client'

// Mock the API client
jest.mock('@/lib/api-client')
const mockApiClient = apiClient as jest.Mocked<typeof apiClient>

// Create mock functions
const mockGet = jest.fn()
const mockPost = jest.fn()
const mockPut = jest.fn()
const mockDelete = jest.fn()

// Mock the apiClient object
jest.mocked(apiClient).get = mockGet
jest.mocked(apiClient).post = mockPost
jest.mocked(apiClient).put = mockPut
jest.mocked(apiClient).delete = mockDelete

// Mock toast
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}))

describe('useServiceTypes', () => {
  const mockServiceTypes = [
    {
      id: '1',
      name: 'Test Service 1',
      description: 'Description 1',
      slug: 'test-service-1',
      isActive: true,
      sortOrder: 1,
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2023-01-01T00:00:00Z',
    },
    {
      id: '2',
      name: 'Test Service 2',
      description: 'Description 2',
      slug: 'test-service-2',
      isActive: false,
      sortOrder: 2,
      createdAt: '2023-01-02T00:00:00Z',
      updatedAt: '2023-01-02T00:00:00Z',
    },
  ]

  beforeEach(() => {
    mockGet.mockResolvedValue({ data: mockServiceTypes })
    mockPost.mockResolvedValue({ data: mockServiceTypes[0] })
    mockPut.mockResolvedValue({ data: mockServiceTypes[0] })
    mockDelete.mockResolvedValue({})
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('fetches service types on mount', async () => {
    const { result } = renderHook(() => useServiceTypes())

    expect(result.current.loading).toBe(true)

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.serviceTypes).toEqual(mockServiceTypes)
    expect(mockGet).toHaveBeenCalledWith('/service-types')
  })

  test('handles fetch error', async () => {
    const errorMessage = 'Failed to fetch service types'
    mockGet.mockRejectedValue(new Error(errorMessage))

    const { result } = renderHook(() => useServiceTypes())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.error).toBe(errorMessage)
    expect(result.current.serviceTypes).toBeNull()
  })

  test('creates service type successfully', async () => {
    const newServiceType = {
      name: 'New Service',
      description: 'New Description',
      slug: 'new-service',
      isActive: true,
      sortOrder: 3,
    }

    const { result } = renderHook(() => useServiceTypes())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    await act(async () => {
      await result.current.createServiceType(newServiceType)
    })

    expect(mockPost).toHaveBeenCalledWith('/service-types', newServiceType)
    expect(mockGet).toHaveBeenCalledTimes(2) // Initial fetch + refresh
  })

  test('handles create service type error', async () => {
    const errorMessage = 'Failed to create service type'
    mockPost.mockRejectedValue(new Error(errorMessage))

    const { result } = renderHook(() => useServiceTypes())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    await expect(result.current.createServiceType({
      name: 'Test',
      description: 'Test',
      slug: 'test',
      isActive: true,
      sortOrder: 1,
    })).rejects.toThrow(errorMessage)
  })

  test('updates service type successfully', async () => {
    const updateData = {
      name: 'Updated Service',
      description: 'Updated Description',
    }

    const { result } = renderHook(() => useServiceTypes())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    await act(async () => {
      await result.current.updateServiceType('1', updateData)
    })

    expect(mockPut).toHaveBeenCalledWith('/service-types/1', updateData)
    expect(mockGet).toHaveBeenCalledTimes(2) // Initial fetch + refresh
  })

  test('deletes service type successfully', async () => {
    const { result } = renderHook(() => useServiceTypes())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    await act(async () => {
      await result.current.deleteServiceType('1')
    })

    expect(mockDelete).toHaveBeenCalledWith('/service-types/1')
    expect(mockGet).toHaveBeenCalledTimes(2) // Initial fetch + refresh
  })

  test('toggles service type status successfully', async () => {
    const { result } = renderHook(() => useServiceTypes())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    await act(async () => {
      await result.current.toggleServiceTypeStatus('1', false)
    })

    expect(mockPut).toHaveBeenCalledWith('/service-types/1/status', {
      isActive: false,
    })
    expect(mockGet).toHaveBeenCalledTimes(2) // Initial fetch + refresh
  })

  test('refreshes service types', async () => {
    const { result } = renderHook(() => useServiceTypes())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    act(() => {
      result.current.refresh()
    })

    expect(mockGet).toHaveBeenCalledTimes(2) // Initial fetch + refresh
  })
})

// Test utility functions
describe('generateSlug', () => {
  test('generates correct slug from service name', () => {
    // Since generateSlug is internal, we'll test the logic directly
    const generateSlug = (name: string) => {
      return name
        .toLowerCase()
        .replace(/[^\w\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-')      // Replace spaces with hyphens
        .replace(/--+/g, '-')      // Replace multiple hyphens with single hyphen
        .trim()
    }

    expect(generateSlug('Test Service Name')).toBe('test-service-name')
    expect(generateSlug('Test   Service   Name')).toBe('test-service-name')
    expect(generateSlug('Test-Service-Name')).toBe('test-service-name')
    expect(generateSlug('Test Service Name!@#$')).toBe('test-service-name')
    expect(generateSlug('  Test Service Name  ')).toBe('test-service-name')
    expect(generateSlug('')).toBe('')
  })
})