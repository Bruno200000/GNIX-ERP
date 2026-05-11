import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageSquare, Sparkles } from "lucide-react"

export default function CommWhatsApp() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">WhatsApp Business Sync</h1>
      <p className="text-sm text-slate-500">Centralisation de vos échanges WhatsApp avec analyse IA.</p>
      
      <Card className="bg-emerald-50/50 border-emerald-100">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-emerald-700">
            <MessageSquare className="h-5 w-5" /> État de la Connexion
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-sm font-medium text-emerald-700">Connecté à l'API Business</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
