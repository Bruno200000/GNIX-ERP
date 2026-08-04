import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Lock, Smartphone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { getAppSettings, requestPasswordReset, saveSettings } from "../actions"

export default async function SettingsSecurity() {
  const settings = await getAppSettings()
  const notifications = settings?.notifications || {}

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
          <form action={saveSettings} className="space-y-4 rounded-xl border border-indigo-100 bg-white p-4">
            <input type="hidden" name="settings_section" value="security" />
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm font-medium text-slate-700">2FA active</span>
              <Switch name="two_factor_enabled" defaultChecked={settings?.two_factor_enabled ?? false} />
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm font-medium text-slate-700">Alertes de connexion</span>
              <Switch name="login_alerts" defaultChecked={notifications.login_alerts !== false} />
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm font-medium text-slate-700">Appareils approuves</span>
              <Switch name="device_approval" defaultChecked={notifications.device_approval === true} />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="session_timeout">Expiration session</Label>
                <select id="session_timeout" name="session_timeout" defaultValue={String(notifications.session_timeout || "30")} className="flex h-10 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-600">
                  <option value="15">15 minutes</option>
                  <option value="30">30 minutes</option>
                  <option value="60">1 heure</option>
                  <option value="240">4 heures</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="audit_retention">Retention audit</Label>
                <select id="audit_retention" name="audit_retention" defaultValue={String(notifications.audit_retention || "90")} className="flex h-10 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-600">
                  <option value="30">30 jours</option>
                  <option value="90">90 jours</option>
                  <option value="365">1 an</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end">
              <Button className="bg-indigo-600 text-white" type="submit">Enregistrer</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
