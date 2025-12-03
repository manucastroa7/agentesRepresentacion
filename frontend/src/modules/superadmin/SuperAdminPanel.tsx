import { useState, useEffect } from 'react';
import { Users, Shield, Globe, Plus, LogOut, Search, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/context/authStore';

const SuperAdminPanel = () => {
    const navigate = useNavigate();
    const [agents, setAgents] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState<{ show: boolean; agentId: string | null; agentName: string }>({ show: false, agentId: null, agentName: '' });
    const { register, handleSubmit, reset } = useForm();
    const [isLoading, setIsLoading] = useState(true);
    const { token, logout } = useAuthStore();

    useEffect(() => {
        fetchAgents();
    }, []);

    const fetchAgents = async () => {
        try {
            const response = await fetch('http://localhost:3000/agents', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const result = await response.json();
                // El backend envuelve la respuesta en { statusCode, data }
                setAgents(result.data || result);
            }
        } catch (error) {
            console.error("Error fetching agents", error);
        } finally {
            setIsLoading(false);
        }
    };

    const onSubmit = async (data: any) => {
        try {
            const response = await fetch('http://localhost:3000/agents', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                setIsModalOpen(false);
                reset();
                fetchAgents();
            }
        } catch (error) {
            console.error("Error creating agent", error);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleDelete = async (agentId: string) => {
        try {
            const response = await fetch(`http://localhost:3000/superadmin/agents/${agentId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                setDeleteConfirm({ show: false, agentId: null, agentName: '' });
                fetchAgents();
            }
        } catch (error) {
            console.error("Error deleting agent", error);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white p-8 font-sans">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-12">
                    <div>
                        <h1 className="text-3xl font-display font-bold text-white tracking-tight flex items-center gap-3">
                            <Shield className="text-[#39FF14]" size={32} />
                            SUPER ADMIN
                        </h1>
                        <p className="text-slate-400 mt-1">Panel de Control Maestro</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
                    >
                        <LogOut size={20} />
                        Salir
                    </button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <motion.div
                        whileHover={{ y: -5 }}
                        className="bg-slate-900/50 border border-white/5 p-6 rounded-2xl backdrop-blur-sm"
                    >
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-[#39FF14]/10 text-[#39FF14] rounded-xl">
                                <Users className="h-8 w-8" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-400 font-medium uppercase tracking-wider">Agentes Totales</p>
                                <p className="text-3xl font-bold font-display">{agents.length}</p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        whileHover={{ y: -5 }}
                        className="bg-slate-900/50 border border-white/5 p-6 rounded-2xl backdrop-blur-sm"
                    >
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl">
                                <Globe className="h-8 w-8" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-400 font-medium uppercase tracking-wider">Dominios Activos</p>
                                <p className="text-3xl font-bold font-display">--</p>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Agents Management */}
                <div className="bg-slate-900/50 border border-white/5 rounded-3xl overflow-hidden backdrop-blur-sm">
                    <div className="p-8 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <h2 className="text-xl font-bold text-white mb-1">Gestión de Agencias</h2>
                            <p className="text-slate-400 text-sm">Administra los accesos y cuentas de agentes.</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                <input
                                    type="text"
                                    placeholder="Buscar agencia..."
                                    className="bg-slate-950 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#39FF14] w-64"
                                />
                            </div>
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="bg-[#39FF14] hover:bg-[#32d912] text-slate-950 px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(57,255,20,0.2)]"
                            >
                                <Plus size={18} />
                                NUEVA AGENCIA
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-950/50 text-slate-400 text-xs uppercase tracking-wider font-medium">
                                <tr>
                                    <th className="px-8 py-4">Agencia</th>
                                    <th className="px-8 py-4">Slug</th>
                                    <th className="px-8 py-4">Plan</th>
                                    <th className="px-8 py-4">Estado</th>
                                    <th className="px-8 py-4">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {isLoading ? (
                                    <tr><td colSpan={5} className="text-center py-8 text-slate-500">Cargando...</td></tr>
                                ) : agents.map((agent: any) => (
                                    <tr key={agent.id} className="hover:bg-white/5 transition-colors">
                                        <td className="px-8 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-[#39FF14] font-bold">
                                                    {agent.agencyName.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-white">{agent.agencyName}</p>
                                                    <p className="text-xs text-slate-500">{agent.user?.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-4 text-slate-300 font-mono text-sm">{agent.slug}</td>
                                        <td className="px-8 py-4">
                                            <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold border border-blue-500/20">
                                                {agent.plan}
                                            </span>
                                        </td>
                                        <td className="px-8 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${agent.status === 'active' ? 'bg-[#39FF14]/10 text-[#39FF14] border-[#39FF14]/20' : 'bg-slate-800 text-slate-400 border-slate-700'}`}>
                                                {agent.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-4">
                                            <button
                                                onClick={() => setDeleteConfirm({ show: true, agentId: agent.id, agentName: agent.agencyName })}
                                                className="text-red-400 hover:text-red-300 text-sm font-medium flex items-center gap-1.5 transition-colors"
                                            >
                                                <Trash2 size={16} />
                                                Eliminar
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Create Agent Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl"
                    >
                        <div className="p-6 border-b border-white/10 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-white">Nueva Agencia</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
                        </div>
                        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-400">Nombre de la Agencia</label>
                                <input
                                    {...register('agencyName', { required: true })}
                                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#39FF14]"
                                    placeholder="Ej. Elite Sports"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-400">Email del Agente</label>
                                <input
                                    {...register('email', { required: true })}
                                    type="email"
                                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#39FF14]"
                                    placeholder="agente@ejemplo.com"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-400">Contraseña Temporal</label>
                                <input
                                    {...register('password', { required: true })}
                                    type="password"
                                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#39FF14]"
                                    placeholder="••••••••"
                                />
                            </div>
                            <div className="pt-4">
                                <button
                                    type="submit"
                                    className="w-full bg-[#39FF14] hover:bg-[#32d912] text-slate-950 font-bold py-3 rounded-xl transition-all"
                                >
                                    CREAR AGENCIA
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteConfirm.show && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-slate-900 border border-red-500/20 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl"
                    >
                        <div className="p-6 border-b border-white/10">
                            <div className="flex items-center gap-3 text-red-400">
                                <Trash2 size={24} />
                                <h3 className="text-xl font-bold text-white">Eliminar Agencia</h3>
                            </div>
                        </div>
                        <div className="p-6 space-y-4">
                            <p className="text-slate-300">
                                ¿Estás seguro de que deseas eliminar la agencia <strong className="text-white">{deleteConfirm.agentName}</strong>?
                            </p>
                            <p className="text-sm text-slate-400">
                                Esta acción eliminará el agente y su usuario asociado. No se puede deshacer.
                            </p>
                            <div className="flex gap-3 pt-4">
                                <button
                                    onClick={() => setDeleteConfirm({ show: false, agentId: null, agentName: '' })}
                                    className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-medium py-3 rounded-xl transition-all"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={() => deleteConfirm.agentId && handleDelete(deleteConfirm.agentId)}
                                    className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-xl transition-all"
                                >
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default SuperAdminPanel;
