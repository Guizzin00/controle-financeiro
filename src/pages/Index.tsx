import React, { useState, useEffect } from 'react';
import { FinanceProvider, useFinance } from '@/contexts/FinanceContext';
import { Header } from '@/components/finance/Header';
import { SummaryCards } from '@/components/finance/SummaryCards';
import { FinanceCharts } from '@/components/finance/FinanceCharts';
import { IncomeSection } from '@/components/finance/IncomeSection';
import { FixedExpensesSection } from '@/components/finance/FixedExpensesSection';
import { VariableExpensesSection } from '@/components/finance/VariableExpensesSection';
import { SavingsGoalsSection } from '@/components/finance/SavingsGoalsSection';
import { exportToExcel } from '@/lib/excelExport';

const FinanceApp: React.FC = () => {
  const { state, currentMonthData } = useFinance();
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('finance-dark-mode');
    if (saved === 'true') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('finance-dark-mode', (!isDarkMode).toString());
  };

const handleExportExcel = async () => {
  await exportToExcel(currentMonthData);
};

  return (
    <div className="min-h-screen bg-background">
      <Header 
        onExportExcel={handleExportExcel} 
        isDarkMode={isDarkMode} 
        toggleDarkMode={toggleDarkMode} 
      />
      <main className="container px-4 py-6">
        <div className="space-y-6">
          <SummaryCards />
          <FinanceCharts />
          <IncomeSection />
          <FixedExpensesSection />
          <VariableExpensesSection />
          <SavingsGoalsSection />
        </div>
        <footer className="mt-8 border-t pt-6 text-center text-sm text-muted-foreground">
          <p>Fluxo Financeiro • Controle suas finanças com clareza</p>
          <p className="mt-1">Dev by Guizzin00</p>
        </footer>
      </main>
    </div>
  );
};

const Index = () => (
  <FinanceProvider>
    <FinanceApp />
  </FinanceProvider>
);

export default Index;
