// Finance App Types

export type ExpenseCategory = 
  | 'moradia'
  | 'servicos'
  | 'mensalidades'
  | 'supermercado'
  | 'assinaturas'
  | 'pessoal'
  | 'transporte'
  | 'saude'
  | 'lazer'
  | 'outros';

export type PaymentMethod = 'pix' | 'credito' | 'debito' | 'dinheiro' | 'boleto';

export type IncomeType = 'salario' | 'extra' | 'dividendos' | 'freelance' | 'saldo_anterior' | 'outros';

export interface Income {
  id: string;
  description: string;
  type: IncomeType;
  value: number;
  date: string;
}

export interface FixedExpense {
  id: string;
  description: string;
  category: ExpenseCategory;
  value: number;
  dueDate: number; // day of month
  paymentMethod: PaymentMethod;
  isPaid: boolean;
}

export interface VariableExpense {
  id: string;
  description: string;
  category: ExpenseCategory;
  value: number;
  date: string;
  isEssential: boolean;
  paymentMethod: PaymentMethod;
}

export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: string;
}

export interface MonthlyData {
  month: number; // 0-11
  year: number;
  incomes: Income[];
  fixedExpenses: FixedExpense[];
  variableExpenses: VariableExpense[];
  savingsGoals: SavingsGoal[];
}

export interface FinanceState {
  currentMonth: number;
  currentYear: number;
  monthlyData: MonthlyData[];
}

export const CATEGORY_INFO: Record<ExpenseCategory, { label: string; icon: string; color: string }> = {
  moradia: { label: 'Moradia', icon: 'Home', color: 'hsl(221, 83%, 53%)' },
  servicos: { label: 'Serviços', icon: 'Zap', color: 'hsl(45, 93%, 47%)' },
  mensalidades: { label: 'Mensalidades', icon: 'GraduationCap', color: 'hsl(262, 83%, 58%)' },
  supermercado: { label: 'Supermercado', icon: 'ShoppingCart', color: 'hsl(142, 71%, 45%)' },
  assinaturas: { label: 'Assinaturas', icon: 'Tv', color: 'hsl(346, 77%, 49%)' },
  pessoal: { label: 'Pessoal', icon: 'User', color: 'hsl(199, 89%, 48%)' },
  transporte: { label: 'Transporte', icon: 'Car', color: 'hsl(25, 95%, 53%)' },
  saude: { label: 'Saúde', icon: 'Heart', color: 'hsl(0, 84%, 60%)' },
  lazer: { label: 'Lazer', icon: 'Gamepad2', color: 'hsl(280, 65%, 60%)' },
  outros: { label: 'Outros', icon: 'MoreHorizontal', color: 'hsl(215, 14%, 45%)' },
};

export const PAYMENT_METHOD_INFO: Record<PaymentMethod, { label: string; icon: string }> = {
  pix: { label: 'PIX', icon: 'QrCode' },
  credito: { label: 'Crédito', icon: 'CreditCard' },
  debito: { label: 'Débito', icon: 'Wallet' },
  dinheiro: { label: 'Dinheiro', icon: 'Banknote' },
  boleto: { label: 'Boleto', icon: 'FileText' },
};

export const INCOME_TYPE_INFO: Record<IncomeType, { label: string; icon: string }> = {
  salario: { label: 'Salário', icon: 'Briefcase' },
  extra: { label: 'Extra', icon: 'Plus' },
  dividendos: { label: 'Dividendos', icon: 'TrendingUp' },
  freelance: { label: 'Freelance', icon: 'Laptop' },
  saldo_anterior: { label: 'Saldo Anterior', icon: 'History' },
  outros: { label: 'Outros', icon: 'MoreHorizontal' },
};

export const MONTHS = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];
