"use client"

import { useEffect, useMemo, useState } from "react"
import { ArrowRight, CheckCircle2, Copy, QrCode, Smartphone, Wifi, Zap } from "lucide-react"
import { QRCodeSVG } from "qrcode.react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export function MobileAccessDialog() {
  const [serverIp, setServerIp] = useState("")
  const [port, setPort] = useState("3000")
  const [lanIps, setLanIps] = useState<string[]>([])
  const [temporaryUrl, setTemporaryUrl] = useState("")
  const [qrUrl, setQrUrl] = useState("")
  const [expiresAt, setExpiresAt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [copyState, setCopyState] = useState<"idle" | "copied" | "manual">("idle")

  useEffect(() => {
    let active = true

    async function loadAccessDetails() {
      const currentHostname = window.location.hostname
      const currentPort = window.location.port || "3000"

      setPort(currentPort)
      setServerIp(currentHostname === "localhost" ? "" : currentHostname)

      try {
        const response = await fetch("/mobile/access", { cache: "no-store" })
        if (!response.ok) return

        const details = await response.json()
        if (!active) return

        setServerIp(details.serverIp || currentHostname)
        setPort(details.port || currentPort)
        setLanIps(Array.isArray(details.lanIps) ? details.lanIps : [])
      } catch {
        if (active) setServerIp(currentHostname)
      }
    }

    loadAccessDetails()

    return () => {
      active = false
    }
  }, [])

  const cleanServerIp = serverIp
    .replace(/^https?:\/\//, "")
    .replace(/\/.*$/, "")
    .replace(/:\d+$/, "")
    .trim()

  const mobileUrl = useMemo(() => {
    if (!cleanServerIp) return ""
    return `http://${cleanServerIp}${port ? `:${port}` : ""}/mobile`
  }, [cleanServerIp, port])

  useEffect(() => {
    if (!mobileUrl) {
      setQrUrl("")
      return
    }

    const expires = new Date(Date.now() + 15 * 60 * 1000).toISOString()
    const token = typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}`

    setQrUrl(`${mobileUrl}?access=${token}&expires=${encodeURIComponent(expires)}`)
  }, [mobileUrl])

  async function copyToClipboard(value: string) {
    try {
      await navigator.clipboard.writeText(value)
      setCopyState("copied")
    } catch {
      setCopyState("manual")
    }

    window.setTimeout(() => setCopyState("idle"), 3000)
  }

  async function generateTemporaryLink() {
    setIsGenerating(true)
    setCopyState("idle")

    try {
      const response = await fetch("/mobile/access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ serverIp: cleanServerIp, port }),
      })

      if (!response.ok) throw new Error("Unable to generate link")

      const details = await response.json()
      setTemporaryUrl(details.temporaryUrl)
      setExpiresAt(details.expiresAt)
      await copyToClipboard(details.temporaryUrl)
    } catch {
      if (mobileUrl) {
        setTemporaryUrl(mobileUrl)
        await copyToClipboard(mobileUrl)
      }
    } finally {
      setIsGenerating(false)
    }
  }

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
          <DialogTitle className="text-2xl font-black text-slate-900">Acces Mobile GNIX</DialogTitle>
          <DialogDescription className="text-slate-500">
            Assurez-vous que votre telephone est sur le meme reseau Wi-Fi que ce PC.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center py-6">
          <div className="mb-4 grid w-full grid-cols-[1fr_88px] gap-2 px-4">
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Adresse IP du serveur</label>
              <input
                type="text"
                value={serverIp}
                onChange={(event) => setServerIp(event.target.value)}
                placeholder="IP du PC"
                className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono text-indigo-600 focus:ring-2 focus:ring-indigo-600 outline-none"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Port</label>
              <input
                type="text"
                value={port}
                onChange={(event) => setPort(event.target.value.replace(/\D/g, ""))}
                className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono text-indigo-600 focus:ring-2 focus:ring-indigo-600 outline-none"
              />
            </div>
          </div>

          {lanIps.length > 1 && (
            <div className="mb-4 flex w-full flex-wrap gap-2 px-4">
              {lanIps.map((ip) => (
                <button
                  key={ip}
                  type="button"
                  onClick={() => setServerIp(ip)}
                  className="rounded-lg border border-slate-200 px-2.5 py-1 text-[10px] font-bold text-slate-500 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
                >
                  {ip}
                </button>
              ))}
            </div>
          )}

          <div className="relative p-6 bg-white rounded-[2.5rem] shadow-2xl border-8 border-slate-50 mb-6 group cursor-pointer transition-transform hover:scale-105 duration-300">
            {mobileUrl ? (
              <QRCodeSVG
                value={temporaryUrl || qrUrl || mobileUrl}
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
                <Wifi className="h-5 w-5 text-amber-500" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-900">Adresse partagee</p>
                <p className="break-all text-[10px] text-slate-400">{mobileUrl || "Detection du reseau..."}</p>
              </div>
            </div>

            <Button
              type="button"
              onClick={generateTemporaryLink}
              disabled={!mobileUrl || isGenerating}
              className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl gap-2 group disabled:opacity-60"
            >
              {isGenerating ? "Generation..." : "Generer un lien temporaire"}
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>

            {temporaryUrl && (
              <div className="rounded-2xl border border-indigo-100 bg-indigo-50 p-3">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <p className="text-[10px] font-black uppercase tracking-widest text-indigo-700">Lien temporaire</p>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(temporaryUrl)}
                    className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-white px-2 text-[10px] font-bold text-indigo-600 shadow-sm"
                  >
                    {copyState === "copied" ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                    {copyState === "copied" ? "Copie" : "Copier"}
                  </button>
                </div>
                <p className="break-all font-mono text-[10px] text-slate-600">{temporaryUrl}</p>
                {expiresAt && (
                  <p className="mt-2 text-[10px] text-slate-400">
                    Valable jusqu&apos;a {new Date(expiresAt).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}.
                  </p>
                )}
                {copyState === "manual" && (
                  <p className="mt-2 text-[10px] font-bold text-amber-600">Copie automatique bloquee: copiez le lien affiche.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
