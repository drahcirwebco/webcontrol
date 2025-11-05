import type { Expense, CostCenter, ReportTemplate, BudgetVsActualData, Invoice, HistoricalData } from '../types';
import { ExpenseStatus } from '../types';

export const mockExpenses: Expense[] = [
  { id: 'EXP001', date: '2023-10-01', description: 'Material de Escritório', supplier: 'Papelaria Central', costCenter: 'Admin', amount: 250.75, status: ExpenseStatus.Approved },
  { id: 'EXP002', date: '2023-10-03', description: 'Hospedagem de Servidor na Nuvem', supplier: 'CloudProvider Inc.', costCenter: 'IT', amount: 1200.00, status: ExpenseStatus.Approved },
  { id: 'EXP003', date: '2023-10-05', description: 'Anúncios de Campanha de Marketing', supplier: 'Agência Criativa', costCenter: 'Marketing', amount: 5500.00, status: ExpenseStatus.Approved },
  { id: 'EXP004', date: '2023-10-06', description: 'Almoço da Equipe', supplier: 'Restaurante Saboroso', costCenter: 'RH', amount: 320.50, status: ExpenseStatus.Approved },
  { id: 'EXP005', date: '2023-10-10', description: 'Nova Licença de Software', supplier: 'SaaS Solutions', costCenter: 'IT', amount: 800.00, status: ExpenseStatus.Pending },
  { id: 'EXP006', date: '2023-10-12', description: 'Despesas de Viagem de Cliente', supplier: 'Companhia Aérea FlyHigh', costCenter: 'Vendas', amount: 1850.25, status: ExpenseStatus.Approved },
  { id: 'EXP007', date: '2023-10-15', description: 'Serviços de Consultoria', supplier: 'Consultores Associados', costCenter: 'Admin', amount: 3000.00, status: ExpenseStatus.Approved },
  { id: 'EXP008', date: '2023-10-18', description: 'Gadget Desnecessário', supplier: 'Tech Gadgets', costCenter: 'IT', amount: 450.00, status: ExpenseStatus.Rejected },
  { id: 'EXP009', date: '2023-10-20', description: 'Promoção em Mídias Sociais', supplier: 'Agência Criativa', costCenter: 'Marketing', amount: 1500.00, status: ExpenseStatus.Pending },
  { id: 'EXP010', date: '2023-10-22', description: 'Taxa de Agência de Recrutamento', supplier: 'Talent Finders', costCenter: 'RH', amount: 4000.00, status: ExpenseStatus.Approved },
  { id: 'EXP011', date: '2023-10-25', description: 'Ferramenta de Análise de Dados', supplier: 'Data Insights LLC', costCenter: 'Marketing', amount: 2200.00, status: ExpenseStatus.Approved },
];

const calculateSpent = (costCenterName: string): number => {
    return mockExpenses
        .filter(e => e.costCenter === costCenterName && e.status === ExpenseStatus.Approved)
        .reduce((sum, e) => sum + e.amount, 0);
};

// FIX: Add missing db_id and vertical_id to satisfy the CostCenter type.
export const mockCostCenters: CostCenter[] = [
  { id: '91', db_id: 1, name: 'IT', manager: 'Alice Johnson', budget: 25000, spent: calculateSpent('IT'), vertical: '1P', vertical_id: 1, subgroup: 'Tecnologia' },
  { id: '89', db_id: 2, name: 'Marketing', manager: 'Bob Williams', budget: 40000, spent: calculateSpent('Marketing'), vertical: '1P', vertical_id: 1, subgroup: 'Comercial' },
  { id: '76', db_id: 3, name: 'Vendas', manager: 'Charlie Brown', budget: 35000, spent: calculateSpent('Vendas'), vertical: '1P', vertical_id: 1, subgroup: 'Comercial' },
  { id: '54', db_id: 4, name: 'RH', manager: 'Diana Prince', budget: 15000, spent: calculateSpent('RH'), vertical: 'Controladoria', vertical_id: 2, subgroup: 'Administrativo' },
  { id: '55', db_id: 5, name: 'Admin', manager: 'Ethan Hunt', budget: 10000, spent: calculateSpent('Admin'), vertical: 'Controladoria', vertical_id: 2, subgroup: 'Administrativo' },
  { id: '32', db_id: 6, name: 'Qualidade', manager: 'Frank Castle', budget: 12000, spent: 12800, vertical: '3P', vertical_id: 3, subgroup: 'Operações' },
  { id: '33', db_id: 7, name: 'SAC', manager: 'Grace Hopper', budget: 18000, spent: 17500, vertical: '3P', vertical_id: 3, subgroup: 'Operações' },
];

