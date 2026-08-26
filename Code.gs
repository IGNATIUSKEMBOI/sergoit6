/**
 * SERGOIT PRIMARY SCHOOL — FORM-TO-SHEET BACKEND
 * ------------------------------------------------
 * Paste this whole file into an Apps Script project, then deploy it as
 * a Web App. Full step-by-step instructions are in README.md.
 *
 * This script is hard-wired to your Google Sheet by ID, so it always
 * writes to the right place regardless of where the script itself
 * lives or is deployed from:
 *   https://docs.google.com/spreadsheets/d/1hNOq8ReAHYUByg8-c9pivjB0RJUUy5JJORMymk5IgUo/edit
 *
 * It creates two tabs automatically the first time each form is used:
 *   - "Contact Messages"     (from contact.html)
 *   - "Alumni Registrations" (from alumni.html)
 */

var SPREADSHEET_ID = '1hNOq8ReAHYUByg8-c9pivjB0RJUUy5JJORMymk5IgUo';

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var ss = SpreadsheetApp.openById(SPREADSHEET_ID);

    if (data.formType === 'alumni') {
      appendRow(ss, 'Alumni Registrations',
        ['Timestamp', 'First Name', 'Last Name', 'Graduation Year', 'Phone', 'Email', 'Profession', 'Location'],
        [data.timestamp, data.firstName, data.lastName, data.graduationYear, data.phone, data.email, data.profession, data.location]
      );
    } else {
      // default: treat everything else as the contact form
      appendRow(ss, 'Contact Messages',
        ['Timestamp', 'First Name', 'Last Name', 'Email', 'Phone', 'Subject', 'Message'],
        [data.timestamp, data.firstName, data.lastName, data.email, data.phone, data.subject, data.message]
      );
    }

    return ContentService
      .createTextOutput(JSON.stringify({ result: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'error', message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function appendRow(ss, sheetName, headerRow, rowData) {
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    sheet.appendRow(headerRow);
    sheet.getRange(1, 1, 1, headerRow.length).setFontWeight('bold');
  }
  sheet.appendRow(rowData);
}

/**
 * DEBUG HELPER — run this manually from the Apps Script editor
 * (select "testWrite" in the function dropdown, then click Run)
 * BEFORE wiring up the website. It writes one sample row to each
 * tab so you can confirm the script has write access to your Sheet
 * and that the target ID is correct. Check the Sheet after running —
 * you should see a "TEST" row appear in both tabs.
 */
function testWrite() {
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  appendRow(ss, 'Contact Messages',
    ['Timestamp', 'First Name', 'Last Name', 'Email', 'Phone', 'Subject', 'Message'],
    [new Date().toISOString(), 'TEST', 'Row', 'test@example.com', '0700000000', 'Test Subject', 'This is a test write from testWrite().']
  );
  appendRow(ss, 'Alumni Registrations',
    ['Timestamp', 'First Name', 'Last Name', 'Graduation Year', 'Phone', 'Email', 'Profession', 'Location'],
    [new Date().toISOString(), 'TEST', 'Row', '2020', '0700000000', 'test@example.com', 'Tester', 'Test County']
  );
  Logger.log('Test rows written. Check the Sheet: https://docs.google.com/spreadsheets/d/' + SPREADSHEET_ID + '/edit');
}

/**
 * Lets you sanity-check the deployment by visiting the Web App URL
 * directly in a browser (a GET request).
 */
function doGet(e) {
  return ContentService
    .createTextOutput('Sergoit Primary School form backend is running.')
    .setMimeType(ContentService.MimeType.TEXT);
}
