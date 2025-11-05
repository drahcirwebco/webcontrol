import React, { useState, useMemo } from 'react';
import type { CostCenter, Expense } from '../types';
import { ExpenseStatus } from '../types';

const statusColors: { [key in ExpenseStatus]: string } = {
  [ExpenseStatus.Approved]: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  [ExpenseStatus.Pending]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  [ExpenseStatus.Rejected]: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
};

// --- MODALS ---

const AddVerticalModal: React.FC<{ onClose: () => void; onAdd: (vertical: string) => void }> = ({ onClose, onAdd }) => {
    const [verticalName, setVerticalName] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (verticalName.trim()) {
            onAdd(verticalName.trim());
            onClose();
        } else {
            alert('Por favor, insira um nome para a nova área.');
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md">
                <h3 className="text-lg font-semibold mb-4">Adicionar Nova Área</h3>
                <div>
                    <label htmlFor="vertical-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nome da Área (Vertical)</label>
                    <input
                        type="text"
                        id="vertical-name"
                        value={verticalName}
                        onChange={(e) => setVerticalName(e.target.value)}
                        className="mt-1 block w-full bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2"
                        required
                        placeholder="Ex: Controladoria, Comercial"
                    />
                </div>
                <div className="mt-6 flex justify-end space-x-2">
                    <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600">Cancelar</button>
                    <button type="submit" className="px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700">Adicionar Área</button>
                </div>
            </form>
        </div>
    );
};

const AddCostCenterModal: React.FC<{
    onClose: () => void;
    onAdd: (cc: Omit<CostCenter, 'spent'>) => void;
    verticals: string[];
}> = ({ onClose, onAdd, verticals }) => {
    const [formData, setFormData] = useState({
        id: '',
        name: '',
        manager: '',
        budget: 0,
        vertical: verticals[0] || '',
        subgroup: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.id || !formData.name || !formData.manager || !formData.vertical || !formData.subgroup || formData.budget <= 0) {
            alert('Por favor, preencha todos os campos.');
            return;
        }
        onAdd({ ...formData, budget: Number(formData.budget) });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-2xl space-y-4">
                <h3 className="text-xl font-semibold">Novo Centro de Custo</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium">Nome</label>
                        <input type="text" name="name" onChange={handleChange} className="mt-1 block w-full bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md p-2" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">ID</label>
                        <input type="text" name="id" onChange={handleChange} className="mt-1 block w-full bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md p-2" required />
                    </div>
                     <div>
                        <label className="block text-sm font-medium">Gestor</label>
                        <input type="text" name="manager" onChange={handleChange} className="mt-1 block w-full bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md p-2" required />
                    </div>
                     <div>
                        <label className="block text-sm font-medium">Orçamento (R$)</label>
                        <input type="number" name="budget" onChange={handleChange} className="mt-1 block w-full bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md p-2" required min="1" />
                    </div>
                     <div>
                        <label className="block text-sm font-medium">Área (Vertical)</label>
                        <select name="vertical" value={formData.vertical} onChange={handleChange} className="mt-1 block w-full bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md p-2">
                           {verticals.map(v => <option key={v} value={v}>{v}</option>)}
                        </select>
                    </div>
                     <div>
                        <label className="block text-sm font-medium">Subgrupo</label>
                        <input type="text" name="subgroup" onChange={handleChange} className="mt-1 block w-full bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md p-2" required />
                    </div>
                </div>
                <div className="mt-6 flex justify-end space-x-2">
                    <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600">Cancelar</button>
                    <button type="submit" className="px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700">Salvar Centro de Custo</button>
                </div>
            </form>
        </div>
    );
};

// --- VIEWS ---

