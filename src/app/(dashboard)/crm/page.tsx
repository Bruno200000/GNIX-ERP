import { getClients } from "./actions"
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
import { MoreHorizontal, Sparkles, Building2 } from "lucide-react"
import { AddClientDialog } from "@/components/crm/AddClientDialog"

export default async function CRMPage() {
  const clients = await getClients()

  const getScoreColor = (score: number) => {
    if (score >= 80) return "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-emerald-500/20"
    if (score >= 50) return "bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 border-amber-500/20"
    return "bg-slate-500/10 text-slate-500 hover:bg-slate-500/20 border-slate-500/20"
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">CRM & Ventes</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Gérez vos clients et vos leads avec la puissance prédictive de l'IA GNIX.
          </p>
        </div>
        <AddClientDialog />
      </div>

      <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-slate-500" />
            Liste des Clients
          </CardTitle>
          <CardDescription>
            Tous les clients de votre organisation. Triez par Score IA pour prioriser vos relances.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {clients.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center border border-dashed rounded-lg border-slate-300 dark:border-slate-800">
              <Sparkles className="h-10 w-10 text-slate-400 mb-4" />
              <h3 className="text-lg font-medium text-slate-900 dark:text-white">Aucun client trouvé</h3>
              <p className="mt-1 text-sm text-slate-500">
                Vous n'avez pas encore de clients ou vous n'êtes pas connecté à l'organisation.
              </p>
            </div>
          ) : (
            <div className="rounded-md border border-slate-200 dark:border-slate-800">
              <Table>
                <TableHeader className="bg-slate-50 dark:bg-slate-900/50">
                  <TableRow>
                    <TableHead>Nom du Client</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>
                      <div className="flex items-center gap-1">
                        <Sparkles className="h-3 w-3 text-indigo-500" />
                        Score IA
                      </div>
                    </TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clients.map((client) => (
                    <TableRow key={client.id}>
                      <TableCell className="font-medium">{client.name}</TableCell>
                      <TableCell className="text-slate-500">{client.email}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {client.type || 'Standard'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getScoreColor(client.ai_conversion_score || 0)}>
                          {client.ai_conversion_score || 0}/100
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
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
