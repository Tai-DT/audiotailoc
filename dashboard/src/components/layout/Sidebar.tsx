'use client'

import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  ChartBarIcon,
  HomeIcon,
  DocumentIcon,
  ServerStackIcon,
  ShieldCheckIcon,
  ClockIcon,
  UsersIcon,
  CubeIcon,
  ShoppingBagIcon,
  CogIcon,
  BeakerIcon,
  EnvelopeIcon,
  XMarkIcon,
  SpeakerWaveIcon,
} from '@heroicons/react/24/outline'
import { clsx } from 'clsx'

const navigation = [
  { name: 'Tổng quan', href: '/', icon: HomeIcon },
  { name: 'Giám sát', href: '/monitoring', icon: ChartBarIcon },
  { name: 'API Docs', href: '/api-docs', icon: DocumentIcon },
  { name: 'Backup & Recovery', href: '/backup', icon: ServerStackIcon },
  { name: 'Bảo mật', href: '/security', icon: ShieldCheckIcon },
  { name: 'Người dùng', href: '/users', icon: UsersIcon },
  { name: 'Sản phẩm', href: '/products', icon: CubeIcon },
  { name: 'Đơn hàng', href: '/orders', icon: ShoppingBagIcon },
  { name: 'Hệ thống', href: '/system', icon: CogIcon },
  { name: 'API Test', href: '/api-test', icon: BeakerIcon },
  { name: 'Email', href: '/email', icon: EnvelopeIcon },
  { name: 'Lịch sử', href: '/logs', icon: ClockIcon },
]

const monitoringSubNav = [
  { name: 'Performance', href: '/monitoring/performance' },
  { name: 'Health Checks', href: '/monitoring/health' },
  { name: 'Metrics', href: '/monitoring/metrics' },
  { name: 'Real-time', href: '/monitoring/realtime' },
]

const backupSubNav = [
  { name: 'Dashboard', href: '/backup/dashboard' },
  { name: 'Schedules', href: '/backup/schedules' },
  { name: 'History', href: '/backup/history' },
  { name: 'Settings', href: '/backup/settings' },
]

interface SidebarProps {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
}

export default function Sidebar({ sidebarOpen, setSidebarOpen }: SidebarProps) {
  const pathname = usePathname()

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 px-6 py-8">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
              <SpeakerWaveIcon className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                Audio Tài Lộc
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Admin Dashboard
              </p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-2">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                const isMonitoring = pathname.startsWith('/monitoring')
                const isBackup = pathname.startsWith('/backup')

                return (
                  <li key={item.name}>
                    <div>
                      <Link
                        href={item.href}
                        className={clsx(
                          'group flex gap-x-3 rounded-md p-3 text-sm leading-6 font-semibold',
                          isActive || (item.name === 'Giám sát' && isMonitoring) || (item.name === 'Backup & Recovery' && isBackup)
                            ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400'
                            : 'text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                        )}
                      >
                        <item.icon
                          className={clsx(
                            'h-6 w-6 shrink-0',
                            isActive || (item.name === 'Giám sát' && isMonitoring) || (item.name === 'Backup & Recovery' && isBackup)
                              ? 'text-indigo-600 dark:text-indigo-400'
                              : 'text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400'
                          )}
                          aria-hidden="true"
                        />
                        {item.name}
                      </Link>

                      {/* Sub-navigation for monitoring */}
                      {item.name === 'Giám sát' && isMonitoring && (
                        <motion.ul
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="ml-6 mt-2 space-y-1"
                        >
                          {monitoringSubNav.map((subItem) => (
                            <li key={subItem.name}>
                              <Link
                                href={subItem.href}
                                className={clsx(
                                  'block rounded-md py-2 pl-3 pr-2 text-sm leading-6',
                                  pathname === subItem.href
                                    ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300'
                                    : 'text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                                )}
                              >
                                {subItem.name}
                              </Link>
                            </li>
                          ))}
                        </motion.ul>
                      )}

                      {/* Sub-navigation for backup */}
                      {item.name === 'Backup & Recovery' && isBackup && (
                        <motion.ul
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="ml-6 mt-2 space-y-1"
                        >
                          {backupSubNav.map((subItem) => (
                            <li key={subItem.name}>
                              <Link
                                href={subItem.href}
                                className={clsx(
                                  'block rounded-md py-2 pl-3 pr-2 text-sm leading-6',
                                  pathname === subItem.href
                                    ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300'
                                    : 'text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                                )}
                              >
                                {subItem.name}
                              </Link>
                            </li>
                          ))}
                        </motion.ul>
                      )}
                    </div>
                  </li>
                )
              })}
            </ul>
          </nav>

          {/* Version info */}
          <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="text-xs text-gray-500 dark:text-gray-400">
              <p>Version 2.0.0</p>
              <p>API v2.0</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sidebar */}
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50 lg:hidden" onClose={setSidebarOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-900/80" />
          </Transition.Child>

          <div className="fixed inset-0 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                    <button
                      type="button"
                      className="-m-2.5 p-2.5"
                      onClick={() => setSidebarOpen(false)}
                    >
                      <span className="sr-only">Close sidebar</span>
                      <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
                    </button>
                  </div>
                </Transition.Child>

                <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white dark:bg-gray-800 px-6 py-8">
                  {/* Logo */}
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
                      <SpeakerWaveIcon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Audio Tài Lộc
                      </h1>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Admin Dashboard
                      </p>
                    </div>
                  </div>

                  {/* Navigation */}
                  <nav className="flex flex-1 flex-col">
                    <ul role="list" className="flex flex-1 flex-col gap-y-2">
                      {navigation.map((item) => {
                        const isActive = pathname === item.href
                        const isMonitoring = pathname.startsWith('/monitoring')
                        const isBackup = pathname.startsWith('/backup')

                        return (
                          <li key={item.name}>
                            <Link
                              href={item.href}
                              onClick={() => setSidebarOpen(false)}
                              className={clsx(
                                'group flex gap-x-3 rounded-md p-3 text-sm leading-6 font-semibold',
                                isActive || (item.name === 'Giám sát' && isMonitoring) || (item.name === 'Backup & Recovery' && isBackup)
                                  ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400'
                                  : 'text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                              )}
                            >
                              <item.icon
                                className={clsx(
                                  'h-6 w-6 shrink-0',
                                  isActive || (item.name === 'Giám sát' && isMonitoring) || (item.name === 'Backup & Recovery' && isBackup)
                                    ? 'text-indigo-600 dark:text-indigo-400'
                                    : 'text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400'
                                )}
                                aria-hidden="true"
                              />
                              {item.name}
                            </Link>
                          </li>
                        )
                      })}
                    </ul>
                  </nav>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  )
}
