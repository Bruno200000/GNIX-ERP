import { getDashboardData, getInvoicesData, getProductsData, getProjectsData, getSettingsData, rerunAiAnalysisData } from "@/lib/erp-data"
import { revalidatePath } from "next/cache"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BarChart3, TrendingUp, TrendingDown, Sparkles, BrainCircuit, AlertTriangle, Lightbulb } from "lucide-react"

export default async function AnalyticsIA() {
  async function rerunAnalysis() {
    "use server"
    await rerunAiAnalysisData()
    revalidatePath("/analytics")
  }

  const [dashboard, invoices, products, projects, settings] = await Promise.all([
    getDashboardData(),
    getInvoicesData(),
    getProductsData(),
    getProjectsData(),
    getSettingsData(),
  ])
  const unpaid = invoices.filter((invoice) => invoice.status !== "paid").reduce((sum, invoice) => sum + invoice.total_amount, 0)
  const stockRisk = products.filter((product) => product.totalStock <= 10).length
  const activeProjects = projects.filter((project) => project.status === "active").length

  const forecasts = [
    {
      label: "Tresorerie (30j)",
      value: `${(dashboard.paidRevenue - unpaid).toLocaleString("fr-FR")} FCFA`,
      trend: unpaid > dashboard.paidRevenue ? "down" : "up",
      confidence: 92,
      insight: unpaid > 0 ? `${unpaid.toLocaleString("fr-FR")} FCFA restent a encaisser.` : "Toutes les factures sont a jour.",
    },
    {
      label: "Charge Projets",
      value: `${activeProjects}/${projects.length}`,
      trend: activeProjects > 2 ? "up" : "down",
      confidence: 88,
      insight: `${activeProjects} projets actifs. Repriorisez les taches a forte estimation IA si la charge augmente.`,
    },
    {
      label: "Risque Stock",
      value: stockRisk > 0 ? "A surveiller" : "Bas",
      trend: stockRisk > 0 ? "up" : "down",
      confidence: 95,
      insight: stockRisk > 0 ? `${stockRisk} produit(s) sous le seuil de stock.` : "Le niveau de stock est stable.",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Analyses & Previsions IA</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Moteur predictif GNIX : Charge de travail, Tresorerie et Risques a 30 jours.
          </p>
        </div>
        <div className="flex gap-2">
          <form action={rerunAnalysis}>
            <Button className="bg-indigo-600 hover:bg-indigo-700 gap-2 text-white shadow-lg shadow-indigo-500/20" type="submit">
              <BrainCircuit className="h-4 w-4" /> Relancer l'Analyse
            </Button>
          </form>
        </div>
      </div>
      <div className="rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-3 text-xs font-bold text-indigo-700">
        Derniere analyse IA: {settings?.last_ai_analysis_at ? new Date(settings.last_ai_analysis_at).toLocaleString("fr-FR") : "Jamais"}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {forecasts.map((forecast) => (
          <Card key={forecast.label} className="border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <Sparkles className="h-24 w-24 text-indigo-600" />
            </div>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-widest">{forecast.label}</CardTitle>
                <Badge variant="secondary" className="bg-indigo-50 text-indigo-600 border-none text-[10px]">Confiance {forecast.confidence}%</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-end gap-3 mb-4">
                <span className="text-2xl font-black text-slate-900 dark:text-white">{forecast.value}</span>
                {forecast.trend === "up" ? (
                  <TrendingUp className="h-5 w-5 text-emerald-500 mb-1" />
                ) : (
                  <TrendingDown className="h-5 w-5 text-red-500 mb-1" />
                )}
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800">
                <div className="flex gap-3">
                  <Lightbulb className="h-5 w-5 text-amber-500 shrink-0" />
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    <span className="font-bold text-slate-900 dark:text-slate-200">Insight IA :</span> {forecast.insight}
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
            <CardTitle>Courbe de Tresorerie Predictive</CardTitle>
            <CardDescription>Evolution simulee sur les 30 prochains jours basee sur les factures et paiements.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full bg-slate-50 dark:bg-slate-900/50 rounded-2xl flex items-end justify-around border border-dashed border-slate-200 dark:border-slate-800 p-6">
              {invoices.slice(0, 8).map((invoice) => (
                <div key={invoice.id} className="flex flex-col items-center gap-2">
                  <div
                    className="w-8 rounded-t-lg bg-indigo-500"
                    style={{ height: `${Math.max(20, Math.min(220, invoice.total_amount / 18000))}px` }}
                  />
                  <span className="text-[9px] text-slate-400">{invoice.invoice_number.slice(-3)}</span>
                </div>
              ))}
              {invoices.length === 0 && (
                <div className="text-center">
                  <BarChart3 className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                  <span className="text-sm text-slate-400">Ajoutez des factures pour generer la simulation.</span>
                </div>
              )}
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
                <span>Rupture de Stock</span>
                <span className="text-amber-400">Probabilite {stockRisk > 0 ? 65 : 15}%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-amber-400" style={{ width: `${stockRisk > 0 ? 65 : 15}%` }} />
              </div>
              <p className="text-[10px] text-slate-400">{stockRisk} produit(s) proches du seuil critique.</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-slate-500">
                <span>Anomalies Finance</span>
                <span className="text-red-400">Probabilite {dashboard.anomalies.length > 0 ? 82 : 8}%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-red-400" style={{ width: `${dashboard.anomalies.length > 0 ? 82 : 8}%` }} />
              </div>
              <p className="text-[10px] text-slate-400">{dashboard.anomalies.length} alerte(s) a verifier.</p>
            </div>
            
            <Button variant="secondary" className="w-full bg-indigo-600 hover:bg-indigo-500 border-none text-white font-bold h-12">
              Generer Rapport Decisionnel
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
