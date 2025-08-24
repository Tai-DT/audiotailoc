'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  KeyIcon,
  EyeIcon,
  EyeSlashIcon,
  LockClosedIcon,
  UserGroupIcon,
  DocumentTextIcon,
  ClockIcon,
} from '@heroicons/react/24/outline'

const securityStats = {
  totalUsers: 15420,
  activeSessions: 89,
  failedLogins: 23,
  blockedIPs: 12,
  securityAlerts: 5,
  lastSecurityScan: '2024-01-15T06:00:00Z',
}

const recentSecurityEvents = [
  {
    id: '1',
    type: 'failed_login',
    user: 'unknown',
    ip: '192.168.1.100',
    location: 'Ho Chi Minh City, Vietnam',
    timestamp: '2024-01-15T14:30:00Z',
    severity: 'low',
    details: 'Invalid password attempt',
  },
  {
    id: '2',
    type: 'suspicious_activity',
    user: 'nguyenvana@example.com',
    ip: '10.0.0.50',
    location: 'Ha Noi, Vietnam',
    timestamp: '2024-01-15T13:45:00Z',
    severity: 'medium',
    details: 'Multiple failed API requests',
  },
  {
    id: '3',
    type: 'password_change',
    user: 'tranthib@example.com',
    ip: '192.168.1.200',
    location: 'Da Nang, Vietnam',
    timestamp: '2024-01-15T12:20:00Z',
    severity: 'low',
    details: 'Password successfully changed',
  },
  {
    id: '4',
    type: 'unusual_login',
    user: 'levanc@example.com',
    ip: '203.0.113.10',
    location: 'Singapore',
    timestamp: '2024-01-15T11:15:00Z',
    severity: 'high',
    details: 'Login from unusual location',
  },
]

