import { useRef, useState } from 'react'
import { SendHorizonal } from 'lucide-react'

/** Auto-growing message input. Enter sends; Shift+Enter adds a newline. */
export function Composer({ onSend, placeholder = 'Write a message…' }) {
  const [text, setText] = useState('')
  const [busy, setBusy] = useState(false)
  const ref = useRef(null)

  async function send() {
    const value = text.trim()
    if (!value || busy) return
    setBusy(true)
    setText('')
    if (ref.current) ref.current.style.height = 'auto'
    try {
      await onSend(value)
    } catch {
      setText(value) // give the draft back on failure
    } finally {
      setBusy(false)
      ref.current?.focus()
    }
  }

  return (
    <div className="border-t border-ever-900/8 bg-cream-50/80 p-3 backdrop-blur sm:p-4">
      <div className="flex items-end gap-2.5 rounded-3xl border border-ever-900/12 bg-cream-50 p-2 pl-4 shadow-sm transition focus-within:border-brand-600 focus-within:ring-4 focus-within:ring-brand-600/10">
        <textarea
          ref={ref}
          value={text}
          rows={1}
          placeholder={placeholder}
          onChange={(e) => {
            setText(e.target.value)
            e.target.style.height = 'auto'
            e.target.style.height = `${Math.min(e.target.scrollHeight, 140)}px`
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              send()
            }
          }}
          className="max-h-[140px] flex-1 resize-none bg-transparent py-2 text-[0.92rem] leading-relaxed text-ink-900 outline-none placeholder:text-ink-400"
        />
        <button
          type="button"
          onClick={send}
          disabled={!text.trim() || busy}
          aria-label="Send message"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-600 text-cream-50 shadow-glow transition hover:bg-brand-700 disabled:opacity-40 disabled:shadow-none"
        >
          <SendHorizonal className="h-4.5 w-4.5" />
        </button>
      </div>
    </div>
  )
}
