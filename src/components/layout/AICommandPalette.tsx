'use client'

import { useState, useEffect, useRef } from "react"
import { Sparkles, Command, ArrowRight, Loader2, Zap, Mic, MicOff } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { processAICommand } from "@/lib/ai-actions"

export function AICommandPalette() {
  const [query, setQuery] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [suggestion, setSuggestion] = useState<string | null>(null)
  const [lastResponse, setLastResponse] = useState<{message: string, type: string} | null>(null)
  const recognitionRef = useRef<any>(null)

  useEffect(() => {
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = false
      recognitionRef.current.lang = 'fr-FR'

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        setQuery(transcript)
        setIsRecording(false)
      }

      recognitionRef.current.onerror = () => setIsRecording(false)
      recognitionRef.current.onend = () => setIsRecording(false)
    }
  }, [])

  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop()
    } else {
      setIsRecording(true)
      recognitionRef.current?.start()
    }
  }

  useEffect(() => {
    if (query.length > 5) {
      const timer = setTimeout(() => {
        setSuggestion("IA suggère : 'Donne moi le bilan financier'")
      }, 500)
      return () => clearTimeout(timer)
    } else {
      setSuggestion(null)
    }
  }, [query])

  const handleCommand = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query) return
    setIsProcessing(true)
    setLastResponse(null)
    
    try {
      const result = await processAICommand(query)
      setLastResponse(result)
      setQuery("")
    } catch (error) {
      console.error(error)
      setLastResponse({ message: "Une erreur est survenue lors du traitement.", type: "error" })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="relative w-full max-w-xl">
      <form onSubmit={handleCommand} className="relative group">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
          {isProcessing ? (
            <Loader2 className="h-4 w-4 text-indigo-500 animate-spin" />
          ) : (
            <Sparkles className={cn(
              "h-4 w-4 text-indigo-500 transition-transform",
              isRecording ? "scale-125 animate-pulse text-red-500" : "group-hover:scale-110"
            )} />
          )}
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className={cn(
            "block w-full rounded-2xl border-none bg-slate-50 py-3 pl-11 pr-32 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:bg-slate-900 dark:text-white dark:ring-slate-800 transition-all shadow-sm",
            isProcessing && "opacity-50 pointer-events-none",
            isRecording && "ring-red-200 ring-4"
          )}
          placeholder={isRecording ? "Je vous écoute..." : "IA : Tapez ou dites une commande..."}
        />
        <div className="absolute inset-y-2 right-2 flex items-center gap-2">
          <button
            type="button"
            onClick={toggleRecording}
            className={cn(
              "h-8 w-8 rounded-lg flex items-center justify-center transition-all",
              isRecording ? "bg-red-500 text-white animate-pulse" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
            )}
          >
            {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </button>
          <div className="hidden sm:flex items-center gap-1 px-2 py-1 bg-white border border-slate-200 rounded-lg text-[10px] font-bold text-slate-400 shadow-sm">
             <Command className="h-2.5 w-2.5" /> K
          </div>
          <button 
            type="submit"
            className="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/20"
          >
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </form>

      {suggestion && !isProcessing && !lastResponse && (
        <div className="absolute top-full left-0 right-0 mt-2 p-3 bg-white rounded-2xl shadow-xl border border-indigo-50 animate-in fade-in slide-in-from-top-2 z-50">
          <div className="flex items-center gap-2 text-indigo-600">
            <Zap className="h-3.5 w-3.5 fill-current" />
            <p className="text-xs font-bold">{suggestion}</p>
          </div>
        </div>
      )}

      {lastResponse && (
        <div className="absolute top-full left-0 right-0 mt-2 p-4 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-indigo-100 dark:border-slate-800 animate-in fade-in slide-in-from-top-4 z-50">
          <div className="flex items-start gap-4">
            <div className="h-10 w-10 bg-indigo-600 rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-indigo-500/20">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1 space-y-1">
              <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">Assistant GNIX IA</p>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-semibold">
                {lastResponse.message}
              </p>
              <div className="pt-3 flex justify-end">
                <Button size="sm" variant="outline" onClick={() => setLastResponse(null)} className="h-7 text-[10px] uppercase font-bold text-slate-400 rounded-lg">Fermer</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
