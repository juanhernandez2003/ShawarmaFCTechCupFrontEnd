import { useState, type ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useAuthStore from '../../store/authStore'
import Footer from './Footer'
import logo from '../../assets/logo.png'

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
  const navigate = useNavigate()

  const handleLogout = () => {
    useAuthStore.getState().logout()
    navigate('/login')
  }

  const initials = user ? getInitials(user.correo) : '?'
  const rol = user ? user.rol : 'Invitado'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <header
        style={{
          width: '100%',
          boxSizing: 'border-box',
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid #D9D9D9',
          padding: '0 2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '64px',
        }}
      >
        <img src={logo} alt="TechCup" style={{ height: '100px', objectFit: 'contain' }} />

        <nav style={{ display: 'flex', gap: '2rem' }}>
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              onMouseEnter={() => setHoveredLink(link.to)}
              onMouseLeave={() => setHoveredLink(null)}
              style={{
                color: hoveredLink === link.to ? '#11823B' : '#000000',
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
              backgroundColor: '#11823B',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              fontWeight: 'bold',
              fontSize: '0.85rem',
              flexShrink: 0,
            }}
          >
            {initials}
          </div>
          <span
            style={{
              backgroundColor: '#11823B',
              color: '#ffffff',
              padding: '2px 10px',
              borderRadius: '12px',
              fontSize: '0.8rem',
              fontWeight: 'bold',
            }}
          >
            {rol}
          </span>
          <button
            onClick={handleLogout}
            style={{
              backgroundColor: '#11823B',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '4px',
              padding: '0.35rem 0.85rem',
              fontSize: '0.85rem',
              cursor: 'pointer',
              marginLeft: '1rem',
              fontFamily: 'Montserrat, sans-serif',
            }}
          >
            Cerrar sesión
          </button>
        </div>
      </header>

      <main style={{ flex: 1, backgroundColor: '#D9D9D9' }}>{children}</main>

      <Footer />
    </div>
  )
}

export default DashboardLayout
