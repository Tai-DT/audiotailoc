import { useState, useEffect } from 'react'
import { toast } from 'sonner'

export const useServiceTypes = () => {
  const [serviceTypes, setServiceTypes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchServiceTypes = async () => {
    try {
      setLoading(true)
      setError(null)
      console.log('Fetching service types...')
      const response = await fetch('/api/service-types', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Add auth headers if needed
        },
      })
      console.log('Fetch response status:', response.status)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      console.log('Fetched data:', data)
      setServiceTypes(data || [])
    } catch (err) {
      console.error('Error fetching service types:', err)
      setError(err.message)
      toast.error('Không thể tải danh sách loại dịch vụ')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchServiceTypes()
  }, [])

  return { serviceTypes, loading, error }
}