export default function SecurityPage() {
  const [showPasswords, setShowPasswords] = useState(false)
  const [activeTab, setActiveTab] = useState<'overview' | 'events' | 'settings'>('overview')

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low':
        return 'text-green-600 dark:text-green-400'
      case 'medium':
        return 'text-yellow-600 dark:text-yellow-400'
      case 'high':
        return 'text-red-600 dark:text-red-400'
      default:
        return 'text-gray-600 dark:text-gray-400'
    }
  }

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'failed_login':
        return <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
      case 'suspicious_activity':
        return <ShieldCheckIcon className="h-5 w-5 text-yellow-500" />
      case 'password_change':
        return <KeyIcon className="h-5 w-5 text-green-500" />
      case 'unusual_login':
        return <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
      default:
        return <ClockIcon className="h-5 w-5 text-gray-500" />
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Bảo mật & An ninh
        </h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Giám sát bảo mật, quản lý truy cập và xử lý sự cố an ninh
        </p>
      </div>

      {/* Security Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Người dùng hoạt động</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {securityStats.activeSessions}
              </p>
            </div>
            <UserGroupIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Đăng nhập thất bại</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {securityStats.failedLogins}
              </p>
            </div>
            <ExclamationTriangleIcon className="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">IP bị chặn</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {securityStats.blockedIPs}
              </p>
            </div>
            <LockClosedIcon className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
          </div>
        </motion.div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', name: 'Tổng quan', icon: ShieldCheckIcon },
            { id: 'events', name: 'Sự kiện', icon: DocumentTextIcon },
            { id: 'settings', name: 'Cài đặt', icon: KeyIcon },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                activeTab === tab.id
                  ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <tab.icon className="h-5 w-5" />
              <span>{tab.name}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Security Status */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                Trạng thái bảo mật
              </h2>
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-green-600 dark:text-green-400">Tất cả ổn</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <ShieldCheckIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
                  <span className="text-sm font-medium text-green-800 dark:text-green-300">
                    Firewall Active
                  </span>
                </div>
              </div>

              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <LockClosedIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
                  <span className="text-sm font-medium text-green-800 dark:text-green-300">
                    Encryption Enabled
                  </span>
                </div>
              </div>

              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <KeyIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
                  <span className="text-sm font-medium text-green-800 dark:text-green-300">
                    2FA Required
                  </span>
                </div>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                  <span className="text-sm font-medium text-yellow-800 dark:text-yellow-300">
                    5 Security Alerts
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Security Metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Metrics bảo mật
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Quét bảo mật cuối cùng</span>
                  <span className="text-sm text-gray-900 dark:text-white">
                    {formatDate(securityStats.lastSecurityScan)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Phiên hoạt động</span>
                  <span className="text-sm text-gray-900 dark:text-white">
                    {securityStats.activeSessions}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">IP bị chặn</span>
                  <span className="text-sm text-gray-900 dark:text-white">
                    {securityStats.blockedIPs}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Cảnh báo bảo mật</span>
                  <span className="text-sm text-red-600 dark:text-red-400 font-medium">
                    {securityStats.securityAlerts}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-between p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-colors">
                  <span className="text-sm font-medium text-indigo-700 dark:text-indigo-300">
                    Chạy quét bảo mật
                  </span>
                  <ShieldCheckIcon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                </button>

                <button className="w-full flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors">
                  <span className="text-sm font-medium text-green-700 dark:text-green-300">
                    Kiểm tra firewall
                  </span>
                  <LockClosedIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
                </button>

                <button className="w-full flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
                  <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                    Tạo báo cáo bảo mật
                  </span>
                  <DocumentTextIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </button>

                <button className="w-full flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg hover:bg-yellow-100 dark:hover:bg-yellow-900/30 transition-colors">
                  <span className="text-sm font-medium text-yellow-700 dark:text-yellow-300">
                    Quản lý IP bị chặn
                  </span>
                  <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Events Tab */}
      {activeTab === 'events' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                  Sự kiện bảo mật gần đây
                </h2>
                <div className="flex space-x-2">
                  <select className="text-sm border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1">
                    <option>Tất cả mức độ</option>
                    <option>High</option>
                    <option>Medium</option>
                    <option>Low</option>
                  </select>
                  <select className="text-sm border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1">
                    <option>Tất cả loại</option>
                    <option>Failed Login</option>
                    <option>Suspicious Activity</option>
                    <option>Password Change</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {recentSecurityEvents.map((event) => (
                <div key={event.id} className="px-6 py-4">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      {getEventIcon(event.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {event.user === 'unknown' ? 'Unknown User' : event.user}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {event.details}
                          </p>
                        </div>
                        <div className="flex flex-col items-end space-y-1">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(event.severity)}`}>
                            {event.severity.toUpperCase()}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {formatDate(event.timestamp)}
                          </span>
                        </div>
                      </div>

                      <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                        <span>IP: {event.ip}</span>
                        <span>Location: {event.location}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
              Cài đặt bảo mật
            </h2>

            <div className="space-y-6">
              {/* Authentication Settings */}
              <div>
                <h3 className="text-md font-medium text-gray-900 dark:text-white mb-4">
                  Authentication Settings
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-900 dark:text-white">
                        Yêu cầu 2FA
                      </label>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Yêu cầu xác thực hai yếu tố cho tất cả người dùng
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      defaultChecked
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-900 dark:text-white">
                        Mật khẩu mạnh
                      </label>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Yêu cầu mật khẩu có ít nhất 8 ký tự, chữ hoa, chữ thường và số
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      defaultChecked
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-900 dark:text-white">
                        Giới hạn đăng nhập
                      </label>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Chặn IP sau 5 lần đăng nhập thất bại
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      defaultChecked
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              </div>

              {/* Session Settings */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <h3 className="text-md font-medium text-gray-900 dark:text-white mb-4">
                  Session Settings
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Session Timeout (phút)
                    </label>
                    <input
                      type="number"
                      defaultValue="60"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Maximum Active Sessions
                    </label>
                    <input
                      type="number"
                      defaultValue="5"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Security Monitoring */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <h3 className="text-md font-medium text-gray-900 dark:text-white mb-4">
                  Security Monitoring
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-900 dark:text-white">
                        Log Failed Login Attempts
                      </label>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Ghi log tất cả lần đăng nhập thất bại
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      defaultChecked
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-900 dark:text-white">
                        Suspicious Activity Alerts
                      </label>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Gửi cảnh báo cho hoạt động đáng ngờ
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      defaultChecked
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-900 dark:text-white">
                        IP Geolocation Tracking
                      </label>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Theo dõi vị trí địa lý của IP đăng nhập
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      defaultChecked
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors">
                Lưu cài đặt
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  )
}
