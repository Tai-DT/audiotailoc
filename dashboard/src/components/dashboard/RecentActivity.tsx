'use client'

import { motion } from 'framer-motion'
import {
  UserIcon,
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
  ShieldCheckIcon,
  ServerIcon,
  ClockIcon,
} from '@heroicons/react/24/outline'
import { RecentActivity as RecentActivityType } from '@/src/contexts/DashboardContext'

interface RecentActivityProps {
  activities: RecentActivityType[]
}

export default function RecentActivity({ activities }: RecentActivityProps) {
  const getActivityIcon = (type: RecentActivityType['type']) => {
    switch (type) {
      case 'create':
        return <PlusIcon className="h-5 w-5 text-green-500" />
      case 'update':
        return <PencilSquareIcon className="h-5 w-5 text-blue-500" />
      case 'delete':
        return <TrashIcon className="h-5 w-5 text-red-500" />
      case 'login':
        return <UserIcon className="h-5 w-5 text-purple-500" />
      case 'backup':
        return <ServerIcon className="h-5 w-5 text-yellow-500" />
      case 'system':
        return <ShieldCheckIcon className="h-5 w-5 text-indigo-500" />
      default:
        return <ClockIcon className="h-5 w-5 text-gray-500" />
    }
  }

  const getActivityColor = (type: RecentActivityType['type']) => {
    switch (type) {
      case 'create':
        return 'bg-green-50 dark:bg-green-900/20'
      case 'update':
        return 'bg-blue-50 dark:bg-blue-900/20'
      case 'delete':
        return 'bg-red-50 dark:bg-red-900/20'
      case 'login':
        return 'bg-purple-50 dark:bg-purple-900/20'
      case 'backup':
        return 'bg-yellow-50 dark:bg-yellow-900/20'
      case 'system':
        return 'bg-indigo-50 dark:bg-indigo-900/20'
      default:
        return 'bg-gray-50 dark:bg-gray-700'
    }
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return 'Vừa xong'
    if (diffInMinutes < 60) return `${diffInMinutes} phút trước`

    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `${diffInHours} giờ trước`

    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays} ngày trước`

    return date.toLocaleDateString('vi-VN')
  }

  const getActivityText = (activity: RecentActivityType) => {
    const actionText = {
      create: 'đã tạo',
      update: 'đã cập nhật',
      delete: 'đã xóa',
      login: 'đã đăng nhập',
      backup: 'hoàn thành',
      system: 'đã thực hiện',
    }[activity.type]

    return `${activity.user} ${actionText} ${activity.target.toLowerCase()}`
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Hoạt động gần đây
          </h3>
          <button className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300">
            Xem tất cả
          </button>
        </div>

        <div className="flow-root">
          <ul role="list" className="-mb-8">
            {activities.map((activity, activityIdx) => (
              <motion.li
                key={activity.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: activityIdx * 0.1 }}
              >
                <div className="relative pb-8">
                  {activityIdx !== activities.length - 1 ? (
                    <span
                      className="absolute left-5 top-5 -ml-px h-full w-0.5 bg-gray-200 dark:bg-gray-700"
                      aria-hidden="true"
                    />
                  ) : null}
                  <div className="relative flex items-start space-x-3">
                    <div className="relative">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-full ${getActivityColor(activity.type)}`}>
                        {getActivityIcon(activity.type)}
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {getActivityText(activity)}
                      </div>
                      <div className="mt-1 flex items-center space-x-2">
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {formatTimestamp(activity.timestamp)}
                        </p>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                          activity.type === 'create' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' :
                          activity.type === 'update' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300' :
                          activity.type === 'delete' ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300' :
                          activity.type === 'login' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300' :
                          activity.type === 'backup' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300' :
                          'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300'
                        }`}>
                          {activity.type === 'create' ? 'Tạo mới' :
                           activity.type === 'update' ? 'Cập nhật' :
                           activity.type === 'delete' ? 'Xóa' :
                           activity.type === 'login' ? 'Đăng nhập' :
                           activity.type === 'backup' ? 'Sao lưu' :
                           'Hệ thống'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.li>
            ))}
          </ul>
        </div>

        {/* Empty State */}
        {activities.length === 0 && (
          <div className="text-center py-12">
            <ClockIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
              Chưa có hoạt động
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Hoạt động hệ thống sẽ xuất hiện ở đây.
            </p>
          </div>
        )}

        {/* View More Button */}
        {activities.length > 0 && (
          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button className="w-full flex items-center justify-center px-4 py-2 text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 bg-indigo-50 dark:bg-indigo-900/20 rounded-md hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-colors">
              <ClockIcon className="h-4 w-4 mr-2" />
              Xem thêm hoạt động
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
