import * as React from 'react';
import XLSX from 'xlsx';

import { Grid, Typography } from 'components';

type Palto = {
  Артикул: string;
  'Все характеристики': string;
  Изображение: string;
  Наименование: string;
  Описание?: string;
  РАЗМЕР: string | number;
  СОСТАВ: string;
  Ссылка: string;
  ЦВЕТ: string;
  'Цена, руб.': number;
};

enum Column {
  VendorCode,
  Name,
  Price,
  Category,
  Sizes,
  Color,
  Structure,
  Description,
  Images,
}

type ResultPalto = Record<Column, string | number>;

export function PaltoPenza() {
  const [price, setPrice] = React.useState<File | null>(null);

  const handleFileSelect = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    setPrice(file);
  }, []);

  React.useEffect(() => {
    (async () => {
      if (!price) {
        return;
      }

      const wb = await readFile(price);
      const json = XLSX.utils.sheet_to_json<Palto>(wb.Sheets.Sheet1);

      const resultJson = json.map<ResultPalto>(item => ({
        [Column.VendorCode]: item['Артикул'],
        [Column.Name]: calculateName(item['Наименование']),
        [Column.Price]: Math.ceil(item['Цена, руб.']),
        [Column.Category]: calculateCategory(item['Ссылка']),
        [Column.Sizes]: calculateSizes(item['РАЗМЕР']),
        [Column.Color]: item['ЦВЕТ'],
        [Column.Structure]: item['СОСТАВ'],
        [Column.Description]: calculateDescription(item['Описание'] || ''),
        [Column.Images]: item['Изображение'],
      }));

      const resultSheet = XLSX.utils.json_to_sheet(resultJson, { skipHeader: true });
      wb.Sheets.Sheet1 = resultSheet;

      savePriceAsCSV(wb, 'Пальто Пенза');
    })();
  }, [price]);

  return (
    <Grid container spacing={2}>
      <Grid item>
        <Typography>Выгрузка Turbo.Parser:</Typography>
      </Grid>
      <Grid item>
        <input type="file" onChange={handleFileSelect} accept=".csv,.xlsx" />
      </Grid>
      <Grid item />
    </Grid>
  );
}

function savePriceAsCSV(wb: XLSX.WorkBook, name: string) {
  XLSX.writeFile(wb, `${new Date().toLocaleDateString()} - ${name} - Прайс.xlsx`);
}

const translateByCategory = {
  'kurtki-demisezonnye': 'Куртки демисезонные',
  'kurtki-uteplyennye': 'Куртки утепленные',
  'palto-demisezonnoe': 'Пальто демисезонное',
  'palto-uteplyennoe': 'Пальто утепленное',
  plashchi: 'Плащи',
  rasprodazha: 'Распродажа',
};

function calculateName(name: string) {
  return name.replace(/"/g, '');
}

function calculateCategory(link: string) {
  const category = link.replace(
    /^.+?\/catalog\/(.+?)\/.+$/,
    '$1',
  ) as keyof typeof translateByCategory;

  const translate = translateByCategory[category];

  if (!translate) {
    console.error(`Не известная категория: ${link}`);
  }

  return translate || '';
}

function calculateSizes(sizes: string | number) {
  return String(sizes)
    .replace(/\//g, '-')
    .replace(/;/g, '/');
}

function calculateDescription(desc: string) {
  const fractionSlash = '⁄';
  const maxDescriptionLength = 2500;
  return desc.replace(/\//g, ` ${fractionSlash} `).slice(0, maxDescriptionLength);
}

async function readFile(file: File): Promise<XLSX.WorkBook> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onabort = reject;
    reader.onerror = reject;

    reader.onload = event => {
      if (!event.target?.result || typeof event.target.result === 'string') {
        return reject(new Error('File parsing failed'));
      }

      return resolve(XLSX.read(event.target.result, { type: 'buffer', codepage: 1251 }));
    };

    reader.readAsArrayBuffer(file);
  });
}
