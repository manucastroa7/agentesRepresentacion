import { useState, useEffect } from 'react';
import { Users, Shield, Globe, Plus, LogOut, Search, Trash2, User as UserIcon, Building2, LayoutGrid, List, Pencil } from 'lucide-react';
import { motion } from 'framer-motion';

import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/context/authStore';
import { API_BASE_URL } from '@/config/api';
import CreateUserModal from './components/CreateUserModal';
import EditUserModal from './components/EditUserModal';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import defaultAvatar from '@/assets/default_avatar.png';

const SuperAdminPanel = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Edit state
    const [editUser, setEditUser] = useState<any>(null);

    const [deleteConfirm, setDeleteConfirm] = useState<{ show: boolean; itemId: string | null; itemName: string }>({ show: false, itemId: null, itemName: '' });

    const [isLoading, setIsLoading] = useState(true);
    const { token, logout } = useAuthStore();
    const [activeTab, setActiveTab] = useState('agent'); // agent, player, club
    const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            // Use query param for filtering by role
            const response = await fetch(`${API_BASE_URL}/superadmin/users?role=${activeTab}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const result = await response.json();
                setUsers(result.data || result);
            } else {
                setUsers([]);
            }
        } catch (error) {
            console.error("Error fetching users", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleDelete = async (id: string) => {
        // Only agents supported for delete initially as per previous code, extending logic might be needed
        // For now, keeping naive implementation or generic if backend supports
        try {
            // Determine endpoint based on active tab
            let endpoint = '';
            switch (activeTab) {
                case 'agent': endpoint = `superadmin/agents/${id}`; break;
                case 'player': endpoint = `superadmin/players/${id}`; break;
                case 'club': endpoint = `superadmin/clubs/${id}`; break;
                default: return;
            }

            const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                setDeleteConfirm({ show: false, itemId: null, itemName: '' });
                fetchData();
            }
        } catch (error) {
            console.error("Error deleting item", error);
        }
    };

    const handleEdit = (item: any) => {
        setEditUser({
            id: item.id,
            type: activeTab,
            email: item.user?.email,
            agencyName: item.agencyName,
            slug: item.slug
        });
    };

    const getColumns = () => {
        switch (activeTab) {
            case 'agent':
                return ['Agencia', 'Email', 'Plan', 'Estado', 'Acciones'];
            case 'player':
                return ['Jugador', 'Email', 'Posición', 'Status', 'Acciones'];
            case 'club':
                return ['Club', 'Email', 'Categoría', 'Ubicación', 'Acciones'];
            default:
                return [];
        }
    };

    const renderRow = (item: any) => {
        switch (activeTab) {
            case 'agent':
                return (
                    <tr key={item.id} className="hover:bg-white/5 transition-colors">
                        <td className="px-8 py-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-[#39FF14] font-bold">
                                    {(item.agencyName || 'A').charAt(0)}
                                </div>
                                <div>
                                    <p className="font-bold text-white">{item.agencyName}</p>
                                    <p className="text-xs text-slate-500">{item.slug}</p>
                                </div>
                            </div>
                        </td>
                        <td className="px-8 py-4 text-slate-300 text-sm">{item.user?.email || 'N/A'}</td>
                        <td className="px-8 py-4">
                            <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold border border-blue-500/20">
                                {item.plan || 'Free'}
                            </span>
                        </td>
                        <td className="px-8 py-4">
                            <span className="px-3 py-1 rounded-full bg-[#39FF14]/10 text-[#39FF14] text-xs font-bold border border-[#39FF14]/20">
                                Active
                            </span>
                        </td>
                        <td className="px-8 py-4">
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => handleEdit(item)}
                                    className="text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center gap-1.5 transition-colors"
                                >
                                    <Pencil size={16} />
                                    Editar
                                </button>
                                <button
                                    onClick={() => setDeleteConfirm({ show: true, itemId: item.id, itemName: item.agencyName })}
                                    className="text-red-400 hover:text-red-300 text-sm font-medium flex items-center gap-1.5 transition-colors"
                                >
                                    <Trash2 size={16} />
                                    Eliminar
                                </button>
                            </div>
                        </td>
                    </tr>
                );
            case 'player': // ... (omitted similar changes only repeating for completeness or if requested, focused on Agent for now as per logic, but applying generic Edit button)
                return (
                    <tr key={item.id} className="hover:bg-white/5 transition-colors">
                        <td className="px-8 py-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center overflow-hidden border border-white/10">
                                    <img
                                        src={item.user?.avatarUrl || defaultAvatar}
                                        alt={item.firstName}
                                        className="w-full h-full object-cover"
                                        onError={(e) => { e.currentTarget.src = defaultAvatar; }}
                                    />
                                </div>
                                <div>
                                    <p className="font-bold text-white">{item.firstName} {item.lastName}</p>
                                </div>
                            </div>
                        </td>
                        <td className="px-8 py-4 text-slate-300 text-sm">{item.user?.email || 'N/A'}</td>
                        <td className="px-8 py-4 text-slate-300">{item.position || '-'}</td>
                        <td className="px-8 py-4">
                            <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs font-bold border border-purple-500/20">
                                {item.status}
                            </span>
                        </td>
                        <td className="px-8 py-4">
                            <div className="flex items-center gap-3">
                                <button disabled className="text-slate-600 cursor-not-allowed text-sm font-medium flex items-center gap-1.5">
                                    <Pencil size={16} /> Editar
                                </button>
                                <button
                                    onClick={() => setDeleteConfirm({ show: true, itemId: item.id, itemName: `${item.firstName} ${item.lastName}` })}
                                    className="text-red-400 hover:text-red-300 text-sm font-medium flex items-center gap-1.5 transition-colors"
                                >
                                    <Trash2 size={16} />
                                    Eliminar
                                </button>
                            </div>
                        </td>
                    </tr>
                );
            case 'club':
                return (
                    <tr key={item.id} className="hover:bg-white/5 transition-colors">
                        <td className="px-8 py-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-orange-400 font-bold">
                                    {(item.clubName || 'C').charAt(0)}
                                </div>
                                <div>
                                    <p className="font-bold text-white">{item.clubName}</p>
                                </div>
                            </div>
                        </td>
                        <td className="px-8 py-4 text-slate-300 text-sm">{item.user?.email || 'N/A'}</td>
                        <td className="px-8 py-4 text-slate-300">{item.category || '-'}</td>
                        <td className="px-8 py-4 text-slate-300">{item.location || '-'}</td>
                        <td className="px-8 py-4">
                            {/* Actions placeholder */}
                        </td>
                    </tr>
                );
            default:
                return null;
        }
    }

    const renderGrid = () => {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {users.map((item: any) => (
                    <div key={item.id} className="bg-slate-900 border border-white/5 rounded-2xl overflow-hidden hover:border-[#39FF14]/50 transition-all group relative">
                        <div className="h-48 bg-slate-800 relative">
                            {activeTab === 'player' ? (
                                <img
                                    src={item.user?.avatarUrl || defaultAvatar}
                                    alt={item.firstName}
                                    className="w-full h-full object-cover"
                                    onError={(e) => { e.currentTarget.src = defaultAvatar; }}
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-600">
                                    {activeTab === 'agent' ? <Users size={48} /> : <Building2 size={48} />}
                                </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent opacity-80" />

                            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                                {activeTab === 'agent' && (
                                    <button
                                        onClick={() => handleEdit(item)}
                                        className="bg-blue-500/20 hover:bg-blue-500 text-blue-400 hover:text-white p-2 rounded-lg backdrop-blur-sm transition-all"
                                    >
                                        <Pencil size={16} />
                                    </button>
                                )}
                                <button
                                    onClick={() => setDeleteConfirm({ show: true, itemId: item.id, itemName: activeTab === 'player' ? `${item.firstName} ${item.lastName}` : (item.agencyName || item.clubName) })}
                                    className="bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white p-2 rounded-lg backdrop-blur-sm transition-all"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                        <div className="p-6">
                            <h3 className="text-lg font-bold text-white mb-1">
                                {activeTab === 'player' ? `${item.firstName} ${item.lastName}` : (item.agencyName || item.clubName)}
                            </h3>
                            <p className="text-sm text-slate-400 mb-4">{item.user?.email}</p>

                            <div className="flex flex-wrap gap-2">
                                {activeTab === 'player' && (
                                    <>
                                        <span className="px-2 py-1 rounded-md bg-white/5 text-xs font-medium text-slate-300 border border-white/5">
                                            {item.position}
                                        </span>
                                        <span className="px-2 py-1 rounded-md bg-[#39FF14]/10 text-[#39FF14] text-xs font-bold border border-[#39FF14]/20">
                                            {item.status}
                                        </span>
                                    </>
                                )}
                                {activeTab === 'agent' && (
                                    <span className="px-2 py-1 rounded-md bg-blue-500/10 text-blue-400 text-xs font-bold border border-blue-500/20">
                                        {item.plan || 'Free'}
                                    </span>
                                )}
                                {activeTab === 'club' && (
                                    <span className="px-2 py-1 rounded-md bg-orange-500/10 text-orange-400 text-xs font-bold border border-orange-500/20">
                                        {item.category}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
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

                {/* Main Content */}
                <Tabs defaultValue="agent" value={activeTab} onValueChange={setActiveTab} className="w-full">
                    {/* Controls Row */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                        <TabsList className="bg-slate-900 border border-white/5 p-1 rounded-xl h-auto">
                            <TabsTrigger value="agent" className="data-[state=active]:bg-[#39FF14] data-[state=active]:text-black px-6 py-2 rounded-lg transition-all">
                                <div className="flex items-center gap-2"><Users size={16} /> Agentes</div>
                            </TabsTrigger>
                            <TabsTrigger value="player" className="data-[state=active]:bg-[#39FF14] data-[state=active]:text-black px-6 py-2 rounded-lg transition-all">
                                <div className="flex items-center gap-2"><UserIcon size={16} /> Jugadores</div>
                            </TabsTrigger>
                            <TabsTrigger value="club" className="data-[state=active]:bg-[#39FF14] data-[state=active]:text-black px-6 py-2 rounded-lg transition-all">
                                <div className="flex items-center gap-2"><Building2 size={16} /> Clubes</div>
                            </TabsTrigger>
                        </TabsList>

                        <div className="flex items-center gap-3">
                            {/* View Toggle */}
                            <div className="bg-slate-900 p-1 rounded-lg border border-white/5 flex gap-1 h-[52px] box-border">
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-2 rounded-md transition-all h-full ${viewMode === 'list' ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white'}`}
                                >
                                    <List size={20} />
                                </button>
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-2 rounded-md transition-all h-full ${viewMode === 'grid' ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white'}`}
                                >
                                    <LayoutGrid size={20} />
                                </button>
                            </div>

                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="bg-[#39FF14] hover:bg-[#32d912] text-slate-950 px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(57,255,20,0.2)] h-[52px]"
                            >
                                <Plus size={18} />
                                NUEVO USUARIO
                            </button>
                        </div>
                    </div>

                    {/* Content Container */}
                    {viewMode === 'list' ? (
                        <div className="bg-slate-900/50 border border-white/5 rounded-3xl overflow-hidden backdrop-blur-sm">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-slate-950/50 text-slate-400 text-xs uppercase tracking-wider font-medium">
                                        <tr>
                                            {getColumns().map((col, idx) => (
                                                <th key={idx} className="px-8 py-4">{col}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {isLoading ? (
                                            <tr><td colSpan={5} className="text-center py-8 text-slate-500">Cargando...</td></tr>
                                        ) : users.length === 0 ? (
                                            <tr><td colSpan={5} className="text-center py-8 text-slate-500">No se encontraron registros.</td></tr>
                                        ) : (
                                            users.map((item) => renderRow(item))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ) : (
                        renderGrid()
                    )}
                </Tabs>
            </div>

            {/* Create User Modal */}
            <CreateUserModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={fetchData}
            />

            {/* Edit User Modal */}
            <EditUserModal
                isOpen={!!editUser}
                userData={editUser}
                onClose={() => setEditUser(null)}
                onSuccess={fetchData}
            />

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
                                <h3 className="text-xl font-bold text-white">Eliminar</h3>
                            </div>
                        </div>
                        <div className="p-6 space-y-4">
                            <p className="text-slate-300">
                                ¿Estás seguro de que deseas eliminar <strong className="text-white">{deleteConfirm.itemName}</strong>?
                            </p>
                            <div className="flex gap-3 pt-4">
                                <button
                                    onClick={() => setDeleteConfirm({ show: false, itemId: null, itemName: '' })}
                                    className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-medium py-3 rounded-xl transition-all"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={() => deleteConfirm.itemId && handleDelete(deleteConfirm.itemId)}
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
