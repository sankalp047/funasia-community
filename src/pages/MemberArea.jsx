import { Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from '../context/AuthContext'
import { FullPageSpinner } from '../components/ui/FullPageSpinner'
import AuthPage from './AuthPage'
import Community from './Community'

function RequireAuth({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <FullPageSpinner />
  if (!user) return <Navigate to="/auth" replace />
  return children
}

/**
 * Everything that needs Firebase (sign-in + community) lives behind this one
 * lazily-loaded entry, so the public landing page never downloads Firebase.
 */
export default function MemberArea({ page }) {
  return (
    <AuthProvider>
      {page === 'auth' ? (
        <AuthPage />
      ) : (
        <RequireAuth>
          <Community />
        </RequireAuth>
      )}
    </AuthProvider>
  )
}
