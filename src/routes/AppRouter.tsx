import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom'
import PrivateRoute from './PrivateRoute'
import PublicLayout from '../components/layout/PublicLayout'
import AuthLayout from '../components/layout/AuthLayout'
import DashboardLayout from '../components/layout/DashboardLayout'
import LoginPage from '../pages/LoginPage'
import RegisterPage from '../pages/RegisterPage'
import HomePage from '../pages/HomePage'
import NotFoundPage from '../pages/NotFoundPage'
import TeamListPage from '../features/teams/TeamListPage'
import TeamDetailPage from '../features/teams/TeamDetailPage'
import TeamRegisterPage from '../features/teams/TeamRegisterPage'
import TorneosPage from '../features/torneos/TorneosPage'
import TorneoDetallePage from '../features/torneos/TorneoDetallePage'
import TablaPage from '../features/torneos/TablaPage'
import GoleadoresPage from '../features/torneos/GoleadoresPage'
import EquiposPage from '../features/torneos/EquiposPage'
import CrearPerfilPage from '../features/players/CrearPerfilPage'
import JugadorDashboardPage from '../features/players/JugadorDashboardPage'
import SolicitudesPage from '../features/players/SolicitudesPage'
import SancionesPage from '../features/players/SancionesPage'
import CapitanDashboardPage from '../features/captain/CapitanDashboardPage'
import AlineacionPage from '../features/captain/AlineacionPage'
import AlineacionRivalPage from '../features/captain/AlineacionRivalPage'
import BuscarJugadoresPage from '../features/captain/BuscarJugadoresPage'
import PagosPage from '../features/captain/PagosPage'

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

        {/* Rutas protegidas — JUGADOR y CAPITAN */}
        <Route
          element={
            <PrivateRoute roles={['JUGADOR', 'CAPITAN']}>
              <DashboardLayout>
                <Outlet />
              </DashboardLayout>
            </PrivateRoute>
          }
        >
          <Route path="/dashboard" element={<JugadorDashboardPage />} />
          <Route path="/solicitudes" element={<SolicitudesPage />} />
          <Route path="/sanciones" element={<SancionesPage />} />
          <Route path="/equipos" element={<TeamListPage />} />
          <Route path="/perfil" element={<CrearPerfilPage />} />
          <Route path="/perfil/crear" element={<CrearPerfilPage />} />
        </Route>

        {/* Rutas protegidas — CAPITAN */}
        <Route
          element={
            <PrivateRoute roles={['CAPITAN']}>
              <DashboardLayout>
                <Outlet />
              </DashboardLayout>
            </PrivateRoute>
          }
        >
          <Route path="/capitan/dashboard" element={<CapitanDashboardPage />} />
          <Route path="/capitan/alineacion" element={<AlineacionPage />} />
          <Route path="/capitan/alineacion-rival" element={<AlineacionRivalPage />} />
          <Route path="/capitan/jugadores" element={<BuscarJugadoresPage />} />
          <Route path="/capitan/pagos" element={<PagosPage />} />
          <Route path="/capitan/equipos" element={<TeamListPage />} />
          <Route path="/capitan/equipos/:id" element={<TeamDetailPage />} />
          <Route path="/capitan/equipos/registro" element={<TeamRegisterPage />} />
        </Route>

        {/* Ruta no encontrada */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter
