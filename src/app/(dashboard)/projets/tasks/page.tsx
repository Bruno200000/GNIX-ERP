import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckSquare, Plus, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ProjetsTasks() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tâches Multi-agents</h1>
          <p className="text-sm text-slate-500">Assignation intelligente et suivi granulaire de l'exécution.</p>
        </div>
        <Button className="bg-indigo-600 text-white gap-2"><Plus className="h-4 w-4" /> Nouvelle Tâche</Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-indigo-500" /> Optimisation par l'IA
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-10 text-slate-400 italic">L'IA est prête à optimiser votre backlog...</div>
        </CardContent>
      </Card>
    </div>
  )
}
