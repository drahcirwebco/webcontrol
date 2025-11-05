import React, { useState } from 'react';
import type { Invoice } from '../types';

const statusColors: { [key in Invoice['status']]: string } = {
  Paga: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  Pendente: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  Atrasada: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
};

const DownloadIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

const InvoiceRow: React.FC<{ invoice: Invoice }> = ({ invoice }) => {
  return (
    <tr className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800">
      <td className="py-3 px-6 text-left">{invoice.id}</td>
      <td className="py-3 px-6 text-left font-medium">{invoice.supplier}</td>
      <td className="py-3 px-6 text-left">{new Date(invoice.issue_date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</td>
      <td className="py-3 px-6 text-right">R${invoice.amount.toFixed(2)}</td>
      <td className="py-3 px-6 text-center">
        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusColors[invoice.status]}`}>
          {invoice.status}
        </span>
      </td>
      <td className="py-3 px-6 text-center">
        <a href={invoice.pdf_url} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-200">
          <DownloadIcon />
        </a>
      </td>
    </tr>
  );
};

const ImportInvoiceModal: React.FC<{ onClose: () => void }> = ({ onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-lg">
            <h3 className="text-lg font-semibold mb-4">Importar Nota Fiscal (PDF)</h3>
            <div className="space-y-4">
                 <div>
                    <label htmlFor="pdf-file" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Arquivo PDF da Nota</label>
                    <input 
                        type="file" 
                        id="pdf-file"
                        accept=".pdf"
                        className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                    />
                </div>
                 <div>
                    <label htmlFor="supplier" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Fornecedor</label>
                    <input type="text" id="supplier" className="mt-1 block w-full bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2" placeholder="Nome do Fornecedor"/>
                </div>
                 <div>
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Valor</label>
                    <input type="number" id="amount" className="mt-1 block w-full bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2" placeholder="0.00"/>
                </div>
            </div>
            <div className="mt-6 flex justify-end space-x-2">
                <button onClick={onClose} className="px-4 py-2 rounded-lg text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600">Cancelar</button>
                <button onClick={() => { alert('Nota Fiscal importada com sucesso!'); onClose(); }} className="px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700">Importar e Salvar</button>
            </div>
        </div>
    </div>
);

interface InvoicesProps {
  invoices: Invoice[];
}

export const Invoices: React.FC<InvoicesProps> = ({ invoices }) => {
    const [showImportModal, setShowImportModal] = useState(false);
    return (
        <div className="space-y-6">
            {showImportModal && <ImportInvoiceModal onClose={() => setShowImportModal(false)} />}
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Gerenciamento de Notas Fiscais</h1>
                 <button onClick={() => setShowImportModal(true)} className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition">
                    Importar Nota Fiscal
                </button>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Todas as Notas</h2>
                    {/* Placeholder for filters */}
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white dark:bg-gray-800">
                        <thead>
                        <tr className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 uppercase text-sm leading-normal">
                            <th className="py-3 px-6 text-left">ID da Nota</th>
                            <th className="py-3 px-6 text-left">Fornecedor</th>
                            <th className="py-3 px-6 text-left">Data de Emissão</th>
                            <th className="py-3 px-6 text-right">Valor</th>
                            <th className="py-3 px-6 text-center">Status</th>
                            <th className="py-3 px-6 text-center">PDF</th>
                        </tr>
                        </thead>
                        <tbody className="text-gray-700 dark:text-gray-200 text-sm font-light">
                        {invoices.map(invoice => (
                            <InvoiceRow key={invoice.id} invoice={invoice} />
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};