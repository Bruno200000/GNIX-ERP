'use client'

import { Bell, Search, User, HelpCircle, LogOut, Settings, Menu } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useUI } from "@/context/UIContext"

import { MobileAccessDialog } from "./MobileAccessDialog"

import { AICommandPalette } from "./AICommandPalette"

export function Header() {
  const { toggleSidebar, toggleSidebarCollapse } = useUI()

  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6 dark:border-slate-800 dark:bg-slate-950 transition-colors sticky top-0 z-30 shadow-sm">
      <div className="flex items-center gap-4 lg:gap-8 flex-1">
        {/* Toggle Sidebar Button (Burger) */}
        <button 
          onClick={() => {
            if (window.innerWidth < 1024) {
              toggleSidebar()
            } else {
              toggleSidebarCollapse()
            }
          }}
          className="p-2 -ml-2 rounded-lg text-slate-500 hover:bg-slate-50 hover:text-indigo-600 transition-all"
        >
          <Menu className="h-6 w-6" />
        </button>

        {/* Logo Visible on Header if sidebar is small or for brand reinforcement */}
        <Link href="/" className="flex items-center group lg:hidden">
          <div className="relative w-8 h-8 mr-2">
            <Image 
              src="/logo.png" 
              alt="GNIX Logo" 
              fill
              className="object-contain"
            />
          </div>
          <span className="text-lg font-black text-slate-900 tracking-tighter">GNIX <span className="text-indigo-600">IA</span></span>
        </Link>

        <div className="hidden md:block flex-1 max-w-xl">
          <AICommandPalette />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <MobileAccessDialog />

        <button
          type="button"
          className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-50 hover:text-indigo-600 transition-all dark:bg-slate-950 dark:text-slate-400 dark:hover:text-white"
        >
          <HelpCircle className="h-5 w-5" aria-hidden="true" />
        </button>

        <button
          type="button"
          className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-50 hover:text-indigo-600 transition-all dark:bg-slate-950 dark:text-slate-400 dark:hover:text-white"
        >
          <Bell className="h-5 w-5" aria-hidden="true" />
          <span className="absolute top-2 right-2 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-slate-950" />
        </button>

        <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 mx-2" />

        <div className="flex items-center gap-3 pl-2">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold text-slate-900 dark:text-white leading-none">Bruno Admin</p>
            <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest mt-1">Super Utilisateur</p>
          </div>
          <button className="flex items-center rounded-xl bg-white text-sm focus:outline-none ring-2 ring-indigo-500/10 hover:ring-indigo-500/30 transition-all p-0.5">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center shadow-md">
              <User className="h-5 w-5 text-white" />
            </div>
          </button>
        </div>
      </div>
    </header>
  )
}
