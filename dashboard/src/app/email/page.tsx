'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  useEmailHistory,
  useEmailStats,
  useEmailTemplates,
  useCreateEmailTemplate,
  useUpdateEmailTemplate,
  useDeleteEmailTemplate,
  useSendEmail,
  useEmailSettings,
  useUpdateEmailSettings
} from '@/hooks/useApi'
import {
  EnvelopeIcon,
  PaperAirplaneIcon,
  EyeIcon,
  PencilSquareIcon,
  TrashIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  MailIcon,
  InboxIcon,
} from '@heroicons/react/24/outline'

const mockEmails = [
  {
    id: '1',
    subject: 'Đơn hàng của bạn đã được xác nhận',
    to: 'nguyenvana@example.com',
    from: 'orders@audiotailoc.com',
    status: 'sent',
    type: 'order_confirmation',
    priority: 'normal',
    sentAt: '2024-01-15T14:30:00Z',
    opened: true,
    clicked: false,
    template: 'order-confirmation',
  },
  {
    id: '2',
    subject: 'Khuyến mãi đặc biệt - Giảm giá 30%',
    to: 'tranthib@example.com',
    from: 'marketing@audiotailoc.com',
    status: 'delivered',
    type: 'promotional',
    priority: 'high',
    sentAt: '2024-01-15T13:45:00Z',
    opened: false,
    clicked: false,
    template: 'promotion-discount',
  },
  {
    id: '3',
    subject: 'Đơn hàng của bạn đang được giao',
    to: 'levanc@example.com',
    from: 'orders@audiotailoc.com',
    status: 'sent',
    type: 'shipping_notification',
    priority: 'normal',
    sentAt: '2024-01-15T12:20:00Z',
    opened: true,
    clicked: true,
    template: 'shipping-update',
  },
  {
    id: '4',
    subject: 'Cập nhật mật khẩu thành công',
    to: 'phamthid@example.com',
    from: 'security@audiotailoc.com',
    status: 'failed',
    type: 'security',
    priority: 'high',
    sentAt: '2024-01-15T11:15:00Z',
    opened: false,
    clicked: false,
    template: 'password-reset',
    error: 'Invalid email address',
  },
]

const emailStats = {
  totalEmails: 15420,
  sentToday: 1247,
  delivered: 14250,
  failed: 170,
  openRate: 34.2,
  clickRate: 12.8,
  templates: 15,
}

const emailTemplates = [
  {
    id: 'order-confirmation',
    name: 'Xác nhận đơn hàng',
    type: 'transactional',
    lastModified: '2024-01-10T08:00:00Z',
    usage: 1247,
    category: 'orders',
  },
  {
    id: 'shipping-update',
    name: 'Cập nhật giao hàng',
    type: 'transactional',
    lastModified: '2024-01-08T10:30:00Z',
    usage: 890,
    category: 'shipping',
  },
  {
    id: 'password-reset',
    name: 'Đặt lại mật khẩu',
    type: 'security',
    lastModified: '2024-01-05T14:20:00Z',
    usage: 456,
    category: 'security',
  },
  {
    id: 'welcome-email',
    name: 'Email chào mừng',
    type: 'transactional',
    lastModified: '2024-01-12T11:15:00Z',
    usage: 2340,
    category: 'onboarding',
  },
  {
    id: 'promotion-discount',
    name: 'Khuyến mãi giảm giá',
    type: 'promotional',
    lastModified: '2024-01-14T09:45:00Z',
    usage: 3456,
    category: 'marketing',
  },
]

