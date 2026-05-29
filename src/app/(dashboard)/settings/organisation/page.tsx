import { getOrganizationSettings, saveOrganization } from "../actions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building, MapPin, Globe } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default async function SettingsOrganisation() {
  const organization = await getOrganizationSettings()
  const settings = organization.settings || {}

  return (
    <div className="space-y-6 max-w-4xl">
      <h1 className="text-3xl font-bold tracking-tight">Parametres de l'Organisation</h1>
      <p className="text-sm text-slate-500">Gerez l'identite de votre entreprise et les informations legales.</p>
      
      <form action={saveOrganization} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Building className="h-5 w-5 text-indigo-500" /> Identite</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Nom de l'Organisation</label>
                <Input name="name" defaultValue={organization.name} />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Date de creation</label>
                <Input value={new Date(organization.created_at).toLocaleDateString("fr-FR")} readOnly className="bg-slate-50 text-slate-500" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Slogan / baseline</label>
                <Input name="slogan" defaultValue={String(settings.slogan || "")} />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Categorie de Structure</label>
                <select name="category" defaultValue={String(settings.category || "service")} className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2">
                  <option value="retail">Vente de Produits / Retail</option>
                  <option value="service">Prestation de Services</option>
                  <option value="industry">Industrie / Production</option>
                  <option value="other">Autre</option>
                </select>
                <p className="text-[10px] text-slate-400">Cette option adapte les modules (ex: Logistique avancee pour la vente).</p>
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
                <Input name="address" defaultValue={String(settings.address || "")} />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Ville / Pays</label>
                <Input name="city_country" defaultValue={String(settings.city_country || "")} />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Globe className="h-5 w-5 text-indigo-500" /> Presence Digitale</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Site Web</label>
              <Input name="website" defaultValue={String(settings.website || "")} />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Telephone Standard</label>
              <Input name="phone" defaultValue={String(settings.phone || "")} />
            </div>
            <input type="hidden" name="domain" value={organization.domain || ""} />
          </CardContent>
        </Card>
        
        <div className="flex justify-end">
          <Button className="bg-indigo-600 text-white px-8 h-12 rounded-xl" type="submit">Mettre a jour l'organisation</Button>
        </div>
      </form>
    </div>
  )
}
