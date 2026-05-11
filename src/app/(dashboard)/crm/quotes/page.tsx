import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { FileCheck, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CreateQuoteDialog } from "@/components/crm/CreateQuoteDialog"

export default function CRMQuotes() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Devis & Offres</h1>
          <p className="text-sm text-slate-500">Gérez vos propositions commerciales et signatures électroniques.</p>
        </div>
        <CreateQuoteDialog />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Historique des Devis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-10 text-slate-400 italic">Aucun devis récent.</div>
        </CardContent>
      </Card>
    </div>
  )
}
