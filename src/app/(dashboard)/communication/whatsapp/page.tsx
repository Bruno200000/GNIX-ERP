import Link from "next/link"
import { getCommunicationsData, getIntegrationsData } from "@/lib/erp-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MessageSquare } from "lucide-react"

export default async function CommWhatsApp() {
  const [communications, integrations] = await Promise.all([getCommunicationsData(), getIntegrationsData()])
  const isWhatsappConnected = integrations.find((item) => item.id === "catalog-whatsapp")?.status === "connected"
  const threads = communications.filter((thread) => thread.type === "whatsapp")

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">WhatsApp Business Sync</h1>
      <p className="text-sm text-slate-500">Centralisation de vos echanges WhatsApp avec analyse IA.</p>
      
      <Card className={isWhatsappConnected ? "bg-emerald-50/50 border-emerald-100" : "bg-slate-50 border-slate-200"}>
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 ${isWhatsappConnected ? "text-emerald-700" : "text-slate-700"}`}>
            <MessageSquare className="h-5 w-5" /> Etat de la Connexion
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isWhatsappConnected ? (
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-sm font-medium text-emerald-700">Connecte a l'API Business</span>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm font-medium text-slate-500">Connectez votre token WhatsApp Business pour synchroniser les conversations.</span>
              <Button render={<Link href="/integrations" />} className="bg-indigo-600 text-white">Connecter</Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Conversations synchronisees</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {!isWhatsappConnected ? (
            <div className="rounded-xl border border-dashed border-slate-200 p-6 text-center text-sm text-slate-500">
              Le canal WhatsApp sera disponible apres connexion depuis l'App Marketplace.
            </div>
          ) : threads.map((thread) => (
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
