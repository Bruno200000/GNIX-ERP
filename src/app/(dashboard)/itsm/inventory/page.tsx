import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { HardDrive, Search } from "lucide-react"
import { Input } from "@/components/ui/input"

export default function ITSMInventory() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Inventaire Matériel</h1>
      <p className="text-sm text-slate-500">Suivi des actifs informatiques et équipements.</p>
      
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input className="pl-10" placeholder="Numéro de série, modèle..." />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><HardDrive className="h-5 w-5 text-slate-500" /> Liste du Matériel</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-10 text-slate-400 italic">Chargement de l'inventaire...</div>
        </CardContent>
      </Card>
    </div>
  )
}
