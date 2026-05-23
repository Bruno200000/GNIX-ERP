'use client'

import { useState, useEffect, useRef } from "react"
import { Bell, User, HelpCircle, LogOut, Settings, Menu, CreditCard, ChevronDown } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useUI } from "@/context/UIContext"
import { logout } from "@/app/login/actions"
import { MobileAccessDialog } from "./MobileAccessDialog"
import { AICommandPalette } from "./AICommandPalette"
import { createClient } from "@/lib/supabase/client"

export function Header() {
  const { toggleSidebar, toggleSidebarCollapse } = useUI()
  const [userProfile, setUserProfile] = useState<any>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Fetch user profile on mount
  useEffect(() => {
    const supabase = createClient()

    if (!supabase) {
      return
    }

    const client = supabase

    async function getUser() {
      try {
        const { data: { user } } = await client.auth.getUser()

        if (!user) {
          return
        }

        const fallbackProfile = {
          first_name: user.user_metadata?.first_name ?? user.user_metadata?.name?.split(' ')[0] ?? '',
          last_name: user.user_metadata?.last_name ?? user.user_metadata?.name?.split(' ').slice(1).join(' ') ?? '',
          email: user.email ?? '',
          avatar_url: user.user_metadata?.avatar_url ?? null,
          role: user.user_metadata?.role ?? user.user_metadata?.company_name ?? 'Utilisateur',
        }

        const { data: profile, error } = await client
          .from('profiles')
          .select('first_name,last_name,email,avatar_url,role,organization_id')
          .eq('id', user.id)
          .maybeSingle()

        setUserProfile({
          ...user,
          ...(profile ?? {}),
          ...fallbackProfile,
        })

        if (error) {
          return
        }
      } catch {
        // fail silently
      }
    }

    getUser()
  }, [])

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [menuOpen])

  const displayName = userProfile?.first_name
    ? `${userProfile.first_name} ${userProfile.last_name || ''}`.trim()
    : userProfile?.email?.split('@')[0] || 'Utilisateur'

  const userEmail = userProfile?.email || ''
  const avatarUrl = userProfile?.avatar_url || null
  const userRole = userProfile?.role || userProfile?.user_metadata?.company_name || 'Utilisateur'

  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6 dark:border-slate-800 dark:bg-slate-950 transition-colors sticky top-0 z-30 shadow-sm">
      <div className="flex items-center gap-4 lg:gap-8 flex-1">
        {/* Burger menu */}
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

        {/* Logo mobile */}
        <Link href="/" className="flex items-center group lg:hidden">
          <div className="relative w-8 h-8 mr-2">
            <Image src="/logo.png" alt="GNIX Logo" fill className="object-contain" />
          </div>
          <span className="text-lg font-black text-slate-900 tracking-tighter">
            GNIX <span className="text-indigo-600">IA</span>
          </span>
        </Link>

        <div className="hidden md:block flex-1 max-w-xl">
          <AICommandPalette />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <MobileAccessDialog />

        <button type="button" className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-50 hover:text-indigo-600 transition-all">
          <HelpCircle className="h-5 w-5" />
        </button>

        <button type="button" className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-50 hover:text-indigo-600 transition-all">
          <Bell className="h-5 w-5" />
          <span className="absolute top-2 right-2 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
        </button>

        <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 mx-2" />

        {/* User avatar + custom dropdown */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2 rounded-xl p-1 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all group outline-none"
          >
            {/* Name + role (desktop only) */}
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-slate-900 dark:text-white leading-none">{displayName}</p>
              <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest mt-0.5">{userRole}</p>
            </div>

            {/* Avatar */}
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center shadow-md overflow-hidden ring-2 ring-indigo-500/10 group-hover:ring-indigo-500/30 transition-all">
              {avatarUrl ? (
                <img src={avatarUrl} alt={displayName} className="h-full w-full object-cover" />
              ) : (
                <span className="text-white text-sm font-bold select-none">
                  {displayName.charAt(0).toUpperCase()}
                </span>
              )}
            </div>

            <ChevronDown className={`h-3.5 w-3.5 text-slate-400 transition-transform duration-200 hidden sm:block ${menuOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown panel */}
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-2xl shadow-slate-200/60 dark:shadow-slate-900/60 z-50 overflow-hidden">

              {/* User info header */}
              <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-indigo-50 to-violet-50 dark:from-indigo-900/20 dark:to-violet-900/20 border-b border-slate-100 dark:border-slate-800">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center shadow-md overflow-hidden flex-shrink-0">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt={displayName} className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-white text-xl font-bold select-none">
                      {displayName.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{displayName}</p>
                  <p className="text-xs text-slate-500 truncate">{userEmail}</p>
                  <span className="inline-block mt-1 px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 text-[10px] font-bold rounded-full uppercase tracking-wider">
                    {userRole}
                  </span>
                </div>
              </div>

              {/* Navigation items */}
              <div className="p-2 space-y-0.5">
                <Link
                  href="/settings/profile"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group"
                >
                  <div className="h-8 w-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">
                    <User className="h-4 w-4 text-slate-500 group-hover:text-indigo-600" />
                  </div>
                  <div>
                    <div className="font-semibold">Mon Profil</div>
                    <div className="text-[11px] text-slate-400">Modifier mes informations</div>
                  </div>
                </Link>

                <Link
                  href="/settings"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group"
                >
                  <div className="h-8 w-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:bg-indigo-100 transition-colors">
                    <Settings className="h-4 w-4 text-slate-500 group-hover:text-indigo-600" />
                  </div>
                  <div>
                    <div className="font-semibold">Paramètres</div>
                    <div className="text-[11px] text-slate-400">Préférences &amp; sécurité</div>
                  </div>
                </Link>

                <Link
                  href="/settings"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group"
                >
                  <div className="h-8 w-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:bg-amber-100 transition-colors">
                    <CreditCard className="h-4 w-4 text-slate-500 group-hover:text-amber-600" />
                  </div>
                  <div>
                    <div className="font-semibold">Facturation</div>
                    <div className="text-[11px] text-slate-400">Abonnement &amp; paiements</div>
                  </div>
                </Link>
              </div>

              {/* Logout button */}
              <div className="p-2 pt-0 mt-1 border-t border-slate-100 dark:border-slate-800">
                <form action={logout}>
                  <button
                    type="submit"
                    className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors group"
                  >
                    <div className="h-8 w-8 rounded-lg bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
                      <LogOut className="h-4 w-4 text-red-500" />
                    </div>
                    <div>
                      <div className="font-bold">Déconnexion</div>
                      <div className="text-[11px] text-red-400">Fermer la session en cours</div>
                    </div>
                  </button>
                </form>
              </div>

            </div>
          )}
        </div>
      </div>
    </header>
  )
}
