import React from 'react';
import { mockReportTemplates } from '../data/mockData';
import type { ReportTemplate } from '../types';

const DownloadIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

const ReportCard: React.FC<{ template: ReportTemplate }> = ({ template }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 flex flex-col justify-between">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{template.name}</h3>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{template.description}</p>
        <p className="mt-4 text-xs text-gray-400 dark:text-gray-500">Última Geração: {template.lastGenerated}</p>
      </div>
      <button className="mt-4 w-full flex items-center justify-center bg-primary-100 text-primary-700 dark:bg-primary-900/50 dark:text-primary-300 px-4 py-2 rounded-lg hover:bg-primary-200 dark:hover:bg-primary-900/80 transition font-semibold">
        <DownloadIcon className="w-5 h-5 mr-2" />
        Baixar
      </button>
    </div>
  );
};

export const Reports: React.FC = () => {
  return (
     <div className="space-y-6">
       <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Relatórios e Modelos</h1>
        <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition">
          Criar Novo Modelo
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockReportTemplates.map(template => (
          <ReportCard key={template.id} template={template} />
        ))}
      </div>
    </div>
  );
};