import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { sendDmMessage, subscribeDm, subscribeDmMessages } from '../../lib/db'
import { useCommunity } from '../../pages/Community'
import { Avatar } from './Avatar'
import { MessageList } from './MessageList'
import { Composer } from './Composer'

export function DmChat() {
  const { dmId } = useParams()
  const { me } = useCommunity()
  const [dm, setDm] = useState(undefined)
  const [messages, setMessages] = useState([])
  const navigate = useNavigate()

  useEffect(() => subscribeDm(dmId, setDm), [dmId])
  useEffect(() => subscribeDmMessages(dmId, setMessages), [dmId])

  if (dm === undefined) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Loader2 className="h-7 w-7 animate-spin text-brand-600" />
      </div>
    )
  }

  if (dm === null || !dm.participants.includes(me.id)) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
        <p className="font-display text-xl font-semibold text-ever-900">Conversation not found.</p>
        <button
          type="button"
          onClick={() => navigate('/community')}
          className="rounded-full bg-ever-900 px-5 py-2.5 text-sm font-semibold text-cream-50"
        >
          Back to Community
        </button>
      </div>
    )
  }

  const otherId = dm.participants.find((p) => p !== me.id) ?? me.id
  const other = dm.profiles?.[otherId] ?? { displayName: 'Member' }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <header className="flex shrink-0 items-center gap-3 border-b border-ever-900/8 bg-cream-50/70 px-4 py-3 backdrop-blur">
        <button
          type="button"
          onClick={() => navigate('/community')}
          aria-label="Back"
          className="rounded-xl p-2 text-ink-400 transition hover:bg-ever-900/5 hover:text-ink-900 md:hidden"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <Avatar name={other.displayName} uid={otherId} color={other.color} size="md" />
        <div className="min-w-0 flex-1">
          <h1 className="truncate font-display text-lg font-semibold leading-tight text-ever-900">
            {other.displayName}
          </h1>
          <p className="text-xs text-ink-400">Direct message</p>
        </div>
      </header>

      <MessageList
        messages={messages}
        meId={me.id}
        emptyHint={`This is the very beginning of your conversation with ${other.displayName}.`}
      />
      <Composer onSend={(text) => sendDmMessage(dmId, me, text)} placeholder={`Message ${other.displayName}…`} />
    </div>
  )
}
