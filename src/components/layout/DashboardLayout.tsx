import { useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import useAuthStore from '../../store/authStore'
import Footer from './Footer'

interface DashboardLayoutProps {
  children: ReactNode
}

const navLinks = [
  { label: 'Inicio', to: '/dashboard' },
  { label: 'Torneos', to: '/torneos' },
  { label: 'Equipos', to: '/equipos' },
  { label: 'Configuración', to: '/configuracion' },
]

const getInitials = (nombre: string): string => {
  const parts = nombre.trim().split(' ')
  if (parts.length === 1) return parts[0][0].toUpperCase()
  return (parts[0][0] + parts[1][0]).toUpperCase()
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const user = useAuthStore(state => state.user)
  const [hoveredLink, setHoveredLink] = useState<string | null>(null)

  const initials = user ? getInitials(user.nombre) : '?'
  const rol = user ? user.rol : 'Invitado'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <header
        style={{
          width: '100%',
          boxSizing: 'border-box',
          backgroundColor: '#11823B',
          padding: '0 2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '64px',
        }}
      >
        <span style={{ fontWeight: 'bold', color: '#ffffff', fontSize: '1.1rem' }}>⚽ TECHCUP</span>

        <nav style={{ display: 'flex', gap: '2rem' }}>
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              onMouseEnter={() => setHoveredLink(link.to)}
              onMouseLeave={() => setHoveredLink(null)}
              style={{
                color: hoveredLink === link.to ? '#D9D9D9' : '#ffffff',
                textDecoration: 'none',
                fontSize: '0.95rem',
              }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#11823B',
              fontWeight: 'bold',
              fontSize: '0.85rem',
              flexShrink: 0,
            }}
          >
            {initials}
          </div>
          <span
            style={{
              backgroundColor: '#ffffff',
              color: '#11823B',
              padding: '2px 10px',
              borderRadius: '12px',
              fontSize: '0.8rem',
              fontWeight: 'bold',
            }}
          >
            {rol}
          </span>
        </div>
      </header>

      <main style={{ flex: 1, backgroundColor: '#D9D9D9' }}>{children}</main>

      <Footer />
    </div>
  )
}

export default DashboardLayout
