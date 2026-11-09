import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const REQUIRED_ON_RENDER = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_APP_ID',
]

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  // On Render (RENDER=true) refuse to ship a build without the Firebase config —
  // otherwise the contact form would deploy silently broken. The values live in
  // Render → Environment, never in the repo (.env is git-ignored).
  if (command === 'build' && process.env.RENDER) {
    const env = loadEnv(mode, process.cwd(), 'VITE_')
    const missing = REQUIRED_ON_RENDER.filter((k) => !env[k])
    if (missing.length) {
      throw new Error(
        `Missing environment variables: ${missing.join(', ')}.\n` +
          'Add them in Render → your service → Environment (values are in your local .env), then redeploy.',
      )
    }
  }

  return {
    plugins: [react(), tailwindcss()],
    build: {
      // The landing bundle (React + Framer Motion) is ~160 KB gzipped by design;
      // Firebase and the community app are split into lazily-loaded chunks.
      chunkSizeWarningLimit: 600,
    },
  }
})
