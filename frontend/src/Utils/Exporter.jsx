import Excel from "exceljs";
import { saveAs } from "file-saver";

export const Exporter = async ({ fileName, data }) => {
  if (!data || !data.length) return;

  const workbook = new Excel.Workbook();
  try {
    const worksheet = workbook.addWorksheet(fileName);

    const allKeys = Array.from(
      new Set(data.flatMap((item) => Object.keys(item)))
    );

    worksheet.columns = allKeys.map((key) => ({
      header: key.toUpperCase(),
      key: key,
    }));

    worksheet.getRow(1).font = { bold: true };

    data.forEach((singleData) => {
      worksheet.addRow(singleData);
    });

    const buf = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buf]), `${fileName}.xlsx`);
  } catch (error) {
    console.error("Export Error: ", error);
  } finally {
    workbook.removeWorksheet(fileName);
  }
};
