import React from 'react'
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

interface DataPoint {
  name: string
  value: number
  [key: string]: any
}

interface BarChartProps {
  data: DataPoint[]
  bars: Array<{
    key: string
    color: string
    name: string
  }>
  title?: string
  height?: number
  showGrid?: boolean
  showLegend?: boolean
  horizontal?: boolean
}

export function BarChart({
  data,
  bars,
  title,
  height = 300,
  showGrid = true,
  showLegend = true,
  horizontal = false,
}: BarChartProps) {
  return (
    <div className="w-full">
      {title && (
        <h3 className="text-lg font-semibold mb-4">{title}</h3>
      )}
      
      <ResponsiveContainer width="100%" height={height}>
        <RechartsBarChart
          data={data}
          layout={horizontal ? 'horizontal' : 'vertical'}
        >
          {showGrid && <CartesianGrid strokeDasharray="3 3" />}
          
          <XAxis
            dataKey={horizontal ? 'value' : 'name'}
            type={horizontal ? 'number' : 'category'}
            tick={{ fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          
          <YAxis
            dataKey={horizontal ? 'name' : 'value'}
            type={horizontal ? 'category' : 'number'}
            tick={{ fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            }}
          />
          
          {showLegend && (
            <Legend
              verticalAlign="top"
              height={36}
              iconType="circle"
            />
          )}
          
          {bars.map((bar) => (
            <Bar
              key={bar.key}
              dataKey={bar.key}
              fill={bar.color}
              radius={[4, 4, 0, 0]}
              name={bar.name}
            />
          ))}
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  )
}

// Example usage:
// const data = [
//   { name: 'Jan', revenue: 4000, users: 2400 },
//   { name: 'Feb', revenue: 3000, users: 1398 },
//   { name: 'Mar', revenue: 2000, users: 9800 },
// ]
//
// const bars = [
//   { key: 'revenue', color: '#3b82f6', name: 'Revenue' },
//   { key: 'users', color: '#10b981', name: 'Users' },
// ]
