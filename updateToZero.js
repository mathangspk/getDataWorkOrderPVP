const { google } = require("googleapis");
const path = require('path');
const keyFile = path.join(__dirname, 'credentials.json');


async function getDataFromGoogleSheet() {
    const auth = new google.auth.GoogleAuth({
        keyFile,
        scopes: "https://www.googleapis.com/auth/spreadsheets",
    })

    //create client instance for auth

    const client = await auth.getClient();
    //instance of google sheets API

    const googleSheets = google.sheets({ version: "v4", auth: client });

    const spreadsheetId = '1boCL7lhYIpPISsvjcML5PatieEXY7xxYkPavnjSwP2g';
    //get metadata about spreadsheet 

    const getRows = await googleSheets.spreadsheets.values.get({
        auth,
        spreadsheetId,
        range: "Class Data!A2:F"
    })
    return (getRows.data.values)
};

async function updateDataGoogleSheet(value, row) {
    const auth = new google.auth.GoogleAuth({
        keyFile,
        scopes: "https://www.googleapis.com/auth/spreadsheets",
    })

    //create client instance for auth

    const client = await auth.getClient();
    //instance of google sheets API

    const googleSheets = google.sheets({ version: "v4", auth: client });

    const spreadsheetId = '1boCL7lhYIpPISsvjcML5PatieEXY7xxYkPavnjSwP2g';
    //get metadata about spreadsheet 
    let range = String("Class Data!F" + row);
    await googleSheets.spreadsheets.values.update({
        auth,
        spreadsheetId,
        range,
        valueInputOption: "USER_ENTERED",
        resource: {
            values: [[value]]
        }
    })
};

async function printData() {
    // await getDataFromGoogleSheet();
    var x = await getDataFromGoogleSheet();
    for (let i = 0; i < x.length; i++) {
        await updateDataGoogleSheet(1,i+2);
    }
}
printData();
