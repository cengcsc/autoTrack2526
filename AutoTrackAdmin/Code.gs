const SPREADSHEET_ID = "1ChF3KrE_nlZ6WVCeHyv--upPpC_ziHgm3G-XMBwhplU";
const SHEET_NAME = "deploymentSource"; //TEST DEPLOYMENT, ACTUAL sheet name is  "deploymentSource" OR testingdeploySource

function doGet() {
  return HtmlService.createHtmlOutputFromFile("index")
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function getStudentById(studentId) {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);
  const lastRow = sheet.getLastRow();
  const data = sheet.getRange(2, 1, lastRow - 1, 15).getValues();

  for (let i = 0; i < data.length; i++) {
    if (String(data[i][0]).trim() === studentId) {
      return {
        found: true,
        rowIndex: i + 2,
        id: data[i][0],
        name: data[i][1],
        department: data[i][2],
        yearLevel: data[i][3],
        years: {
          "2025-2026": String(data[i][10]).trim().toUpperCase(),
          "2024-2025": String(data[i][11]).trim().toUpperCase(),
          "2023-2024": String(data[i][12]).trim().toUpperCase(),
          "2022-2023": String(data[i][13]).trim().toUpperCase(),
          "2021-2022": String(data[i][14]).trim().toUpperCase()
        }
      };
    }
  }

  return { found: false };
}


function updateStudentPayment(rowIndex, yearUpdates) {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);
  const yearCols = {
    "2025-2026": 11,
    "2024-2025": 12,
    "2023-2024": 13,
    "2022-2023": 14,
    "2021-2022": 15
  };

  for (let year in yearUpdates) {
    const value = yearUpdates[year] ? "PAID" : "UNPAID";
    sheet.getRange(rowIndex, yearCols[year]).setValue(value);
  }

  return true;
}

function saveSerialNumber(rowIndex, serialNumber) {
  try {
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);
    sheet.getRange(rowIndex, 10).setValue(serialNumber); // Column J = 10
    return true;
  } catch (error) {
    Logger.log("❌ Error saving serial: " + error);
    return false;
  }
}
