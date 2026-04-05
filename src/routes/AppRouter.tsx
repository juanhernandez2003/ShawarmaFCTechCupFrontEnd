import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom'
import PrivateRoute from './PrivateRoute'
import PublicLayout from '../components/layout/PublicLayout'
import AuthLayout from '../components/layout/AuthLayout'
import DashboardLayout from '../components/layout/DashboardLayout'
import LoginPage from '../pages/LoginPage'
import HomePage from '../pages/HomePage'
import NotFoundPage from '../pages/NotFoundPage'
import TeamListPage from '../features/teams/TeamListPage'
import TeamDetailPage from '../features/teams/TeamDetailPage'
import TeamRegisterPage from '../features/teams/TeamRegisterPage'

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas públicas */}
        <Route
          element={
            <PublicLayout>
              <Outlet />
            </PublicLayout>
          }
        >
          <Route path="/" element={<HomePage />} />
          <Route path="/torneos" element={<NotFoundPage />} />
          <Route path="/como-funciona" element={<NotFoundPage />} />
        </Route>

        {/* Rutas de autenticación */}
        <Route
          element={
            <AuthLayout>
              <Outlet />
            </AuthLayout>
          }
        >
          <Route path="/login" element={<LoginPage />} />
          <Route path="/registro" element={<NotFoundPage />} />
        </Route>

        {/* Rutas protegidas */}
        <Route
          element={
            <PrivateRoute>
              <DashboardLayout>
                <Outlet />
              </DashboardLayout>
            </PrivateRoute>
          }
        >
          <Route path="/dashboard" element={<NotFoundPage />} />
          <Route path="/equipos" element={<TeamListPage />} />
          <Route path="/equipos/:id" element={<TeamDetailPage />} />
          <Route path="/equipos/registro" element={<TeamRegisterPage />} />
          <Route path="/perfil" element={<NotFoundPage />} />
        </Route>

        {/* Ruta no encontrada */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter
