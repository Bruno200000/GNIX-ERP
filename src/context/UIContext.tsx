'use client'

import React, { createContext, useContext, useState } from 'react'

interface UIContextType {
  isSidebarOpen: boolean
  isSidebarCollapsed: boolean
  toggleSidebar: () => void
  closeSidebar: () => void
  toggleSidebarCollapse: () => void
}

const UIContext = createContext<UIContextType | undefined>(undefined)

export function UIProvider({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  const toggleSidebar = () => setIsSidebarOpen(prev => !prev)
  const closeSidebar = () => setIsSidebarOpen(false)
  const toggleSidebarCollapse = () => setIsSidebarCollapsed(prev => !prev)

  return (
    <UIContext.Provider value={{ 
      isSidebarOpen, 
      isSidebarCollapsed, 
      toggleSidebar, 
      closeSidebar,
      toggleSidebarCollapse 
    }}>
      {children}
    </UIContext.Provider>
  )
}

export function useUI() {
  const context = useContext(UIContext)
  if (context === undefined) {
    throw new Error('useUI must be used within a UIProvider')
  }
  return context
}
