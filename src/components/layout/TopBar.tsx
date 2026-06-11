'use client'

import React, { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Menu,
  Search,
  Bell,
  User,
  LogOut,
  Settings,
  HelpCircle,
  ChevronDown
} from 'lucide-react'

interface TopBarProps {
  onMenuClick: () => void
  mobile?: boolean
}

function getInitials(name?: string, email?: string): string {
  if (name && name.trim()) {
    const parts = name.trim().split(' ')
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    }
    return name.charAt(0).toUpperCase()
  }
  if (email) return email.charAt(0).toUpperCase()
  return 'U'
}

export function TopBar({ onMenuClick, mobile = false }: TopBarProps) {
  const { logout, isAuthenticated, redirectToAuth, user, loading } = useAuth()
  const router = useRouter()
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSignOut = async () => {
    try {
      setProfileDropdownOpen(false)
      await logout()
      router.push('/')
    } catch (error) {
      console.error('Sign out failed:', error)
    }
  }

  const userEmail = user?.email || ''
  const userName = user?.name || user?.displayName || ''
  const initials = getInitials(userName, userEmail)

  if (!mounted) return null

  return (
    <header className={cn(
      'flex h-16 items-center justify-between bg-bedrock border-b border-hairline px-6 z-50 transition-colors',
      mobile && 'px-4'
    )}>
      {/* Left Section */}
      <div className="flex items-center gap-4 min-w-0">
        <button
          onClick={onMenuClick}
          className="p-2 text-neutral-400 hover:text-white lg:hidden transition-colors"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Logo and App Name */}
        <Link href="/home" className="flex items-center gap-2">
          <div className="h-8 w-8 bg-primary rounded flex items-center justify-center">
             <span className="text-white font-bold text-sm">SD</span>
          </div>
          <span className="font-bold text-white tracking-tight text-lg">SettleDaddy</span>
        </Link>
      </div>

      {/* Center Section - Search */}
      <div className="hidden lg:flex flex-1 justify-center px-12">
        <div className="relative w-full max-w-xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
          <input
            type="text"
            placeholder="Search transactions, addresses..."
            className="w-full bg-chrome border border-hairline rounded px-10 py-2 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-primary/50 transition-colors"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <button className="p-2 text-neutral-400 hover:text-white transition-colors">
          <Bell className="h-5 w-5" />
        </button>

        {/* Profile Section */}
        <div className="relative">
          <button
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className={cn(
              'flex items-center gap-2 p-1 rounded transition-colors',
              profileDropdownOpen ? 'bg-focus' : 'hover:bg-focus'
            )}
          >
            {isAuthenticated && !loading ? (
              <>
                <div className="h-8 w-8 rounded bg-primary flex items-center justify-center text-white font-semibold text-xs">
                  {initials}
                </div>
                {!mobile && (
                  <ChevronDown className={cn(
                    'h-4 w-4 text-neutral-500 transition-transform',
                    profileDropdownOpen && 'rotate-180'
                  )} />
                )}
              </>
            ) : (
              <User className="h-5 w-5 text-neutral-400" />
            )}
          </button>

          {/* Dropdown Menu */}
          {profileDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-chrome border border-hairline rounded shadow-2xl py-1 z-50">
              {isAuthenticated ? (
                <>
                  <div className="px-4 py-3 border-b border-hairline">
                    <p className="text-sm font-semibold text-white truncate">{userName || 'Account'}</p>
                    <p className="text-xs text-neutral-500 truncate">{userEmail}</p>
                  </div>
                  <div className="py-1">
                    <button onClick={() => { setProfileDropdownOpen(false); router.push('/profile') }} className="flex items-center w-full px-4 py-2 text-sm text-neutral-300 hover:bg-focus hover:text-white gap-3 transition-colors">
                      <User className="h-4 w-4" /> <span>Profile</span>
                    </button>
                    <button onClick={() => { setProfileDropdownOpen(false); router.push('/settings') }} className="flex items-center w-full px-4 py-2 text-sm text-neutral-300 hover:bg-focus hover:text-white gap-3 transition-colors">
                      <Settings className="h-4 w-4" /> <span>Settings</span>
                    </button>
                  </div>
                  <div className="border-t border-hairline" />
                  <button onClick={handleSignOut} className="flex items-center w-full px-4 py-2 text-sm text-error hover:bg-error/10 gap-3 transition-colors">
                    <LogOut className="h-4 w-4" /> <span>Sign out</span>
                  </button>
                </>
              ) : (
                <button onClick={() => { setProfileDropdownOpen(false); redirectToAuth() }} className="flex items-center w-full px-4 py-2 text-sm text-primary hover:bg-primary/10 gap-3 transition-colors font-medium">
                  <User className="h-4 w-4" /> <span>Sign in</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
