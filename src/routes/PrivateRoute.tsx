import { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'

interface PrivateRouteProps {
  children: ReactNode
  roles?: string[]
}

const PrivateRoute = ({ children, roles }: PrivateRouteProps) => {
  const token = useAuthStore(state => state.token)
  const user = useAuthStore(state => state.user)

  if (!token) {
    return <Navigate to="/login" replace />
  }

  if (roles && (!user || !roles.includes(user.rol))) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default PrivateRoute
