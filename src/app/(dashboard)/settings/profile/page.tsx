import { getProfile, saveProfile } from "../actions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { PhotoFileInput } from "@/components/ui/PhotoFileInput"
import { Badge } from "@/components/ui/badge"

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
            <div className="flex items-center gap-4 rounded-xl border border-slate-100 p-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={profile?.avatar_url || undefined} />
                <AvatarFallback className="bg-indigo-100 text-indigo-700">
                  {profile?.first_name?.[0]}{profile?.last_name?.[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="font-bold text-slate-900">{profile?.first_name} {profile?.last_name}</div>
                <div className="text-xs text-slate-500">{profile?.email}</div>
                <div className="mt-2 flex gap-2">
                  <Badge variant="secondary">{profile?.role || "Utilisateur"}</Badge>
                  <Badge variant={profile?.is_active ? "outline" : "secondary"}>{profile?.is_active ? "Compte actif" : "En attente"}</Badge>
                </div>
              </div>
              <PhotoFileInput name="avatar" label="Avatar" shape="rounded-full" />
            </div>
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
