import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import LandingPage from '@/modules/landing/LandingPage';
import LoginPage from '@/modules/auth/LoginPage';
import ForgotPasswordPage from '@/modules/auth/ForgotPasswordPage';
import DashboardLayout from '@/modules/dashboard/DashboardLayout';
import PlayerListPage from '@/modules/dashboard/PlayerListPage';
import CreatePlayerForm from '@/modules/dashboard/CreatePlayerForm';
import ScoutingPage from '@/modules/dashboard/ScoutingPage';
import PlayerProfile from '@/modules/players/PlayerProfile';
import SuperAdminPanel from '@/modules/superadmin/SuperAdminPanel';
import AgentProfile from '@/modules/public-profile/AgentProfile';
import PublicPlayerProfile from '@/modules/public-profile/PublicPlayerProfile';
import AgentPublicPortfolio from '@/modules/public-profile/AgentPublicPortfolio';
import { Toaster } from "@/components/ui/toaster";

// Placeholder components (will be replaced by real modules)
const Unauthorized = () => <div className="p-10 text-3xl font-bold text-center text-red-500">Unauthorized</div>;

const AppRoutes = () => {
    return (
        <>
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/unauthorized" element={<Unauthorized />} />

                {/* Public Agent Profile (Dynamic Route) */}
                <Route path="/agent/:agentId" element={<AgentProfile />} />
                <Route path="/p/:playerId" element={<PublicPlayerProfile />} />
                <Route path="/u/:slug" element={<AgentPublicPortfolio />} />

                {/* Protected Routes - Agent */}
                <Route element={<ProtectedRoute allowedRoles={['agent', 'superadmin']} />}>
                    <Route path="/dashboard" element={<DashboardLayout />}>
                        <Route index element={<Navigate to="players" replace />} />
                        <Route path="players" element={<PlayerListPage />} />
                        <Route path="players/new" element={<CreatePlayerForm />} />
                        <Route path="players/edit/:id" element={<CreatePlayerForm />} />
                        <Route path="players/:id" element={<PlayerProfile />} />
                        <Route path="scouting" element={<ScoutingPage />} />
                        <Route path="settings" element={<div className="p-6 text-white">Configuración (Próximamente)</div>} />
                    </Route>
                </Route>

                {/* Protected Routes - SuperAdmin */}
                <Route element={<ProtectedRoute allowedRoles={['superadmin']} />}>
                    <Route path="/superadmin/*" element={<SuperAdminPanel />} />
                </Route>

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            <Toaster />
        </>
    );
};

export default AppRoutes;
