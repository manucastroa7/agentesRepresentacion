import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import LandingPage from '@/modules/landing/LandingPage';
import LoginPage from '@/modules/auth/LoginPage';
import RegisterPage from '@/modules/auth/pages/RegisterPage';
import ForgotPasswordPage from '@/modules/auth/ForgotPasswordPage';
import ResetPasswordPage from '@/modules/auth/ResetPasswordPage';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuthStore } from '@/context/authStore';

// Modules
import DashboardHome from '@/modules/dashboard/DashboardHome';
import ClubDashboardHome from '@/modules/dashboard/ClubDashboardHome';
import PlayerListPage from '@/modules/dashboard/PlayerListPage';
import CreatePlayerForm from '@/modules/dashboard/CreatePlayerForm';
import ScoutingPage from '@/modules/dashboard/ScoutingPage';
import PlayerProfile from '@/modules/players/PlayerProfile';
import SuperAdminPanel from '@/modules/superadmin/SuperAdminPanel';
import AgentProfileSettings from '@/modules/dashboard/AgentProfileSettings';
import AgentProfile from '@/modules/public-profile/AgentProfile';
import PublicPlayerProfile from '@/modules/public-profile/PublicPlayerProfile';
import AgentPublicPortfolio from '@/modules/public-profile/AgentPublicPortfolio';
import MarketplacePage from '@/modules/market/pages/MarketplacePage'; // Legacy public market
import MarketPage from '@/modules/market/pages/MarketPage'; // New Club Market
import FindAgentPage from '@/modules/applications/pages/FindAgentPage';
import MyApplicationsPage from '@/modules/applications/pages/MyApplicationsPage';
import AgentApplicationsPage from '@/modules/applications/pages/AgentApplicationsPage';
import MySquadPage from '@/modules/dashboard/agent/MySquadPage';
import { Toaster } from "@/components/ui/toaster";

const Unauthorized = () => <div className="p-10 text-3xl font-bold text-center text-red-500">Unauthorized</div>;

const DashboardHomeWrapper = () => {
    const { user } = useAuthStore();
    if (user?.role === 'club') {
        return <ClubDashboardHome />;
    }
    return <DashboardHome />;
};

const ALLOWED_ROLES = ['agent', 'superadmin', 'player', 'club'];

const AppRoutes = () => {
    return (
        <>
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/market" element={<MarketplacePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />
                <Route path="/unauthorized" element={<Unauthorized />} />

                {/* Public Agent Profile (Dynamic Route) */}
                <Route path="/agent/:agentId" element={<AgentProfile />} />
                <Route path="/p/:playerId" element={<PublicPlayerProfile />} />
                <Route path="/u/:slug" element={<AgentPublicPortfolio />} />

                {/* Protected Routes - Unified Shell (DashboardLayout) */}
                <Route element={<ProtectedRoute allowedRoles={ALLOWED_ROLES} />}>
                    <Route element={<DashboardLayout />}>

                        {/* SuperAdmin Routes */}
                        <Route path="/superadmin/users" element={<SuperAdminPanel />} />
                        <Route path="/superadmin/dashboard" element={<div className="text-white p-8">Panel General (Próximamente)</div>} />

                        {/* Club Routes */}
                        <Route path="/dashboard/club/market" element={<MarketPage />} />

                        {/* Agent Routes */}
                        {/* <Route path="/dashboard/agent/squad" element={<MySquadPage />} /> */}
                        <Route path="/dashboard/agent/requests" element={<div className="text-white p-8">Solicitudes (Próximamente)</div>} />
                        <Route path="/dashboard/agent/settings" element={<div className="text-white p-8">Configuración (Próximamente)</div>} />

                        {/* Redirect legacy agent path */}
                        <Route path="/dashboard/agent" element={<Navigate to="/dashboard/players" replace />} />

                        {/* Shared / Legacy Routes */}
                        <Route path="/dashboard" element={<DashboardHomeWrapper />} />
                        <Route path="/dashboard/players" element={<MySquadPage />} />
                        <Route path="/dashboard/players/new" element={<CreatePlayerForm />} />
                        <Route path="/dashboard/players/edit/:id" element={<CreatePlayerForm />} />
                        <Route path="/dashboard/players/:id" element={<PlayerProfile />} />
                        <Route path="/dashboard/scouting" element={<ScoutingPage />} />
                        <Route path="/dashboard/settings" element={<AgentProfileSettings />} />

                        {/* Player Specific Routes */}
                        <Route path="/dashboard/player/home" element={<div className="text-white p-8">Mi Carrera (Próximamente)</div>} />
                        <Route path="/dashboard/find-agent" element={<FindAgentPage />} />
                        <Route path="/dashboard/my-applications" element={<MyApplicationsPage />} />

                        {/* Agent Applications */}
                        <Route path="/dashboard/applications" element={<AgentApplicationsPage />} />
                    </Route>
                </Route>

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            <Toaster />
        </>
    );
};

export default AppRoutes;
