import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import {
  MonthlyData,
  CATEGORY_INFO,
  PAYMENT_METHOD_INFO,
  INCOME_TYPE_INFO,
  MONTHS,
} from '@/types/finance';

export const exportToExcel = async (currentMonthData: MonthlyData) => {
  const wb = new ExcelJS.Workbook();
  wb.creator = 'Controle Financeiro';
  wb.created = new Date();

  const {
    totalIncome,
    totalFixed,
    totalVariable,
    totalExpenses,
    available,
    percentage,
  } = calculateTotals(currentMonthData);

  /* ================= STYLES ================= */
  const headerStyle: Partial<ExcelJS.Style> = {
    font: { bold: true, color: { argb: 'FFFFFFFF' } },
    alignment: { vertical: 'middle', horizontal: 'center' },
    fill: {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF1F2937' },
    },
  };

  const titleStyle: Partial<ExcelJS.Style> = {
    font: { bold: true, size: 14 },
    alignment: { vertical: 'middle', horizontal: 'center' },
  };

  const moneyFmt = '"R$" #,##0.00';
  const dateFmt = 'dd/mm/yyyy';

  const zebra = (row: ExcelJS.Row, index: number) => {
    if (index % 2 === 0) {
      row.eachCell(cell => {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFF3F4F6' },
        };
      });
    }
  };

  /* ================= ABA 1 — VISÃO GERAL ================= */
  const ws1 = wb.addWorksheet('Visão Geral');
  ws1.mergeCells('A1:C1');
  ws1.getCell('A1').value = 'VISÃO GERAL FINANCEIRA';
  ws1.getCell('A1').style = titleStyle;

  ws1.addRow([]);
  ws1.addRow(['Período', `${MONTHS[currentMonthData.month]} / ${currentMonthData.year}`]);
  ws1.addRow([]);

  const h1 = ws1.addRow(['Indicador', 'Valor', 'Observação']);
  h1.eachCell(c => (c.style = headerStyle));

  const overview = [
    ['Renda Total', totalIncome, ''],
    ['Gastos Fixos', totalFixed, ''],
    ['Gastos Variáveis', totalVariable, ''],
    ['Total de Gastos', totalExpenses, ''],
    ['Saldo Disponível', available, available >= 0 ? 'Positivo ✓' : 'Negativo ✗'],
    ['% Comprometido', percentage, percentage > 0.5 ? 'Atenção!' : 'Saudável'],
  ];

  overview.forEach((r, i) => {
    const row = ws1.addRow(r);
    row.getCell(2).numFmt = moneyFmt;
    if (i === 5) row.getCell(2).numFmt = '0.0%';
    zebra(row, i);
  });

  ws1.columns = [{ width: 26 }, { width: 18 }, { width: 18 }];
  ws1.views = [{ state: 'frozen', ySplit: 5 }];

  /* ================= ABA 2 — GASTOS FIXOS ================= */
  const ws2 = wb.addWorksheet('Gastos Fixos');
  ws2.mergeCells('A1:F1');
  ws2.getCell('A1').value = 'GASTOS FIXOS';
  ws2.getCell('A1').style = titleStyle;

  const h2 = ws2.addRow([
    'Descrição',
    'Categoria',
    'Valor (R$)',
    'Vencimento',
    'Forma Pgto',
    'Pago?',
  ]);
  h2.eachCell(c => (c.style = headerStyle));

  currentMonthData.fixedExpenses.forEach((e, i) => {
    const row = ws2.addRow([
      e.description,
      CATEGORY_INFO[e.category].label,
      e.value,
      `Dia ${e.dueDate}`,
      PAYMENT_METHOD_INFO[e.paymentMethod].label,
      e.isPaid ? 'Sim' : 'Não',
    ]);
    row.getCell(3).numFmt = moneyFmt;
    zebra(row, i);
  });

  const t2 = ws2.addRow(['TOTAL', '', totalFixed]);
  t2.font = { bold: true };
  t2.getCell(3).numFmt = moneyFmt;

  ws2.columns = [
    { width: 32 },
    { width: 18 },
    { width: 15 },
    { width: 15 },
    { width: 16 },
    { width: 10 },
  ];

  ws2.autoFilter = { from: 'A2', to: `F${ws2.rowCount}` };
  ws2.views = [{ state: 'frozen', ySplit: 2 }];

  /* ================= ABA 3 — GASTOS VARIÁVEIS ================= */
  const ws3 = wb.addWorksheet('Gastos Variáveis');
  ws3.mergeCells('A1:E1');
  ws3.getCell('A1').value = 'GASTOS VARIÁVEIS';
  ws3.getCell('A1').style = titleStyle;

  const h3 = ws3.addRow([
    'Descrição',
    'Categoria',
    'Valor (R$)',
    'Data',
    'Essencial?',
  ]);
  h3.eachCell(c => (c.style = headerStyle));

  currentMonthData.variableExpenses.forEach((e, i) => {
    const row = ws3.addRow([
      e.description,
      CATEGORY_INFO[e.category].label,
      e.value,
      new Date(e.date),
      e.isEssential ? 'Sim' : 'Não',
    ]);
    row.getCell(3).numFmt = moneyFmt;
    row.getCell(4).numFmt = dateFmt;
    zebra(row, i);
  });

  const t3 = ws3.addRow(['TOTAL', '', totalVariable]);
  t3.font = { bold: true };
  t3.getCell(3).numFmt = moneyFmt;

  ws3.columns = [
    { width: 32 },
    { width: 18 },
    { width: 15 },
    { width: 15 },
    { width: 12 },
  ];

  ws3.autoFilter = { from: 'A2', to: `E${ws3.rowCount}` };
  ws3.views = [{ state: 'frozen', ySplit: 2 }];

  /* ================= ABA 4 — POR CATEGORIA ================= */
  const ws4 = wb.addWorksheet('Por Categoria');
  ws4.mergeCells('A1:C1');
  ws4.getCell('A1').value = 'RESUMO POR CATEGORIA';
  ws4.getCell('A1').style = titleStyle;

  const h4 = ws4.addRow(['Categoria', 'Total (R$)', '% do Total']);
  h4.eachCell(c => (c.style = headerStyle));

  const categoryTotals = new Map<string, number>();
  [...currentMonthData.fixedExpenses, ...currentMonthData.variableExpenses].forEach(e => {
    const label = CATEGORY_INFO[e.category].label;
    categoryTotals.set(label, (categoryTotals.get(label) || 0) + e.value);
  });

  Array.from(categoryTotals.entries()).forEach((c, i) => {
    const row = ws4.addRow([
      c[0],
      c[1],
      totalExpenses > 0 ? c[1] / totalExpenses : 0,
    ]);
    row.getCell(2).numFmt = moneyFmt;
    row.getCell(3).numFmt = '0.0%';
    zebra(row, i);
  });

  ws4.columns = [{ width: 26 }, { width: 18 }, { width: 15 }];
  ws4.views = [{ state: 'frozen', ySplit: 2 }];

  /* ================= ABA 5 — RENDAS ================= */
  const ws5 = wb.addWorksheet('Rendas');
  ws5.mergeCells('A1:D1');
  ws5.getCell('A1').value = 'FONTES DE RENDA';
  ws5.getCell('A1').style = titleStyle;

  const h5 = ws5.addRow(['Descrição', 'Tipo', 'Valor (R$)', 'Data']);
  h5.eachCell(c => (c.style = headerStyle));

  currentMonthData.incomes.forEach((i, idx) => {
    const row = ws5.addRow([
      i.description,
      INCOME_TYPE_INFO[i.type].label,
      i.value,
      new Date(i.date),
    ]);
    row.getCell(3).numFmt = moneyFmt;
    row.getCell(4).numFmt = dateFmt;
    zebra(row, idx);
  });

  const t5 = ws5.addRow(['TOTAL', '', totalIncome]);
  t5.font = { bold: true };
  t5.getCell(3).numFmt = moneyFmt;

  ws5.columns = [
    { width: 32 },
    { width: 18 },
    { width: 15 },
    { width: 15 },
  ];

  ws5.views = [{ state: 'frozen', ySplit: 2 }];

  /* ================= DOWNLOAD ================= */
  const buffer = await wb.xlsx.writeBuffer();
  saveAs(
    new Blob([buffer]),
    `Financeiro_${MONTHS[currentMonthData.month]}_${currentMonthData.year}.xlsx`
  );
};

function calculateTotals(data: MonthlyData) {
  const totalIncome = data.incomes.reduce((s, i) => s + i.value, 0);
  const totalFixed = data.fixedExpenses.reduce((s, e) => s + e.value, 0);
  const totalVariable = data.variableExpenses.reduce((s, e) => s + e.value, 0);
  const totalExpenses = totalFixed + totalVariable;
  const available = totalIncome - totalExpenses;
  const percentage = totalIncome > 0 ? totalExpenses / totalIncome : 0;

  return {
    totalIncome,
    totalFixed,
    totalVariable,
    totalExpenses,
    available,
    percentage,
  };
}
