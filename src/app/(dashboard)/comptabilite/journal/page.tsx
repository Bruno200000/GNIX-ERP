import { getAccountingEntries } from "../actions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { BookOpenCheck } from "lucide-react"

export default async function AccountingJournalPage() {
  const entries = await getAccountingEntries()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Journal comptable</h1>
        <p className="text-sm text-slate-500">Ecritures generees par les operations comptables.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpenCheck className="h-5 w-5 text-indigo-500" />
            Ecritures
          </CardTitle>
        </CardHeader>
        <CardContent>
          {entries.length === 0 ? (
            <div className="rounded-lg border border-dashed border-slate-300 py-10 text-center text-sm text-slate-500">
              Aucune ecriture comptable.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>N°</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Compte</TableHead>
                  <TableHead>Libelle</TableHead>
                  <TableHead className="text-right">Debit</TableHead>
                  <TableHead className="text-right">Credit</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {entries.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell className="font-medium">{entry.entry_number}</TableCell>
                    <TableCell>{new Date(entry.entry_date).toLocaleDateString("fr-FR")}</TableCell>
                    <TableCell>{entry.account_code}</TableCell>
                    <TableCell>{entry.label}</TableCell>
                    <TableCell className="text-right">{entry.debit.toLocaleString("fr-FR")}</TableCell>
                    <TableCell className="text-right">{entry.credit.toLocaleString("fr-FR")}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
