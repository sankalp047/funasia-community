import { Suspense, lazy } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Landing from './pages/Landing'
import { FullPageSpinner } from './components/ui/FullPageSpinner'

// Sign-in + community (and Firebase with them) load only when visited.
const MemberArea = lazy(() => import('./pages/MemberArea'))

export default function App() {
  return (
    <>
      <div className="grain" aria-hidden="true" />
      <BrowserRouter>
        <Suspense fallback={<FullPageSpinner />}>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/auth" element={<MemberArea page="auth" />} />
            <Route path="/community/*" element={<MemberArea page="community" />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </>
  )
}
