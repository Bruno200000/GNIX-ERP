import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Smartphone, QrCode, Zap, ShieldCheck, ArrowRight } from "lucide-react"
import { QRCodeSVG } from "qrcode.react"
import { useState, useEffect } from "react"

export function MobileAccessDialog() {
  const [serverIp, setServerIp] = useState("192.168.1.13") // IP détectée via ipconfig
  const [mobileUrl, setMobileUrl] = useState("")

  useEffect(() => {
    setMobileUrl(`http://${serverIp}:3000/mobile`)
  }, [serverIp])

  return (
    <Dialog>
      <DialogTrigger
        render={
          <button
            type="button"
            className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-50 hover:text-indigo-600 transition-all dark:bg-slate-950 dark:text-slate-400 dark:hover:text-white"
          >
            <Smartphone className="h-5 w-5" aria-hidden="true" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
            </span>
          </button>
        }
      />
      <DialogContent className="sm:max-w-[425px] rounded-3xl border-slate-200 shadow-2xl">
        <DialogHeader className="items-center text-center">
          <div className="h-16 w-16 bg-indigo-100 rounded-2xl flex items-center justify-center mb-4">
            <QrCode className="h-8 w-8 text-indigo-600" />
          </div>
          <DialogTitle className="text-2xl font-black text-slate-900">Accès Mobile GNIX</DialogTitle>
          <DialogDescription className="text-slate-500">
            Assurez-vous que votre téléphone est sur le **même réseau Wi-Fi**.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col items-center py-6">
          <div className="mb-4 w-full px-4">
             <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Adresse IP du Serveur</label>
             <input 
               type="text" 
               value={serverIp} 
               onChange={(e) => setServerIp(e.target.value)}
               className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono text-indigo-600 focus:ring-2 focus:ring-indigo-600 outline-none"
             />
          </div>

          <div className="relative p-6 bg-white rounded-[2.5rem] shadow-2xl border-8 border-slate-50 mb-6 group cursor-pointer transition-transform hover:scale-105 duration-300">
            {mobileUrl ? (
              <QRCodeSVG 
                value={mobileUrl} 
                size={180}
                level="H"
                includeMargin={false}
                imageSettings={{
                  src: "/logo.png",
                  x: undefined,
                  y: undefined,
                  height: 36,
                  width: 36,
                  excavate: true,
                }}
              />
            ) : (
              <div className="w-[180px] h-[180px] bg-slate-100 animate-pulse rounded-xl" />
            )}
            <div className="absolute inset-0 bg-indigo-600/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-[2.5rem] flex items-center justify-center backdrop-blur-[1px]">
              <div className="bg-white/90 p-3 rounded-2xl shadow-xl">
                 <Zap className="h-8 w-8 text-indigo-600 animate-bounce" />
              </div>
            </div>
          </div>

          <div className="w-full space-y-4">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-4">
              <div className="h-10 w-10 bg-white rounded-xl shadow-sm flex items-center justify-center">
                <Zap className="h-5 w-5 text-amber-500" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">Connexion Sécurisée</p>
                <p className="text-[10px] text-slate-400">Authentification biométrique requise sur le téléphone.</p>
              </div>
            </div>

            <Button className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl gap-2 group">
              Générer un lien temporaire <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
