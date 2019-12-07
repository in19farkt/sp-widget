import XLSX from 'xlsx';

export async function readFile(file: File): Promise<XLSX.WorkBook> {
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
