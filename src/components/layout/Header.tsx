'use client'

import { useState, useEffect } from "react"
import { Bell, Search, User, HelpCircle, LogOut, Settings, Menu, CreditCard, Shield } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useUI } from "@/context/UIContext"
import { logout } from "@/app/login/actions"
import { MobileAccessDialog } from "./MobileAccessDialog"
import { AICommandPalette } from "./AICommandPalette"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { createClient } from "@/lib/supabase/client"

export function Header() {
  const { toggleSidebar, toggleSidebarCollapse } = useUI()
  const [userProfile, setUserProfile] = useState<any>(null)

  useEffect(() => {
    const supabase = createClient()
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()
        setUserProfile({ ...user, ...profile })
      }
    }
    getUser()
  }, [])

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
            <p className="text-xs font-bold text-slate-900 dark:text-white leading-none">
              {userProfile?.first_name ? `${userProfile.first_name} ${userProfile.last_name}` : "Chargement..."}
            </p>
            <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest mt-1">
              {userProfile?.role || "Utilisateur"}
            </p>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center rounded-xl bg-white text-sm focus:outline-none ring-2 ring-indigo-500/10 hover:ring-indigo-500/30 transition-all p-0.5 outline-none cursor-pointer">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center shadow-md overflow-hidden">
                {userProfile?.avatar_url ? (
                  <img src={userProfile.avatar_url} alt="Profile" className="h-full w-full object-cover" />
                ) : (
                  <User className="h-5 w-5 text-white" />
                )}
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 mt-2 rounded-xl shadow-xl border-slate-100 p-1" align="end">
              <DropdownMenuLabel className="font-normal p-2">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-bold leading-none">{userProfile?.first_name} {userProfile?.last_name}</p>
                  <p className="text-xs leading-none text-slate-500">{userProfile?.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-slate-100" />
              <DropdownMenuGroup>
                <Link href="/settings/profile">
                  <DropdownMenuItem className="rounded-lg cursor-pointer">
                    <User className="mr-2 h-4 w-4 text-slate-400" />
                    <span>Mon Profil</span>
                  </DropdownMenuItem>
                </Link>
                <Link href="/settings">
                  <DropdownMenuItem className="rounded-lg cursor-pointer">
                    <Settings className="mr-2 h-4 w-4 text-slate-400" />
                    <span>Paramètres</span>
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuItem className="rounded-lg cursor-pointer">
                  <CreditCard className="mr-2 h-4 w-4 text-slate-400" />
                  <span>Facturation</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator className="bg-slate-100" />
              <DropdownMenuItem 
                onClick={() => logout()}
                className="rounded-lg text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/10 cursor-pointer"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Déconnexion</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
