import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Lock, Smartphone, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function SettingsSecurity() {
  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-3xl font-bold tracking-tight">Sécurité</h1>
      <p className="text-sm text-slate-500">Protégez votre compte avec l'authentification forte et le suivi des sessions.</p>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Lock className="h-5 w-5 text-indigo-500" /> Mot de passe</CardTitle>
        </CardHeader>
        <CardContent>
          <Button variant="outline">Changer le mot de passe</Button>
        </CardContent>
      </Card>

      <Card className="border-indigo-100 bg-indigo-50/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Smartphone className="h-5 w-5 text-indigo-600" /> Double Authentification (2FA)</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-500 mb-4">Ajoutez une couche de sécurité supplémentaire à votre compte.</p>
          <Button className="bg-indigo-600 text-white">Activer le 2FA</Button>
        </CardContent>
      </Card>
    </div>
  )
}
