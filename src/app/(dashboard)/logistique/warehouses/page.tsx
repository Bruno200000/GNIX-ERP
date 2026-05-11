import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Building2, Plus, Box, MapPin, Grid3X3, ArrowRightLeft, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { AddStockDialog } from "@/components/logistique/AddStockDialog"

export default function LogistiqueWarehouses() {
  const stockItems = [
    { id: 1, name: 'Processeur i7-12700K', sku: 'CPU-001', qty: 45, warehouse: 'Entrepôt Central', location: 'Étagère A-12' },
    { id: 2, name: 'Carte Mère Z690', sku: 'MB-982', qty: 12, warehouse: 'Entrepôt Central', location: 'Étagère B-04' },
    { id: 3, name: 'Alimentation 850W Gold', sku: 'PSU-102', qty: 28, warehouse: 'Hub Secondaire', location: 'Section C-1' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Entrepôts & Emplacements</h1>
          <p className="text-sm text-slate-500">Gérez vos stocks avec précision : allées, étagères et casiers.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <ArrowRightLeft className="h-4 w-4" /> Transfert de Stock
          </Button>
          <AddStockDialog />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="border-l-4 border-l-indigo-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold text-slate-500">Entrepôt Central</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-black">1,450 art.</div>
              <Badge className="bg-emerald-100 text-emerald-700 border-none">85% Plein</Badge>
            </div>
            <p className="text-[10px] text-slate-400 mt-2 flex items-center gap-1">
              <MapPin className="h-3 w-3" /> Zone Industrielle, Abidjan
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-amber-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold text-slate-500">Hub Secondaire</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-black">280 art.</div>
              <Badge className="bg-blue-100 text-blue-700 border-none">12% Plein</Badge>
            </div>
            <p className="text-[10px] text-slate-400 mt-2 flex items-center gap-1">
              <MapPin className="h-3 w-3" /> Koumassi, Abidjan
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-50 border-dashed border-2 flex items-center justify-center cursor-pointer hover:bg-slate-100 transition-colors h-[100px]">
           <div className="text-center">
              <Plus className="h-5 w-5 text-slate-400 mx-auto" />
              <span className="text-xs font-bold text-slate-500 uppercase">Nouvel Entrepôt</span>
           </div>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Inventaire Détaillé & Emplacements</CardTitle>
              <CardDescription>Précisez l'étagère de chaque produit pour un picking rapide.</CardDescription>
            </div>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input className="pl-10 h-9 rounded-xl" placeholder="Rechercher produit..." />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50/50 border-y text-[10px] uppercase font-bold text-slate-500 tracking-widest">
                <tr>
                  <th className="px-6 py-3">Produit / SKU</th>
                  <th className="px-6 py-3">Entrepôt</th>
                  <th className="px-6 py-3 text-indigo-600">Emplacement (Étagère)</th>
                  <th className="px-6 py-3">Quantité</th>
                  <th className="px-6 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {stockItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900">{item.name}</div>
                      <div className="text-[10px] font-mono text-slate-400">{item.sku}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-500 text-xs font-medium">{item.warehouse}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 font-black text-indigo-600">
                        <Grid3X3 className="h-3.5 w-3.5" />
                        {item.location}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-black">{item.qty}</td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="ghost" size="sm">Éditer Empl.</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
