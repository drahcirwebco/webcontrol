export type Theme = 'light' | 'dark';
export type View = 'dashboard' | 'expenses' | 'costCenters' | 'budgetVsActual' | 'reports' | 'invoices' | 'users';

export enum ExpenseStatus {
  Approved = 'Aprovado',
  Pending = 'Pendente',
  Rejected = 'Rejeitado',
}

export enum UserRole {
  Admin = 'admin',
  Director = 'director',
  Manager = 'manager'
}

export interface UserProfile {
  id: string;
  full_name: string;
  email?: string;
  role: UserRole;
  vertical_id?: number | null;
  cost_center_id?: number | null;
  // Optional fields for display purposes
  vertical_name?: string;
  cost_center_name?: string;
}

export interface Expense {
  id: string; // Corresponds to expense_code
  date: string;
  description: string;
  supplier: string;
  costCenter: string;
  amount: number;
  status: ExpenseStatus;
}

export interface CostCenter {
  id: string; // Corresponds to code
  db_id: number; // The actual primary key from the DB
  name: string;
  manager: string;
  budget: number;
  spent: number;
  vertical: string;
  vertical_id: number;
  subgroup: string;
}

export interface Vertical {
    id: number;
    name: string;
}

export interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  lastGenerated: string;
}

export interface BudgetVsActualData {
  name: string;
  budget: number;
  actual: number;
  variance: number;
}

export interface Invoice {
    id: string; // Corresponds to invoice_code
    supplier: string;
    issue_date: string; // Changed from issueDate to match DB
    amount: number;
    pdf_url: string; // Changed from pdfUrl to match DB
    status: 'Paga' | 'Pendente' | 'Atrasada';
}

export interface HistoricalData {
    month: string;
    spent: number;
}