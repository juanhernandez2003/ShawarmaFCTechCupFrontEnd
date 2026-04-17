import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { decodeToken } from '../services/authService'
import useAuthStore from '../store/authStore'

const getRutaPorRol = (rol: string): string => {
  switch (rol) {
    case 'ADMINISTRADOR':
      return '/admin'
    case 'ORGANIZADOR':
      return '/organizador'
    case 'USUARIO_REGISTRADO':
      return '/perfil/crear'
    case 'CAPITAN':
      return '/capitan/dashboard'
    case 'JUGADOR':
    case 'FAMILIAR':
      return '/dashboard'
    case 'ARBITRO':
      return '/arbitro'
    default:
      return '/dashboard'
  }
}

export default function OAuth2CallbackPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const authStore = useAuthStore()

  useEffect(() => {
    const token = searchParams.get('token')
    if (token) {
      try {
        const decoded = decodeToken(token)
        authStore.login(token, { correo: decoded.sub, rol: decoded.rol })
        navigate(getRutaPorRol(decoded.rol))
      } catch {
        navigate('/login')
      }
    } else {
      navigate('/login')
    }
  }, [])

  return <p style={{ textAlign: 'center', marginTop: '2rem' }}>Iniciando sesión con Google...</p>
}
