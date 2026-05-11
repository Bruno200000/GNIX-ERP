import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sparkles, TrendingUp, Target, Users } from "lucide-react"

export default function CRMLeads() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Leads & Scoring IA</h1>
          <p className="text-sm text-slate-500">Priorisez vos opportunités grâce à l'analyse prédictive.</p>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Hot Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-emerald-500 flex items-center mt-1"><Sparkles className="h-3 w-3 mr-1" /> Score {">"} 80</p>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Opportunités en cours</CardTitle>
          <CardDescription>Liste des prospects avec probabilité de conversion IA.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-10 text-slate-400 italic">Chargement du pipeline IA...</div>
        </CardContent>
      </Card>
    </div>
  )
}
