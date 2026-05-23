import { getClients } from "../actions"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sparkles, TrendingUp, Target, Users } from "lucide-react"

export default async function CRMLeads() {
  const clients = await getClients()
  const leads = clients.filter((client) => client.status !== "client")
  const hotLeads = leads.filter((client) => client.ai_conversion_score >= 80)
  const pipeline = leads.reduce((sum, client) => sum + client.estimated_value, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Leads & Scoring IA</h1>
          <p className="text-sm text-slate-500">Priorisez vos opportunites grace a l'analyse predictive.</p>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Hot Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{hotLeads.length}</div>
            <p className="text-xs text-emerald-500 flex items-center mt-1"><Sparkles className="h-3 w-3 mr-1" /> Score {">"} 80</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pipeline Lead</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pipeline.toLocaleString("fr-FR")} FCFA</div>
            <p className="text-xs text-indigo-500 flex items-center mt-1"><TrendingUp className="h-3 w-3 mr-1" /> Valeur estimee</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Leads actifs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{leads.length}</div>
            <p className="text-xs text-slate-500 flex items-center mt-1"><Users className="h-3 w-3 mr-1" /> CRM synchronise</p>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Opportunites en cours</CardTitle>
          <CardDescription>Liste des prospects avec probabilite de conversion IA.</CardDescription>
        </CardHeader>
        <CardContent>
          {leads.length === 0 ? (
            <div className="text-center py-10 text-slate-400 italic">Aucun lead a prioriser.</div>
          ) : (
            <div className="space-y-3">
              {leads.map((lead) => (
                <div key={lead.id} className="flex items-center justify-between rounded-xl border border-slate-100 p-4 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <Target className="h-5 w-5 text-indigo-500" />
                    <div>
                      <div className="font-bold text-slate-900">{lead.name}</div>
                      <div className="text-xs text-slate-500">{lead.source} - {lead.email || lead.phone}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-slate-500">{lead.estimated_value.toLocaleString("fr-FR")} FCFA</span>
                    <Badge className={lead.ai_conversion_score >= 80 ? "bg-emerald-500" : "bg-amber-500"}>
                      {lead.ai_conversion_score}/100
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
