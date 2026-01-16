import React, { useState } from 'react';
import { useFinance } from '@/contexts/FinanceContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Plus, Trash2, Target } from 'lucide-react';

const formatCurrency = (value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

export const SavingsGoalsSection: React.FC = () => {
  const { currentMonthData, addSavingsGoal, updateSavingsGoal, deleteSavingsGoal, totalSaved } = useFinance();
  const [isAdding, setIsAdding] = useState(false);
  const [newGoal, setNewGoal] = useState({ name: '', targetAmount: '', currentAmount: '' });

  const handleAdd = () => {
    if (!newGoal.name || !newGoal.targetAmount) return;
    addSavingsGoal({ name: newGoal.name, targetAmount: parseFloat(newGoal.targetAmount), currentAmount: parseFloat(newGoal.currentAmount || '0') });
    setNewGoal({ name: '', targetAmount: '', currentAmount: '' });
    setIsAdding(false);
  };

  return (
    <Card className="animate-fade-in">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2 text-lg">🎯 Metas e Reservas</CardTitle>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">Total guardado: <span className="font-semibold text-savings">{formatCurrency(totalSaved)}</span></span>
          <Button size="sm" onClick={() => setIsAdding(!isAdding)}><Plus className="mr-1 h-4 w-4" />Nova Meta</Button>
        </div>
      </CardHeader>
      <CardContent>
        {isAdding && (
          <div className="mb-4 grid grid-cols-1 gap-3 rounded-lg border bg-muted/30 p-4 sm:grid-cols-4">
            <Input placeholder="Nome da meta" value={newGoal.name} onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })} />
            <Input type="number" placeholder="Valor alvo" value={newGoal.targetAmount} onChange={(e) => setNewGoal({ ...newGoal, targetAmount: e.target.value })} />
            <Input type="number" placeholder="Valor atual (opcional)" value={newGoal.currentAmount} onChange={(e) => setNewGoal({ ...newGoal, currentAmount: e.target.value })} />
            <div className="flex gap-2"><Button onClick={handleAdd} className="flex-1">Salvar</Button><Button variant="outline" onClick={() => setIsAdding(false)}>✕</Button></div>
          </div>
        )}
        {currentMonthData.savingsGoals.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {currentMonthData.savingsGoals.map((goal) => {
              const progress = (goal.currentAmount / goal.targetAmount) * 100;
              const remaining = goal.targetAmount - goal.currentAmount;
              return (
                <div key={goal.id} className="rounded-lg border p-4">
                  <div className="mb-2 flex items-start justify-between">
                    <div className="flex items-center gap-2"><Target className="h-5 w-5 text-savings" /><span className="font-medium">{goal.name}</span></div>
                    <Button variant="ghost" size="icon" onClick={() => deleteSavingsGoal(goal.id)} className="h-8 w-8 text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
                  </div>
                  <Progress value={Math.min(progress, 100)} className="mb-2 h-3" />
                  <div className="flex justify-between text-sm">
                    <span className="text-savings">{formatCurrency(goal.currentAmount)}</span>
                    <span className="text-muted-foreground">de {formatCurrency(goal.targetAmount)}</span>
                  </div>
                  {remaining > 0 && <p className="mt-1 text-xs text-muted-foreground">Falta: {formatCurrency(remaining)}</p>}
                  <div className="mt-3 flex gap-2">
                    <Input type="number" placeholder="Adicionar valor" className="h-8 text-sm" onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        const input = e.target as HTMLInputElement;
                        const addValue = parseFloat(input.value);
                        if (addValue > 0) { updateSavingsGoal(goal.id, { currentAmount: goal.currentAmount + addValue }); input.value = ''; }
                      }
                    }} />
                  </div>
                </div>
              );
            })}
          </div>
        ) : <div className="flex h-24 items-center justify-center rounded-lg border border-dashed text-muted-foreground">Nenhuma meta cadastrada. Crie uma meta de economia!</div>}
      </CardContent>
    </Card>
  );
};
