import React, { useState, useMemo } from 'react';
import type { Expense, CostCenter } from '../types';
import { ExpenseStatus } from '../types';

const statusColors: { [key in ExpenseStatus]: string } = {
  [ExpenseStatus.Approved]: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  [ExpenseStatus.Pending]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  [ExpenseStatus.Rejected]: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
};

const WarningIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M12 2L2 22h20L12 2z"></path><line x1="12" y1="8" x2="12" y2="16"></line><line x1="12" y1="20" x2="12.01" y2="20"></line>
    </svg>
);


const ExpenseRow: React.FC<{ 
    expense: Expense; 
    isNewSupplier: boolean;
    onUpdateStatus: (id: string, status: ExpenseStatus) => void;
}> = ({ expense, isNewSupplier, onUpdateStatus }) => {
  return (
    <tr className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800">
      <td className="py-3 px-6 text-left">{expense.id}</td>
      <td className="py-3 px-6 text-left">{new Date(expense.date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</td>
      <td className="py-3 px-6 text-left">{expense.description}</td>
      <td className="py-3 px-6 text-left flex items-center">
        {expense.supplier}
        {isNewSupplier && (
          <div className="ml-2 group relative">
            <WarningIcon className="text-yellow-500" />
            <span className="absolute left-1/2 -translate-x-1/2 -top-10 w-max bg-gray-900 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity">
              Fornecedor não recorrente neste CC
            </span>
          </div>
        )}
      </td>
      <td className="py-3 px-6 text-left">{expense.costCenter}</td>
      <td className="py-3 px-6 text-right">R${expense.amount.toFixed(2)}</td>
      <td className="py-3 px-6 text-center">
        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusColors[expense.status]}`}>
          {expense.status}
        </span>
      </td>
      <td className="py-3 px-6 text-center">
        {expense.status === ExpenseStatus.Pending && (
            <div className="flex items-center justify-center space-x-2">
                <button 
                    onClick={() => onUpdateStatus(expense.id, ExpenseStatus.Approved)}
                    className="px-2 py-1 text-xs font-semibold rounded-md bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/50 dark:text-green-300 dark:hover:bg-green-900"
                    aria-label={`Aprovar despesa ${expense.id}`}
                >
                    Aprovar
                </button>
                 <button 
                    onClick={() => onUpdateStatus(expense.id, ExpenseStatus.Rejected)}
                    className="px-2 py-1 text-xs font-semibold rounded-md bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/50 dark:text-red-300 dark:hover:bg-red-900"
                    aria-label={`Rejeitar despesa ${expense.id}`}
                >
                    Rejeitar
                </button>
            </div>
        )}
      </td>
    </tr>
  );
};

const ImportCsvModal: React.FC<{onClose: () => void; onImport: (newExpenses: Expense[]) => void}> = ({onClose, onImport}) => {
    const [file, setFile] = useState<File | null>(null);

    const handleImport = () => {
        if (!file) {
            alert('Por favor, selecione um arquivo para importar.');
            return;
        }

        // Simulate import by adding mock data
        const simulatedImportedExpenses: Expense[] = [
            { id: `EXP${Math.floor(Math.random() * 900) + 100}`, date: new Date().toISOString(), description: 'Assinatura Software XYZ', supplier: 'XYZ Corp', costCenter: 'IT', amount: 150.00, status: ExpenseStatus.Pending },
            { id: `EXP${Math.floor(Math.random() * 900) + 100}`, date: new Date().toISOString(), description: 'Café para o escritório', supplier: 'Supermercado ABC', costCenter: 'Admin', amount: 85.50, status: ExpenseStatus.Pending },
        ];
        
        onImport(simulatedImportedExpenses);
        alert('Importação simulada com sucesso!');
        onClose();
    }

    return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Importar Despesas de CSV (TOTVS)</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Selecione o arquivo CSV exportado do sistema TOTVS. A ferramenta irá tratar e importar os dados automaticamente.
            </p>
            <input 
                type="file" 
                accept=".csv"
                onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
            />
            <div className="mt-6 flex justify-end space-x-2">
                <button onClick={onClose} className="px-4 py-2 rounded-lg text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600">Cancelar</button>
                <button onClick={handleImport} disabled={!file} className="px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 disabled:bg-primary-300 disabled:cursor-not-allowed">Importar</button>
            </div>
        </div>
    </div>
)};

const AddExpenseModal: React.FC<{
    onClose: () => void;
    onAdd: (expense: Omit<Expense, 'id' | 'status'>) => void;
    costCenters: CostCenter[];
}> = ({ onClose, onAdd, costCenters }) => {
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0],
        description: '',
        supplier: '',
        costCenter: costCenters[0]?.name || '',
        amount: 0,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.description || !formData.supplier || formData.amount <= 0) {
            alert('Por favor, preencha todos os campos obrigatórios.');
            return;
        }
        onAdd({
            ...formData,
            amount: Number(formData.amount)
        });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-lg space-y-4">
                 <h3 className="text-lg font-semibold">Adicionar Nova Despesa</h3>
                 
                 <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Descrição</label>
                    <input type="text" name="description" id="description" value={formData.description} onChange={handleChange} className="mt-1 block w-full bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2" required/>
                </div>
                 <div>
                    <label htmlFor="supplier" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Fornecedor</label>
                    <input type="text" name="supplier" id="supplier" value={formData.supplier} onChange={handleChange} className="mt-1 block w-full bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2" required/>
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Valor (R$)</label>
                        <input type="number" name="amount" id="amount" value={formData.amount} onChange={handleChange} className="mt-1 block w-full bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2" required min="0.01" step="0.01"/>
                    </div>
                     <div>
                        <label htmlFor="costCenter" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Centro de Custo</label>
                        <select name="costCenter" id="costCenter" value={formData.costCenter} onChange={handleChange} className="mt-1 block w-full bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2">
                           {costCenters.map(cc => <option key={cc.id} value={cc.name}>{cc.name}</option>)}
                        </select>
                    </div>
                     <div>
                        <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Data</label>
                        <input type="date" name="date" id="date" value={formData.date} onChange={handleChange} className="mt-1 block w-full bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2"/>
                    </div>
                 </div>

                 <div className="mt-6 flex justify-end space-x-2">
                    <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600">Cancelar</button>
                    <button type="submit" className="px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700">Salvar Despesa</button>
                </div>
            </form>
        </div>
    );
};

interface ExpensesProps {
  expenses: Expense[];
  costCenters: CostCenter[];
  onUpdateExpenseStatus: (expenseId: string, newStatus: ExpenseStatus) => void;
  onAddExpense: (newExpense: Omit<Expense, 'id' | 'status'>) => void;
  onImportExpenses: (newExpenses: Expense[]) => void;
}

export const Expenses: React.FC<ExpensesProps> = ({ expenses, costCenters, onUpdateExpenseStatus, onAddExpense, onImportExpenses }) => {
  const [showImportModal, setShowImportModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    costCenter: 'all',
    status: 'all',
  });

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({
      startDate: '',
      endDate: '',
      costCenter: 'all',
      status: 'all',
    });
  };

  const handleAddExpenseSubmit = (newExpenseData: Omit<Expense, 'id' | 'status'>) => {
    onAddExpense(newExpenseData);
    setShowAddModal(false);
  };

  const filteredExpenses = useMemo(() => {
    return expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      // Adjust for timezone issues by comparing date strings
      const startDate = filters.startDate ? new Date(filters.startDate + 'T00:00:00') : null;
      const endDate = filters.endDate ? new Date(filters.endDate + 'T23:59:59') : null;

      if (startDate && expenseDate < startDate) {
        return false;
      }
      if (endDate && expenseDate > endDate) {
        return false;
      }
      if (filters.costCenter !== 'all' && expense.costCenter !== filters.costCenter) {
        return false;
      }
      if (filters.status !== 'all' && expense.status !== filters.status) {
        return false;
      }
      return true;
    });
  }, [expenses, filters]);

  const supplierHistory = useMemo(() => {
    const history = new Map<string, Set<string>>();
    expenses.forEach(exp => {
      if (!history.has(exp.costCenter)) {
        history.set(exp.costCenter, new Set());
      }
      history.get(exp.costCenter)!.add(exp.supplier);
    });

    const recurringSuppliers = new Map<string, Set<string>>();
    for (const [cc, suppliers] of history.entries()) {
        const counts = new Map<string, number>();
        expenses.filter(e => e.costCenter === cc).forEach(e => {
            counts.set(e.supplier, (counts.get(e.supplier) || 0) + 1);
        });
        recurringSuppliers.set(cc, new Set([...suppliers].filter(s => (counts.get(s) || 0) > 1)));
    }
    return recurringSuppliers;
  }, [expenses]);

  const isNewSupplier = (expense: Expense) => {
      const recurring = supplierHistory.get(expense.costCenter);
      return !recurring || !recurring.has(expense.supplier);
  }

  return (
    <div className="space-y-6">
      {showImportModal && <ImportCsvModal onClose={() => setShowImportModal(false)} onImport={onImportExpenses} />}
      {showAddModal && <AddExpenseModal onClose={() => setShowAddModal(false)} onAdd={handleAddExpenseSubmit} costCenters={costCenters} />}
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Gerenciamento de Despesas</h1>
      
      <div className="p-4 bg-white dark:bg-gray-800/50 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex flex-wrap items-end gap-4">
        <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">De</label>
            <input type="date" name="startDate" id="startDate" value={filters.startDate} onChange={handleFilterChange} className="mt-1 block w-full bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 text-sm"/>
        </div>
        <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Até</label>
            <input type="date" name="endDate" id="endDate" value={filters.endDate} onChange={handleFilterChange} className="mt-1 block w-full bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 text-sm"/>
        </div>
        <div>
            <label htmlFor="costCenter" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Centro de Custo</label>
            <select name="costCenter" id="costCenter" value={filters.costCenter} onChange={handleFilterChange} className="mt-1 block w-full bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 text-sm">
                <option value="all">Todos</option>
                {costCenters.map(cc => <option key={cc.id} value={cc.name}>{cc.name}</option>)}
            </select>
        </div>
        <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
            <select name="status" id="status" value={filters.status} onChange={handleFilterChange} className="mt-1 block w-full bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 text-sm">
                <option value="all">Todos</option>
                {Object.values(ExpenseStatus).map(s => <option key={s} value={s}>{s}</option>)}
            </select>
        </div>
        <button onClick={clearFilters} className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-500 text-sm">
            Limpar Filtros
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Todas as Despesas ({filteredExpenses.length})</h2>
          <div className="space-x-2">
            <button onClick={() => setShowImportModal(true)} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition">
                Importar Despesas (CSV)
            </button>
            <button onClick={() => setShowAddModal(true)} className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition">
                Adicionar Despesa
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white dark:bg-gray-800">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">ID</th>
                <th className="py-3 px-6 text-left">Data</th>
                <th className="py-3 px-6 text-left">Descrição</th>
                <th className="py-3 px-6 text-left">Fornecedor</th>
                <th className="py-3 px-6 text-left">Centro de Custo</th>
                <th className="py-3 px-6 text-right">Valor</th>
                <th className="py-3 px-6 text-center">Status</th>
                <th className="py-3 px-6 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 dark:text-gray-200 text-sm font-light">
              {filteredExpenses.length > 0 ? (
                filteredExpenses.map(expense => (
                  <ExpenseRow 
                      key={expense.id} 
                      expense={expense} 
                      isNewSupplier={isNewSupplier(expense)}
                      onUpdateStatus={onUpdateExpenseStatus}
                  />
                ))
              ) : (
                <tr>
                    <td colSpan={8} className="text-center py-12 text-gray-500 dark:text-gray-400">
                        Nenhuma despesa encontrada com os filtros aplicados.
                    </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};