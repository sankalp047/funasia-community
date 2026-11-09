import { initializeApp } from 'firebase/app'
import { connectAuthEmulator, getAuth } from 'firebase/auth'
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore'

// Real config comes from environment variables: .env locally (copy .env.example;
// .env is git-ignored) and Render → Environment in production. In local
// development without a config we fall back to the Firebase emulators.
const env = import.meta.env
const hasRealConfig = Boolean(env.VITE_FIREBASE_API_KEY)

if (!hasRealConfig && env.PROD) {
  console.error('Firebase is not configured: set the VITE_FIREBASE_* environment variables.')
}

const firebaseConfig = hasRealConfig
  ? {
      apiKey: env.VITE_FIREBASE_API_KEY,
      authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: env.VITE_FIREBASE_PROJECT_ID,
      storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId: env.VITE_FIREBASE_APP_ID,
      measurementId: env.VITE_FIREBASE_MEASUREMENT_ID,
    }
  : {
      apiKey: 'demo-api-key',
      authDomain: 'demo-funasia.firebaseapp.com',
      projectId: 'demo-funasia',
    }

export const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)

// Emulators only ever in development (or when explicitly requested) — never a
// silent fallback on the live site.
export const usingEmulators =
  env.VITE_FIREBASE_USE_EMULATORS === 'true' || (!hasRealConfig && env.DEV)

if (usingEmulators) {
  connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true })
  connectFirestoreEmulator(db, '127.0.0.1', 8080)
}
// Google Analytics is loaded site-wide (and deferred) by src/lib/analytics.js.
