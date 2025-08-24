'use client'

import { useEffect, useState } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Line } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

interface PerformanceData {
  timestamp: string
  cpu: number
  memory: number
  responseTime: number
}

export default function PerformanceChart() {
  const [data, setData] = useState<PerformanceData[]>([])
  const [timeRange, setTimeRange] = useState<'1h' | '6h' | '24h'>('1h')

  // Generate mock data
  useEffect(() => {
    const generateData = () => {
      const points = timeRange === '1h' ? 60 : timeRange === '6h' ? 72 : 96
      const interval = timeRange === '1h' ? 60000 : timeRange === '6h' ? 300000 : 900000

      const newData: PerformanceData[] = []
      const now = Date.now()

      for (let i = points - 1; i >= 0; i--) {
        const timestamp = new Date(now - i * interval).toISOString()
        newData.push({
          timestamp,
          cpu: Math.random() * 100,
          memory: 40 + Math.random() * 40,
          responseTime: 100 + Math.random() * 200,
        })
      }

      setData(newData)
    }

    generateData()

    const interval = setInterval(generateData, 30000) // Update every 30 seconds
    return () => clearInterval(interval)
  }, [timeRange])

  const chartData = {
    labels: data.map(d => {
      const date = new Date(d.timestamp)
      return timeRange === '1h'
        ? date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
        : date.toLocaleTimeString('vi-VN', { hour: '2-digit' })
    }),
    datasets: [
      {
        label: 'CPU Usage (%)',
        data: data.map(d => d.cpu),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        pointRadius: 0,
        borderWidth: 2,
      },
      {
        label: 'Memory Usage (%)',
        data: data.map(d => d.memory),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4,
        pointRadius: 0,
        borderWidth: 2,
      },
      {
        label: 'Response Time (ms)',
        data: data.map(d => d.responseTime),
        borderColor: 'rgb(168, 85, 247)',
        backgroundColor: 'rgba(168, 85, 247, 0.1)',
        tension: 0.4,
        pointRadius: 0,
        borderWidth: 2,
        yAxisID: 'responseTime',
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: function(context: any) {
            if (context.datasetIndex === 2) {
              return `${context.dataset.label}: ${context.parsed.y.toFixed(0)}ms`
            }
            return `${context.dataset.label}: ${context.parsed.y.toFixed(1)}%`
          }
        }
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          maxTicksLimit: 8,
        },
      },
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          callback: function(value: any) {
            return value + '%'
          }
        }
      },
      responseTime: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        grid: {
          drawOnChartArea: false,
        },
        ticks: {
          callback: function(value: any) {
            return value + 'ms'
          }
        }
      },
    },
    elements: {
      point: {
        radius: 0,
        hoverRadius: 6,
      },
    },
  }

  return (
    <div className="space-y-4">
      {/* Time Range Selector */}
      <div className="flex justify-between items-center">
        <h4 className="text-sm font-medium text-gray-900 dark:text-white">
          Performance Metrics
        </h4>
        <div className="flex space-x-2">
          {(['1h', '6h', '24h'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1 text-xs rounded-md transition-colors ${
                timeRange === range
                  ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="h-64">
        <Line data={chartData} options={options} />
      </div>

      {/* Current Values */}
      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {data.length > 0 ? data[data.length - 1].cpu.toFixed(1) : '0.0'}%
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">CPU Usage</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {data.length > 0 ? data[data.length - 1].memory.toFixed(1) : '0.0'}%
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Memory Usage</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {data.length > 0 ? data[data.length - 1].responseTime.toFixed(0) : '0'}ms
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Response Time</div>
        </div>
      </div>
    </div>
  )
}
