/**
 * Route between login and index.html based on URL parameter
 */
function doGet(e) {
  return HtmlService.createHtmlOutputFromFile("index")
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * Fetches payment status based on student ID from the "Payments" sheet
 */
function getPaymentStatus(studentId) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("deploymentSource"); // UPDATE THIS WHEN NEEDED //eto kasi attached na sya sa google sheet mismo

  const finder = sheet.getRange("A:A")
    .createTextFinder(studentId.trim())
    .matchEntireCell(true)
    .findNext();

  if (!finder) {
    return { error: "❌ Student ID not found." };
  }

  const row = finder.getRow();
  const data = sheet.getRange(row, 1, 1, 13).getDisplayValues()[0];

  return {
    id: data[0],
    name: data[1],
    department: data[2],
    yearLevel: data[3],
    datePaid: data[4],
    total: data[5],
    paid: data[6],
    balance: data[7],
    status: data[8],
    orNumber: data[9] || '—', 
    history: {
      '2025–2026': data[10] || '—',
      '2024–2025': data[11] || '—',
      '2023–2024': data[12] || '—',
      '2022–2023': data[13] || '—'
    }
  };
}

/**
 * Validates login credentials (not used yet in UI)
 */
function validateLogin(username, password) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("CREDENTIALS");
  const data = sheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {
    const storedUser = data[i][0];
    const storedPass = data[i][1];

    if (storedUser === username && storedPass === password) {
      return true;
    }
  }
  return false;
}

/**
 * Checks if username exists (for UI feedback)
 */
function checkUsernameExists(username) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("CREDENTIALS");
  const data = sheet.getRange("A2:A" + sheet.getLastRow()).getValues();

  return data.some(row => row[0] === username);
}
