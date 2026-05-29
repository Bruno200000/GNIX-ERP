import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Lock, Smartphone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { getAppSettings, requestPasswordReset, saveSettings } from "../actions"

export default async function SettingsSecurity() {
  const settings = await getAppSettings()

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-3xl font-bold tracking-tight">Securite</h1>
      <p className="text-sm text-slate-500">Protegez votre compte avec l'authentification forte et le suivi des sessions.</p>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Lock className="h-5 w-5 text-indigo-500" /> Mot de passe</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={requestPasswordReset}>
            <Button variant="outline" type="submit">Envoyer un lien de reinitialisation</Button>
          </form>
        </CardContent>
      </Card>

      <Card className="border-indigo-100 bg-indigo-50/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Smartphone className="h-5 w-5 text-indigo-600" /> Double Authentification (2FA)</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-500 mb-4">Ajoutez une couche de securite supplementaire a votre compte.</p>
          <form action={saveSettings} className="flex items-center justify-between gap-4 rounded-xl border border-indigo-100 bg-white p-4">
            <input type="hidden" name="settings_section" value="security" />
            <span className="text-sm font-medium text-slate-700">2FA active</span>
            <Switch name="two_factor_enabled" defaultChecked={settings?.two_factor_enabled ?? false} />
            <Button className="bg-indigo-600 text-white" type="submit">Enregistrer</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
