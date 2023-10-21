const ExcelJS = require("exceljs");

const bulkUploadXlsx = async (res, data, fileName) => {
  // Create a new Excel workbook
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("ShareHappinessData");

  const dynamicColumns = Object.keys(data[0]).map((key) => ({
    header: key,
    key: key,
  }));

  worksheet.columns = dynamicColumns;

  // Add the JSON data to the worksheet
  worksheet.addRows(data);

  // Set response headers for the XLSX file download
  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.setHeader("Content-Disposition", `attachment; filename=${fileName}.xlsx`);

  // Pipe the workbook to the response
  await workbook.xlsx.write(res);

  res.end();
};

module.exports = bulkUploadXlsx;
