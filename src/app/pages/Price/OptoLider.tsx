import * as React from 'react';
import XLSX from 'xlsx';
import { uniqWith } from 'ramda';

import { Grid, Typography } from 'components';
import {
  readFile,
  calculateName,
  calculateDescription,
  savePriceAsCSV,
  calculateFeatures,
} from 'utils/price';

type Product = {
  Ссылка: string;
  Наименование: string;
  'Цена, руб.': number;
  'Название раздела': string;
  ЦВЕТ?: string;
  Описание?: string;
  'Все характеристики'?: string;
  Изображение: string;
};

enum Column {
  VendorCode,
  Name,
  Price,
  Category,
  Color,
  Description,
  Features,
  Images,
}

type ResultProduct = Record<Column, string | number>;

export function OptoLider() {
  const [all, setAll] = React.useState<File | null>(null);
  const [parts, setParts] = React.useState<File[] | null>(null);

  const handleAllSelect = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    setAll(file);
  }, []);

  const handlePartsSelect = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && Array.from<File>(event.target.files);
    setParts(file);
  }, []);

  React.useEffect(() => {
    (async () => {
      if (!all || !parts?.length) {
        return;
      }

      const allWb = await readFile(all);
      const partsWb = await Promise.all(parts.map(part => readFile(part)));

      let allResultJson = uniqWith(
        (a, b) => a[Column.VendorCode] === b[Column.VendorCode],
        calcResultJson(allWb),
      );

      const partsResultJson = uniqWith(
        (a, b) => a[Column.VendorCode] === b[Column.VendorCode],
        partsWb.map(wb => calcResultJson(wb)).flat(),
      );

      allResultJson = allResultJson
        .map(product => {
          const index = partsResultJson.findIndex(
            item => item[Column.VendorCode] === product[Column.VendorCode],
          );

          return index !== -1 ? partsResultJson.splice(index, 1)[0] : product;
        })
        .concat(partsResultJson)
        .filter(product => !!product[Column.Price]);

      const resultSheet = XLSX.utils.json_to_sheet(allResultJson, { skipHeader: true });

      const resultWb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(resultWb, resultSheet, 'Sheet1');

      savePriceAsCSV(resultWb, 'ОптоЛидер');
    })();
  }, [all, parts]);

  return (
    <Grid container spacing={2}>
      <Grid item xs={4}>
        <Typography>Выгрузка всех товаров (один файл .xls):</Typography>
      </Grid>
      <Grid item xs={8}>
        <input type="file" onChange={handleAllSelect} accept=".xls" />
      </Grid>
      <Grid item xs={4}>
        <Typography>Выгрузка по частям (несколько файлов .xls):</Typography>
      </Grid>
      <Grid item xs={8}>
        <input type="file" onChange={handlePartsSelect} accept=".xls" multiple />
      </Grid>
    </Grid>
  );
}

const featuresFilterRegExp = /^(Дропшиппинг|от \d+? шт).+$/i;

function calcResultJson(wb: XLSX.WorkBook) {
  const json = XLSX.utils.sheet_to_json<Product>(wb.Sheets[wb.SheetNames[0]]);

  const resultJson = json.map<ResultProduct>(item => ({
    [Column.VendorCode]: calculateVendorCode(item['Ссылка']),
    [Column.Name]: calculateName(item['Наименование']),
    [Column.Price]: Math.ceil(item['Цена, руб.']),
    [Column.Category]: item['Название раздела'],
    [Column.Color]: calculateColor(item['ЦВЕТ'] || ''),
    [Column.Description]: calculateDescription(item['Описание'] || ''),
    [Column.Features]: calculateFeatures(item['Все характеристики'] || '', featuresFilterRegExp),
    [Column.Images]: item['Изображение'],
  }));

  return resultJson;
}

function calculateVendorCode(link: string) {
  return link.replace(/^.+?\/product\/(.+?)\//, '$1');
}

function calculateColor(color: string) {
  return color.replace(/,/g, '/');
}
