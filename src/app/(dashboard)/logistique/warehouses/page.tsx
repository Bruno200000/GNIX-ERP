import { getProducts, getWarehouses } from "../actions"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Plus, MapPin, Grid3X3, ArrowRightLeft, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { AddStockDialog } from "@/components/logistique/AddStockDialog"
import { AddWarehouseDialog } from "@/components/logistique/AddWarehouseDialog"
import { TransferStockDialog } from "@/components/logistique/TransferStockDialog"
import { EditLocationDialog } from "@/components/logistique/EditLocationDialog"

export default async function LogistiqueWarehouses() {
  const [warehouses, products] = await Promise.all([getWarehouses(), getProducts()])
  const inventoryRows = products.flatMap((product) =>
    product.inventory.map((row) => ({
      id: row.id,
      name: product.name,
      sku: product.sku,
      qty: row.quantity,
      warehouse: row.warehouses?.name || "Entrepot inconnu",
      warehouseId: row.warehouse_id,
      location: row.location || "Non defini",
    })),
  )

  const stockByWarehouse = warehouses.map((warehouse) => {
    const qty = inventoryRows
      .filter((row) => row.warehouseId === warehouse.id)
      .reduce((sum, row) => sum + row.qty, 0)
    return { ...warehouse, qty, fill: warehouse.capacity ? Math.round((qty / warehouse.capacity) * 100) : 0 }
  })

  const totalWarehouses = warehouses.length
  const totalItems = inventoryRows.reduce((sum, row) => sum + row.qty, 0)
  const avgFillRate = stockByWarehouse.length ? Math.round(stockByWarehouse.reduce((sum, w) => sum + w.fill, 0) / stockByWarehouse.length) : 0

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Entrepots & Emplacements</h1>
          <p className="text-sm text-slate-500">Gerez vos stocks avec precision : allees, etageres et casiers.</p>
        </div>
        <div className="flex gap-2">
          <TransferStockDialog />
          <AddStockDialog />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <Card className="bg-indigo-50/50 border-indigo-100 shadow-sm">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Total Entrepôts</p>
              <h3 className="text-2xl font-black text-slate-900 mt-1">{totalWarehouses}</h3>
            </div>
            <div className="h-10 w-10 bg-indigo-100 rounded-xl flex items-center justify-center">
              <MapPin className="h-5 w-5 text-indigo-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-emerald-50/50 border-emerald-100 shadow-sm">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Total Articles</p>
              <h3 className="text-2xl font-black text-slate-900 mt-1">{totalItems.toLocaleString("fr-FR")}</h3>
            </div>
            <div className="h-10 w-10 bg-emerald-100 rounded-xl flex items-center justify-center">
              <Grid3X3 className="h-5 w-5 text-emerald-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-blue-50/50 border-blue-100 shadow-sm">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-blue-600 uppercase tracking-wider">Taux Remplissage Moyen</p>
              <h3 className="text-2xl font-black text-slate-900 mt-1">{avgFillRate}%</h3>
            </div>
            <div className="h-10 w-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <ArrowRightLeft className="h-5 w-5 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {stockByWarehouse.map((warehouse, index) => (
          <Card key={warehouse.id} className={`border-l-4 ${index % 2 === 0 ? "border-l-indigo-500" : "border-l-amber-500"}`}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold text-slate-500">{warehouse.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-black">{warehouse.qty.toLocaleString("fr-FR")} art.</div>
                <Badge className={warehouse.fill > 75 ? "bg-emerald-100 text-emerald-700 border-none" : "bg-blue-100 text-blue-700 border-none"}>
                  {warehouse.fill}% Plein
                </Badge>
              </div>
              <p className="text-[10px] text-slate-400 mt-2 flex items-center gap-1">
                <MapPin className="h-3 w-3" /> {warehouse.location}
              </p>
            </CardContent>
          </Card>
        ))}

        <AddWarehouseDialog trigger={
          <Card className="bg-slate-50 border-dashed border-2 flex items-center justify-center cursor-pointer hover:bg-slate-100 transition-colors h-[100px]">
            <div className="text-center">
              <Plus className="h-5 w-5 text-slate-400 mx-auto" />
              <span className="text-xs font-bold text-slate-500 uppercase">Nouvel Entrepot</span>
            </div>
          </Card>
        } />
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Inventaire Detaille & Emplacements</CardTitle>
              <CardDescription>Precisez l'etagere de chaque produit pour un picking rapide.</CardDescription>
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
                  <th className="px-6 py-3">Entrepot</th>
                  <th className="px-6 py-3 text-indigo-600">Emplacement (Etagere)</th>
                  <th className="px-6 py-3">Quantite</th>
                  <th className="px-6 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {inventoryRows.map((item) => (
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
                      <EditLocationDialog 
                        inventoryId={item.id} 
                        currentLocation={item.location} 
                        productName={item.name} 
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {inventoryRows.length === 0 && <div className="text-center py-10 text-slate-400 italic">Aucun emplacement de stock.</div>}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
