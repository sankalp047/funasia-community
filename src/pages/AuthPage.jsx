import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, HeartHandshake, Loader2, MessagesSquare, UsersRound } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { usingEmulators } from '../lib/firebase'

const EASE = [0.22, 1, 0.36, 1]

const FRIENDLY = {
  'auth/popup-closed-by-user': 'The Google window was closed before finishing — try again.',
  'auth/popup-blocked': 'Your browser blocked the sign-in window. Allow pop-ups and try again.',
  'auth/network-request-failed': 'Network hiccup — check your connection and try again.',
  'auth/too-many-requests': 'Too many attempts — please wait a moment and try again.',
}

const PERKS = [
  { icon: UsersRound, text: 'Join nonprofit groups — or request an invite to private ones' },
  { icon: MessagesSquare, text: 'Real-time group chats and direct messages' },
  { icon: HeartHandshake, text: 'Create a page for your own organization' },
]

export default function AuthPage() {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const { user, loading, googleSignIn } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading && user) navigate('/community', { replace: true })
  }, [user, loading, navigate])

  async function handleGoogle() {
    setError('')
    setBusy(true)
    try {
      await googleSignIn()
      navigate('/community')
    } catch (err) {
      setError(FRIENDLY[err.code] ?? 'Google sign-in didn’t complete — please try again.')
      setBusy(false)
    }
  }

  return (
    <div className="grid min-h-dvh bg-cream-100 lg:grid-cols-2">
      {/* Form column */}
      <div className="flex flex-col px-5 py-6 sm:px-10">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-cream-50 p-1.5 shadow-card ring-1 ring-ever-900/10">
              <img src="/images/fanicon2.png" alt="FunAsia Outreach logo" className="h-full w-full object-contain" />
            </span>
            <span className="font-display text-lg font-bold text-ever-900">
              FunAsia <span className="italic text-brand-600">Outreach</span>
            </span>
          </Link>
          <Link
            to="/"
            className="flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium text-ink-600 transition hover:bg-ever-900/5 hover:text-ever-900"
          >
            <ArrowLeft className="h-4 w-4" /> Back to site
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-center py-10">
          <motion.div
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE }}
            className="w-full max-w-md"
          >
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-brand-600">
              FunAsia Community
            </p>
            <h1 className="mt-3 font-display text-display-md font-semibold text-ever-900">
              One tap and you're in
            </h1>
            <p className="mt-3 leading-relaxed text-ink-600">
              Sign in with Google to join groups, connect with nonprofits, and be part of the
              conversation.
            </p>

            <ul className="mt-7 space-y-3.5">
              {PERKS.map(({ icon: Icon, text }, i) => (
                <motion.li
                  key={text}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25 + i * 0.1, duration: 0.6, ease: EASE }}
                  className="flex items-center gap-3.5 text-sm text-ink-600"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-50 to-marigold-100 text-brand-600">
                    <Icon className="h-4 w-4" />
                  </span>
                  {text}
                </motion.li>
              ))}
            </ul>

            {usingEmulators && (
              <p className="mt-7 rounded-xl border border-marigold-500/30 bg-marigold-100/70 px-4 py-2.5 text-xs text-ink-600">
                Running on <strong>local Firebase emulators</strong> — sign-in uses a test Google
                account chooser and nothing leaves this machine.
              </p>
            )}

            {error && (
              <p role="alert" className="mt-5 rounded-xl border border-brand-600/25 bg-brand-50 px-4 py-2.5 text-sm text-brand-700">
                {error}
              </p>
            )}

            <button
              type="button"
              onClick={handleGoogle}
              disabled={busy}
              className="mt-7 flex w-full items-center justify-center gap-3 rounded-2xl bg-brand-600 py-4 text-sm font-semibold text-cream-50 shadow-glow transition hover:-translate-y-0.5 hover:bg-brand-700 disabled:translate-y-0 disabled:opacity-60"
            >
              {busy ? (
                <Loader2 className="h-4.5 w-4.5 animate-spin" />
              ) : (
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-cream-50">
                  <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                    <path fill="#4285F4" d="M22.5 12.23c0-.78-.07-1.53-.2-2.25H12v4.26h5.89a5.03 5.03 0 0 1-2.18 3.3v2.74h3.53c2.06-1.9 3.26-4.7 3.26-8.05Z" />
                    <path fill="#34A853" d="M12 22.9c2.95 0 5.42-.98 7.23-2.64l-3.53-2.74c-.98.66-2.23 1.05-3.7 1.05-2.84 0-5.25-1.92-6.11-4.5H2.24v2.83A10.9 10.9 0 0 0 12 22.9Z" />
                    <path fill="#FBBC05" d="M5.89 14.07a6.55 6.55 0 0 1 0-4.19V7.05H2.24a10.92 10.92 0 0 0 0 9.85l3.65-2.83Z" />
                    <path fill="#EA4335" d="M12 5.33c1.6 0 3.04.55 4.17 1.63l3.13-3.13C17.41 2.05 14.95 1 12 1 7.74 1 4.06 3.45 2.24 7.05L5.9 9.88C6.75 7.3 9.16 5.33 12 5.33Z" />
                  </svg>
                </span>
              )}
              Continue with Google
            </button>

            <p className="mt-4 text-center text-xs text-ink-400">
              We only use your name and email to create your community profile.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Visual column */}
      <div className="relative hidden overflow-hidden bg-ever-950 lg:block">
        <img
          src="/images/banner_main1.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ever-950 via-ever-950/40 to-ever-950/70" />
        <div aria-hidden="true" className="absolute inset-x-16 bottom-0 top-24 rounded-t-[999px] border border-marigold-400/20" />
        <div className="absolute inset-x-0 bottom-0 p-12">
          <motion.blockquote
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3, ease: EASE }}
            className="max-w-md"
          >
            <p className="font-display text-3xl font-semibold italic leading-snug text-cream-50">
              “Leadership is not just about business success—it's about building stronger
              communities.”
            </p>
            <footer className="mt-4 text-sm text-marigold-300">
              Vaishali Thakkar · CEO, FunAsia Network
            </footer>
          </motion.blockquote>
        </div>
      </div>
    </div>
  )
}
