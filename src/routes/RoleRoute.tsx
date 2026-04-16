import { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'

interface RoleRouteProps {
  children: ReactNode
  roles: string[]
}

const RoleRoute = ({ children, roles }: RoleRouteProps) => {
  const user = useAuthStore(state => state.user)

  if (!user) return <Navigate to="/login" replace />
  if (!roles.includes(user.rol)) return <Navigate to="/sin-permiso" replace />

  return children
}

export default RoleRoute
