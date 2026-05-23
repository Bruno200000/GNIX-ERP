import { getCommunicationsData } from "@/lib/erp-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageSquare } from "lucide-react"

export default async function CommWhatsApp() {
  const threads = (await getCommunicationsData()).filter((thread) => thread.type === "whatsapp")

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">WhatsApp Business Sync</h1>
      <p className="text-sm text-slate-500">Centralisation de vos echanges WhatsApp avec analyse IA.</p>
      
      <Card className="bg-emerald-50/50 border-emerald-100">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-emerald-700">
            <MessageSquare className="h-5 w-5" /> Etat de la Connexion
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-sm font-medium text-emerald-700">Connecte a l'API Business</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Conversations synchronisees</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {threads.map((thread) => (
            <div key={thread.id} className="rounded-xl border border-slate-100 p-4 hover:bg-slate-50">
              <div className="font-bold text-slate-900">{thread.client_name}</div>
              <div className="text-sm text-slate-600">{thread.subject}</div>
              <div className="text-xs text-slate-400 mt-1">{thread.summary}</div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
