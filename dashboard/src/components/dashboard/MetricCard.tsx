import { motion } from 'framer-motion'
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/solid'
import { LucideIcon } from 'lucide-react'

interface MetricCardProps {
  name: string
  value: string | number
  change: string
  changeType: 'increase' | 'decrease' | 'neutral'
  icon: LucideIcon
  color: string
  bgColor: string
}

export default function MetricCard({
  name,
  value,
  change,
  changeType,
  icon: Icon,
  color,
  bgColor,
}: MetricCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {name}
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            {value}
          </p>
        </div>
        <div className={`p-3 rounded-full ${bgColor}`}>
          <Icon className={`h-6 w-6 ${color}`} />
        </div>
      </div>

      <div className="mt-4 flex items-center">
        {changeType === 'increase' && (
          <ArrowUpIcon className="h-4 w-4 text-green-500" />
        )}
        {changeType === 'decrease' && (
          <ArrowDownIcon className="h-4 w-4 text-red-500" />
        )}
        <span
          className={`text-sm font-medium ml-1 ${
            changeType === 'increase'
              ? 'text-green-600 dark:text-green-400'
              : changeType === 'decrease'
              ? 'text-red-600 dark:text-red-400'
              : 'text-gray-600 dark:text-gray-400'
          }`}
        >
          {change}
        </span>
        <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
          vs last period
        </span>
      </div>
    </motion.div>
  )
}
