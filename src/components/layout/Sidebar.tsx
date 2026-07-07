'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { 
  LayoutDashboard, 
  Wallet, 
  Send, 
  ArrowDownLeft, 
  History, 
  Settings, 
  ExternalLink,
  Coins
} from 'lucide-react'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

const navigation = [
  { name: 'Dashboard', href: '/home', icon: LayoutDashboard },
  { name: 'Wallets', href: '/wallets', icon: Wallet },
  { name: 'Send', href: '/send', icon: Send },
  { name: 'Request', href: '/requests', icon: ArrowDownLeft },
  { name: 'History', href: '/history', icon: History },
  { name: 'Settings', href: '/settings', icon: Settings },
]

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const pathname = usePathname()

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/60 lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside className={cn(
        'bg-bedrock border-r border-hairline h-full flex flex-col transition-all duration-300',
        'fixed top-16 left-0 z-50 w-64 transform lg:static lg:w-64 lg:translate-x-0',
        isOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => onClose()}
                  className={cn(
                    'flex items-center px-3 py-2 text-sm font-medium rounded transition-colors group',
                    {
                      'bg-focus text-primary': isActive,
                      'text-neutral-400 hover:bg-focus hover:text-white': !isActive,
                    }
                  )}
                >
                  <Icon className={cn(
                    'mr-3 h-4 w-4 transition-colors',
                    isActive ? 'text-primary' : 'text-neutral-500 group-hover:text-white'
                  )} />
                  {item.name}
                </Link>
              )
            })}
        </nav>
        
        {/* Footer */}
        <div className="px-4 py-4 border-t border-hairline flex-shrink-0 bg-chrome">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
              <span className="text-white font-bold text-xs">C4</span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-white">Catch402</p>
              <p className="text-[10px] text-neutral-500 uppercase tracking-widest">Telemetry Router</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
