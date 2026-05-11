import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BarChart3, TrendingUp, TrendingDown, Sparkles, BrainCircuit, Calendar, AlertTriangle, Lightbulb } from "lucide-react"

export default function AnalyticsIA() {
  const forecasts = [
    { label: 'Trésorerie (30j)', value: '+14,200,000 FCFA', trend: 'up', confidence: 92, insight: 'Pic attendu le 15 suite aux paiements clients récurrents.' },
    { label: 'Charge Projets', value: '85%', trend: 'up', confidence: 88, insight: 'Risque de surcharge en semaine 22. Envisager de reporter les tâches mineures.' },
    { label: 'Risque Client', value: 'Bas', trend: 'down', confidence: 95, insight: 'Le scoring moyen des clients est stable.' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Analyses & Prévisions IA</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Moteur prédictif GNIX : Charge de travail, Trésorerie et Risques à 30 jours.
          </p>
        </div>
        <div className="flex gap-2">
          <Button className="bg-indigo-600 hover:bg-indigo-700 gap-2 text-white shadow-lg shadow-indigo-500/20">
            <BrainCircuit className="h-4 w-4" /> Relancer l'Analyse
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {forecasts.map((f, i) => (
          <Card key={i} className="border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <Sparkles className="h-24 w-24 text-indigo-600" />
            </div>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-widest">{f.label}</CardTitle>
                <Badge variant="secondary" className="bg-indigo-50 text-indigo-600 border-none text-[10px]">Confiance {f.confidence}%</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-end gap-3 mb-4">
                <span className="text-2xl font-black text-slate-900 dark:text-white">{f.value}</span>
                {f.trend === 'up' ? (
                  <TrendingUp className="h-5 w-5 text-emerald-500 mb-1" />
                ) : (
                  <TrendingDown className="h-5 w-5 text-red-500 mb-1" />
                )}
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800">
                <div className="flex gap-3">
                  <Lightbulb className="h-5 w-5 text-amber-500 shrink-0" />
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    <span className="font-bold text-slate-900 dark:text-slate-200">Insight IA :</span> {f.insight}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
        <Card className="lg:col-span-4 border-slate-200 dark:border-slate-800 shadow-sm">
          <CardHeader>
            <CardTitle>Courbe de Trésorerie Prédictive</CardTitle>
            <CardDescription>Évolution simulée sur les 30 prochains jours basée sur les factures et dépenses récurrentes.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full bg-slate-50 dark:bg-slate-900/50 rounded-2xl flex items-center justify-center border border-dashed border-slate-200 dark:border-slate-800">
              <div className="text-center">
                <BarChart3 className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                <span className="text-sm text-slate-400">Simulation Graphique (Recharts)</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 border-slate-200 dark:border-slate-800 shadow-sm bg-slate-900 text-white">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-400" />
              Alertes de Risque IA
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-slate-500">
                <span>Rupture de Stock (Logistique)</span>
                <span className="text-amber-400">Probabilité 65%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-amber-400 w-[65%]" />
              </div>
              <p className="text-[10px] text-slate-400">Produit "CPU-X1" en baisse rapide. Délai réappro: 12j.</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-slate-500">
                <span>Retard Livraison (Client #12)</span>
                <span className="text-red-400">Probabilité 82%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-red-400 w-[82%]" />
              </div>
              <p className="text-[10px] text-slate-400">Anomalie détectée sur le hub logistique d'Abidjan.</p>
            </div>
            
            <Button variant="secondary" className="w-full bg-indigo-600 hover:bg-indigo-500 border-none text-white font-bold h-12">
              Générer Rapport Décisionnel
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
