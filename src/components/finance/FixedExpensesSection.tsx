import React, { useState } from 'react';
import { useFinance } from '@/contexts/FinanceContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  Plus, 
  Trash2, 
  Home,
  Zap,
  GraduationCap,
  ShoppingCart,
  Tv,
  User,
  Car,
  Heart,
  Gamepad2,
  MoreHorizontal,
  QrCode,
  CreditCard,
  Wallet,
  Banknote,
  FileText
} from 'lucide-react';
import { 
  FixedExpense, 
  ExpenseCategory, 
  PaymentMethod,
  CATEGORY_INFO, 
  PAYMENT_METHOD_INFO 
} from '@/types/finance';

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

const categoryIcons: Record<string, React.ElementType> = {
  Home,
  Zap,
  GraduationCap,
  ShoppingCart,
  Tv,
  User,
  Car,
  Heart,
  Gamepad2,
  MoreHorizontal,
};

const paymentIcons: Record<string, React.ElementType> = {
  QrCode,
  CreditCard,
  Wallet,
  Banknote,
  FileText,
};

export const FixedExpensesSection: React.FC = () => {
  const { 
    currentMonthData, 
    addFixedExpense, 
    updateFixedExpense, 
    deleteFixedExpense, 
    totalFixedExpenses 
  } = useFinance();
  
  const [isAdding, setIsAdding] = useState(false);
  const [newExpense, setNewExpense] = useState({
    description: '',
    category: 'moradia' as ExpenseCategory,
    value: '',
    dueDate: '1',
    paymentMethod: 'pix' as PaymentMethod,
  });

  const handleAdd = () => {
    if (!newExpense.description || !newExpense.value) return;
    
    addFixedExpense({
      description: newExpense.description,
      category: newExpense.category,
      value: parseFloat(newExpense.value),
      dueDate: parseInt(newExpense.dueDate),
      paymentMethod: newExpense.paymentMethod,
      isPaid: false,
    });
    
    setNewExpense({
      description: '',
      category: 'moradia',
      value: '',
      dueDate: '1',
      paymentMethod: 'pix',
    });
    setIsAdding(false);
  };

  const togglePaid = (id: string, currentValue: boolean) => {
    updateFixedExpense(id, { isPaid: !currentValue });
  };

  const paidTotal = currentMonthData.fixedExpenses
    .filter(e => e.isPaid)
    .reduce((sum, e) => sum + e.value, 0);

  return (
    <Card className="animate-fade-in">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2 text-lg">
          🏦 Contas Fixas
        </CardTitle>
        <div className="flex items-center gap-3">
          <div className="text-right text-sm">
            <span className="text-muted-foreground">Total: </span>
            <span className="font-semibold text-expense">{formatCurrency(totalFixedExpenses)}</span>
            <span className="mx-2 text-muted-foreground">|</span>
            <span className="text-muted-foreground">Pago: </span>
            <span className="font-semibold text-income">{formatCurrency(paidTotal)}</span>
          </div>
          <Button size="sm" onClick={() => setIsAdding(!isAdding)}>
            <Plus className="mr-1 h-4 w-4" />
            Adicionar
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isAdding && (
          <div className="mb-4 grid grid-cols-1 gap-3 rounded-lg border bg-muted/30 p-4 sm:grid-cols-6">
            <Input
              placeholder="Descrição"
              value={newExpense.description}
              onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
            />
            <Select
              value={newExpense.category}
              onValueChange={(value) => setNewExpense({ ...newExpense, category: value as ExpenseCategory })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(CATEGORY_INFO).map(([key, info]) => (
                  <SelectItem key={key} value={key}>
                    {info.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              type="number"
              placeholder="Valor"
              value={newExpense.value}
              onChange={(e) => setNewExpense({ ...newExpense, value: e.target.value })}
            />
            <Select
              value={newExpense.dueDate}
              onValueChange={(value) => setNewExpense({ ...newExpense, dueDate: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Dia" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                  <SelectItem key={day} value={day.toString()}>
                    Dia {day}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={newExpense.paymentMethod}
              onValueChange={(value) => setNewExpense({ ...newExpense, paymentMethod: value as PaymentMethod })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(PAYMENT_METHOD_INFO).map(([key, info]) => (
                  <SelectItem key={key} value={key}>
                    {info.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex gap-2">
              <Button onClick={handleAdd} className="flex-1">
                Salvar
              </Button>
              <Button variant="outline" onClick={() => setIsAdding(false)}>
                ✕
              </Button>
            </div>
          </div>
        )}

        {currentMonthData.fixedExpenses.length > 0 ? (
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">Pago</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Vencimento</TableHead>
                  <TableHead>Forma Pgto</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentMonthData.fixedExpenses.map((expense) => {
                  const catInfo = CATEGORY_INFO[expense.category];
                  const payInfo = PAYMENT_METHOD_INFO[expense.paymentMethod];
                  const CategoryIcon = categoryIcons[catInfo.icon] || MoreHorizontal;
                  const PaymentIcon = paymentIcons[payInfo.icon] || MoreHorizontal;
                  
                  return (
                    <TableRow 
                      key={expense.id} 
                      className={expense.isPaid ? 'bg-muted/30' : ''}
                    >
                      <TableCell>
                        <Checkbox
                          checked={expense.isPaid}
                          onCheckedChange={() => togglePaid(expense.id, expense.isPaid)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div 
                            className="rounded-lg p-2" 
                            style={{ backgroundColor: `${catInfo.color}20` }}
                          >
                            <CategoryIcon 
                              className="h-4 w-4" 
                              style={{ color: catInfo.color }} 
                            />
                          </div>
                          <span className="text-sm">{catInfo.label}</span>
                        </div>
                      </TableCell>
                      <TableCell className={`font-medium ${expense.isPaid ? 'line-through text-muted-foreground' : ''}`}>
                        {expense.description}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        Dia {expense.dueDate}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <PaymentIcon className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{payInfo.label}</span>
                        </div>
                      </TableCell>
                      <TableCell className={`text-right font-semibold ${expense.isPaid ? 'text-muted-foreground' : 'text-expense'}`}>
                        {formatCurrency(expense.value)}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteFixedExpense(expense.id)}
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="flex h-32 items-center justify-center rounded-lg border border-dashed text-muted-foreground">
            Nenhuma conta fixa cadastrada. Clique em "Adicionar" para começar.
          </div>
        )}
      </CardContent>
    </Card>
  );
};
