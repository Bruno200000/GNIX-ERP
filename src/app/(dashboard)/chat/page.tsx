import { createChannelData, getChatData, sendChatMessageData } from "@/lib/erp-data"
import { revalidatePath } from "next/cache"
import Link from "next/link"
import { ChatMessageComposer } from "@/components/communication/ChatMessageComposer"
import { ChatSummaryDialog } from "@/components/communication/ChatSummaryDialog"
import { CreateChannelDialog } from "@/components/communication/CreateChannelDialog"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Hash, User, Search, Plus, Paperclip } from "lucide-react"

async function sendMessage(formData: FormData) {
  "use server"
  await sendChatMessageData(formData)
  revalidatePath("/chat")
}

async function createChannel(formData: FormData) {
  "use server"
  await createChannelData(formData)
  revalidatePath("/chat")
}

export default async function ChatInterne({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams
  const { channels, messages, users } = await getChatData()
  
  const activeChannelId = typeof params.channel === 'string' ? params.channel : channels[0]?.id
  const activeChannel = channels.find(c => c.id === activeChannelId) || channels[0]
  
  const channelMessages = messages.filter(m => m.channel_id === activeChannel?.id)

  return (
    <div className="h-[calc(100vh-160px)] flex gap-4 overflow-hidden">
      <div className="w-64 flex flex-col gap-4">
        <Card className="flex-1 border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <Input className="pl-8 h-8 text-xs bg-slate-50 border-none" placeholder="Rechercher..." />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Channels</span>
                <CreateChannelDialog 
                  action={createChannel}
                  trigger={<Plus className="h-3 w-3 text-slate-400 cursor-pointer hover:text-indigo-600" />}
                />
              </div>
              <div className="space-y-1">
                {channels.map((channel) => (
                  <Link href={`/chat?channel=${channel.id}`} key={channel.id}>
                    <div className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm font-medium cursor-pointer transition-colors ${activeChannel?.id === channel.id ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'}`}>
                      <Hash className={`h-3.5 w-3.5 ${activeChannel?.id === channel.id ? 'text-indigo-500' : 'text-slate-400'}`} />
                      {channel.name}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Direct Messages</span>
              </div>
              <div className="space-y-1">
                {users.map((user) => (
                  <div key={user.id} className="flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                      <div className="h-2 w-2 rounded-full bg-slate-300" />
                      {user.first_name} {user.last_name}
                    </div>
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>

      <Card className="flex-1 border-slate-200 dark:border-slate-800 shadow-sm flex flex-col overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-950 z-10">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-indigo-50 flex items-center justify-center">
              <Hash className="h-4 w-4 text-indigo-600" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white"># {activeChannel?.name || "General"}</h3>
              <p className="text-[10px] text-slate-400 font-medium italic">Communication globale de l'entreprise</p>
            </div>
          </div>
          <ChatSummaryDialog messages={channelMessages} />
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/30">
          {channelMessages.map((message) => (
            <div key={message.id} className={`flex gap-3 ${message.is_me ? "justify-end" : ""}`}>
              {!message.is_me && (
                <div className="h-8 w-8 rounded-full bg-slate-200 shrink-0 flex items-center justify-center">
                  <User className="h-4 w-4 text-slate-500" />
                </div>
              )}
              <div className={`space-y-1 max-w-[70%] ${message.is_me ? "flex flex-col items-end" : ""}`}>
                <div className="flex items-end gap-2">
                  {message.is_me && <span className="text-[10px] text-slate-400">{message.sent_at}</span>}
                  <span className="text-xs font-bold text-slate-900">{message.author}</span>
                  {!message.is_me && <span className="text-[10px] text-slate-400">{message.sent_at}</span>}
                </div>
                <div className={`p-3 rounded-2xl text-sm shadow-sm ${message.is_me ? "bg-indigo-600 text-white rounded-tr-none" : "bg-white border border-slate-100 rounded-tl-none text-slate-700"}`}>
                  {message.content}
                  {message.attachment_url && (
                    <a
                      href={message.attachment_url}
                      download={message.attachment_name || "piece-jointe"}
                      className={`mt-2 flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold ${message.is_me ? "bg-white/15 text-white" : "bg-slate-50 text-indigo-600"}`}
                    >
                      <Paperclip className="h-3.5 w-3.5" />
                      {message.attachment_name || "Piece jointe"}
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800">
          <ChatMessageComposer
            channelId={activeChannel?.id || ""}
            channelName={activeChannel?.name || "General"}
            action={sendMessage}
          />
        </div>
      </Card>
    </div>
  )
}
