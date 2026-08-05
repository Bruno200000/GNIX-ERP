'use client'

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  Wallet, 
  Package, 
  Settings,
  Building2,
  Calendar,
  MessageSquare,
  Ticket,
  BarChart3,
  Calculator,
  FileText,
  Mail,
  ChevronDown,
  ChevronRight,
  Zap,
  X,
  UserCircle,
  Shield,
  Building
} from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { useUI } from "@/context/UIContext"

const navigation = [
  { 
    name: 'Dashboard', 
    href: '/', 
    icon: LayoutDashboard 
  },
  { 
    name: 'CRM & Ventes', 
    href: '/crm', 
    icon: Briefcase,
    subItems: [
      { name: 'Clients', href: '/crm' },
      { name: 'Leads (Scoring IA)', href: '/crm/leads' },
      { name: 'Devis & Offres', href: '/crm/quotes' },
    ]
  },
  { 
    name: 'RH & Présences', 
    href: '/rh', 
    icon: Users,
    subItems: [
      { name: 'Employés', href: '/rh' },
      { name: 'Présences IoT', href: '/rh/attendance' },
      { name: 'Congés & Absences', href: '/rh/leaves' },
      { name: 'Évaluations', href: '/rh/evaluations' },
    ]
  },
  { 
    name: 'Finance & Trésorerie', 
    href: '/finance', 
    icon: Wallet,
    subItems: [
      { name: 'Factures', href: '/finance' },
      { name: 'Paiements', href: '/finance/payments' },
      { name: 'Anomalies IA', href: '/finance/anomalies' },
    ]
  },
  {
    name: 'Comptabilite',
    href: '/comptabilite',
    icon: Calculator,
    subItems: [
      { name: 'Tableau de bord', href: '/comptabilite' },
      { name: 'Paiement de salaire', href: '/comptabilite/salaires' },
      { name: 'Journal comptable', href: '/comptabilite/journal' },
      { name: 'Plan comptable', href: '/comptabilite/plan-comptable' },
      { name: 'Bilan comptable', href: '/comptabilite/bilan' },
    ]
  },
  { 
    name: 'Logistique & Flux', 
    href: '/logistique', 
    icon: Package,
    subItems: [
      { name: 'Stocks', href: '/logistique' },
      { name: 'Tracking Shipments', href: '/logistique/shipments' },
      { name: 'Bons de Livraison', href: '/logistique/delivery-notes' },
      { name: 'Entrepôts', href: '/logistique/warehouses' },
    ]
  },
  { 
    name: 'Projets & Tâches', 
    href: '/projets', 
    icon: Calendar,
    subItems: [
      { name: 'Liste des Projets', href: '/projets' },
      { name: 'Tâches IA', href: '/projets/tasks' },
      { name: 'Réunions', href: '/projets/meetings' },
    ]
  },
  { 
    name: 'Communication Hub', 
    href: '/communication', 
    icon: Mail,
    subItems: [
      { name: 'Emails IA', href: '/communication' },
      { name: 'WhatsApp Sync', href: '/communication/whatsapp' },
      { name: 'Appels IA', href: '/communication/calls' },
    ]
  },
  { 
    name: 'ITSM & Support', 
    href: '/itsm', 
    icon: Ticket,
    subItems: [
      { name: 'Tickets', href: '/itsm' },
      { name: 'Inventaire Matériel', href: '/itsm/inventory' },
      { name: 'SLA Monitor', href: '/itsm/sla' },
    ]
  },
  { name: 'Analyses & IA', href: '/analytics', icon: BarChart3 },
  { name: 'App Marketplace', href: '/integrations', icon: Zap },
  { name: 'Chat Interne', href: '/chat', icon: MessageSquare },
  { name: 'Organisations', href: '/organisations', icon: Building2 },
]

const settingsNavigation = {
  name: 'Paramètres',
  href: '/settings',
  icon: Settings,
  subItems: [
    { name: 'Mon Profil', href: '/settings/profile', icon: UserCircle },
    { name: 'Organisation', href: '/settings/organisation', icon: Building },
    { name: 'Sécurité', href: '/settings/security', icon: Shield },
    { name: 'Audit Logs', href: '/settings/audit', icon: FileText },
  ]
}

