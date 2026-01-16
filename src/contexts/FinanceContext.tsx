import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  FinanceState, 
  MonthlyData, 
  Income, 
  FixedExpense, 
  VariableExpense, 
  SavingsGoal 
} from '@/types/finance';

interface FinanceContextType {
  state: FinanceState;
  currentMonthData: MonthlyData;
  
  // Month navigation
  setMonth: (month: number, year: number) => void;
  
  // Income operations
  addIncome: (income: Omit<Income, 'id'>) => void;
  updateIncome: (id: string, income: Partial<Income>) => void;
  deleteIncome: (id: string) => void;
  
  // Fixed expense operations
  addFixedExpense: (expense: Omit<FixedExpense, 'id'>) => void;
  updateFixedExpense: (id: string, expense: Partial<FixedExpense>) => void;
  deleteFixedExpense: (id: string) => void;
  
  // Variable expense operations
  addVariableExpense: (expense: Omit<VariableExpense, 'id'>) => void;
  updateVariableExpense: (id: string, expense: Partial<VariableExpense>) => void;
  deleteVariableExpense: (id: string) => void;
  
  // Savings goals operations
  addSavingsGoal: (goal: Omit<SavingsGoal, 'id'>) => void;
  updateSavingsGoal: (id: string, goal: Partial<SavingsGoal>) => void;
  deleteSavingsGoal: (id: string) => void;
  
  // Calculated values
  totalIncome: number;
  totalFixedExpenses: number;
  totalVariableExpenses: number;
  totalExpenses: number;
  availableBalance: number;
  percentageCommitted: number;
  totalSaved: number;
  
  // Backup operations
  exportData: () => string;
  importData: (jsonString: string) => boolean;
}

const STORAGE_KEY = 'finance-app-data';

const generateId = () => Math.random().toString(36).substring(2, 11);

const createEmptyMonthData = (month: number, year: number): MonthlyData => ({
  month,
  year,
  incomes: [],
  fixedExpenses: [],
  variableExpenses: [],
  savingsGoals: [],
});

