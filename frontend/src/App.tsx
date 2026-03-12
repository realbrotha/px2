import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { TooltipProvider } from '@/components/ui/tooltip'
import { AuthProvider, useAuth } from '@/contexts/AuthContext'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { DashboardLayout } from '@/components/dashboard-layout'
import { Login } from '@/pages/Login'
import { Home } from '@/pages/Home'
import { SecurityDashboard } from '@/pages/SecurityDashboard'
import { Settings } from '@/pages/Settings'

function ProtectedDashboardRoute({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <DashboardLayout>{children}</DashboardLayout>
    </ProtectedRoute>
  )
}

function LoginRedirect() {
  const { isAuthenticated, isInitialized } = useAuth()
  if (!isInitialized) return null
  return isAuthenticated ? <Navigate to="/" replace /> : <Login />
}

function App() {
  return (
    <TooltipProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginRedirect />} />
            <Route path="/" element={<ProtectedDashboardRoute><Home /></ProtectedDashboardRoute>} />
            <Route path="/settings" element={<ProtectedDashboardRoute><Settings /></ProtectedDashboardRoute>} />
            <Route path="/security-dashboard" element={<ProtectedDashboardRoute><SecurityDashboard /></ProtectedDashboardRoute>} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  )
}

export default App
