'use client'

import { useState, useEffect, useRef } from "react"
import {
  Bell,
  User,
  HelpCircle,
  LogOut,
  Settings,
  Menu,
  CreditCard,
  ChevronDown,
  AlertTriangle,
  CheckCircle2,
  Keyboard,
  LifeBuoy,
  MessageSquare,
  Smartphone,
  Sparkles,
} from "lucide-react"
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
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [helpOpen, setHelpOpen] = useState(false)
  const [readNotificationIds, setReadNotificationIds] = useState<string[]>([])
  const menuRef = useRef<HTMLDivElement>(null)
  const notificationsRef = useRef<HTMLDivElement>(null)
  const helpRef = useRef<HTMLDivElement>(null)

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
      if (notificationsRef.current && !notificationsRef.current.contains(e.target as Node)) {
        setNotificationsOpen(false)
      }
      if (helpRef.current && !helpRef.current.contains(e.target as Node)) {
        setHelpOpen(false)
      }
    }
    if (menuOpen || notificationsOpen || helpOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [menuOpen, notificationsOpen, helpOpen])

  const displayName = userProfile?.first_name
    ? `${userProfile.first_name} ${userProfile.last_name || ''}`.trim()
    : userProfile?.email?.split('@')[0] || 'Utilisateur'

  const userEmail = userProfile?.email || ''
  const avatarUrl = userProfile?.avatar_url || null
  const userRole = userProfile?.role || userProfile?.user_metadata?.company_name || 'Utilisateur'
  const notifications = [
    {
      id: "finance",
      title: "Factures a verifier",
      description: "Des paiements ou anomalies finance demandent votre attention.",
      href: "/finance/anomalies",
      icon: AlertTriangle,
      tone: "text-amber-600 bg-amber-50",
    },
    {
      id: "chat",
      title: "Chat interne actif",
      description: "Votre equipe peut maintenant envoyer messages et pieces jointes.",
      href: "/chat",
      icon: MessageSquare,
      tone: "text-indigo-600 bg-indigo-50",
    },
    {
      id: "settings",
      title: "Preferences appliquees",
      description: "Mode sombre, langue et notifications sont synchronises.",
      href: "/settings",
      icon: CheckCircle2,
      tone: "text-emerald-600 bg-emerald-50",
    },
  ]
  const unreadNotifications = notifications.filter((item) => !readNotificationIds.includes(item.id))

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

        <div className="relative" ref={helpRef}>
          <button
            type="button"
            onClick={() => {
              setHelpOpen((value) => !value)
              setNotificationsOpen(false)
              setMenuOpen(false)
            }}
            className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-50 hover:text-indigo-600 transition-all"
            aria-label="Ouvrir l'aide"
          >
            <HelpCircle className="h-5 w-5" />
          </button>

          {helpOpen && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-slate-100 bg-white shadow-2xl shadow-slate-200/60 z-50 overflow-hidden dark:border-slate-800 dark:bg-slate-900">
              <div className="border-b border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/60">
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                    <HelpCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-sm font-black text-slate-900 dark:text-white">Centre d'aide GNIX</div>
                    <div className="text-xs text-slate-500">Actions rapides et assistance.</div>
                  </div>
                </div>
              </div>
              <div className="p-2">
                {[
                  { href: "/mobile", title: "Controle telephone", desc: "Piloter l'ERP avec IA GNIX.", icon: Smartphone },
                  { href: "/chat", title: "Chat interne", desc: "Envoyer messages et pieces jointes.", icon: MessageSquare },
                  { href: "/settings", title: "Parametres", desc: "Langue, IA, notifications, securite.", icon: Settings },
                  { href: "/itsm", title: "Support", desc: "Creer ou suivre un ticket d'assistance.", icon: LifeBuoy },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setHelpOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-700 transition-colors hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-500 dark:bg-slate-800">
                      <item.icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-bold">{item.title}</div>
                      <div className="text-xs text-slate-400">{item.desc}</div>
                    </div>
                  </Link>
                ))}
                <div className="mt-2 rounded-xl bg-indigo-50 p-3 text-xs text-indigo-700 dark:bg-indigo-950/30 dark:text-indigo-200">
                  <div className="mb-1 flex items-center gap-2 font-black">
                    <Keyboard className="h-3.5 w-3.5" />
                    Exemple
                  </div>
                  Dans IA GNIX, tapez: "ouvre les stocks" ou "cree un ticket".
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="relative" ref={notificationsRef}>
          <button
            type="button"
            onClick={() => {
              setNotificationsOpen((value) => !value)
              setHelpOpen(false)
              setMenuOpen(false)
            }}
            className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-50 hover:text-indigo-600 transition-all"
            aria-label="Ouvrir les notifications"
          >
            <Bell className="h-5 w-5" />
            {unreadNotifications.length > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-black text-white ring-2 ring-white">
                {unreadNotifications.length}
              </span>
            )}
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-96 max-w-[calc(100vw-2rem)] rounded-2xl border border-slate-100 bg-white shadow-2xl shadow-slate-200/60 z-50 overflow-hidden dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/60">
                <div>
                  <div className="text-sm font-black text-slate-900 dark:text-white">Notifications</div>
                  <div className="text-xs text-slate-500">{unreadNotifications.length} non lue(s)</div>
                </div>
                <button
                  type="button"
                  onClick={() => setReadNotificationIds(notifications.map((item) => item.id))}
                  className="rounded-lg px-3 py-1.5 text-xs font-bold text-indigo-600 hover:bg-indigo-50"
                >
                  Tout lire
                </button>
              </div>
              <div className="max-h-96 overflow-y-auto p-2">
                {notifications.map((item) => {
                  const Icon = item.icon
                  const isRead = readNotificationIds.includes(item.id)
                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      onClick={() => {
                        setReadNotificationIds((ids) => ids.includes(item.id) ? ids : [...ids, item.id])
                        setNotificationsOpen(false)
                      }}
                      className="flex items-start gap-3 rounded-xl px-3 py-3 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800"
                    >
                      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${item.tone}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <div className="text-sm font-bold text-slate-900 dark:text-white">{item.title}</div>
                          {!isRead && <span className="h-2 w-2 rounded-full bg-red-500" />}
                        </div>
                        <div className="mt-0.5 text-xs leading-relaxed text-slate-500">{item.description}</div>
                      </div>
                    </Link>
                  )
                })}
              </div>
              <div className="border-t border-slate-100 p-3 dark:border-slate-800">
                <Link
                  href="/settings"
                  onClick={() => setNotificationsOpen(false)}
                  className="flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-600"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  Gerer mes notifications
                </Link>
              </div>
            </div>
          )}
        </div>

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
