import { getEmployees } from "./actions"
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
import { MoreHorizontal, Users, Fingerprint } from "lucide-react"
import { AddEmployeeDialog } from "@/components/rh/AddEmployeeDialog"

export default async function RHPage() {
  const employees = await getEmployees()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Ressources Humaines</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Gérez vos collaborateurs, les pointages biométriques et les performances.
          </p>
        </div>
        <AddEmployeeDialog />
      </div>

      <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-slate-500" />
            Liste des Employés
          </CardTitle>
          <CardDescription>
            Tous les collaborateurs actifs de votre entreprise.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {employees.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center border border-dashed rounded-lg border-slate-300 dark:border-slate-800">
              <Fingerprint className="h-10 w-10 text-slate-400 mb-4" />
              <h3 className="text-lg font-medium text-slate-900 dark:text-white">Aucun employé</h3>
              <p className="mt-1 text-sm text-slate-500">
                Vous n'avez pas encore invité de collaborateurs dans votre organisation.
              </p>
            </div>
          ) : (
            <div className="rounded-md border border-slate-200 dark:border-slate-800">
              <Table>
                <TableHeader className="bg-slate-50 dark:bg-slate-900/50">
                  <TableRow>
                    <TableHead>Employé</TableHead>
                    <TableHead>Département</TableHead>
                    <TableHead>Poste</TableHead>
                    <TableHead>Type de Contrat</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {employees.map((emp) => (
                    <TableRow key={emp.id}>
                      <TableCell className="font-medium">
                        {emp.first_name} {emp.last_name}
                      </TableCell>
                      <TableCell>{emp.department || 'Non défini'}</TableCell>
                      <TableCell>{emp.position || 'Non défini'}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {emp.contract_type || 'Standard'}
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
