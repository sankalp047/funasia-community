import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { Link, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown, Globe, LogOut, X } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { subscribeMyDms, subscribeMyGroups } from '../lib/db'
import { usingEmulators } from '../lib/firebase'
import { Avatar } from '../components/community/Avatar'
import { Sidebar } from '../components/community/Sidebar'
import { DiscoverView } from '../components/community/DiscoverView'
import { GroupChat } from '../components/community/GroupChat'
import { DmChat } from '../components/community/DmChat'
import { CreateGroupModal } from '../components/community/CreateGroupModal'
import { NewDmModal } from '../components/community/NewDmModal'

const CommunityCtx = createContext(null)
export const useCommunity = () => useContext(CommunityCtx)

function AccountMenu() {
  const { user, profile, logOut } = useAuth()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    const close = (e) => {
      if (!ref.current?.contains(e.target)) setOpen(false)
    }
    document.addEventListener('pointerdown', close)
    return () => document.removeEventListener('pointerdown', close)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-full py-1 pl-1 pr-2.5 transition hover:bg-ever-900/5"
      >
        <Avatar name={profile?.displayName ?? user.email} uid={user.uid} color={profile?.color} size="md" />
        <ChevronDown className="h-4 w-4 text-ink-400" />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.18 }}
            className="absolute right-0 top-full z-50 mt-2 w-60 overflow-hidden rounded-2xl border border-ever-900/10 bg-cream-50 shadow-soft"
          >
            <div className="border-b border-ever-900/8 px-4 py-3">
              <p className="truncate font-display font-semibold text-ever-900">{profile?.displayName}</p>
              <p className="truncate text-xs text-ink-400">{user.email}</p>
            </div>
            <Link to="/" className="flex items-center gap-2.5 px-4 py-3 text-sm text-ink-900 transition hover:bg-cream-100">
              <Globe className="h-4 w-4 text-ink-400" /> Back to website
            </Link>
            <button
              type="button"
              onClick={async () => {
                await logOut()
                navigate('/')
              }}
              className="flex w-full items-center gap-2.5 px-4 py-3 text-sm text-brand-700 transition hover:bg-brand-50"
            >
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function Community() {
  const { user, profile } = useAuth()
  const [myGroups, setMyGroups] = useState([])
  const [myDms, setMyDms] = useState([])
  const [showCreate, setShowCreate] = useState(false)
  const [showNewDm, setShowNewDm] = useState(false)
  const location = useLocation()

  useEffect(() => subscribeMyGroups(user.uid, setMyGroups), [user.uid])
  useEffect(() => subscribeMyDms(user.uid, setMyDms), [user.uid])

  // Below md, the sidebar is the "home screen"; chat routes replace it
  const inConversation = /\/community\/(g|dm)\//.test(location.pathname)
  const inDiscover = location.pathname.includes('/discover')

  const ctx = {
    me: profile ? { ...profile, id: user.uid } : { id: user.uid, displayName: user.email ?? 'Member' },
    myGroups,
    myDms,
    openCreate: () => setShowCreate(true),
    openNewDm: () => setShowNewDm(true),
  }

  return (
    <CommunityCtx.Provider value={ctx}>
      <div className="flex h-dvh flex-col bg-cream-100">
        {/* Top bar */}
        <header className="z-40 flex h-16 shrink-0 items-center justify-between border-b border-ever-900/8 bg-cream-50/90 px-4 backdrop-blur sm:px-5">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-cream-50 p-1 shadow-card ring-1 ring-ever-900/10">
              <img src="/images/fanicon2.png" alt="FunAsia Outreach logo" className="h-full w-full object-contain" />
            </span>
            <span className="hidden font-display text-lg font-bold text-ever-900 sm:block">
              FunAsia <span className="italic text-brand-600">Community</span>
            </span>
          </Link>
          <div className="flex items-center gap-3">
            {usingEmulators && (
              <span className="hidden rounded-full border border-marigold-500/40 bg-marigold-100 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-wider text-marigold-600 md:block">
                Local emulator
              </span>
            )}
            <AccountMenu />
          </div>
        </header>

        {/* Body */}
        <div className="flex min-h-0 flex-1">
          <Sidebar
            className={`${inConversation || inDiscover ? 'hidden md:flex' : 'flex'} w-full shrink-0 md:w-80 lg:w-[21rem]`}
          />
          <main className={`${inConversation || inDiscover ? 'flex' : 'hidden md:flex'} min-w-0 flex-1 flex-col`}>
            <Routes>
              <Route index element={<DiscoverView />} />
              <Route path="discover" element={<DiscoverView />} />
              <Route path="g/:groupId" element={<GroupChat />} />
              <Route path="dm/:dmId" element={<DmChat />} />
            </Routes>
          </main>
        </div>
      </div>

      <AnimatePresence>
        {showCreate && <CreateGroupModal onClose={() => setShowCreate(false)} />}
        {showNewDm && <NewDmModal onClose={() => setShowNewDm(false)} />}
      </AnimatePresence>
    </CommunityCtx.Provider>
  )
}

/** Shared modal chrome. */
export function Modal({ title, onClose, children, wide = false }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[70] flex items-end justify-center bg-ever-950/50 p-0 backdrop-blur-sm sm:items-center sm:p-6"
      onPointerDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40, scale: 0.98 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className={`flex max-h-[92dvh] w-full flex-col overflow-hidden rounded-t-3xl bg-cream-50 shadow-soft sm:rounded-3xl ${
          wide ? 'sm:max-w-2xl' : 'sm:max-w-lg'
        }`}
      >
        <div className="flex items-center justify-between border-b border-ever-900/8 px-6 py-4">
          <h2 className="font-display text-xl font-semibold text-ever-900">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-xl p-2 text-ink-400 transition hover:bg-ever-900/5 hover:text-ink-900"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">{children}</div>
      </motion.div>
    </motion.div>
  )
}
