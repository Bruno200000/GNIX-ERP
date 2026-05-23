import { getAssetsData } from "@/lib/erp-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { HardDrive, Search } from "lucide-react"
import { Input } from "@/components/ui/input"

export default async function ITSMInventory() {
  const assets = await getAssetsData()

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Inventaire Materiel</h1>
      <p className="text-sm text-slate-500">Suivi des actifs informatiques et equipements.</p>
      
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input className="pl-10" placeholder="Numero de serie, modele..." />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><HardDrive className="h-5 w-5 text-slate-500" /> Liste du Materiel</CardTitle>
        </CardHeader>
        <CardContent>
          {assets.length === 0 ? (
            <div className="text-center py-10 text-slate-400 italic">Aucun materiel en inventaire.</div>
          ) : (
            <div className="space-y-3">
              {assets.map((asset) => (
                <div key={asset.id} className="flex items-center justify-between rounded-xl border border-slate-100 p-4 hover:bg-slate-50">
                  <div>
                    <div className="font-bold text-slate-900">{asset.model}</div>
                    <div className="text-xs text-slate-500">{asset.serial_number} - {asset.assigned_to}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-500">{asset.location}</span>
                    <Badge variant="outline">{asset.status}</Badge>
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