const CostCenterDetail: React.FC<{ costCenter: CostCenter; expenses: Expense[]; onBack: () => void; }> = ({ costCenter, expenses, onBack }) => {
    const percentageSpent = costCenter.budget > 0 ? (costCenter.spent / costCenter.budget) * 100 : 0;
    const progressBarColor = percentageSpent > 105 ? 'bg-red-500' : percentageSpent > 100 ? 'bg-yellow-500' : 'bg-primary-600';
    
    return (
        <div className="space-y-6 animate-fade-in">
             <button onClick={onBack} className="flex items-center text-sm font-semibold text-primary-600 dark:text-primary-400 hover:underline">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                Voltar para todos os Centros de Custo
            </button>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                <div className="flex flex-col md:flex-row justify-between md:items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">{costCenter.name} ({costCenter.id})</h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">Gerenciado por {costCenter.manager} · {costCenter.vertical} / {costCenter.subgroup}</p>
                    </div>
                    <div className="text-right mt-4 md:mt-0">
                         <div className="text-lg font-medium text-gray-600 dark:text-gray-300">Variação</div>
                         <div className={`text-2xl font-bold ${costCenter.spent > costCenter.budget ? 'text-red-500' : 'text-green-500'}`}>
                            R$ {(costCenter.budget - costCenter.spent).toLocaleString()}
                        </div>
                    </div>
                </div>
                 <div className="mt-6">
                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-1">
                        <span>Gasto: <span className="font-semibold">R${costCenter.spent.toLocaleString()}</span></span>
                        <span>Orçamento: <span className="font-semibold">R${costCenter.budget.toLocaleString()}</span></span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                        <div className={`${progressBarColor} h-4 rounded-full flex items-center justify-center text-white text-xs font-bold`} style={{ width: `${Math.min(percentageSpent, 100)}%` }}>
                            {percentageSpent.toFixed(1)}%
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Despesas Recentes</h3>
                 <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 uppercase text-sm leading-normal">
                        <th className="py-3 px-6 text-left">ID</th>
                        <th className="py-3 px-6 text-left">Data</th>
                        <th className="py-3 px-6 text-left">Descrição</th>
                        <th className="py-3 px-6 text-right">Valor</th>
                        <th className="py-3 px-6 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="text-gray-700 dark:text-gray-200 text-sm font-light">
                      {expenses.length > 0 ? expenses.map(e => (
                          <tr key={e.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800">
                                <td className="py-3 px-6 text-left">{e.id}</td>
                                <td className="py-3 px-6 text-left">{new Date(e.date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</td>
                                <td className="py-3 px-6 text-left">{e.description}</td>
                                <td className="py-3 px-6 text-right font-mono">R$ {e.amount.toFixed(2)}</td>
                                <td className="py-3 px-6 text-center">
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusColors[e.status]}`}>{e.status}</span>
                                </td>
                          </tr>
                      )) : (
                          <tr><td colSpan={5} className="text-center py-8">Nenhuma despesa para este centro de custo.</td></tr>
                      )}
                    </tbody>
                  </table>
                 </div>
            </div>
        </div>
    );
}


const CostCentersList: React.FC<{
    costCenters: CostCenter[];
    onSelectCostCenter: (cc: CostCenter) => void;
    onShowAddCostCenter: () => void;
    onShowAddVertical: () => void;
}> = ({ costCenters, onSelectCostCenter, onShowAddCostCenter, onShowAddVertical }) => {
    const [selectedVertical, setSelectedVertical] = useState<string>('all');
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [reviewingCostCenter, setReviewingCostCenter] = useState<CostCenter | null>(null);

    const verticals = useMemo(() => ['all', ...Array.from(new Set(costCenters.map(cc => cc.vertical)))], [costCenters]);

    const filteredCostCenters = useMemo(() => {
        return costCenters
        .filter(cc => selectedVertical === 'all' || cc.vertical === selectedVertical)
        .filter(cc =>
            cc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            cc.id.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [selectedVertical, searchTerm, costCenters]);

    const groupedByVertical = filteredCostCenters.reduce((acc, cc) => {
        if (!acc[cc.vertical]) {
        acc[cc.vertical] = [];
        }
        acc[cc.vertical].push(cc);
        return acc;
    }, {} as Record<string, CostCenter[]>);
    
    const FlagIcon: React.FC<{ color: string }> = ({ color }) => (
        <svg className={`w-5 h-5 ${color}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M14.4 6L14 4H5v17h2v-7h5.6l.4 2h7V6h-5.6z" /></svg>
    );

    const CostCenterCard: React.FC<{ costCenter: CostCenter }> = ({ costCenter }) => {
        const percentageSpent = costCenter.budget > 0 ? (costCenter.spent / costCenter.budget) * 100 : 0;
        const progressBarColor = percentageSpent > 105 ? 'bg-red-500' : percentageSpent > 100 ? 'bg-yellow-500' : 'bg-primary-600';
        const overBudgetAmount = costCenter.spent - costCenter.budget;
        const variancePercentage = costCenter.budget > 0 ? (overBudgetAmount / costCenter.budget) * 100 : 0;

        return (
            <div onClick={() => onSelectCostCenter(costCenter)} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 flex flex-col justify-between h-full cursor-pointer hover:shadow-lg hover:border-primary-500 dark:hover:border-primary-500 transition-all duration-200">
                <div>
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-lg font-bold text-primary-600 dark:text-primary-400">{costCenter.name} ({costCenter.id})</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Gerenciado por {costCenter.manager}</p>
                        </div>
                        <div className="group relative">
                            {variancePercentage > 5 && <FlagIcon color="text-red-500" />}
                            {variancePercentage > 0 && variancePercentage <= 5 && <FlagIcon color="text-yellow-500" />}
                        </div>
                    </div>
                    <div className="mt-4">
                        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-1">
                            <span>Gasto: R${costCenter.spent.toLocaleString()}</span>
                            <span>Orçamento: R${costCenter.budget.toLocaleString()}</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                            <div className={`${progressBarColor} h-2.5 rounded-full`} style={{ width: `${Math.min(percentageSpent, 100)}%` }}></div>
                        </div>
                        <div className="text-right text-xs mt-1 text-gray-500 dark:text-gray-400">{percentageSpent.toFixed(2)}% do orçamento utilizado</div>
                    </div>
                </div>
                <button onClick={(e) => { e.stopPropagation(); alert('Funcionalidade de revisão em desenvolvimento.');}} className="mt-4 text-sm w-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-semibold py-2 px-4 rounded-lg transition">
                    Revisar Orçamento
                </button>
            </div>
        );
    };

    const SearchIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
        <svg aria-hidden="true" viewBox="0 0 20 20" fill="currentColor" {...props}>
            <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
        </svg>
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap justify-between items-center gap-4">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Centros de Custo</h1>
                
                <div className="flex items-center gap-4 flex-wrap">
                    <div className="flex items-center gap-2">
                        <select 
                            id="vertical-filter" 
                            value={selectedVertical} 
                            onChange={(e) => setSelectedVertical(e.target.value)} 
                            className="block w-full md:w-auto pl-3 pr-10 py-2 text-base border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
                            aria-label="Filtrar por Área"
                        >
                            {verticals.map(v => (<option key={v} value={v}>{v === 'all' ? 'Todas as Áreas' : v}</option>))}
                        </select>
                        <div className="relative">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                               <SearchIcon className="h-5 w-5 text-gray-400" />
                            </div>
                            <input 
                                type="text" 
                                id="search-filter" 
                                value={searchTerm} 
                                onChange={(e) => setSearchTerm(e.target.value)} 
                                placeholder="Buscar por Nome ou ID..." 
                                className="block w-full md:w-64 pl-10 pr-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-sm shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500" 
                            />
                        </div>
                    </div>

                    <div className="flex items-center space-x-2">
                        <button onClick={onShowAddVertical} className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition text-sm font-semibold">
                            Nova Área
                        </button>
                        <button onClick={onShowAddCostCenter} className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition text-sm font-semibold">
                            Novo Centro de Custo
                        </button>
                    </div>
                </div>
            </div>

            <div className="space-y-8">
                {Object.keys(groupedByVertical).length > 0 ? (
                    Object.keys(groupedByVertical).map((vertical) => (
                        <section key={vertical}>
                            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white pb-2 mb-4 border-b border-gray-200 dark:border-gray-700">{vertical}</h2>
                            <div className="grid grid-cols-[repeat(auto-fill,minmax(22rem,1fr))] gap-6">
                                {groupedByVertical[vertical].map(cc => (<CostCenterCard key={cc.id} costCenter={cc} />))}
                            </div>
                        </section>
                    ))
                ) : (
                    <div className="text-center py-12 bg-white dark:bg-gray-800/50 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" /></svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Nenhum resultado</h3>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Nenhum centro de custo encontrado com os filtros aplicados.</p>
                    </div>
                )}
            </div>
        </div>
    );
};


// --- MAIN COMPONENT ---

interface CostCentersProps {
    costCenters: CostCenter[];
    expenses: Expense[];
    verticals: string[];
    onAddCostCenter: (cc: Omit<CostCenter, 'spent'>) => void;
    onAddVertical: (vertical: string) => void;
}

export const CostCenters: React.FC<CostCentersProps> = ({ costCenters, expenses, verticals, onAddCostCenter, onAddVertical }) => {
    const [selectedCostCenter, setSelectedCostCenter] = useState<CostCenter | null>(null);
    const [showAddCCModal, setShowAddCCModal] = useState(false);
    const [showAddVerticalModal, setShowAddVerticalModal] = useState(false);

    const expensesForSelectedCC = useMemo(() => {
        if (!selectedCostCenter) return [];
        return expenses.filter(e => e.costCenter === selectedCostCenter.name);
    }, [selectedCostCenter, expenses]);
    
    if (selectedCostCenter) {
        return <CostCenterDetail 
                    costCenter={selectedCostCenter}
                    expenses={expensesForSelectedCC} 
                    onBack={() => setSelectedCostCenter(null)}
                />;
    }

    return (
        <>
            {showAddCCModal && <AddCostCenterModal verticals={verticals} onAdd={onAddCostCenter} onClose={() => setShowAddCCModal(false)} />}
            {showAddVerticalModal && <AddVerticalModal onAdd={onAddVertical} onClose={() => setShowAddVerticalModal(false)} />}
            <CostCentersList
                costCenters={costCenters}
                onSelectCostCenter={setSelectedCostCenter}
                onShowAddCostCenter={() => setShowAddCCModal(true)}
                onShowAddVertical={() => setShowAddVerticalModal(true)}
            />
        </>
    );
};