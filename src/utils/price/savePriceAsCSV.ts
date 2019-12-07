import XLSX from 'xlsx';

export function savePriceAsCSV(wb: XLSX.WorkBook, name: string) {
  XLSX.writeFile(wb, `${new Date().toLocaleDateString()} - ${name} - Прайс.xlsx`);
}
