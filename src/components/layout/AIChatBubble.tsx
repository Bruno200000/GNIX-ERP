'use client'

import { useState, useRef, useEffect } from "react"
import { Sparkles, X, Send, Bot, User, Loader2, Mic, MicOff } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { processAICommand } from "@/lib/ai-actions"
import Image from "next/image"

export function AIChatBubble() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<{role: 'ai' | 'user', content: string}[]>([
    { role: 'ai', content: 'Bonjour Bruno ! Je suis GNIX IA. Comment puis-je vous aider aujourd\'hui ?' }
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
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
        setInput(transcript)
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
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = async () => {
    if (!input.trim()) return
    
    const userMsg = input
    setMessages(prev => [...prev, { role: 'user', content: userMsg }])
    setInput("")
    setIsTyping(true)

    try {
      const response = await processAICommand(userMsg)
      setMessages(prev => [...prev, { role: 'ai', content: response.message }])
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', content: "Désolé, j'ai rencontré une erreur." }])
    } finally {
      setIsTyping(false)
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-[350px] h-[480px] bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden animate-in slide-in-from-bottom-6 duration-300">
          {/* Header */}
          <div className="p-4 bg-indigo-600 text-white flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 bg-white rounded-xl flex items-center justify-center p-1.5 shadow-inner">
                <Image src="/logo.png" alt="GNIX" width={24} height={24} className="object-contain" />
              </div>
              <div>
                <p className="text-sm font-black leading-none uppercase tracking-tighter">GNIX <span className="text-indigo-200">IA</span></p>
                <p className="text-[9px] font-bold text-indigo-200 uppercase tracking-widest mt-1">Assistant Vocal Actif</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Messages Area */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide bg-slate-50/50 dark:bg-slate-900/50">
            {messages.map((msg, i) => (
              <div key={i} className={cn(
                "flex items-end gap-2 animate-in fade-in slide-in-from-bottom-2",
                msg.role === 'user' ? "flex-row-reverse" : "flex-row"
              )}>
                <div className={cn(
                  "h-7 w-7 rounded-lg flex items-center justify-center shrink-0 shadow-sm",
                  msg.role === 'ai' ? "bg-indigo-600 text-white" : "bg-white border border-slate-200 text-slate-600"
                )}>
                  {msg.role === 'ai' ? <Bot className="h-3.5 w-3.5" /> : <User className="h-3.5 w-3.5" />}
                </div>
                <div className={cn(
                  "max-w-[85%] p-3 rounded-2xl text-xs shadow-sm",
                  msg.role === 'ai' 
                    ? "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-bl-none border border-slate-100 dark:border-slate-700" 
                    : "bg-indigo-600 text-white rounded-br-none"
                )}>
                  {msg.content}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex items-center gap-2 text-indigo-600 animate-pulse">
                <div className="h-7 w-7 rounded-lg bg-indigo-50 flex items-center justify-center">
                  <Loader2 className="h-3 w-3 animate-spin" />
                </div>
                <span className="text-[9px] font-bold uppercase tracking-widest">IA réfléchit...</span>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
            <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="relative flex items-center gap-2">
              <div className="relative flex-1">
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={isRecording ? "Je vous écoute..." : "Message..."}
                  className={cn(
                    "w-full h-10 pl-4 pr-10 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-xs focus:ring-2 focus:ring-indigo-600 outline-none transition-all",
                    isRecording && "ring-2 ring-red-500 bg-red-50/50"
                  )}
                />
                <button
                  type="button"
                  onClick={toggleRecording}
                  className={cn(
                    "absolute right-2 top-1.5 h-7 w-7 rounded-lg flex items-center justify-center transition-all",
                    isRecording ? "bg-red-500 text-white animate-pulse" : "text-slate-400 hover:bg-slate-100"
                  )}
                >
                  {isRecording ? <MicOff className="h-3.5 w-3.5" /> : <Mic className="h-3.5 w-3.5" />}
                </button>
              </div>
              <button 
                type="submit"
                disabled={!input.trim() || isTyping}
                className="h-10 w-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 hover:bg-indigo-700 disabled:opacity-50 transition-all shrink-0"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Bubble Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "h-14 w-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 hover:scale-110 active:scale-95 group relative overflow-hidden border-4",
          isOpen 
            ? "bg-slate-900 rotate-90 border-slate-800" 
            : "bg-white p-2.5 border-indigo-100 shadow-indigo-500/20 animate-bounce [animation-duration:3s]"
        )}
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        {isOpen ? (
          <X className="h-6 w-6 text-white" />
        ) : (
          <div className="relative w-full h-full p-1">
            <Image 
              src="/logo.png" 
              alt="GNIX AI" 
              fill 
              className="object-contain group-hover:rotate-12 transition-transform" 
            />
          </div>
        )}
        {!isOpen && (
          <span className="absolute top-0 right-0 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-indigo-600 text-[8px] font-black flex items-center justify-center text-white border border-white">IA</span>
          </span>
        )}
      </button>
    </div>
  )
}
