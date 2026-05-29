'use client'

import { useRef, useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Smile, Paperclip } from "lucide-react"

export function ChatMessageComposer({
  channelId,
  channelName,
  action,
}: {
  channelId: string
  channelName: string
  action: (formData: FormData) => Promise<void>
}) {
  const formRef = useRef<HTMLFormElement>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const [attachmentName, setAttachmentName] = useState("")
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState("")

  async function actionWrapper(formData: FormData) {
    setError("")
    startTransition(async () => {
      try {
        await action(formData)
        formRef.current?.reset()
        setAttachmentName("")
      } catch {
        setError("Le message n'a pas pu etre envoye.")
      }
    })
  }

  return (
    <form ref={formRef} action={actionWrapper} className="relative group" encType="multipart/form-data">
      <input type="hidden" name="channel_id" value={channelId} />
      <input
        ref={fileRef}
        name="attachment"
        type="file"
        className="sr-only"
        onChange={(event) => setAttachmentName(event.target.files?.[0]?.name || "")}
      />
      <Input
        name="content"
        className="pr-28 h-12 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500/20 transition-all"
        placeholder={attachmentName ? `Piece jointe: ${attachmentName}` : `Ecrire un message dans # ${channelName}...`}
      />
      {attachmentName && (
        <div className="absolute -top-7 left-2 rounded-full bg-indigo-50 px-3 py-1 text-[10px] font-bold text-indigo-600">
          {attachmentName}
        </div>
      )}
      {error && (
        <div className="absolute -top-7 left-2 rounded-full bg-red-50 px-3 py-1 text-[10px] font-bold text-red-600">
          {error}
        </div>
      )}
      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-slate-400 hover:text-indigo-600"
          onClick={() => {
            const input = formRef.current?.elements.namedItem("content")
            if (input instanceof HTMLInputElement) {
              input.value = `${input.value} 🙂`.trim()
              input.focus()
            }
          }}
        >
          <Smile className="h-5 w-5" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-slate-400 hover:text-indigo-600"
          onClick={() => fileRef.current?.click()}
        >
          <Paperclip className="h-5 w-5" />
        </Button>
        <button
          type="submit"
          disabled={isPending}
          className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-md transition-all hover:bg-indigo-700 disabled:opacity-50"
          aria-label="Envoyer le message"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
    </form>
  )
}