export function Sidebar({ organizationCategory }: { organizationCategory?: string }) {
  const pathname = usePathname()
  const { isSidebarOpen, isSidebarCollapsed, closeSidebar } = useUI()
  const [mounted, setMounted] = useState(false)
  const [expandedItems, setExpandedItems] = useState<string[]>([])
  const visibleNavigation = useMemo(
    () => organizationCategory === "service"
      ? navigation.filter((item) => item.href !== "/logistique")
      : navigation,
    [organizationCategory]
  )

  useEffect(() => {
    setMounted(true)
    const activeItem = [...visibleNavigation, settingsNavigation].find(item =>
      item.subItems?.some(sub => pathname === sub.href)
    )
    if (activeItem) {
      setExpandedItems(prev => prev.includes(activeItem.name) ? prev : [...prev, activeItem.name])
    }
  }, [pathname, visibleNavigation])

  const toggleExpand = (name: string) => {
    setExpandedItems(prev => 
      prev.includes(name) 
        ? prev.filter(i => i !== name) 
        : [...prev, name]
    )
  }

  if (!mounted) return <div className="hidden lg:block w-64 bg-slate-950 h-full border-r border-slate-800" />

  return (
    <>
      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={closeSidebar}
        />
      )}

      <div className={cn(
        "fixed inset-y-0 left-0 z-50 bg-slate-950 text-slate-300 transition-all duration-300 border-r border-slate-800 lg:static lg:translate-x-0 flex flex-col h-full",
        isSidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full",
        isSidebarCollapsed ? "w-20" : "w-64"
      )}>
        <div className={cn(
          "flex h-16 items-center bg-slate-900/50 border-b border-slate-800 transition-all duration-300",
          isSidebarCollapsed ? "justify-center px-0" : "justify-between px-6"
        )}>
          <div className="flex items-center">
            <div className={cn("relative h-8 w-8 transition-all duration-300", isSidebarCollapsed ? "mr-0" : "mr-3")}>
              <Image 
                src="/logo.png" 
                alt="GNIX Logo" 
                fill
                className="object-contain"
              />
            </div>
            {!isSidebarCollapsed && (
              <span className="text-xl font-bold text-white tracking-tight animate-in fade-in duration-300">
                GNIX <span className="text-indigo-500">IA</span>
              </span>
            )}
          </div>
          {isSidebarOpen && !isSidebarCollapsed && (
            <button onClick={closeSidebar} className="p-1 rounded-lg hover:bg-slate-800 lg:hidden text-slate-500">
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
        
        <div className="flex-1 overflow-y-auto py-6 scrollbar-hide">
          <div className="px-4 mb-4">
            {!isSidebarCollapsed && (
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2 mb-4 animate-in fade-in">Système ERP Intelligent</p>
            )}
            <nav className="flex flex-col space-y-1">
              {visibleNavigation.map((item) => {
                const isExpanded = expandedItems.includes(item.name)
                const hasSubItems = item.subItems && item.subItems.length > 0
                const isActive = pathname === item.href || (hasSubItems && item.subItems?.some(s => pathname === s.href))

                return (
                  <div key={item.name} className="space-y-1">
                    {hasSubItems ? (
                      <button
                        onClick={() => toggleExpand(item.name)}
                        title={isSidebarCollapsed ? item.name : ""}
                        className={cn(
                          "w-full group flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
                          isActive ? "bg-slate-800 text-white" : "hover:bg-slate-900 hover:text-white",
                          isSidebarCollapsed ? "justify-center" : "justify-between"
                        )}
                      >
                        <div className="flex items-center">
                          <item.icon
                            className={cn(
                              "h-5 w-5 flex-shrink-0 transition-all duration-300",
                              isActive ? "text-indigo-400" : "text-slate-400 group-hover:text-indigo-400",
                              !isSidebarCollapsed && "mr-3"
                            )}
                          />
                          {!isSidebarCollapsed && <span className="animate-in fade-in duration-300">{item.name}</span>}
                        </div>
                        {!isSidebarCollapsed && (
                          isExpanded ? <ChevronDown className="h-3 w-3 text-slate-500" /> : <ChevronRight className="h-3 w-3 text-slate-500" />
                        )}
                      </button>
                    ) : (
                      <Link
                        href={item.href}
                        onClick={closeSidebar}
                        title={isSidebarCollapsed ? item.name : ""}
                        className={cn(
                          "group flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
                          pathname === item.href ? "bg-slate-800 text-white" : "hover:bg-slate-900 hover:text-white",
                          isSidebarCollapsed ? "justify-center" : ""
                        )}
                      >
                        <item.icon
                          className={cn(
                            "h-5 w-5 flex-shrink-0 transition-all duration-300",
                            pathname === item.href ? "text-indigo-400" : "text-slate-400 group-hover:text-indigo-400",
                            !isSidebarCollapsed && "mr-3"
                          )}
                        />
                        {!isSidebarCollapsed && <span className="animate-in fade-in duration-300">{item.name}</span>}
                      </Link>
                    )}

                    {hasSubItems && isExpanded && !isSidebarCollapsed && (
                      <div className="ml-4 pl-3 border-l border-slate-800 flex flex-col space-y-1 mt-1 animate-in slide-in-from-left-2 duration-300">
                        {item.subItems?.map((sub) => (
                          <Link
                            key={sub.name}
                            href={sub.href}
                            onClick={closeSidebar}
                            className={cn(
                              "flex items-center rounded-md px-3 py-1.5 text-[13px] font-medium transition-all duration-200",
                              pathname === sub.href ? "text-indigo-400 bg-indigo-500/5" : "text-slate-500 hover:text-slate-300 hover:bg-slate-900"
                            )}
                          >
                            {sub.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </nav>
          </div>
        </div>
        
        <div className={cn("border-t border-slate-900 bg-slate-900/20 transition-all duration-300", isSidebarCollapsed ? "p-2" : "p-4")}>
          {!isSidebarCollapsed && (
            <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-slate-900/50 mb-4 border border-slate-800 animate-in fade-in">
              <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center">
                <Zap className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Plan Actif</p>
                <p className="text-xs font-bold text-white">IA Unlimited</p>
              </div>
            </div>
          )}
          
          <div className="space-y-1">
            <button
              onClick={() => toggleExpand(settingsNavigation.name)}
              title={isSidebarCollapsed ? settingsNavigation.name : ""}
              className={cn(
                "w-full group flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
                expandedItems.includes(settingsNavigation.name) ? "bg-slate-800 text-white" : "hover:bg-slate-900 hover:text-white",
                isSidebarCollapsed ? "justify-center" : "justify-between"
              )}
            >
              <div className="flex items-center">
                <settingsNavigation.icon className={cn("h-5 w-5 text-slate-400 group-hover:text-indigo-400 transition-all duration-300", !isSidebarCollapsed && "mr-3")} />
                {!isSidebarCollapsed && <span className="animate-in fade-in duration-300">{settingsNavigation.name}</span>}
              </div>
              {!isSidebarCollapsed && (
                expandedItems.includes(settingsNavigation.name) ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />
              )}
            </button>

            {expandedItems.includes(settingsNavigation.name) && !isSidebarCollapsed && (
              <div className="ml-4 pl-3 border-l border-slate-800 flex flex-col space-y-1 mt-1 animate-in slide-in-from-left-2 duration-300">
                {settingsNavigation.subItems.map((sub) => (
                  <Link
                    key={sub.name}
                    href={sub.href}
                    onClick={closeSidebar}
                    className={cn(
                      "flex items-center gap-2 rounded-md px-3 py-1.5 text-[13px] font-medium transition-all duration-200",
                      pathname === sub.href ? "text-indigo-400 bg-indigo-500/5" : "text-slate-500 hover:text-slate-300 hover:bg-slate-900"
                    )}
                  >
                    <sub.icon className="h-3.5 w-3.5" />
                    {sub.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
