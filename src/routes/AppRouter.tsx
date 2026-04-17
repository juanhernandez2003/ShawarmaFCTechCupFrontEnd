import { BrowserRouter, Routes, Route, Outlet, Navigate } from 'react-router-dom'
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
import ArbitroPanelPage from '../features/arbitro/ArbitroPanelPage'
import AlineacionesArbitroPage from '../features/arbitro/AlineacionesArbitroPage'
import ReglamentoArbitroPage from '../features/arbitro/ReglamentoArbitroPage'
import TablaPosicionesArbitroPage from '../features/arbitro/TablaPosicionesArbitroPage'
import LlavesArbitroPage from '../features/arbitro/LlavesArbitroPage'
import PartidosArbitroPage from '../features/arbitro/PartidosArbitroPage'
import AuditoriaPage from '../features/admin/AuditoriaPage'
import OrganizerDashboardPage from '../features/organizer/OrganizerDashboardPage'
import OrganizerCreateTournamentPage from '../features/organizer/OrganizerCreateTournamentPage'
import OrganizerTournamentManagePage from '../features/organizer/OrganizerTournamentManagePage'
import OAuth2CallbackPage from '../pages/OAuth2CallbackPage'
import JugadorDashboardPage from '../features/players/JugadorDashboardPage'
import SolicitudesPage from '../features/players/SolicitudesPage'
import SancionesPage from '../features/players/SancionesPage'
import CapitanDashboardPage from '../features/captain/CapitanDashboardPage'
import AlineacionPage from '../features/captain/AlineacionPage'
import AlineacionRivalPage from '../features/captain/AlineacionRivalPage'
import BuscarJugadoresPage from '../features/captain/BuscarJugadoresPage'
import PagosPage from '../features/captain/PagosPage'
import EquiposCapitanPage from '../features/captain/EquiposCapitanPage'

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
        <Route path="/oauth2/callback" element={<OAuth2CallbackPage />} />

        {/* Rutas protegidas */}
        <Route
          element={
            <PrivateRoute>
              <DashboardLayout
                roleLabel="Arbitro"
                navLinks={[
                  { label: 'Inicio', to: '/arbitro' },
                  { label: 'Torneos', to: '/torneos' },
                  { label: 'Equipos', to: '/equipos' },
                  { label: 'Reglamento', to: '/arbitro/reglamento' },
                ]}
              >
                <Outlet />
              </DashboardLayout>
            </PrivateRoute>
          }
        >
          <Route path="/arbitro" element={<ArbitroPanelPage />} />
          <Route path="/arbitro/partidos" element={<PartidosArbitroPage />} />
          <Route path="/arbitro/alineaciones" element={<AlineacionesArbitroPage />} />
          <Route path="/arbitro/reglamento" element={<ReglamentoArbitroPage />} />
          <Route path="/arbitro/tabla" element={<TablaPosicionesArbitroPage />} />
          <Route path="/arbitro/tabla/llaves" element={<LlavesArbitroPage />} />
        </Route>

        <Route
          element={
            <PrivateRoute>
              <DashboardLayout>
                <Outlet />
              </DashboardLayout>
            </PrivateRoute>
          }
        >
          <Route path="/organizador" element={<OrganizerDashboardPage />} />
          <Route path="/organizador/torneos/crear" element={<OrganizerCreateTournamentPage />} />
          <Route path="/organizador/torneos/:id" element={<OrganizerTournamentManagePage />} />
          <Route path="/configuracion" element={<Navigate to="/organizador" replace />} />
          <Route path="/equipos" element={<TeamListPage />} />
          <Route path="/equipos/:id" element={<TeamDetailPage />} />
          <Route path="/equipos/registro" element={<TeamRegisterPage />} />
          <Route
            path="/perfil"
            element={
              <RoleRoute roles={['JUGADOR', 'CAPITAN', 'USUARIO_REGISTRADO']}>
                <CrearPerfilPage />
              </RoleRoute>
            }
          />

          <Route
            path="/dashboard"
            element={
              <RoleRoute roles={['JUGADOR']}>
                <JugadorDashboardPage />
              </RoleRoute>
            }
          />
          <Route
            path="/solicitudes"
            element={
              <RoleRoute roles={['JUGADOR']}>
                <SolicitudesPage />
              </RoleRoute>
            }
          />
          <Route
            path="/sanciones"
            element={
              <RoleRoute roles={['JUGADOR']}>
                <SancionesPage />
              </RoleRoute>
            }
          />
          <Route
            path="/perfil/crear"
            element={
              <RoleRoute roles={['JUGADOR', 'CAPITAN', 'USUARIO_REGISTRADO']}>
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

        {/* Rutas protegidas — CAPITAN */}
        <Route
          element={
            <PrivateRoute>
              <RoleRoute roles={['CAPITAN']}>
                <DashboardLayout>
                  <Outlet />
                </DashboardLayout>
              </RoleRoute>
            </PrivateRoute>
          }
        >
          <Route path="/capitan/dashboard" element={<CapitanDashboardPage />} />
          <Route path="/capitan/alineacion" element={<AlineacionPage />} />
          <Route path="/capitan/alineacion-rival" element={<AlineacionRivalPage />} />
          <Route path="/capitan/jugadores" element={<BuscarJugadoresPage />} />
          <Route path="/capitan/pagos" element={<PagosPage />} />
          <Route path="/capitan/equipos" element={<EquiposCapitanPage />} />
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
