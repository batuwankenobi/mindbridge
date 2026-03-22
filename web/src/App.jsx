import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './hooks/useAuth'
import Sidebar from './components/layout/Sidebar'
import AuthPage from './pages/AuthPage'
import HomePage from './pages/HomePage'
import JournalPage from './pages/JournalPage'
import ChatPage from './pages/ChatPage'
import BurnoutPage from './pages/BurnoutPage'
import CrisisPage from './pages/CrisisPage'
import ProfilePage from './pages/ProfilePage'
import './i18n'
import './styles/main.css'

function ProtectedLayout({ children }) {
  const { user, loading } = useAuth()
  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <div style={{ textAlign: 'center' }}>
        <p style={{ fontSize: '32px', fontFamily: 'var(--font-display)', color: 'var(--purple-600)', marginBottom: '0.5rem' }}>MindBridge</p>
        <p style={{ color: 'var(--gray-400)' }}>Loading...</p>
      </div>
    </div>
  )
  if (!user) return <Navigate to="/auth" replace />
  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">{children}</main>
    </div>
  )
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/" element={<ProtectedLayout><HomePage /></ProtectedLayout>} />
      <Route path="/journal" element={<ProtectedLayout><JournalPage /></ProtectedLayout>} />
      <Route path="/chat" element={<ProtectedLayout><ChatPage /></ProtectedLayout>} />
      <Route path="/burnout" element={<ProtectedLayout><BurnoutPage /></ProtectedLayout>} />
      <Route path="/crisis" element={<ProtectedLayout><CrisisPage /></ProtectedLayout>} />
      <Route path="/profile" element={<ProtectedLayout><ProfilePage /></ProtectedLayout>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  )
}
