import React, { useState, useEffect } from 'react';
import type { Session } from '@supabase/supabase-js';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { Expenses } from './components/Expenses';
import { CostCenters } from './components/CostCenters';
import { BudgetVsActual } from './components/BudgetVsActual';
import { Reports } from './components/Reports';
import { Invoices } from './components/Invoices';
import { Login } from './components/Login';
import { Users } from './components/Users';
import type { Theme, View, Expense, CostCenter, UserProfile, Vertical, Invoice } from './types';
import { ExpenseStatus, UserRole } from './types';
import { supabase } from './lib/supabaseClient';

const App: React.FC = () => {
  const [theme, setTheme] = useState<Theme>('light');
  const [session, setSession] = useState<Session | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [currentView, setCurrentView] = useState<View>('dashboard');
  
  // App Data State
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [costCenters, setCostCenters] = useState<CostCenter[]>([]);
  const [verticals, setVerticals] = useState<Vertical[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  // Theme management
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  // Auth management
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (!session) {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);
  
  // Data fetching based on user profile
  useEffect(() => {
    if (session?.user) {
      const fetchProfileAndData = async () => {
        setLoading(true);
        setError(null);
        setUserProfile(null);

        // 1. Fetch User Profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profileError || !profileData) {
          console.error('Error fetching profile:', profileError);
           if (profileError?.code === 'PGRST116') { // PostgREST code for "single() returned 0 rows"
             setError('Login bem-sucedido, mas seu perfil de usuário não foi encontrado no sistema. Por favor, entre em contato com o administrador para criar seu perfil.');
          } else {
             setError(`Ocorreu um erro ao carregar seu perfil: ${profileError?.message || 'Perfil não encontrado.'}`);
          }
          setLoading(false);
          return;
        }
        setUserProfile(profileData as UserProfile);

        // 2. Fetch App Data (RLS will filter it)
        const [verticalsRes, costCentersRes, expensesRes, invoicesRes] = await Promise.all([
            supabase.from('verticals').select('*'),
            supabase.from('cost_centers').select(`*, verticals(name)`),
            supabase.from('expenses').select(`*, cost_centers(name)`),
            supabase.from('invoices').select('*')
        ]);
        
        // Error handling
        if (verticalsRes.error) console.error('Error fetching verticals:', verticalsRes.error);
        if (costCentersRes.error) console.error('Error fetching cost centers:', costCentersRes.error);
        if (expensesRes.error) console.error('Error fetching expenses:', expensesRes.error);
        if (invoicesRes.error) console.error('Error fetching invoices:', invoicesRes.error);

        // 3. Transform and Set State
        setVerticals(verticalsRes.data || []);
        
        const transformedExpenses: Expense[] = expensesRes.data?.map((e: any) => ({
            id: e.expense_code,
            date: e.date,
            description: e.description,
            supplier: e.supplier,
            costCenter: e.cost_centers.name,
            amount: e.amount,
            status: e.status,
        })) || [];
        setExpenses(transformedExpenses);
        
        const transformedCostCenters: CostCenter[] = costCentersRes.data?.map((cc: any) => {
            const spent = transformedExpenses
                .filter(e => e.costCenter === cc.name && e.status === ExpenseStatus.Approved)
                .reduce((sum, e) => sum + e.amount, 0);
            return {
                id: cc.code,
                db_id: cc.id,
                name: cc.name,
                manager: cc.manager,
                budget: cc.budget,
                spent,
                vertical: cc.verticals.name,
                vertical_id: cc.vertical_id,
                subgroup: cc.subgroup,
            };
        }) || [];
        setCostCenters(transformedCostCenters);

        const transformedInvoices: Invoice[] = invoicesRes.data?.map((i: any) => ({
          id: i.invoice_code,
          supplier: i.supplier,
          issue_date: i.issue_date,
          amount: i.amount,
          pdf_url: i.pdf_url,
          status: i.status,
        })) || [];
        setInvoices(transformedInvoices);

        setLoading(false);
      };

      fetchProfileAndData();
    } else {
        // Clear data on logout
        setLoading(false);
        setUserProfile(null);
        setError(null);
        setExpenses([]);
        setCostCenters([]);
        setVerticals([]);
        setInvoices([]);
    }
  }, [session]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };
  
  // TODO: Convert these handlers to write to Supabase
  const handleUpdateExpenseStatus = (expenseId: string, newStatus: ExpenseStatus) => {
    setExpenses(prevExpenses =>
      prevExpenses.map(expense =>
        expense.id === expenseId ? { ...expense, status: newStatus } : expense
      )
    );
  };
  const handleAddExpense = (newExpenseData: Omit<Expense, 'id' | 'status'>) => {
    const newExpense: Expense = {
      id: `EXP${Math.floor(Math.random() * 9000) + 1000}`,
      status: ExpenseStatus.Pending,
      ...newExpenseData,
    };
    setExpenses(prev => [newExpense, ...prev]);
  };
  const handleImportExpenses = (newExpenses: Expense[]) => {
    setExpenses(prev => [...prev, ...newExpenses]);
  };
  const handleAddCostCenter = (newCostCenterData: Omit<CostCenter, 'spent' | 'db_id' | 'vertical_id'>) => {
      // This is a simplified version, needs proper DB insertion
      const newCostCenter: CostCenter = {
          ...newCostCenterData,
          spent: 0,
          db_id: Math.random(),
          vertical_id: Math.random()
      };
      setCostCenters(prev => [newCostCenter, ...prev]);
  };
  const handleAddVertical = (newVertical: string) => {
      if (newVertical) {
          // Simplified, needs DB insert
      }
  };


  if (!session) {
    return <Login />;
  }

  const renderView = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-xl font-semibold text-gray-500 dark:text-gray-400 animate-pulse">
            Carregando dados...
          </div>
        </div>
      );
    }

    // This error state is now critical for handling missing profiles
    if (error) {
       return (
        <div className="flex flex-col items-center justify-center h-full text-center p-6">
          <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">Ocorreu um Erro de Acesso</h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-md">{error}</p>
           <button 
              onClick={() => supabase.auth.signOut()}
              className="mt-6 px-6 py-2 rounded-lg bg-primary-600 text-white font-semibold hover:bg-primary-700 transition-colors"
           >
             Voltar para o Login
           </button>
        </div>
      );
    }
    
    // This state can briefly happen between loading and profile fetch, or if something unexpected happens
    if (!userProfile) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center p-6">
                 <h2 className="text-2xl font-bold text-yellow-600 dark:text-yellow-400 mb-4">Aguardando Perfil</h2>
                 <p className="text-gray-600 dark:text-gray-400 max-w-md">Verificando dados do usuário...</p>
                 <button 
                    onClick={() => supabase.auth.signOut()}
                    className="mt-6 px-4 py-2 text-sm rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 transition-colors"
                 >
                    Cancelar e Voltar
                </button>
            </div>
        );
    }
    
    switch (currentView) {
      case 'dashboard':
        return <Dashboard costCenters={costCenters} />;
      case 'expenses':
        return <Expenses 
                  expenses={expenses} 
                  costCenters={costCenters}
                  onUpdateExpenseStatus={handleUpdateExpenseStatus}
                  onAddExpense={handleAddExpense}
                  onImportExpenses={handleImportExpenses}
                />;
      case 'costCenters':
        return <CostCenters 
                  costCenters={costCenters}
                  expenses={expenses}
                  verticals={verticals.map(v => v.name)}
                  onAddCostCenter={handleAddCostCenter}
                  onAddVertical={handleAddVertical}
               />;
      case 'budgetVsActual':
        return <BudgetVsActual costCenters={costCenters} />;
      case 'reports':
        return <Reports />;
      case 'invoices':
        return <Invoices invoices={invoices} />;
      case 'users':
        if (userProfile.role !== UserRole.Admin) return <Dashboard costCenters={costCenters} />;
        return <Users verticals={verticals} costCenters={costCenters} />;
      default:
        return <Dashboard costCenters={costCenters}/>;
    }
  };
  
  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <Header 
        theme={theme} 
        toggleTheme={toggleTheme}
        currentView={currentView}
        setCurrentView={setCurrentView}
        userProfile={userProfile}
      />
      <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
        {renderView()}
      </main>
    </div>
  );
};

export default App;