export default function EmailPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [selectedEmail, setSelectedEmail] = useState<any>(null)
  const [activeTab, setActiveTab] = useState<'emails' | 'templates' | 'analytics'>('emails')

  // API hooks
  const { data: emailHistoryData, isLoading: emailsLoading } = useEmailHistory({
    status: statusFilter === 'all' ? undefined : statusFilter,
    type: typeFilter === 'all' ? undefined : typeFilter,
    page: 1,
    limit: 50,
  })

  const { data: emailStatsData } = useEmailStats()
  const { data: emailTemplatesData } = useEmailTemplates({
    type: activeTab === 'templates' ? undefined : undefined,
    page: 1,
    limit: 20,
  })

  const { data: emailSettingsData } = useEmailSettings()

  // Mutation hooks
  const sendEmailMutation = useSendEmail()
  const createTemplateMutation = useCreateEmailTemplate()
  const updateTemplateMutation = useUpdateEmailTemplate()
  const deleteTemplateMutation = useDeleteEmailTemplate()
  const updateSettingsMutation = useUpdateEmailSettings()

  // Extract data from API responses
  const emails = emailHistoryData?.data || []
  const emailStats = emailStatsData?.data || {
    totalEmails: 0,
    sentToday: 0,
    delivered: 0,
    failed: 0,
    openRate: 0,
    clickRate: 0,
    templates: 0,
  }
  const emailTemplates = emailTemplatesData?.data || []
  const emailSettings = emailSettingsData?.data || {}

  // Client-side filtering for additional search
  const filteredEmails = emails.filter(email => {
    const matchesSearch = email.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         email.to?.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN')
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />
      case 'delivered':
        return <PaperAirplaneIcon className="h-5 w-5 text-blue-500" />
      case 'failed':
        return <XCircleIcon className="h-5 w-5 text-red-500" />
      case 'pending':
        return <ClockIcon className="h-5 w-5 text-yellow-500" />
      default:
        return <MailIcon className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent':
        return 'text-green-600 dark:text-green-400'
      case 'delivered':
        return 'text-blue-600 dark:text-blue-400'
      case 'failed':
        return 'text-red-600 dark:text-red-400'
      case 'pending':
        return 'text-yellow-600 dark:text-yellow-400'
      default:
        return 'text-gray-600 dark:text-gray-400'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'order_confirmation':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300'
      case 'promotional':
        return 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300'
      case 'shipping_notification':
        return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
      case 'security':
        return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
      default:
        return 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-300'
    }
  }

  const tabs = [
    { id: 'emails', name: 'Email History', icon: MailIcon },
    { id: 'templates', name: 'Templates', icon: DocumentIcon },
    { id: 'analytics', name: 'Analytics', icon: ChartBarIcon },
  ]

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
          Quản lý Email
        </h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Quản lý email, template và theo dõi hiệu suất gửi email
        </p>
      </div>

      {/* Email Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Tổng email</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {emailStats.totalEmails.toLocaleString()}
              </p>
            </div>
            <EnvelopeIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
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
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Gửi hôm nay</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {emailStats.sentToday}
              </p>
            </div>
            <PaperAirplaneIcon className="h-8 w-8 text-green-600 dark:text-green-400" />
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
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Tỷ lệ mở</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {emailStats.openRate}%
              </p>
            </div>
            <EyeIcon className="h-8 w-8 text-purple-600 dark:text-purple-400" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Tỷ lệ click</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {emailStats.clickRate}%
              </p>
            </div>
            <InboxIcon className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
          </div>
        </motion.div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
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

      {/* Emails Tab */}
      {activeTab === 'emails' && (
        <div className="space-y-6">
          {/* Search and Filters */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <EnvelopeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Filters */}
              <div className="flex gap-4">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="all">Tất cả trạng thái</option>
                  <option value="sent">Đã gửi</option>
                  <option value="delivered">Đã giao</option>
                  <option value="failed">Thất bại</option>
                  <option value="pending">Đang chờ</option>
                </select>

                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="all">Tất cả loại</option>
                  <option value="order_confirmation">Xác nhận đơn hàng</option>
                  <option value="promotional">Khuyến mãi</option>
                  <option value="shipping_notification">Thông báo giao hàng</option>
                  <option value="security">Bảo mật</option>
                </select>
              </div>
            </div>
          </div>

          {/* Emails Table */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                  Lịch sử Email
                </h2>
                <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors">
                  <PaperAirplaneIcon className="h-4 w-4 mr-2" />
                  Gửi Email
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Loại
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Trạng thái
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Mở/Click
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Template
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Thời gian gửi
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredEmails.map((email) => (
                    <tr key={email.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {email.subject}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            To: {email.to}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            From: {email.from}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(email.type)}`}>
                          {email.type.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(email.status)}
                          <span className={`text-sm font-medium ${getStatusColor(email.status)}`}>
                            {email.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        <div className="flex items-center space-x-4">
                          <span className={email.opened ? 'text-green-600' : 'text-gray-400'}>
                            {email.opened ? '✓' : '○'} Mở
                          </span>
                          <span className={email.clicked ? 'text-blue-600' : 'text-gray-400'}>
                            {email.clicked ? '✓' : '○'} Click
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {email.template}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(email.sentAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setSelectedEmail(email)}
                            className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                          >
                            <EyeIcon className="h-5 w-5" />
                          </button>
                          <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">
                            <PencilSquareIcon className="h-5 w-5" />
                          </button>
                          <button className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredEmails.length === 0 && (
              <div className="text-center py-12">
                <EnvelopeIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                  Không tìm thấy email
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Không có email nào phù hợp với tiêu chí tìm kiếm.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Templates Tab */}
      {activeTab === 'templates' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">
              Email Templates
            </h2>
            <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors">
              <PencilSquareIcon className="h-4 w-4 mr-2" />
              Tạo Template
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {emailTemplates.map((template) => (
              <div key={template.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                      {template.name}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {template.category}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Đã sử dụng: {template.usage?.toLocaleString() || 0} lần
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Cập nhật: {formatDate(template.lastModified)}
                    </p>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    template.type === 'transactional'
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300'
                      : template.type === 'promotional'
                      ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300'
                      : 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                  }`}>
                    {template.type}
                  </span>
                </div>

                <div className="mt-4 flex items-center space-x-2">
                  <button className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 text-sm">
                    Chỉnh sửa
                  </button>
                  <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 text-sm">
                    Preview
                  </button>
                  <button
                    onClick={() => deleteTemplateMutation.mutate(template.id)}
                    disabled={deleteTemplateMutation.isLoading}
                    className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 text-sm disabled:opacity-50"
                  >
                    Xóa
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">
            Email Analytics
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                Delivery Rate
              </h3>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                92.3%
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                +2.1% from last week
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                Open Rate
              </h3>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                34.2%
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                +5.3% from last week
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                Click Rate
              </h3>
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                12.8%
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                +1.2% from last week
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                Bounce Rate
              </h3>
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                1.1%
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                -0.3% from last week
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Email Performance Trends
            </h3>
            <div className="text-center py-12">
              <ChartBarIcon className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Chart component sẽ được tích hợp tại đây
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Email Details Modal */}
      {selectedEmail && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 bg-opacity-75" onClick={() => setSelectedEmail(null)}></div>
            </div>

            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Chi tiết Email
                  </h3>
                  {getStatusIcon(selectedEmail.status)}
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Subject</label>
                    <p className="text-sm text-gray-900 dark:text-white mt-1">{selectedEmail.subject}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">To</label>
                      <p className="text-sm text-gray-900 dark:text-white mt-1">{selectedEmail.to}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">From</label>
                      <p className="text-sm text-gray-900 dark:text-white mt-1">{selectedEmail.from}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</label>
                      <p className={`text-sm mt-1 ${getStatusColor(selectedEmail.status)}`}>
                        {selectedEmail.status}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Type</label>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${getTypeColor(selectedEmail.type)}`}>
                        {selectedEmail.type.replace('_', ' ')}
                      </span>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Priority</label>
                      <p className="text-sm text-gray-900 dark:text-white mt-1 capitalize">{selectedEmail.priority}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Opened</label>
                      <p className={`text-sm mt-1 ${selectedEmail.opened ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        {selectedEmail.opened ? 'Yes' : 'No'}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Clicked</label>
                      <p className={`text-sm mt-1 ${selectedEmail.clicked ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        {selectedEmail.clicked ? 'Yes' : 'No'}
                      </p>
                    </div>
                  </div>

                  {selectedEmail.error && (
                    <div>
                      <label className="text-sm font-medium text-red-500 dark:text-red-400">Error</label>
                      <p className="text-sm text-red-600 dark:text-red-400 mt-1">{selectedEmail.error}</p>
                    </div>
                  )}

                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Sent At</label>
                    <p className="text-sm text-gray-900 dark:text-white mt-1">{formatDate(selectedEmail.sentAt)}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setSelectedEmail(null)}
                >
                  Đóng
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setSelectedEmail(null)}
                >
                  Resend
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  )
}
