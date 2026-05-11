import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ProjetsMeetings() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Réunions & Collaboration</h1>
          <p className="text-sm text-slate-500">Planifiez et gérez vos réunions d'équipe.</p>
        </div>
        <Button className="bg-indigo-600 text-white gap-2"><Plus className="h-4 w-4" /> Nouvelle Réunion</Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Users className="h-5 w-5 text-indigo-500" /> Planning Hebdomadaire</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-10 text-slate-400 italic">Aucune réunion prévue aujourd'hui.</div>
        </CardContent>
      </Card>
    </div>
  )
}