const getInitialState = (): FinanceState => {
  const now = new Date();
  const savedData = localStorage.getItem(STORAGE_KEY);
  
  if (savedData) {
    try {
      return JSON.parse(savedData);
    } catch {
      console.error('Failed to parse saved data');
    }
  }
  
  return {
    currentMonth: now.getMonth(),
    currentYear: now.getFullYear(),
    monthlyData: [createEmptyMonthData(now.getMonth(), now.getFullYear())],
  };
};

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<FinanceState>(getInitialState);

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const getCurrentMonthData = useCallback((): MonthlyData => {
    const existing = state.monthlyData.find(
      (m) => m.month === state.currentMonth && m.year === state.currentYear
    );
    return existing || createEmptyMonthData(state.currentMonth, state.currentYear);
  }, [state.currentMonth, state.currentYear, state.monthlyData]);

  const updateMonthData = useCallback((updater: (data: MonthlyData) => MonthlyData) => {
    setState((prev) => {
      const monthIndex = prev.monthlyData.findIndex(
        (m) => m.month === prev.currentMonth && m.year === prev.currentYear
      );
      
      const currentData = monthIndex >= 0 
        ? prev.monthlyData[monthIndex] 
        : createEmptyMonthData(prev.currentMonth, prev.currentYear);
      
      const updatedData = updater(currentData);
      
      const newMonthlyData = monthIndex >= 0
        ? prev.monthlyData.map((m, i) => (i === monthIndex ? updatedData : m))
        : [...prev.monthlyData, updatedData];
      
      return { ...prev, monthlyData: newMonthlyData };
    });
  }, []);

  const setMonth = useCallback((month: number, year: number) => {
    setState((prev) => ({ ...prev, currentMonth: month, currentYear: year }));
  }, []);

  // Income operations
  const addIncome = useCallback((income: Omit<Income, 'id'>) => {
    updateMonthData((data) => ({
      ...data,
      incomes: [...data.incomes, { ...income, id: generateId() }],
    }));
  }, [updateMonthData]);

  const updateIncome = useCallback((id: string, updates: Partial<Income>) => {
    updateMonthData((data) => ({
      ...data,
      incomes: data.incomes.map((i) => (i.id === id ? { ...i, ...updates } : i)),
    }));
  }, [updateMonthData]);

  const deleteIncome = useCallback((id: string) => {
    updateMonthData((data) => ({
      ...data,
      incomes: data.incomes.filter((i) => i.id !== id),
    }));
  }, [updateMonthData]);

  // Fixed expense operations
  const addFixedExpense = useCallback((expense: Omit<FixedExpense, 'id'>) => {
    updateMonthData((data) => ({
      ...data,
      fixedExpenses: [...data.fixedExpenses, { ...expense, id: generateId() }],
    }));
  }, [updateMonthData]);

  const updateFixedExpense = useCallback((id: string, updates: Partial<FixedExpense>) => {
    updateMonthData((data) => ({
      ...data,
      fixedExpenses: data.fixedExpenses.map((e) => (e.id === id ? { ...e, ...updates } : e)),
    }));
  }, [updateMonthData]);

  const deleteFixedExpense = useCallback((id: string) => {
    updateMonthData((data) => ({
      ...data,
      fixedExpenses: data.fixedExpenses.filter((e) => e.id !== id),
    }));
  }, [updateMonthData]);

  // Variable expense operations
  const addVariableExpense = useCallback((expense: Omit<VariableExpense, 'id'>) => {
    updateMonthData((data) => ({
      ...data,
      variableExpenses: [...data.variableExpenses, { ...expense, id: generateId() }],
    }));
  }, [updateMonthData]);

  const updateVariableExpense = useCallback((id: string, updates: Partial<VariableExpense>) => {
    updateMonthData((data) => ({
      ...data,
      variableExpenses: data.variableExpenses.map((e) => (e.id === id ? { ...e, ...updates } : e)),
    }));
  }, [updateMonthData]);

  const deleteVariableExpense = useCallback((id: string) => {
    updateMonthData((data) => ({
      ...data,
      variableExpenses: data.variableExpenses.filter((e) => e.id !== id),
    }));
  }, [updateMonthData]);

  // Savings goals operations
  const addSavingsGoal = useCallback((goal: Omit<SavingsGoal, 'id'>) => {
    updateMonthData((data) => ({
      ...data,
      savingsGoals: [...data.savingsGoals, { ...goal, id: generateId() }],
    }));
  }, [updateMonthData]);

  const updateSavingsGoal = useCallback((id: string, updates: Partial<SavingsGoal>) => {
    updateMonthData((data) => ({
      ...data,
      savingsGoals: data.savingsGoals.map((g) => (g.id === id ? { ...g, ...updates } : g)),
    }));
  }, [updateMonthData]);

  const deleteSavingsGoal = useCallback((id: string) => {
    updateMonthData((data) => ({
      ...data,
      savingsGoals: data.savingsGoals.filter((g) => g.id !== id),
    }));
  }, [updateMonthData]);

  // Backup operations
  const exportData = useCallback(() => {
    return JSON.stringify(state, null, 2);
  }, [state]);

  const importData = useCallback((jsonString: string): boolean => {
    try {
      const data = JSON.parse(jsonString) as FinanceState;
      setState(data);
      return true;
    } catch {
      return false;
    }
  }, []);

  const currentMonthData = getCurrentMonthData();
  
  // Calculated values
  const totalIncome = currentMonthData.incomes.reduce((sum, i) => sum + i.value, 0);
  const totalFixedExpenses = currentMonthData.fixedExpenses.reduce((sum, e) => sum + e.value, 0);
  const totalVariableExpenses = currentMonthData.variableExpenses.reduce((sum, e) => sum + e.value, 0);
  const totalExpenses = totalFixedExpenses + totalVariableExpenses;
  const availableBalance = totalIncome - totalExpenses;
  const percentageCommitted = totalIncome > 0 ? (totalExpenses / totalIncome) * 100 : 0;
  const totalSaved = currentMonthData.savingsGoals.reduce((sum, g) => sum + g.currentAmount, 0);

  return (
    <FinanceContext.Provider
      value={{
        state,
        currentMonthData,
        setMonth,
        addIncome,
        updateIncome,
        deleteIncome,
        addFixedExpense,
        updateFixedExpense,
        deleteFixedExpense,
        addVariableExpense,
        updateVariableExpense,
        deleteVariableExpense,
        addSavingsGoal,
        updateSavingsGoal,
        deleteSavingsGoal,
        totalIncome,
        totalFixedExpenses,
        totalVariableExpenses,
        totalExpenses,
        availableBalance,
        percentageCommitted,
        totalSaved,
        exportData,
        importData,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};
