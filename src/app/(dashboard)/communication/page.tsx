import { getCommunicationsData, getIntegrationsData } from "@/lib/erp-data"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AutoResponseDialog } from "@/components/communication/AutoResponseDialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MessageSquare, Mail, Phone, Sparkles, Filter, Search } from "lucide-react"
import { Input } from "@/components/ui/input"

export default async function CommunicationHub({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams
  const activeChannel = typeof params.channel === 'string' ? params.channel : 'all'

  const [allThreads, integrations] = await Promise.all([
    getCommunicationsData(),
    getIntegrationsData()
  ])

  const isEmailConnected = integrations.find(i => i.id === "catalog-email")?.status === "connected"
  const isWhatsappConnected = integrations.find(i => i.id === "catalog-whatsapp")?.status === "connected"

  const threads = allThreads.filter(thread => {
    if (thread.type === "email" && !isEmailConnected) return false
    if (thread.type === "whatsapp" && !isWhatsappConnected) return false
    if (activeChannel !== 'all' && thread.type !== activeChannel) return false
    return true
  })

  const emailCount = allThreads.filter((thread) => thread.type === "email").length
  const whatsappCount = allThreads.filter((thread) => thread.type === "whatsapp").length
  const callCount = allThreads.filter((thread) => thread.type === "call").length

  const getSentimentColor = (sentiment: string) => {
    if (sentiment === "positive") return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
    if (sentiment === "negative") return "bg-red-500/10 text-red-500 border-red-500/20"
    return "bg-slate-500/10 text-slate-500 border-slate-500/20"
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Communication Hub</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Emails OVH & WhatsApp Business centralises avec analyse IA des sentiments et besoins.
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/communication">
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" /> Effacer Filtres
            </Button>
          </Link>
          <AutoResponseDialog trigger={
            <Button className="bg-indigo-600 hover:bg-indigo-700 gap-2 text-white">
              <Sparkles className="h-4 w-4" /> Reponse IA Auto
            </Button>
          } />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-500">Canaux</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button render={<Link href={isEmailConnected ? (activeChannel === "email" ? "/communication" : "/communication?channel=email") : "#"} />} variant={isEmailConnected ? (activeChannel === "email" ? "default" : "secondary") : "ghost"} disabled={!isEmailConnected} className={`w-full justify-start gap-3 ${isEmailConnected && activeChannel !== "email" ? 'bg-indigo-50 text-indigo-700 border-indigo-100' : ''} ${!isEmailConnected ? 'opacity-50' : ''}`}>
                <Mail className="h-4 w-4" /> Emails ({emailCount})
                {!isEmailConnected && <span className="text-[10px] ml-auto bg-slate-200 px-2 py-0.5 rounded text-slate-500">Hors ligne</span>}
              </Button>
              <Button render={<Link href={isWhatsappConnected ? (activeChannel === "whatsapp" ? "/communication" : "/communication?channel=whatsapp") : "#"} />} variant={isWhatsappConnected ? (activeChannel === "whatsapp" ? "default" : "ghost") : "ghost"} disabled={!isWhatsappConnected} className={`w-full justify-start gap-3 ${!isWhatsappConnected ? 'opacity-50' : ''}`}>
                <MessageSquare className="h-4 w-4" /> WhatsApp ({whatsappCount})
                {!isWhatsappConnected && <span className="text-[10px] ml-auto bg-slate-200 px-2 py-0.5 rounded text-slate-500">Hors ligne</span>}
              </Button>
              <Button render={<Link href={activeChannel === "call" ? "/communication" : "/communication?channel=call"} />} variant={activeChannel === "call" ? "default" : "ghost"} className="w-full justify-start gap-3">
                <Phone className="h-4 w-4" /> Appels IA ({callCount})
              </Button>
            </CardContent>
          </Card>
          
          <Card className="border-slate-200 dark:border-slate-800 shadow-sm bg-gradient-to-br from-indigo-600 to-violet-700 text-white">
            <CardContent className="pt-6 text-center">
              <Sparkles className="h-8 w-8 mx-auto mb-4 opacity-80" />
              <p className="text-sm font-medium">L'IA GNIX a classifie {threads.length} messages aujourd'hui.</p>
              <Button render={<Link href="/analytics" />} variant="secondary" className="mt-4 w-full bg-white/10 border-white/20 hover:bg-white/20 text-white">
                Voir l'analyse
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input className="pl-10 h-12 bg-white border-slate-200 rounded-xl" placeholder="Rechercher une conversation..." />
          </div>

          <div className="space-y-3">
            {threads.length === 0 ? (
              <div className="text-center py-12 bg-slate-50 dark:bg-slate-900 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-800">
                <MessageSquare className="h-10 w-10 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-slate-600 dark:text-slate-300">Aucun message</h3>
                <p className="text-sm text-slate-400 mt-1 max-w-md mx-auto">
                  Veuillez connecter vos applications depuis le Marketplace pour synchroniser vos communications.
                </p>
              </div>
            ) : (
              threads.map((thread) => (
                <Link key={thread.id} href="/chat" className="block">
                  <Card className="border-slate-200 dark:border-slate-800 shadow-sm hover:border-indigo-400 transition-all cursor-pointer group">
                    <CardContent className="p-4 flex items-start gap-4">
                      <div className={`p-3 rounded-xl ${thread.type === "email" ? "bg-blue-50 text-blue-600" : "bg-emerald-50 text-emerald-600"}`}>
                        {thread.type === "email" ? <Mail className="h-5 w-5" /> : <MessageSquare className="h-5 w-5" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">{thread.client_name}</h3>
                          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Il y a 5 min</span>
                        </div>
                        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{thread.subject}</p>
                        <div className="mt-2 flex items-center gap-2">
                          <Badge variant="outline" className={getSentimentColor(thread.sentiment)}>
                            Sentiment: {thread.sentiment}
                          </Badge>
                          <Badge variant="secondary" className="bg-slate-100 text-slate-600 border-none">
                            {thread.category}
                          </Badge>
                        </div>
                        <div className="mt-3 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-100 dark:border-slate-800 italic text-xs text-slate-500">
                          <Sparkles className="h-3 w-3 inline mr-1 text-indigo-500" />
                          Resume IA: {thread.summary}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
