import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building, MapPin, Globe, Phone } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function SettingsOrganisation() {
  return (
    <div className="space-y-6 max-w-4xl">
      <h1 className="text-3xl font-bold tracking-tight">Paramètres de l'Organisation</h1>
      <p className="text-sm text-slate-500">Gérez l'identité de votre entreprise et les informations légales.</p>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Building className="h-5 w-5 text-indigo-500" /> Identité</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Nom de l'Organisation</label>
              <Input defaultValue="GNIX IA SARL" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Slogan / baseline</label>
              <Input defaultValue="L'IA au service de votre gestion" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Catégorie de Structure</label>
              <select className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2">
                <option value="retail">Vente de Produits / Retail</option>
                <option value="service">Prestation de Services</option>
                <option value="industry">Industrie / Production</option>
                <option value="other">Autre</option>
              </select>
              <p className="text-[10px] text-slate-400">Cette option adapte les modules (ex: Logistique avancée pour la vente).</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><MapPin className="h-5 w-5 text-indigo-500" /> Localisation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Adresse</label>
              <Input defaultValue="Boulevard Latrille, Cocody" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Ville / Pays</label>
              <Input defaultValue="Abidjan, Côte d'Ivoire" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Globe className="h-5 w-5 text-indigo-500" /> Présence Digitale</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase">Site Web</label>
            <Input defaultValue="https://gnix.ia" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase">Téléphone Standard</label>
            <Input defaultValue="+225 01 02 03 04 05" />
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-end">
        <Button className="bg-indigo-600 text-white px-8 h-12 rounded-xl">Mettre à jour l'organisation</Button>
      </div>
    </div>
  )
}
