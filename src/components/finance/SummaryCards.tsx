import React from 'react';
import { useFinance } from '@/contexts/FinanceContext';
import { Card, CardContent } from '@/components/ui/card';
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  PieChart,
  AlertTriangle
} from 'lucide-react';

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

export const SummaryCards: React.FC = () => {
  const { 
    totalIncome, 
    totalExpenses, 
    availableBalance, 
    percentageCommitted 
  } = useFinance();

  const isOverBudget = percentageCommitted > 100;
  const isWarning = percentageCommitted > 50 && percentageCommitted <= 100;

  const cards = [
    {
      title: 'Renda Total',
      value: formatCurrency(totalIncome),
      icon: TrendingUp,
      color: 'text-income',
      bgColor: 'bg-income/10',
    },
    {
      title: 'Total de Gastos',
      value: formatCurrency(totalExpenses),
      icon: TrendingDown,
      color: 'text-expense',
      bgColor: 'bg-expense/10',
    },
    {
      title: 'Saldo Disponível',
      value: formatCurrency(availableBalance),
      icon: Wallet,
      color: availableBalance >= 0 ? 'text-income' : 'text-expense',
      bgColor: availableBalance >= 0 ? 'bg-income/10' : 'bg-expense/10',
    },
    {
      title: '% Comprometido',
      value: `${percentageCommitted.toFixed(1)}%`,
      icon: isOverBudget || isWarning ? AlertTriangle : PieChart,
      color: isOverBudget ? 'text-expense' : isWarning ? 'text-warning' : 'text-primary',
      bgColor: isOverBudget ? 'bg-expense/10' : isWarning ? 'bg-warning/10' : 'bg-primary/10',
      alert: isOverBudget ? 'Gastos excedem a renda!' : isWarning ? 'Mais de 50% comprometido' : null,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => (
        <Card key={index} className="overflow-hidden animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  {card.title}
                </p>
                <p className={`text-2xl font-bold ${card.color}`}>
                  {card.value}
                </p>
                {card.alert && (
                  <p className={`text-xs ${card.color}`}>
                    {card.alert}
                  </p>
                )}
              </div>
              <div className={`rounded-xl p-3 ${card.bgColor}`}>
                <card.icon className={`h-5 w-5 ${card.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
