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
import ArbitroPanelPage from '../features/arbitro/ArbitroPanelPage'
import AlineacionesArbitroPage from '../features/arbitro/AlineacionesArbitroPage'
import ReglamentoArbitroPage from '../features/arbitro/ReglamentoArbitroPage'
import TablaPosicionesArbitroPage from '../features/arbitro/TablaPosicionesArbitroPage'
import LlavesArbitroPage from '../features/arbitro/LlavesArbitroPage'

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
          <Route path="/dashboard" element={<NotFoundPage />} />
          <Route path="/equipos" element={<TeamListPage />} />
          <Route path="/equipos/:id" element={<TeamDetailPage />} />
          <Route path="/equipos/registro" element={<TeamRegisterPage />} />
          <Route path="/perfil" element={<NotFoundPage />} />
          <Route path="/perfil/crear" element={<CrearPerfilPage />} />
        </Route>

        {/* Ruta no encontrada */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter
