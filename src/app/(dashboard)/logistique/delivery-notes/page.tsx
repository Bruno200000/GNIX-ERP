import { getDeliveryNotes } from "../actions"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Printer, Download, Search, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { CreateDeliveryNoteDialog } from "@/components/logistique/CreateDeliveryNoteDialog"

export default async function LogistiqueDeliveryNotes() {
  const notes = await getDeliveryNotes()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bons de Livraison (BL)</h1>
          <p className="text-sm text-slate-500">Gerez les sorties de stock et les confirmations de livraison.</p>
        </div>
        <CreateDeliveryNoteDialog />
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input className="pl-10 h-10 rounded-xl" placeholder="Rechercher par N BL ou Client..." />
        </div>
        <Button variant="outline" className="gap-2"><Filter className="h-4 w-4" /> Filtres</Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 border-b text-[10px] uppercase font-bold text-slate-500 tracking-widest">
                <tr>
                  <th className="px-6 py-4">N de Bon</th>
                  <th className="px-6 py-4">Client / Destination</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Articles</th>
                  <th className="px-6 py-4">Statut</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {notes.map((note) => (
                  <tr key={note.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-indigo-600">{note.delivery_number}</td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900">{note.client?.name || "Client inconnu"}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-500">{new Date(note.delivery_date).toLocaleDateString("fr-FR")}</td>
                    <td className="px-6 py-4">
                      <Badge variant="secondary" className="bg-slate-100">{note.items.reduce((sum, item) => sum + item.qty, 0)} articles</Badge>
                    </td>
                    <td className="px-6 py-4">
                      <Badge className={note.status === "validated" ? "bg-emerald-500" : "bg-amber-500"}>
                        {note.status === "validated" ? "Valide" : "En attente"}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <Button variant="ghost" size="icon" title="Imprimer"><Printer className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" title="Telecharger"><Download className="h-4 w-4" /></Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {notes.length === 0 && <div className="text-center py-10 text-slate-400 italic">Aucun bon de livraison.</div>}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
