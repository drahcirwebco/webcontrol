import React from 'react';
import type { View } from '../types';
import { DashboardIcon } from './icons/DashboardIcon';
import { ExpensesIcon } from './icons/ExpensesIcon';
import { CostCentersIcon } from './icons/CostCentersIcon';
import { BudgetIcon } from './icons/BudgetIcon';
import { ReportsIcon } from './icons/ReportsIcon';

interface SidebarProps {
  currentView: View;
  setCurrentView: (view: View) => void;
}

const NavItem: React.FC<{
  view: View;
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}> = ({ view, label, icon, isActive, onClick }) => {
  return (
    <a
      href="#"
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
      className={`flex items-center p-3 my-1 rounded-lg transition-colors duration-200 ${
        isActive
          ? 'bg-primary-600 text-white'
          : 'text-gray-600 dark:text-gray-300 hover:bg-primary-100 dark:hover:bg-gray-700'
      }`}
    >
      {icon}
      <span className="ml-4 text-sm font-medium">{label}</span>
    </a>
  );
};

// Fix: Define a type for navigation items to ensure `view` is of type `View`.
interface NavItemData {
  view: View;
  label: string;
  icon: React.ReactNode;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView }) => {
  // Fix: Explicitly type `navItems` with `NavItemData[]`.
  const navItems: NavItemData[] = [
    { view: 'dashboard', label: 'Dashboard', icon: <DashboardIcon className="w-5 h-5" /> },
    { view: 'expenses', label: 'Despesas', icon: <ExpensesIcon className="w-5 h-5" /> },
    { view: 'costCenters', label: 'Centros de Custo', icon: <CostCentersIcon className="w-5 h-5" /> },
    { view: 'budgetVsActual', label: 'Orçado vs. Realizado', icon: <BudgetIcon className="w-5 h-5" /> },
    { view: 'reports', label: 'Relatórios', icon: <ReportsIcon className="w-5 h-5" /> },
  ];

  return (
    <aside className="w-64 flex-shrink-0 bg-white dark:bg-gray-800 p-4 border-r border-gray-200 dark:border-gray-700">
      <div className="flex items-center mb-6">
        <div className="p-2 bg-primary-600 rounded-lg">
          <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <h1 className="ml-3 text-xl font-bold text-gray-800 dark:text-white">Web Control</h1>
      </div>
      <nav>
        {navItems.map(item => (
          <NavItem
            key={item.view}
            view={item.view}
            label={item.label}
            icon={item.icon}
            isActive={currentView === item.view}
            onClick={() => setCurrentView(item.view)}
          />
        ))}
      </nav>
    </aside>
  );
};