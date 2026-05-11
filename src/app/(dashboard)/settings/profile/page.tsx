import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { User, Mail, Shield } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function SettingsProfile() {
  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-3xl font-bold tracking-tight">Mon Profil</h1>
      <p className="text-sm text-slate-500">Gérez vos informations personnelles et préférences de compte.</p>
      
      <Card>
        <CardHeader>
          <CardTitle>Informations Générales</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Prénom</label>
              <Input defaultValue="Bruno" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Nom</label>
              <Input defaultValue="Admin" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase">Email</label>
            <Input defaultValue="bruno@gnix.ia" type="email" />
          </div>
          <Button className="bg-indigo-600 text-white">Sauvegarder les modifications</Button>
        </CardContent>
      </Card>
    </div>
  )
}
