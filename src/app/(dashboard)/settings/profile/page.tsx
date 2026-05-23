import { getProfile, saveProfile } from "../actions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default async function SettingsProfile() {
  const profile = await getProfile()

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-3xl font-bold tracking-tight">Mon Profil</h1>
      <p className="text-sm text-slate-500">Gerez vos informations personnelles et preferences de compte.</p>
      
      <Card>
        <CardHeader>
          <CardTitle>Informations Generales</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={saveProfile} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Prenom</label>
                <Input name="first_name" defaultValue={profile?.first_name || ""} />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Nom</label>
                <Input name="last_name" defaultValue={profile?.last_name || ""} />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Email</label>
              <Input name="email" defaultValue={profile?.email || ""} type="email" />
            </div>
            <Button className="bg-indigo-600 text-white" type="submit">Sauvegarder les modifications</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
