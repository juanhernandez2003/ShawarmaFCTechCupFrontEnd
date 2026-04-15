import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom'
import PrivateRoute from './PrivateRoute'
import RoleRoute from './RoleRoute'
import PublicLayout from '../components/layout/PublicLayout'
import AuthLayout from '../components/layout/AuthLayout'
import DashboardLayout from '../components/layout/DashboardLayout'
import LoginPage from '../pages/LoginPage'
import RegisterPage from '../pages/RegisterPage'
import HomePage from '../pages/HomePage'
import NotFoundPage from '../pages/NotFoundPage'
import SinPermisoPage from '../pages/SinPermisoPage'
import TeamListPage from '../features/teams/TeamListPage'
import TeamDetailPage from '../features/teams/TeamDetailPage'
import TeamRegisterPage from '../features/teams/TeamRegisterPage'
import TorneosPage from '../features/torneos/TorneosPage'
import TorneoDetallePage from '../features/torneos/TorneoDetallePage'
import TablaPage from '../features/torneos/TablaPage'
import GoleadoresPage from '../features/torneos/GoleadoresPage'
import EquiposPage from '../features/torneos/EquiposPage'
import LlavesPage from '../features/torneos/LlavesPage'
import CrearPerfilPage from '../features/players/CrearPerfilPage'
import AdminDashboardPage from '../features/admin/AdminDashboardPage'
import AuditoriaPage from '../features/admin/AuditoriaPage'

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
          <Route path="/torneos" element={<TorneosPage />} />
          <Route path="/torneos/:id" element={<TorneoDetallePage />} />
          <Route path="/torneos/:id/tabla" element={<TablaPage />} />
          <Route path="/torneos/:id/goleadores" element={<GoleadoresPage />} />
          <Route path="/torneos/:id/equipos" element={<EquiposPage />} />
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
        </Route>

        <Route path="/registro" element={<RegisterPage />} />
        <Route path="/sin-permiso" element={<SinPermisoPage />} />

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
          <Route path="/torneos/:id/llaves" element={<LlavesPage />} />

          <Route
            path="/dashboard"
            element={
              <RoleRoute roles={['ADMINISTRADOR']}>
                <AdminDashboardPage />
              </RoleRoute>
            }
          />

          <Route
            path="/equipos"
            element={
              <RoleRoute roles={['JUGADOR', 'CAPITAN', 'ADMINISTRADOR']}>
                <TeamListPage />
              </RoleRoute>
            }
          />

          <Route
            path="/equipos/:id"
            element={
              <RoleRoute roles={['JUGADOR', 'CAPITAN', 'ADMINISTRADOR']}>
                <TeamDetailPage />
              </RoleRoute>
            }
          />

          <Route
            path="/equipos/registro"
            element={
              <RoleRoute roles={['CAPITAN']}>
                <TeamRegisterPage />
              </RoleRoute>
            }
          />

          <Route path="/perfil" element={<NotFoundPage />} />

          <Route
            path="/perfil/crear"
            element={
              <RoleRoute roles={['JUGADOR', 'CAPITAN']}>
                <CrearPerfilPage />
              </RoleRoute>
            }
          />

          <Route
            path="/admin/auditoria"
            element={
              <RoleRoute roles={['ADMINISTRADOR']}>
                <AuditoriaPage />
              </RoleRoute>
            }
          />
        </Route>

        {/* Ruta no encontrada */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter
