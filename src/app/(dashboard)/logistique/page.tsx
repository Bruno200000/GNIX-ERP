import { getProducts, getPurchaseOrders } from "./actions"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Package, MapPin, ShoppingCart } from "lucide-react"
import { AddProductDialog } from "@/components/logistique/AddProductDialog"
import { AddPurchaseOrderDialog } from "@/components/logistique/AddPurchaseOrderDialog"
import { addPurchaseOrder } from "./actions"

export default async function LogistiquePage() {
  const products = await getProducts()
  const purchaseOrders = await getPurchaseOrders()

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF' }).format(amount)
  }

  // Calcul du stock total depuis la relation inventory
  const getTotalStock = (inventoryArray: any[]) => {
    if (!inventoryArray || inventoryArray.length === 0) return 0
    return inventoryArray.reduce((acc, curr) => acc + (curr.quantity || 0), 0)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Logistique & Stocks</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Gérez votre catalogue de produits et suivez l'inventaire dans vos différents entrepôts.
          </p>
        </div>
        <div className="flex gap-2">
          <AddPurchaseOrderDialog action={addPurchaseOrder} />
          <AddProductDialog />
        </div>
      </div>

      <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-slate-500" />
            Catalogue des Produits
          </CardTitle>
          <CardDescription>
            Tous les articles de votre entreprise avec leur disponibilité en temps réel.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center border border-dashed rounded-lg border-slate-300 dark:border-slate-800">
              <Package className="h-10 w-10 text-slate-400 mb-4" />
              <h3 className="text-lg font-medium text-slate-900 dark:text-white">Aucun produit</h3>
              <p className="mt-1 text-sm text-slate-500">
                Votre catalogue est vide. Ajoutez votre premier article pour gérer ses stocks.
              </p>
            </div>
          ) : (
            <div className="rounded-md border border-slate-200 dark:border-slate-800">
              <Table>
                <TableHeader className="bg-slate-50 dark:bg-slate-900/50">
                  <TableRow>
                    <TableHead>Référence (SKU)</TableHead>
                    <TableHead>Nom du Produit</TableHead>
                    <TableHead>Prix Unitaire</TableHead>
                    <TableHead>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-slate-500" />
                        Stock Total
                      </div>
                    </TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => {
                    const totalStock = getTotalStock(product.inventory)
                    
                    return (
                      <TableRow key={product.id}>
                        <TableCell className="font-mono text-xs text-slate-500">
                          {product.sku}
                        </TableCell>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell className="text-slate-900 dark:text-white">
                          {formatCurrency(product.price)}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={
                            totalStock > 10 ? "text-emerald-500 border-emerald-500/20 bg-emerald-500/10" :
                            totalStock > 0 ? "text-amber-500 border-amber-500/20 bg-amber-500/10" :
                            "text-red-500 border-red-500/20 bg-red-500/10"
                          }>
                            {totalStock > 0 ? `${totalStock} en stock` : 'Rupture'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-slate-200 dark:border-slate-800 shadow-sm mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-slate-500" />
            Bons de Commande
          </CardTitle>
          <CardDescription>
            Suivi des commandes fournisseurs et reapprovisionnements en cours.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {purchaseOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center border border-dashed rounded-lg border-slate-300 dark:border-slate-800">
              <ShoppingCart className="h-10 w-10 text-slate-400 mb-4" />
              <h3 className="text-lg font-medium text-slate-900 dark:text-white">Aucun bon de commande</h3>
              <p className="mt-1 text-sm text-slate-500">
                Vous n'avez pas de commande fournisseur en cours.
              </p>
            </div>
          ) : (
            <div className="rounded-md border border-slate-200 dark:border-slate-800">
              <Table>
                <TableHeader className="bg-slate-50 dark:bg-slate-900/50">
                  <TableRow>
                    <TableHead>N° Commande</TableHead>
                    <TableHead>Fournisseur</TableHead>
                    <TableHead>Montant</TableHead>
                    <TableHead>Date prevue</TableHead>
                    <TableHead>Statut</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {purchaseOrders.map((po) => (
                    <TableRow key={po.id}>
                      <TableCell className="font-mono text-xs font-bold text-indigo-600">
                        {po.order_number}
                      </TableCell>
                      <TableCell className="font-medium">{po.supplier}</TableCell>
                      <TableCell className="text-slate-900 dark:text-white">
                        {formatCurrency(po.total_amount)}
                      </TableCell>
                      <TableCell>{new Date(po.expected_date).toLocaleDateString("fr-FR")}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={
                          po.status === 'pending' ? "text-amber-500 border-amber-500/20 bg-amber-500/10" :
                          po.status === 'received' ? "text-emerald-500 border-emerald-500/20 bg-emerald-500/10" :
                          "text-slate-500 border-slate-500/20 bg-slate-500/10"
                        }>
                          {po.status === 'pending' ? 'En attente' : 'Recu'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
