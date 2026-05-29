'use client'

import { useMemo, useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"

type Message = {
  author: string
  content: string
}

export function ChatSummaryDialog({ messages }: { messages: Message[] }) {
  const [open, setOpen] = useState(false)
  const summary = useMemo(() => {
    if (!messages.length) return "Aucun message dans ce canal pour le moment."
    const latest = messages.slice(-5)
    return `Resume de ${messages.length} message(s): ${latest.map((message) => `${message.author}: ${message.content}`).join(" | ")}`
  }, [messages])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="ghost" size="sm" className="gap-2 text-indigo-600">
            <Sparkles className="h-3.5 w-3.5" /> Resume IA
          </Button>
        }
      />
      <DialogContent className="sm:max-w-lg bg-white">
        <DialogHeader>
          <DialogTitle>Resume IA du canal</DialogTitle>
          <DialogDescription>Synthese rapide des derniers messages du chat interne.</DialogDescription>
        </DialogHeader>
        <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm leading-relaxed text-slate-700">
          {summary}
        </div>
      </DialogContent>
    </Dialog>
  )
}
