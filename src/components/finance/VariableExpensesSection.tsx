import React, { useState } from 'react';
import { useFinance } from '@/contexts/FinanceContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Trash2 } from 'lucide-react';
import { ExpenseCategory, PaymentMethod, CATEGORY_INFO, PAYMENT_METHOD_INFO } from '@/types/finance';

const formatCurrency = (value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

export const VariableExpensesSection: React.FC = () => {
  const { currentMonthData, addVariableExpense, deleteVariableExpense, totalVariableExpenses, totalIncome } = useFinance();
  const [isAdding, setIsAdding] = useState(false);
  const [newExpense, setNewExpense] = useState({
    description: '', category: 'outros' as ExpenseCategory, value: '',
    date: new Date().toISOString().split('T')[0], isEssential: true, paymentMethod: 'pix' as PaymentMethod,
  });

  const handleAdd = () => {
    if (!newExpense.description || !newExpense.value) return;
    addVariableExpense({ ...newExpense, value: parseFloat(newExpense.value) });
    setNewExpense({ description: '', category: 'outros', value: '', date: new Date().toISOString().split('T')[0], isEssential: true, paymentMethod: 'pix' });
    setIsAdding(false);
  };

  const essentialTotal = currentMonthData.variableExpenses.filter(e => e.isEssential).reduce((s, e) => s + e.value, 0);
  const nonEssentialTotal = totalVariableExpenses - essentialTotal;

  return (
    <Card className="animate-fade-in">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2 text-lg">💳 Gastos do Mês</CardTitle>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">
            Total: <span className="font-semibold text-expense">{formatCurrency(totalVariableExpenses)}</span>
          </span>
          <Button size="sm" onClick={() => setIsAdding(!isAdding)}><Plus className="mr-1 h-4 w-4" />Adicionar</Button>
        </div>
      </CardHeader>
      <CardContent>
        {isAdding && (
          <div className="mb-4 grid grid-cols-1 gap-3 rounded-lg border bg-muted/30 p-4 sm:grid-cols-6">
            <Input placeholder="Descrição" value={newExpense.description} onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })} />
            <Select value={newExpense.category} onValueChange={(v) => setNewExpense({ ...newExpense, category: v as ExpenseCategory })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{Object.entries(CATEGORY_INFO).map(([k, i]) => <SelectItem key={k} value={k}>{i.label}</SelectItem>)}</SelectContent>
            </Select>
            <Input type="number" placeholder="Valor" value={newExpense.value} onChange={(e) => setNewExpense({ ...newExpense, value: e.target.value })} />
            <Input type="date" value={newExpense.date} onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })} />
            <div className="flex items-center gap-2">
              <Checkbox checked={newExpense.isEssential} onCheckedChange={(c) => setNewExpense({ ...newExpense, isEssential: !!c })} />
              <span className="text-sm">Essencial</span>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAdd} className="flex-1">Salvar</Button>
              <Button variant="outline" onClick={() => setIsAdding(false)}>✕</Button>
            </div>
          </div>
        )}
        <div className="mb-4 grid grid-cols-2 gap-4">
          <div className="rounded-lg border bg-income/5 p-4"><p className="text-sm text-muted-foreground">Essenciais</p><p className="text-xl font-bold text-income">{formatCurrency(essentialTotal)}</p></div>
          <div className="rounded-lg border bg-warning/5 p-4"><p className="text-sm text-muted-foreground">Não Essenciais</p><p className="text-xl font-bold text-warning">{formatCurrency(nonEssentialTotal)}</p></div>
        </div>
        {currentMonthData.variableExpenses.length > 0 ? (
          <div className="rounded-lg border"><Table><TableHeader><TableRow><TableHead>Essencial</TableHead><TableHead>Categoria</TableHead><TableHead>Descrição</TableHead><TableHead>Data</TableHead><TableHead className="text-right">Valor</TableHead><TableHead className="w-[50px]"></TableHead></TableRow></TableHeader><TableBody>
            {currentMonthData.variableExpenses.map((e) => (
              <TableRow key={e.id}><TableCell>{e.isEssential ? '✓' : '✗'}</TableCell><TableCell>{CATEGORY_INFO[e.category].label}</TableCell><TableCell className="font-medium">{e.description}</TableCell><TableCell className="text-muted-foreground">{new Date(e.date).toLocaleDateString('pt-BR')}</TableCell><TableCell className="text-right font-semibold text-expense">{formatCurrency(e.value)}</TableCell><TableCell><Button variant="ghost" size="icon" onClick={() => deleteVariableExpense(e.id)} className="h-8 w-8 text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></Button></TableCell></TableRow>
            ))}
          </TableBody></Table></div>
        ) : <div className="flex h-24 items-center justify-center rounded-lg border border-dashed text-muted-foreground">Nenhum gasto variável cadastrado.</div>}
      </CardContent>
    </Card>
  );
};
