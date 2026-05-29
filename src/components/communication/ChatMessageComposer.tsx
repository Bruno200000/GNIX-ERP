'use client'

import { useRef, useState } from "react"
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

  async function actionWrapper(formData: FormData) {
    await action(formData)
    formRef.current?.reset()
    setAttachmentName("")
  }

  return (
    <form ref={formRef} action={actionWrapper} className="relative group">
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
        <Button type="submit" size="icon" className="h-8 w-8 bg-indigo-600 hover:bg-indigo-700 text-white shadow-md">
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </form>
  )
}
