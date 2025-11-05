import React, { useState, useMemo } from 'react';
import type { BudgetVsActualData, CostCenter } from '../types';
import { BudgetVsActualChart } from './BudgetVsActualChart';

const FlagIcon: React.FC<{ color: string, className?: string }> = ({ color, className }) => (
    <svg className={`w-5 h-5 ${color} ${className}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M14.4 6L14 4H5v17h2v-7h5.6l.4 2h7V6h-5.6z" />
    </svg>
);

const JustificationModal: React.FC<{ data: BudgetVsActualData, onClose: () => void }> = ({ data, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-lg">
                <h3 className="text-lg font-semibold mb-2">Adicionar Justificativa</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Centro de Custo: <span className="font-bold">{data.name}</span>
                </p>
                <textarea 
                    rows={5} 
                    className="w-full bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm p-2"
                    placeholder="Explique o motivo da variação do orçamento..."
                />
                <div className="mt-4 flex justify-end space-x-2">
                    <button onClick={onClose} className="px-4 py-2 rounded-lg text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600">Cancelar</button>
                    <button onClick={() => { alert('Justificativa salva com sucesso!'); onClose(); }} className="px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700">Salvar</button>
                </div>
            </div>
        </div>
    );
};

const BvATableRow: React.FC<{ data: BudgetVsActualData; onJustify: () => void }> = ({ data, onJustify }) => {
  const varianceColor = data.variance >= 0 ? 'text-green-500' : 'text-red-500';
  const variancePercentage = data.budget > 0 ? (Math.abs(data.variance) / data.budget) * 100 : 0;
  
  let flag = null;
  if (data.variance < 0) { // Over budget
      const percentageOver = - (data.variance / data.budget) * 100;
      if (percentageOver > 5) {
          flag = <FlagIcon color="text-red-500" />;
      } else if (percentageOver > 0) {
          flag = <FlagIcon color="text-yellow-500" />;
      }
  }

  return (
    <tr className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800">
      <td className="py-3 px-6 text-left font-medium">{data.name}</td>
      <td className="py-3 px-6 text-right">R${data.budget.toLocaleString()}</td>
      <td className="py-3 px-6 text-right">R${data.actual.toLocaleString()}</td>
      <td className={`py-3 px-6 text-right font-semibold ${varianceColor}`}>
        R${data.variance.toLocaleString()} ({variancePercentage.toFixed(1)}%)
      </td>
       <td className="py-3 px-6 text-center">{flag}</td>
       <td className="py-3 px-6 text-center">
        {flag && (
             <button onClick={onJustify} className="text-xs bg-primary-100 text-primary-700 dark:bg-primary-900/50 dark:text-primary-300 px-2 py-1 rounded-md hover:bg-primary-200">
                Justificar
             </button>
        )}
       </td>
    </tr>
  );
};

interface BudgetVsActualProps {
    costCenters: CostCenter[];
}

export const BudgetVsActual: React.FC<BudgetVsActualProps> = ({ costCenters }) => {
  const data = useMemo(() => {
    return costCenters.map(cc => ({
        name: cc.name,
        budget: cc.budget,
        actual: cc.spent,
        variance: cc.budget - cc.spent
    }));
  }, [costCenters]);

  const [justifyingData, setJustifyingData] = useState<BudgetVsActualData | null>(null);

  return (
    <div className="space-y-6">
      {justifyingData && <JustificationModal data={justifyingData} onClose={() => setJustifyingData(null)} />}
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Análise Orçado vs. Realizado</h1>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Gráfico Orçado vs. Realizado</h3>
        <div className="h-96">
          <BudgetVsActualChart data={data} />
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Detalhamento</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white dark:bg-gray-800">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">Centro de Custo</th>
                <th className="py-3 px-6 text-right">Orçamento</th>
                <th className="py-3 px-6 text-right">Realizado</th>
                <th className="py-3 px-6 text-right">Variação</th>
                <th className="py-3 px-6 text-center">Status</th>
                <th className="py-3 px-6 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 dark:text-gray-200 text-sm font-light">
              {data.map(item => <BvATableRow key={item.name} data={item} onJustify={() => setJustifyingData(item)} />)}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};