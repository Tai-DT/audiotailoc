import React from 'react'
import {
  LineChart as RechartsLineChart,
  Line,
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

interface LineChartProps {
  data: DataPoint[]
  lines: Array<{
    key: string
    color: string
    name: string
  }>
  title?: string
  height?: number
  showGrid?: boolean
  showLegend?: boolean
}

export function LineChart({
  data,
  lines,
  title,
  height = 300,
  showGrid = true,
  showLegend = true,
}: LineChartProps) {
  return (
    <div className="w-full">
      {title && (
        <h3 className="text-lg font-semibold mb-4">{title}</h3>
      )}
      
      <ResponsiveContainer width="100%" height={height}>
        <RechartsLineChart data={data}>
          {showGrid && <CartesianGrid strokeDasharray="3 3" />}
          
          <XAxis
            dataKey="name"
            tick={{ fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          
          <YAxis
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
          
          {lines.map((line) => (
            <Line
              key={line.key}
              type="monotone"
              dataKey={line.key}
              stroke={line.color}
              strokeWidth={2}
              dot={{ fill: line.color, strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: line.color, strokeWidth: 2 }}
              name={line.name}
            />
          ))}
        </RechartsLineChart>
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
// const lines = [
//   { key: 'revenue', color: '#3b82f6', name: 'Revenue' },
//   { key: 'users', color: '#10b981', name: 'Users' },
// ]
