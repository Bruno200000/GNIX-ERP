import { getEvaluations } from "../actions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Target, TrendingUp } from "lucide-react"

export default async function RHEvaluations() {
  const evaluations = await getEvaluations()
  const avgScore = evaluations.length
    ? Math.round(evaluations.reduce((sum, evaluation) => sum + evaluation.score, 0) / evaluations.length)
    : 0

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Evaluations & Objectifs</h1>
      <p className="text-sm text-slate-500">Suivi de la performance et developpement des competences.</p>
      
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Evaluations a venir</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{evaluations.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Score moyen</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-2xl font-bold"><Star className="h-5 w-5 text-amber-500" /> {avgScore}/100</div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Campagne de Performance 2026</CardTitle>
        </CardHeader>
        <CardContent>
          {evaluations.length === 0 ? (
            <div className="text-center py-10 text-slate-400 italic">Aucune evaluation active.</div>
          ) : (
            <div className="space-y-3">
              {evaluations.map((evaluation) => (
                <div key={evaluation.id} className="flex items-center justify-between rounded-xl border border-slate-100 p-4 hover:bg-slate-50">
                  <div className="flex items-center gap-3">
                    <Target className="h-5 w-5 text-indigo-500" />
                    <div>
                      <div className="font-bold text-slate-900">{evaluation.employee_name}</div>
                      <div className="text-xs text-slate-500">{evaluation.objective}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-emerald-500" />
                    <Badge variant="outline">{evaluation.score}/100</Badge>
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
