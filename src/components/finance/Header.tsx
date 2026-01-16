import React, { useRef } from 'react';
import { useFinance } from '@/contexts/FinanceContext';
import { MONTHS } from '@/types/finance';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { 
  FileSpreadsheet, 
  Download, 
  Upload, 
  Moon, 
  Sun,
  Wallet
} from 'lucide-react';

interface HeaderProps {
  onExportExcel: () => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  onExportExcel, 
  isDarkMode, 
  toggleDarkMode 
}) => {
  const { state, setMonth, exportData, importData } = useFinance();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleMonthChange = (value: string) => {
    setMonth(parseInt(value), state.currentYear);
  };

  const handleYearChange = (value: string) => {
    setMonth(state.currentMonth, parseInt(value));
  };

  const handleExportBackup = () => {
    const data = exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup-financeiro-${state.currentYear}-${state.currentMonth + 1}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = importData(content);
      if (!success) {
        alert('Erro ao importar dados. Verifique o arquivo.');
      }
    };
    reader.readAsText(file);
  };

  const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 5 + i);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Wallet className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-lg font-semibold">Fluxo Financeiro</h1>
            <p className="text-xs text-muted-foreground">Controle suas finanças</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Select value={state.currentMonth.toString()} onValueChange={handleMonthChange}>
            <SelectTrigger className="w-[130px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MONTHS.map((month, index) => (
                <SelectItem key={index} value={index.toString()}>
                  {month}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={state.currentYear.toString()} onValueChange={handleYearChange}>
            <SelectTrigger className="w-[90px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={toggleDarkMode}>
            {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          
          <Button variant="outline" size="sm" onClick={handleExportBackup}>
            <Download className="mr-2 h-4 w-4" />
            Backup
          </Button>
          
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImportBackup}
            accept=".json"
            className="hidden"
          />
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="mr-2 h-4 w-4" />
            Importar
          </Button>
          
          <Button onClick={onExportExcel} className="bg-success hover:bg-success/90">
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            Excel
          </Button>
        </div>
      </div>
    </header>
  );
};
