import React from 'react';
import type { Theme, View, UserProfile } from '../types';
import { UserRole } from '../types';
import { supabase } from '../lib/supabaseClient';
import { DashboardIcon } from './icons/DashboardIcon';
import { ExpensesIcon } from './icons/ExpensesIcon';
import { CostCentersIcon } from './icons/CostCentersIcon';
import { BudgetIcon } from './icons/BudgetIcon';
import { ReportsIcon } from './icons/ReportsIcon';
import { InvoiceIcon } from './icons/InvoiceIcon';
import { UsersIcon } from './icons/UsersIcon';

const SunIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
);

const MoonIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

const LogoutIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <polyline points="16 17 21 12 16 7" />
        <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
);


const ThemeToggle: React.FC<{ theme: Theme; toggleTheme: () => void }> = ({ theme, toggleTheme }) => (
  <button
    onClick={toggleTheme}
    className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
    aria-label={`Mudar para tema ${theme === 'light' ? 'escuro' : 'claro'}`}
  >
    {theme === 'light' ? <MoonIcon className="h-6 w-6" /> : <SunIcon className="h-6 w-6" />}
  </button>
);

interface NavItemData {
  view: View;
  label: string;
  icon: React.ReactNode;
  adminOnly?: boolean;
}

interface HeaderProps {
  theme: Theme;
  toggleTheme: () => void;
  currentView: View;
  setCurrentView: (view: View) => void;
  userProfile: UserProfile | null;
}

export const Header: React.FC<HeaderProps> = ({ theme, toggleTheme, currentView, setCurrentView, userProfile }) => {
  const navItems: NavItemData[] = [
    { view: 'dashboard', label: 'Dashboard', icon: <DashboardIcon className="w-5 h-5 mr-2" /> },
    { view: 'expenses', label: 'Despesas', icon: <ExpensesIcon className="w-5 h-5 mr-2" /> },
    { view: 'costCenters', label: 'Centros de Custo', icon: <CostCentersIcon className="w-5 h-5 mr-2" /> },
    { view: 'budgetVsActual', label: 'Orçado vs. Realizado', icon: <BudgetIcon className="w-5 h-5 mr-2" /> },
    { view: 'invoices', label: 'Notas Fiscais', icon: <InvoiceIcon className="w-5 h-5 mr-2" /> },
    { view: 'reports', label: 'Relatórios', icon: <ReportsIcon className="w-5 h-5 mr-2" /> },
    { view: 'users', label: 'Usuários', icon: <UsersIcon className="w-5 h-5 mr-2" />, adminOnly: true },
  ];
  
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <header className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="flex items-center">
        <div className="p-2 bg-primary-600 rounded-lg">
          <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <h1 className="ml-3 text-xl font-bold text-gray-800 dark:text-white">Web Control</h1>
      </div>
      
      <nav className="flex items-center space-x-1">
        {navItems.map(item => {
          if (item.adminOnly && userProfile?.role !== UserRole.Admin) {
            return null;
          }
          return (
            <a
                key={item.view}
                href="#"
                onClick={(e) => {
                e.preventDefault();
                setCurrentView(item.view);
                }}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                currentView === item.view
                    ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/50 dark:text-primary-300'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
            >
                {item.icon}
                {item.label}
            </a>
          );
        })}
      </nav>

      <div className="flex items-center space-x-4">
        <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
        <div className="flex items-center space-x-2">
            <div className="text-right">
                <div className="text-sm font-medium text-gray-800 dark:text-white">{userProfile?.full_name}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 capitalize">{userProfile?.role}</div>
            </div>
            <button 
                onClick={handleLogout}
                className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                aria-label="Sair"
            >
                <LogoutIcon className="h-6 w-6" />
            </button>
        </div>
      </div>
    </header>
  );
};