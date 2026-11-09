import { createContext, useContext, useEffect, useState } from 'react'
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from 'firebase/auth'
import { doc, onSnapshot, serverTimestamp, setDoc } from 'firebase/firestore'
import { auth, db } from '../lib/firebase'
import { userColor } from '../lib/colors'

const AuthContext = createContext(null)

/** Create/refresh the Firestore profile document for an authed user. */
async function ensureProfile(user, displayName) {
  const name = displayName || user.displayName || user.email?.split('@')[0] || 'Member'
  await setDoc(
    doc(db, 'users', user.uid),
    {
      displayName: name,
      nameLower: name.toLowerCase(),
      email: user.email ?? '',
      color: userColor(user.uid),
      createdAt: serverTimestamp(),
    },
    { merge: true },
  )
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => onAuthStateChanged(auth, (u) => {
    setUser(u)
    setLoading(false)
  }), [])

  // Live profile document for the signed-in user
  useEffect(() => {
    if (!user) {
      setProfile(null)
      return
    }
    return onSnapshot(doc(db, 'users', user.uid), (snap) => {
      setProfile(snap.exists() ? { id: snap.id, ...snap.data() } : null)
    })
  }, [user])

  const value = {
    user,
    profile,
    loading,
    async signUp(email, password, displayName) {
      const cred = await createUserWithEmailAndPassword(auth, email, password)
      await updateProfile(cred.user, { displayName })
      await ensureProfile(cred.user, displayName)
      return cred.user
    },
    async logIn(email, password) {
      const cred = await signInWithEmailAndPassword(auth, email, password)
      return cred.user
    },
    async googleSignIn() {
      const cred = await signInWithPopup(auth, new GoogleAuthProvider())
      await ensureProfile(cred.user)
      return cred.user
    },
    resetPassword: (email) => sendPasswordResetEmail(auth, email),
    logOut: () => signOut(auth),
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