export const mockReportTemplates: ReportTemplate[] = [
    { id: 'RT01', name: 'Resumo Mensal de Despesas', description: 'Detalhamento de todas as despesas por centro de custo para o mês.', lastGenerated: '2023-10-01' },
    { id: 'RT02', name: 'Trimestral Orçado vs. Realizado', description: 'Visão geral de alto nível do desempenho do orçamento em todos os departamentos para o trimestre.', lastGenerated: '2023-09-30' },
    { id: 'RT03', name: 'Demonstrativo Financeiro Anual', description: 'Relatório financeiro abrangente para todo o ano fiscal.', lastGenerated: '2023-01-15' },
    { id: 'RT04', name: 'Revisão de Desempenho do Centro de Custo', description: 'Análise aprofundada dos gastos de um único centro de custo e sua aderência ao orçamento.', lastGenerated: '2023-10-05' },
];

export const getBudgetVsActualData = (): BudgetVsActualData[] => {
    return mockCostCenters.map(cc => ({
        name: cc.name,
        budget: cc.budget,
        actual: cc.spent,
        variance: cc.budget - cc.spent
    }));
};

// FIX: Rename issueDate to issue_date and pdfUrl to pdf_url to match the Invoice type.
export const mockInvoices: Invoice[] = [
    { id: 'NF001', supplier: 'CloudProvider Inc.', issue_date: '2023-10-02', amount: 1200.00, pdf_url: '#', status: 'Paga' },
    { id: 'NF002', supplier: 'Agência Criativa', issue_date: '2023-10-04', amount: 5500.00, pdf_url: '#', status: 'Paga' },
    { id: 'NF003', supplier: 'SaaS Solutions', issue_date: '2023-10-09', amount: 800.00, pdf_url: '#', status: 'Pendente' },
    { id: 'NF004', supplier: 'Consultores Associados', issue_date: '2023-09-14', amount: 3000.00, pdf_url: '#', status: 'Atrasada' },
    { id: 'NF005', supplier: 'Talent Finders', issue_date: '2023-10-21', amount: 4000.00, pdf_url: '#', status: 'Pendente' },
];

export const historicalData: HistoricalData[] = [
    { month: 'Jan', spent: 65000 },
    { month: 'Fev', spent: 58000 },
    { month: 'Mar', spent: 72000 },
    { month: 'Abr', spent: 68000 },
    { month: 'Mai', spent: 75000 },
    { month: 'Jun', spent: 71000 },
    { month: 'Jul', spent: 78000 },
    { month: 'Ago', spent: 82000 },
    { month: 'Set', spent: 79000 },
    { month: 'Out', spent: 85000 },
    { month: 'Nov', spent: 88000 },
    { month: 'Dez', spent: 92000 },
];

// FIX: Update function signature to accept `costCenters` and use it for calculations.
// This fixes a type error and a logical bug where stale mock data was used instead of live app state.
export const getFilteredData = (period: string, costCenters: CostCenter[]) => {
    let filteredHistoricalData = [...historicalData];
    let budgetMultiplier = 1;
    let spentMultiplier = 1;

    switch (period) {
        case 'last_6_months':
            filteredHistoricalData = historicalData.slice(-6);
            budgetMultiplier = 0.5;
            spentMultiplier = 0.48;
            break;
        case 'last_90_days':
            filteredHistoricalData = historicalData.slice(-3);
            budgetMultiplier = 0.25;
            spentMultiplier = 0.23;
            break;
        case 'this_year':
        default:
            // Full data
            break;
    }

    const filteredCostCenters = costCenters.map(cc => {
        return {
            ...cc,
            budget: Math.round(cc.budget * budgetMultiplier),
            spent: Math.round(cc.spent * spentMultiplier),
        }
    });

    const filteredBudgetVsActualData = filteredCostCenters.map(cc => ({
        name: cc.name,
        budget: cc.budget,
        actual: cc.spent,
        variance: cc.budget - cc.spent
    }));

    return {
        costCenters: filteredCostCenters,
        historicalData: filteredHistoricalData,
        budgetVsActualData: filteredBudgetVsActualData,
    };
};
