import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '../lib/supabaseClient';
import type { UserProfile, Vertical, CostCenter } from '../types';
import { UserRole } from '../types';

interface AddUserModalProps {
    onClose: () => void;
    onUserInvited: () => void;
    verticals: Vertical[];
    costCenters: CostCenter[];
}

const AddUserModal: React.FC<AddUserModalProps> = ({ onClose, onUserInvited, verticals, costCenters }) => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState<UserRole>(UserRole.Manager);
    const [verticalId, setVerticalId] = useState<number | null>(null);
    const [costCenterId, setCostCenterId] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const filteredCostCenters = useMemo(() => {
        if (role !== UserRole.Manager || !verticalId) return [];
        return costCenters.filter(cc => cc.vertical_id === verticalId);
    }, [role, verticalId, costCenters]);

    useEffect(() => {
        if (role === UserRole.Admin) {
            setVerticalId(null);
            setCostCenterId(null);
        } else if (role === UserRole.Director) {
            setCostCenterId(null);
        }
    }, [role]);

    const handleInvite = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const metadata: any = {
            full_name: fullName,
            role: role,
        };

        if (role === UserRole.Director && verticalId) {
            metadata.vertical_id = verticalId;
        }
        if (role === UserRole.Manager && costCenterId) {
            const selectedCC = costCenters.find(cc => cc.db_id === costCenterId);
            metadata.vertical_id = selectedCC?.vertical_id;
            metadata.cost_center_id = costCenterId;
        }

        const { error } = await supabase.auth.admin.inviteUserByEmail(email, {
            data: metadata
        });

        if (error) {
            setError(error.message);
        } else {
            alert('Convite enviado com sucesso!');
            onUserInvited();
            onClose();
        }
        setLoading(false);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <form onSubmit={handleInvite} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-lg space-y-4">
                <h3 className="text-xl font-semibold">Convidar Novo Usuário</h3>
                
                {error && <p className="text-sm text-red-500 bg-red-100 dark:bg-red-900/50 p-3 rounded-md">{error}</p>}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium">Nome Completo</label>
                        <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="mt-1 block w-full bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md p-2" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Email</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 block w-full bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md p-2" required />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium">Função</label>
                    <select value={role} onChange={(e) => setRole(e.target.value as UserRole)} className="mt-1 block w-full bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md p-2">
                        {Object.values(UserRole).map(r => <option key={r} value={r} className="capitalize">{r}</option>)}
                    </select>
                </div>
                {role === UserRole.Director && (
                    <div>
                        <label className="block text-sm font-medium">Vertical</label>
                        <select onChange={(e) => setVerticalId(Number(e.target.value))} className="mt-1 block w-full bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md p-2" required>
                            <option value="">Selecione uma Vertical</option>
                            {verticals.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                        </select>
                    </div>
                )}
                {role === UserRole.Manager && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium">Vertical</label>
                            <select onChange={(e) => { setVerticalId(Number(e.target.value)); setCostCenterId(null); }} className="mt-1 block w-full bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md p-2" required>
                                <option value="">Selecione uma Vertical</option>
                                {verticals.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Centro de Custo</label>
                            <select onChange={(e) => setCostCenterId(Number(e.target.value))} className="mt-1 block w-full bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md p-2" required disabled={!verticalId}>
                                <option value="">Selecione um Centro de Custo</option>
                                {filteredCostCenters.map(cc => <option key={cc.db_id} value={cc.db_id}>{cc.name}</option>)}
                            </select>
                        </div>
                    </div>
                )}
                <div className="mt-6 flex justify-end space-x-2">
                    <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600">Cancelar</button>
                    <button type="submit" disabled={loading} className="px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 disabled:bg-primary-300">
                        {loading ? 'Enviando...' : 'Enviar Convite'}
                    </button>
                </div>
            </form>
        </div>
    );
};


interface UsersProps {
    verticals: Vertical[];
    costCenters: CostCenter[];
}

export const Users: React.FC<UsersProps> = ({ verticals, costCenters }) => {
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);

    const fetchUsers = async () => {
        setLoading(true);
        const { data, error } = await supabase.rpc('get_all_users_with_details');
        
        if (error) {
            console.error("Error fetching users:", error);
            alert(`Erro ao carregar usuários: ${error.message}`);
            setUsers([]);
        } else {
            const enrichedUsers: UserProfile[] = (data as any[]).map(user => ({
                ...user,
                vertical_name: user.vertical_id ? verticals.find(v => v.id === user.vertical_id)?.name : '-',
                cost_center_name: user.cost_center_id ? costCenters.find(cc => cc.db_id === user.cost_center_id)?.name : '-',
            }));
            setUsers(enrichedUsers);
        }
        setLoading(false);
    }
    
    useEffect(() => {
        fetchUsers();
    }, []);
    
    const handlePasswordReset = async (email: string | undefined) => {
        if (!email) {
            alert('Email do usuário não encontrado.');
            return;
        }
        if (confirm(`Tem certeza que deseja enviar um link de redefinição de senha para ${email}?`)) {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: window.location.origin,
            });

            if (error) {
                alert(`Erro ao enviar o link: ${error.message}`);
            } else {
                alert(`Link de redefinição de senha enviado para ${email}.`);
            }
        }
    };

    return (
        <div className="space-y-6">
            {showAddModal && <AddUserModal onClose={() => setShowAddModal(false)} onUserInvited={fetchUsers} verticals={verticals} costCenters={costCenters} />}
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Gerenciamento de Usuários</h1>
                <button onClick={() => setShowAddModal(true)} className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition">
                    Convidar Usuário
                </button>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white dark:bg-gray-800">
                        <thead>
                            <tr className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 uppercase text-sm leading-normal">
                                <th className="py-3 px-6 text-left">Nome</th>
                                <th className="py-3 px-6 text-left">Email</th>
                                <th className="py-3 px-6 text-left">Função</th>
                                <th className="py-3 px-6 text-left">Vertical</th>
                                <th className="py-3 px-6 text-left">Centro de Custo</th>
                                <th className="py-3 px-6 text-center">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-700 dark:text-gray-200 text-sm font-light">
                            {loading ? (
                                <tr><td colSpan={6} className="text-center py-12">Carregando usuários...</td></tr>
                            ) : users.map(user => (
                                <tr key={user.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800">
                                    <td className="py-3 px-6 text-left font-medium">{user.full_name}</td>
                                    <td className="py-3 px-6 text-left">{user.email}</td>
                                    <td className="py-3 px-6 text-left capitalize">{user.role}</td>
                                    <td className="py-3 px-6 text-left">{user.vertical_name}</td>
                                    <td className="py-3 px-6 text-left">{user.cost_center_name}</td>
                                    <td className="py-3 px-6 text-center">
                                        <div className="flex items-center justify-center space-x-2">
                                            <button className="text-xs bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500">Editar</button>
                                            <button 
                                                onClick={() => handlePasswordReset(user.email)}
                                                className="text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 px-2 py-1 rounded-md hover:bg-blue-200 dark:hover:bg-blue-800"
                                            >
                                                Resetar Senha
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
};