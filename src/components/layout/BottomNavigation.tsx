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
  History 
} from 'lucide-react'

const navigation = [
  { name: 'Home', href: '/home', icon: LayoutDashboard },
  { name: 'Wallets', href: '/wallets', icon: Wallet },
  { name: 'Send', href: '/send', icon: Send },
  { name: 'Request', href: '/requests', icon: ArrowDownLeft },
  { name: 'History', href: '/history', icon: History },
]

export function BottomNavigation() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-bedrock border-t border-hairline lg:hidden transition-colors">
      <div className="flex items-center justify-around px-2 py-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex flex-col items-center gap-1 rounded px-3 py-2 transition-all',
                isActive ? 'text-primary' : 'text-neutral-500 hover:text-white'
              )}
            >
              <Icon className={cn('h-5 w-5', isActive && 'scale-110')} />
              <span className="text-[10px] font-medium tracking-tight">
                {item.name}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
