import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function RHLeaves() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Congés & Absences</h1>
          <p className="text-sm text-slate-500">Planning et gestion des demandes d'absence.</p>
        </div>
        <Button className="bg-indigo-600 gap-2 text-white"><Plus className="h-4 w-4" /> Demander un Congé</Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Calendar className="h-5 w-5 text-indigo-500" /> Calendrier des Absences</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] flex items-center justify-center bg-slate-50 rounded-xl border border-dashed text-slate-400">Vue Calendrier</div>
        </CardContent>
      </Card>
    </div>
  )
}
