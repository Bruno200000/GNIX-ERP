import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Star, Target, TrendingUp } from "lucide-react"

export default function RHEvaluations() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Évaluations & Objectifs</h1>
      <p className="text-sm text-slate-500">Suivi de la performance et développement des compétences.</p>
      
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Évaluations à venir</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Campagne de Performance 2026</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-10 text-slate-400 italic">Aucune évaluation active.</div>
        </CardContent>
      </Card>
    </div>
  )
}
