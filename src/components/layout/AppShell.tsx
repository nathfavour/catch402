'use client'

import React from 'react'
import { useSidebar } from '@/contexts/SidebarContext'
import { BottomNavigation } from './BottomNavigation'
import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar'

interface AppShellProps {
  children: React.ReactNode
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const { isSidebarOpen, toggleSidebar } = useSidebar()

  return (
    <div className="flex flex-col h-screen bg-void text-white">
      {/* TopBar */}
      <TopBar onMenuClick={toggleSidebar} mobile={false} />

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />

        {/* Main Content Area */}
        <div className="flex flex-col flex-1 min-w-0 bg-void">
          <main className="flex-1 overflow-y-auto pb-16 lg:pb-0">
            {children}
          </main>

          {/* Mobile Bottom Navigation */}
          <div className="lg:hidden">
            <BottomNavigation />
          </div>
        </div>
      </div>
    </div>
  )
}

export default AppShell
