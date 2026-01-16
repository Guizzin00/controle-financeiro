import React, { useState } from 'react';
import { useFinance } from '@/contexts/FinanceContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  Briefcase, 
  TrendingUp, 
  Laptop, 
  History,
  MoreHorizontal
} from 'lucide-react';
import { Income, IncomeType, INCOME_TYPE_INFO } from '@/types/finance';

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

const getIconComponent = (iconName: string) => {
  const icons: Record<string, React.ElementType> = {
    Briefcase,
    Plus,
    TrendingUp,
    Laptop,
    History,
    MoreHorizontal,
  };
  return icons[iconName] || MoreHorizontal;
};

export const IncomeSection: React.FC = () => {
  const { currentMonthData, addIncome, deleteIncome, totalIncome } = useFinance();
  const [isAdding, setIsAdding] = useState(false);
  const [newIncome, setNewIncome] = useState({
    description: '',
    type: 'salario' as IncomeType,
    value: '',
    date: new Date().toISOString().split('T')[0],
  });

  const handleAdd = () => {
    if (!newIncome.description || !newIncome.value) return;
    
    addIncome({
      description: newIncome.description,
      type: newIncome.type,
      value: parseFloat(newIncome.value),
      date: newIncome.date,
    });
    
    setNewIncome({
      description: '',
      type: 'salario',
      value: '',
      date: new Date().toISOString().split('T')[0],
    });
    setIsAdding(false);
  };

  return (
    <Card className="animate-fade-in">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2 text-lg">
          💰 Fontes de Renda
        </CardTitle>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">
            Total: <span className="font-semibold text-income">{formatCurrency(totalIncome)}</span>
          </span>
          <Button size="sm" onClick={() => setIsAdding(!isAdding)}>
            <Plus className="mr-1 h-4 w-4" />
            Adicionar
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isAdding && (
          <div className="mb-4 grid grid-cols-1 gap-3 rounded-lg border bg-muted/30 p-4 sm:grid-cols-5">
            <Input
              placeholder="Descrição"
              value={newIncome.description}
              onChange={(e) => setNewIncome({ ...newIncome, description: e.target.value })}
            />
            <Select
              value={newIncome.type}
              onValueChange={(value) => setNewIncome({ ...newIncome, type: value as IncomeType })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(INCOME_TYPE_INFO).map(([key, info]) => (
                  <SelectItem key={key} value={key}>
                    {info.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              type="number"
              placeholder="Valor"
              value={newIncome.value}
              onChange={(e) => setNewIncome({ ...newIncome, value: e.target.value })}
            />
            <Input
              type="date"
              value={newIncome.date}
              onChange={(e) => setNewIncome({ ...newIncome, date: e.target.value })}
            />
            <div className="flex gap-2">
              <Button onClick={handleAdd} className="flex-1">
                Salvar
              </Button>
              <Button variant="outline" onClick={() => setIsAdding(false)}>
                Cancelar
              </Button>
            </div>
          </div>
        )}

        {currentMonthData.incomes.length > 0 ? (
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentMonthData.incomes.map((income) => {
                  const typeInfo = INCOME_TYPE_INFO[income.type];
                  const IconComponent = getIconComponent(typeInfo.icon);
                  
                  return (
                    <TableRow key={income.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="rounded-lg bg-income/10 p-2">
                            <IconComponent className="h-4 w-4 text-income" />
                          </div>
                          <span className="text-sm">{typeInfo.label}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{income.description}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(income.date).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell className="text-right font-semibold text-income">
                        {formatCurrency(income.value)}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteIncome(income.id)}
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
            Nenhuma renda cadastrada. Clique em "Adicionar" para começar.
          </div>
        )}
      </CardContent>
    </Card>
  );
};
