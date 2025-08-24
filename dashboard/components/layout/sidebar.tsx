"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  Home, 
  Users, 
  BarChart3, 
  Settings, 
  Music, 
  Calendar,
  CreditCard,
  MessageSquare,
  FileText
} from "lucide-react"

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Users', href: '/users', icon: Users },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Karaoke', href: '/karaoke', icon: Music },
  { name: 'Bookings', href: '/bookings', icon: Calendar },
  { name: 'Payments', href: '/payments', icon: CreditCard },
  { name: 'Chat', href: '/chat', icon: MessageSquare },
  { name: 'Reports', href: '/reports', icon: FileText },
  { name: 'Settings', href: '/settings', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-full w-64 flex-col bg-gray-900">
      <div className="flex h-16 items-center px-6">
        <h1 className="text-xl font-bold text-white">AudioTailoc</h1>
      </div>
      
      <nav className="flex-1 space-y-1 px-2 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                isActive
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <item.icon className={`mr-3 h-5 w-5 ${
                isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'
              }`} />
              {item.name}
            </Link>
          )
        })}
      </nav>
      
      {/* Footer */}
      <div className="border-t border-gray-700 p-4">
        <div className="text-xs text-gray-400">
          <p>AudioTailoc Dashboard</p>
          <p>Version 1.0.0</p>
        </div>
      </div>
    </div>
  )
}
