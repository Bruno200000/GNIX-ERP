import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShieldAlert, Activity, AlertTriangle } from "lucide-react"

export default function FinanceAnomalies() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Détection d'Anomalies IA</h1>
          <p className="text-sm text-slate-500">Contrôle automatique des fraudes, doublons et erreurs de saisie.</p>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-red-100 bg-red-50/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <ShieldAlert className="h-5 w-5" /> Alertes Critiques
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-6 text-slate-400">Aucune anomalie critique détectée aujourd'hui.</div>
          </CardContent>
        </Card>
        
        <Card className="border-amber-100 bg-amber-50/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-600">
              <Activity className="h-5 w-5" /> Analyse des Marges
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-6 text-slate-400">Analyse IA en cours sur les factures du mois...</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
