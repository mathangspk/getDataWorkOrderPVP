const { google } = require("googleapis");
const path = require('path');
const fs = require('fs');

const keyFile = path.join(__dirname, 'credentials.json');

(async () => {
    const auth = new google.auth.GoogleAuth({
        keyFile,
        scopes: "https://www.googleapis.com/auth/spreadsheets",
    })

    //create client instance for auth

    const client = await auth.getClient();
    console.log(client)
    //instance of google sheets API

    const googleSheets = google.sheets({ version: "v4", auth: client });

    const spreadsheetId = '1boCL7lhYIpPISsvjcML5PatieEXY7xxYkPavnjSwP2g';
    //get metadata about spreadsheet 
    const metaData = await googleSheets.spreadsheets.get({
        auth,
        spreadsheetId
    })

    //console.log(metaData);
    listMajors(auth);
})();

function listMajors(auth) {
    const sheets = google.sheets({version: 'v4', auth});
    sheets.spreadsheets.values.get({
      spreadsheetId: '1boCL7lhYIpPISsvjcML5PatieEXY7xxYkPavnjSwP2g',
      range: 'Class Data!A2:E',
    }, (err, res) => {
      if (err) return console.log('The API returned an error: ' + err);
      const rows = res.data.values;
      if (rows.length) {
        console.log('Name, Address, Phone, Date, Loi Khai Bao');
        // Print columns A and E, which correspond to indices 0 and 4.
        rows.map((row) => {
          console.log(`${row[0]}, ${row[1]},${row[2]},${row[3]}, ${row[4]}`);
        });
      } else {
        console.log('No data found.');
      }
    });
  }

module.exports = {
    listMajors
}
