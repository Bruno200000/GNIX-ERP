import { getDashboardStats } from "../dashboard-actions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, DollarSign, Activity, TrendingUp, Sparkles, Building2, Calendar } from "lucide-react"

export default async function Dashboard() {
  const stats = await getDashboardStats()

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF' }).format(amount)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Dashboard Exécutif</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Bienvenue sur GNIX IA. Voici le résumé de l'activité de votre entreprise.
          </p>
        </div>
        <div className="flex gap-2">
          <Card className="flex items-center px-3 py-1 bg-indigo-50 dark:bg-indigo-900/20 border-indigo-100 dark:border-indigo-800">
            <Sparkles className="h-4 w-4 text-indigo-600 mr-2" />
            <span className="text-xs font-medium text-indigo-600">IA Optimisée</span>
          </Card>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-300">Valeur Pipeline</CardTitle>
            <DollarSign className="w-4 h-4 text-slate-500 dark:text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">
              {formatCurrency(stats?.totalRevenue || 0)}
            </div>
            <p className="text-xs text-emerald-500 flex items-center mt-1 font-medium">
              <TrendingUp className="w-3 h-3 mr-1" />
              Basé sur vos factures
            </p>
          </CardContent>
        </Card>
        <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-300">Base Clients</CardTitle>
            <Users className="w-4 h-4 text-slate-500 dark:text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">
              {stats?.clientsCount || 0}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Contacts actifs en base
            </p>
          </CardContent>
        </Card>
        <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-300">Projets Actifs</CardTitle>
            <Calendar className="h-4 w-4 text-slate-500 dark:text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">
              {stats?.projectsCount || 0}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
              En cours d'exécution
            </p>
          </CardContent>
        </Card>
        <Card className="border-slate-200 dark:border-slate-800 shadow-sm bg-indigo-50/30 dark:bg-indigo-900/10 border-indigo-100 dark:border-indigo-900/30">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-indigo-700 dark:text-indigo-300">Score Conversion IA</CardTitle>
            <div className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
              {stats?.avgScore || 0}/100
            </div>
            <p className="text-xs text-indigo-500/80 mt-1 font-medium">
              Santé globale de votre CRM
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 border-slate-200 dark:border-slate-800 shadow-sm">
          <CardHeader>
            <CardTitle>Vue d'Ensemble des Revenus</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[250px] w-full bg-slate-50 dark:bg-slate-900/50 rounded-xl flex items-center justify-center border border-dashed border-slate-300 dark:border-slate-800">
              <div className="flex flex-col items-center gap-2">
                <Activity className="h-8 w-8 text-slate-300 dark:text-slate-700" />
                <span className="text-xs text-slate-500">Visualisation des tendances (Recharts)</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3 border-slate-200 dark:border-slate-800 shadow-sm">
          <CardHeader>
            <CardTitle>Actions Suggérées par l'IA</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-start space-x-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
                <div className="w-2 h-2 mt-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
                <div>
                  <p className="text-sm font-semibold">Anomalie financière détectée</p>
                  <p className="text-xs text-slate-500 mt-0.5">Une facture présente un montant inhabituel par rapport à l'historique client.</p>
                  <button className="mt-2 text-[10px] font-bold text-indigo-600 uppercase tracking-wider hover:underline">Vérifier</button>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-3 rounded-lg bg-indigo-50/50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-900/30">
                <div className="w-2 h-2 mt-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
                <div>
                  <p className="text-sm font-semibold text-indigo-900 dark:text-indigo-200">Opportunité de conversion</p>
                  <p className="text-xs text-indigo-700/70 dark:text-indigo-400/70 mt-0.5">Le score IA de 3 prospects a augmenté de +15%. Préparez une relance.</p>
                  <button className="mt-2 text-[10px] font-bold text-indigo-600 uppercase tracking-wider hover:underline">Voir les leads</button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
