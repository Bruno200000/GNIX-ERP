import { getQuotes } from "../actions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CreateQuoteDialog } from "@/components/crm/CreateQuoteDialog"

export default async function CRMQuotes() {
  const quotes = await getQuotes()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Devis & Offres</h1>
          <p className="text-sm text-slate-500">Gerez vos propositions commerciales et signatures electroniques.</p>
        </div>
        <CreateQuoteDialog />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Historique des Devis</CardTitle>
        </CardHeader>
        <CardContent>
          {quotes.length === 0 ? (
            <div className="text-center py-10 text-slate-400 italic">Aucun devis recent.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 border-b text-[10px] uppercase font-bold text-slate-500 tracking-widest">
                  <tr>
                    <th className="px-6 py-4">Numero</th>
                    <th className="px-6 py-4">Client</th>
                    <th className="px-6 py-4">Validite</th>
                    <th className="px-6 py-4">Montant</th>
                    <th className="px-6 py-4">Statut</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {quotes.map((quote) => (
                    <tr key={quote.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-bold text-indigo-600">{quote.quote_number}</td>
                      <td className="px-6 py-4">{quote.client?.name || "Client inconnu"}</td>
                      <td className="px-6 py-4 text-slate-500">{new Date(quote.valid_until).toLocaleDateString("fr-FR")}</td>
                      <td className="px-6 py-4 font-semibold">{quote.total_amount.toLocaleString("fr-FR")} FCFA</td>
                      <td className="px-6 py-4"><Badge variant="outline">{quote.status}</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
