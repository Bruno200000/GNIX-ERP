'use client'

import { useCallback, useMemo, useState, useRef, useEffect } from "react"
import { Mic, Zap, Package, Users, Wallet, Sparkles, LayoutDashboard, Search, Bell, Smartphone, Menu, X, ChevronRight, BarChart3, Settings, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { processAICommand } from "@/lib/ai-actions"

export default function MobileRemotePage() {
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [aiResponse, setAiResponse] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [commandText, setCommandText] = useState("")
  const recognitionRef = useRef<any>(null)
  const commandRoutes = useMemo(() => [
    { keywords: ["stock", "stocks", "produit", "produits", "logistique"], href: "/logistique" },
    { keywords: ["client", "clients", "crm", "vente", "ventes"], href: "/crm" },
    { keywords: ["finance", "facture", "factures", "paiement"], href: "/finance" },
    { keywords: ["analyse", "rapport", "statistique"], href: "/analytics" },
    { keywords: ["parametre", "parametres", "profil", "securite"], href: "/settings" },
    { keywords: ["chat", "message", "communication"], href: "/chat" },
  ], [])

  const handleVoiceCommand = useCallback(async (command: string) => {
    setIsListening(false)
    setIsProcessing(true)
    setCommandText(command)
    setAiResponse(`Analyse de : "${command}"...`)

    try {
      const result = await processAICommand(command)
      const lowerCommand = command.toLowerCase()
      const route = commandRoutes.find((item) => item.keywords.some((keyword) => lowerCommand.includes(keyword)))
      setAiResponse(route ? `${result.message} Ouverture du module demande...` : result.message)
      if (route) setTimeout(() => router.push(route.href), 500)
    } catch {
      setAiResponse("Erreur de connexion avec l'IA.")
    } finally {
      setIsProcessing(false)
    }
  }, [commandRoutes, router])

  useEffect(() => {
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = false
      recognitionRef.current.lang = 'fr-FR'

      recognitionRef.current.onresult = async (event: any) => {
        const transcript = event.results[0][0].transcript
        handleVoiceCommand(transcript)
      }

      recognitionRef.current.onerror = () => setIsListening(false)
      recognitionRef.current.onend = () => setIsListening(false)
    }
  }, [handleVoiceCommand])

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop()
    } else {
      setIsListening(true)
      setAiResponse(null)
      recognitionRef.current?.start()
    }
  }

  const stats = [
    { label: 'Ventes', value: '12.4M', icon: Wallet, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { label: 'Stocks', value: '842', icon: Package, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
    { label: 'Alertes', value: '3', icon: Zap, color: 'text-amber-400', bg: 'bg-amber-500/10' },
  ]

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/' },
    { name: 'Ventes & CRM', icon: Users, href: '/crm' },
    { name: 'Stock & Logistique', icon: Package, href: '/logistique' },
    { name: 'Finance', icon: Wallet, href: '/finance' },
    { name: 'Analytique IA', icon: BarChart3, href: '/analytics' },
    { name: 'Paramètres', icon: Settings, href: '/settings' },
  ]

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans flex flex-col overflow-hidden">
      {/* Mobile Sidebar / Drawer */}
      <div className={cn(
        "fixed inset-0 z-[100] bg-black/60 backdrop-blur-md transition-all duration-300",
        isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      )} onClick={() => setIsMenuOpen(false)} />
      
      <div className={cn(
        "fixed inset-y-0 left-0 z-[101] w-72 bg-[#0a0a0a] border-r border-white/10 p-6 transition-transform duration-500 ease-out shadow-2xl",
        isMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
             <div className="h-10 w-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
               <Smartphone className="h-6 w-6" />
             </div>
             <span className="font-black text-xl tracking-tighter">GNIX <span className="text-indigo-500 text-xs">MOBILE</span></span>
          </div>
          <button onClick={() => setIsMenuOpen(false)} className="p-2 bg-white/5 rounded-lg">
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => (
            <Link 
              key={item.name} 
              href={item.href}
              className="flex items-center justify-between p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all group"
            >
              <div className="flex items-center gap-4">
                <item.icon className="h-5 w-5 text-slate-400 group-hover:text-indigo-400" />
                <span className="text-sm font-bold text-slate-300">{item.name}</span>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-600" />
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-10 left-6 right-6">
           <Button className="w-full h-14 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-2xl font-bold border border-red-500/20">
             Déconnexion
           </Button>
        </div>
      </div>

      {/* Main Header */}
      <header className="flex items-center justify-between p-6 bg-black/40 backdrop-blur-xl sticky top-0 z-50 border-b border-white/5">
        <button onClick={() => setIsMenuOpen(true)} className="p-3 bg-white/5 rounded-2xl border border-white/10 active:scale-90 transition-transform">
          <Menu className="h-6 w-6 text-indigo-400" />
        </button>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Live</span>
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
        </div>
        <div className="relative">
           <div className="h-12 w-12 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-2xl flex items-center justify-center shadow-lg p-0.5">
             <div className="h-full w-full bg-[#0a0a0a] rounded-[14px] flex items-center justify-center">
               <Users className="h-5 w-5 text-white" />
             </div>
           </div>
           <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full border-2 border-[#050505] flex items-center justify-center text-[8px] font-bold">2</span>
        </div>
      </header>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 pt-6 pb-32 space-y-8 scroll-smooth">
        {/* Profile Card */}
        <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-[2.5rem] p-8 shadow-2xl shadow-indigo-500/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
          <p className="text-indigo-200 text-xs font-bold uppercase tracking-[0.2em] mb-2">Bienvenue</p>
          <h2 className="text-3xl font-black mb-4">Bruno Admin</h2>
          <div className="flex items-center gap-2">
            <Badge className="bg-white/20 hover:bg-white/30 border-none text-[10px] uppercase font-black px-3 py-1">Super Utilisateur</Badge>
            <Badge className="bg-emerald-500/20 text-emerald-400 border-none text-[10px] uppercase font-black px-3 py-1">En ligne</Badge>
          </div>
        </div>

        {/* Dynamic Grid */}
        <div className="grid grid-cols-1 gap-4">
          <div className="grid grid-cols-3 gap-3">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-white/5 p-4 rounded-3xl border border-white/5 flex flex-col items-center gap-3">
                <div className={cn("p-2.5 rounded-xl", stat.bg)}>
                  <stat.icon className={cn("h-5 w-5", stat.color)} />
                </div>
                <div className="text-center">
                  <p className="text-lg font-black">{stat.value}</p>
                  <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Action Hub */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Assistant IA</h3>
            <Sparkles className="h-4 w-4 text-indigo-500" />
          </div>
          
          {/* Main Voice Button */}
          <div className="flex flex-col items-center py-4">
            <button 
              onClick={toggleListening}
              disabled={isProcessing}
              className={cn(
                "relative h-44 w-44 sm:h-52 sm:w-52 rounded-full flex flex-col items-center justify-center transition-all duration-700 active:scale-90 shadow-2xl",
                isListening 
                  ? "bg-red-500 shadow-red-500/40 ring-[16px] ring-red-500/10" 
                  : isProcessing
                  ? "bg-slate-700 shadow-slate-500/40 ring-[16px] ring-slate-500/10"
                  : "bg-indigo-600 shadow-indigo-500/40 ring-[16px] ring-indigo-500/10"
              )}
            >
              {(isListening || isProcessing) && (
                <div className="absolute inset-0 rounded-full border-4 border-white/40 animate-ping" />
              )}
              {isProcessing ? (
                <Loader2 className="h-12 w-12 text-white animate-spin mb-3" />
              ) : (
                <Mic className="h-12 w-12 text-white mb-3" />
              )}
              <span className="text-sm font-black uppercase tracking-widest text-white">IA GNIX</span>
              <span className="mt-1 text-[10px] font-black uppercase tracking-widest text-white/80">
                {isListening ? "Écoute..." : isProcessing ? "Analyse..." : "Parler à l'IA"}
              </span>
            </button>
            <form
              className="mt-8 flex w-full max-w-sm gap-2"
              onSubmit={(event) => {
                event.preventDefault()
                if (commandText.trim()) handleVoiceCommand(commandText)
              }}
            >
              <input
                value={commandText}
                onChange={(event) => setCommandText(event.target.value)}
                placeholder="Ex: ouvre les stocks"
                className="h-12 min-w-0 flex-1 rounded-2xl border border-white/10 bg-white/5 px-4 text-sm text-white outline-none placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="submit"
                disabled={isProcessing || !commandText.trim()}
                className="h-12 rounded-2xl bg-indigo-600 px-5 text-xs font-black uppercase tracking-widest text-white disabled:opacity-50"
              >
                Executer
              </button>
            </form>
             
            {aiResponse && (
              <div className="mt-6 w-full max-w-sm p-5 sm:p-6 bg-indigo-500/10 border border-indigo-500/20 rounded-3xl animate-in fade-in slide-in-from-bottom-4 duration-500">
                <p className="text-sm font-medium text-indigo-200 text-center leading-relaxed italic">
                  "{aiResponse}"
                </p>
              </div>
            )}
            
            <p className="text-[10px] text-slate-500 mt-8 font-medium text-center max-w-[200px]">
              "Affiche le rapport des ventes" ou "Scanner un produit"
            </p>
          </div>
        </div>

        {/* Quick Actions List */}
        <div className="space-y-4">
          <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 px-2">Actions Rapides</h3>
          <div className="grid grid-cols-2 gap-3">
             <Link href="/logistique" className="flex flex-col items-center gap-3 p-6 bg-white/5 rounded-[2rem] border border-white/5 active:bg-white/10 transition-colors">
               <Package className="h-6 w-6 text-indigo-400" />
               <span className="text-[10px] font-bold uppercase tracking-widest">Stocks</span>
             </Link>
             <Link href="/crm" className="flex flex-col items-center gap-3 p-6 bg-white/5 rounded-[2rem] border border-white/5 active:bg-white/10 transition-colors">
               <Users className="h-6 w-6 text-emerald-400" />
               <span className="text-[10px] font-bold uppercase tracking-widest">Clients</span>
             </Link>
          </div>
        </div>
      </div>

      {/* Bottom Nav Bar - iOS Style */}
      <div className="fixed bottom-0 left-0 right-0 h-24 bg-black/80 backdrop-blur-3xl border-t border-white/10 px-4 sm:px-8 flex items-center justify-around z-[90]">
        <Link href="/" className="flex flex-col items-center gap-1.5 text-indigo-500">
          <LayoutDashboard className="h-6 w-6" />
          <span className="text-[9px] font-black uppercase">Home</span>
        </Link>
        <Link href="/crm/search" className="flex flex-col items-center gap-1.5 text-slate-500">
          <Search className="h-6 w-6" />
          <span className="text-[9px] font-black uppercase">Search</span>
        </Link>
        <div className="-mt-16 bg-[#050505] p-3 rounded-full border border-white/10 shadow-2xl">
           <button onClick={toggleListening} className="h-16 w-16 bg-indigo-600 rounded-full flex flex-col items-center justify-center shadow-lg shadow-indigo-500/40 active:scale-90 transition-transform">
             <span className="text-[9px] font-black leading-none text-white">IA</span>
             <span className="text-[10px] font-black leading-none text-white">GNIX</span>
           </button>
        </div>
        <Link href="/notifications" className="flex flex-col items-center gap-1.5 text-slate-500">
          <Bell className="h-6 w-6" />
          <span className="text-[9px] font-black uppercase">Alerts</span>
        </Link>
        <Link href="/settings" className="flex flex-col items-center gap-1.5 text-slate-500">
          <Settings className="h-6 w-6" />
          <span className="text-[9px] font-black uppercase">Settings</span>
        </Link>
      </div>
    </div>
  )
}
