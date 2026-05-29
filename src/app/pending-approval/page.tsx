import { logout } from "@/app/login/actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ShieldCheck } from "lucide-react"

export default function PendingApprovalPage() {
  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <Card className="max-w-md w-full border-slate-200 shadow-sm">
        <CardHeader className="text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100">
            <ShieldCheck className="h-6 w-6 text-indigo-600" />
          </div>
          <CardTitle>Compte en attente de validation</CardTitle>
          <CardDescription>
            Un administrateur doit valider votre acces avant que vous puissiez utiliser GNIX ERP.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={logout}>
            <Button type="submit" variant="outline" className="w-full">Retour a la connexion</Button>
          </form>
        </CardContent>
      </Card>
    </main>
  )
}
