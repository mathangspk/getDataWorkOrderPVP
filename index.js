const puppeteer = require('puppeteer');
const { google } = require("googleapis");
const path = require('path');
const moment = require('moment');

const fs = require('fs');
const keyFile = path.join(__dirname, 'credentials.json');
var lastDay = function (y, m) {
  return new Date(y, m, 0).getDate();
}
async function checkDayCreateNewSheet() {
  const month = moment(new Date()).format('MM');
  const year = moment(new Date()).format('YYYY');
  const lastDay1 = lastDay(year, month);
  let dayCheckFrom = moment(new Date()).format("YYYY-MM-26");
  let dayCheckTo = moment(new Date()).format("YYYY-MM-" + lastDay1);
  console.log(dayCheckTo);
  let today = moment(new Date()).format("YYYY-MM-DD");
  console.log(today)
  if (today >= dayCheckFrom && today <= dayCheckTo) return true;
  return false;
}

function nameSheetCheck(department) {
  const monthYear = moment(new Date()).format('MYYYY')
  const nameSheetCheck = String('SR' + monthYear + "-" + department)
  return nameSheetCheck;
}
function nameSheetCheckNextMonth(department) {
  let month = new Date().getMonth();
  let year;
  if (month == 11) {
    month = 1;
    year = moment(new Date()).format('YYYY');
    year = Number(year) + 1;
  } else {
    month = Number(month) + 2;
    year = moment(new Date()).format('YYYY');
  }
  const monthYear = String(String(month) + String(year));
  const nameSheetCheck = String('SR' + monthYear + "-" + department)
  return nameSheetCheck;
}

function convertStringToDate(stringDate) {
  let t = stringDate;
  let t1 = t.split(' ');
  let date = t1[0];
  let formatDate = date.split('/');
  formatDate = String(formatDate[2] + '-' + formatDate[1] + '-' + formatDate[0])
  return new Date(formatDate);
}

async function getDataFromGoogleSheet(nameSheet) {
  const auth = new google.auth.GoogleAuth({
    keyFile,
    scopes: "https://www.googleapis.com/auth/spreadsheets",
  })

  //create client instance for auth

  const client = await auth.getClient();
  //instance of google sheets API

  const googleSheets = google.sheets({ version: "v4", auth: client });

  const spreadsheetId = '1eyV2C2DBZeBwtg0vjDTKHK3zvys9ecHO4tKeBbDTibM';
  //get metadata about spreadsheet 
  const range = String(nameSheet + "!A2:H")
  const getRows = await googleSheets.spreadsheets.values.get({
    auth,
    spreadsheetId,
    range
  })
  console.log(getRows.data)
  return (getRows.data.values)
};

async function createNewSheet(nameSheet) {
  const auth = new google.auth.GoogleAuth({
    keyFile,
    scopes: "https://www.googleapis.com/auth/spreadsheets",
  })

  //create client instance for auth

  const client = await auth.getClient();
  //instance of google sheets API

  const googleSheets = google.sheets({ version: "v4", auth: client });
  const spreadsheetId = '1eyV2C2DBZeBwtg0vjDTKHK3zvys9ecHO4tKeBbDTibM';

  await googleSheets.spreadsheets.batchUpdate({
    auth,
    spreadsheetId,
    requestBody: {
      requests: [{
        addSheet: {
          properties: {
            title: nameSheet,
          }
        }
      }]
    }
  })

}
async function getAllSheet() {
  const titles = [];
  const auth = new google.auth.GoogleAuth({
    keyFile,
    scopes: "https://www.googleapis.com/auth/spreadsheets",
  })

  //create client instance for auth

  const client = await auth.getClient();
  //instance of google sheets API

  const googleSheets = google.sheets({ version: "v4", auth: client });
  const spreadsheetId = '1eyV2C2DBZeBwtg0vjDTKHK3zvys9ecHO4tKeBbDTibM';

  const metaData = await googleSheets.spreadsheets.get({
    auth,
    spreadsheetId
  })
  //console.log(metaData.data.sheets)
  let sheetsInfo = metaData.data.sheets;
  sheetsInfo.map(sheetInfo =>
    //console.log(sheetInfo.properties.title)
    titles.push(sheetInfo.properties.title)
  )
  return titles;

}


async function insertHeaderGoogleSheet(nameSheet, value) {
  const auth = new google.auth.GoogleAuth({
    keyFile,
    scopes: "https://www.googleapis.com/auth/spreadsheets",
  })

  //create client instance for auth

  const client = await auth.getClient();
  //instance of google sheets API

  const googleSheets = google.sheets({ version: "v4", auth: client });

  const spreadsheetId = '1eyV2C2DBZeBwtg0vjDTKHK3zvys9ecHO4tKeBbDTibM';
  //get metadata about spreadsheet 
  let range = String(nameSheet + "!A1");
  await googleSheets.spreadsheets.values.append({
    auth,
    spreadsheetId,
    range,
    valueInputOption: "USER_ENTERED",
    resource: {
      values: value
      //values: [['value']]
    }
  })
};
async function insertDataGoogleSheet(nameSheet, value) {
  const auth = new google.auth.GoogleAuth({
    keyFile,
    scopes: "https://www.googleapis.com/auth/spreadsheets",
  })

  //create client instance for auth

  const client = await auth.getClient();
  //instance of google sheets API

  const googleSheets = google.sheets({ version: "v4", auth: client });

  const spreadsheetId = '1eyV2C2DBZeBwtg0vjDTKHK3zvys9ecHO4tKeBbDTibM';
  //get metadata about spreadsheet 
  let range = String(`${nameSheet}!A2`);
  await googleSheets.spreadsheets.values.append({
    auth,
    spreadsheetId,
    range,
    valueInputOption: "USER_ENTERED",
    resource: {
      values: value
      //values: [['value']]
    }
  })
};

//insertDataGoogleSheet();

async function main() {
  await getSRForDepartment("C&I");
  await getSRForDepartment("DIEN");
  await getSRForDepartment("CO");
}
async function getSRForDepartment(department) {
  let dayCreateNew = await checkDayCreateNewSheet();
  console.log(dayCreateNew);
  let thisMonth;
  if (dayCreateNew) {
    thisMonth = false;
    console.log('this month is: '+ thisMonth);
    createWorkSheetSRNextMonth(department, thisMonth);
  } else {
    thisMonth = true;
    console.log('this month is: '+ thisMonth);
    createWorkSheetSR(department, thisMonth);    
  }
}

async function createWorkSheetSR(department, thisMonth) {
  let sheetCheck = nameSheetCheck(department);
  console.log(sheetCheck)
  let titles = await getAllSheet();
  console.log(titles);
  let tabSRNowHave = await checkExistElementInArray(sheetCheck, titles);
  console.log(tabSRNowHave)
  if (tabSRNowHave) {
    let SR = await filterSRWithDate(department,thisMonth);
    console.log(SR)
    let indexC = await firstCheckSRDateFinish(SR,thisMonth);// return index when compare date finish set
    console.log(indexC);
    let SRF = await filterSRWithDateFinish(indexC.index, SR)
    let srOnly = SRF.map(el => el[0])
    console.log(srOnly)
    let dataExist = await getDataFromGoogleSheet(sheetCheck);
    //console.log(dataExist)
    // //compare dataExist with getServiceRequest get
    if (dataExist) {
      console.log('dataExists:');
      console.log(dataExist);
      let dataInsert = await compare2Array(dataExist, srOnly, SRF);
      console.log('dataInsert:');
      console.log(dataInsert);
      await insertDataGoogleSheet(sheetCheck, dataInsert);
    } else {
      await insertDataGoogleSheet(sheetCheck, SRF);
    }
  } else {
    await createNewSheet(sheetCheck);
    let header = [[
      'Service Request',
      'Summary',
      'asset',
      'location',
      'plant',
      'time',
      'status',
      'departmentService']]
    await insertHeaderGoogleSheet(sheetCheck, header);
    let SR = await filterSRWithDate(department,thisMonth);
    let indexC = await firstCheckSRDateFinish(SR,thisMonth);// return index when compare date finish set
    console.log(indexC);
    let SRF = await filterSRWithDateFinish(indexC.index, SR)
    console.log(SRF);
    await insertDataGoogleSheet(sheetCheck, SRF);
  }
}
async function createWorkSheetSRNextMonth(department,thisMonth) {
  let sheetCheck = nameSheetCheckNextMonth(department);
  console.log(sheetCheck)
  let titles = await getAllSheet();
  console.log(titles);
  let tabSRNowHave = await checkExistElementInArray(sheetCheck, titles);
  console.log(tabSRNowHave)
  if (tabSRNowHave) {
    let SR = await filterSRWithDate(department,thisMonth);
    console.log(SR)
    let indexC = await firstCheckSRDateFinish(SR,thisMonth);// return index when compare date finish set
    console.log(indexC);
    let SRF = await filterSRWithDateFinish(indexC.index, SR)
    let srOnly = SRF.map(el => el[0])
    console.log(srOnly)
    let dataExist = await getDataFromGoogleSheet(sheetCheck);
    //console.log(dataExist)
    // //compare dataExist with getServiceRequest get
    if (dataExist) {
      console.log('dataExists:');
      console.log(dataExist);
      let dataInsert = await compare2Array(dataExist, srOnly, SRF);
      console.log('dataInsert:');
      console.log(dataInsert);
      await insertDataGoogleSheet(sheetCheck, dataInsert);
    } else {
      await insertDataGoogleSheet(sheetCheck, SRF);
    }
  } else {
    await createNewSheet(sheetCheck);
    let header = [[
      'Service Request',
      'Summary',
      'asset',
      'location',
      'plant',
      'time',
      'status',
      'departmentService']]
    await insertHeaderGoogleSheet(sheetCheck, header);
    let SR = await filterSRWithDate(department,thisMonth);
    let indexC = await firstCheckSRDateFinish(SR,thisMonth);// return index when compare date finish set
    console.log(indexC);
    let SRF = await filterSRWithDateFinish(indexC.index, SR)
    console.log(SRF);
    await insertDataGoogleSheet(sheetCheck, SRF);
  }
}

async function filterSRWithDate(department,thisMonth) {
  let arrayAfterCompare = [];
  let page = 1;
  let c = {
    check: false,
    index: 0
  };
  while (c.check == false) {
    let sr = await getServiceRequest(page, department);
    //console.log(sr.length)
    page++;
    let srArray = await convertObjectToArray(sr);
    console.log('filterSRWithDate');
    console.log(thisMonth);
    c = await firstCheckSRDate(srArray,thisMonth);
    console.log(c);
    arrayAfterCompare = await spliceElementInArray(c.index, srArray);
    //console.log('arrayAfterCompare' + arrayAfterCompare);
  }
  return arrayAfterCompare;
}

async function filterSRWithDateFinish(index, arrayIn) {
  let result = arrayIn.splice(index, arrayIn.length);
  return result;
}

async function firstCheckSRDate(srArray, thisMonth) {
  let month = new Date();
  let year = new Date();
  let date;
  console.log('firstCheckSRDate');
  console.log(thisMonth);
  if (thisMonth == true) {
    date = moment(new Date(year.getFullYear(), month.getMonth() - 1, 26)).format("YYYY-MM-DD");
  } else {
    date = moment(new Date(year.getFullYear(), month.getMonth(), 26)).format("YYYY-MM-DD");
  }

  date = date.split("T")[0];
  let dater = new Date(date)
  let result = {};
  for (let i = 0; i < srArray.length; i++) {
    console.log(srArray[i][5])
    result.check = await compareDate(dater, srArray[i][5])
    console.log(result.check)
    if (result.check) {
      result.index = i;
      break;
    }
  }
  return result;
}
async function firstCheckSRDateFinish(srArray, thisMonth) {
  let month = new Date();
  let year = new Date();
  let date;
  console.log('firstCheckSRDateFinish');
  console.log(thisMonth);
  if (thisMonth == true) {
    date = moment(new Date(year.getFullYear(), month.getMonth(), 25)).format("YYYY-MM-DD");
  } else {
    date = moment(new Date(year.getFullYear(), month.getMonth() + 1, 25)).format("YYYY-MM-DD");
  }

  date = date.split("T")[0];
  let dater = new Date(date)
  let result = {};
  for (let i = 0; i < srArray.length; i++) {
    console.log(srArray[i][5])
    result.check = await compareDateFinish(dater, srArray[i][5])
    console.log(result.check)
    if (result.check) {
      result.index = i;
      break;
    }
  }
  return result;
}
async function compareDate(date, element) {
  let result = false;
  console.log(date);
  let dateC = moment(new Date(element)).format("YYYY-MM-DD");
  dateC = dateC.split("T")[0];
  let dateB = new Date(dateC);
  console.log(dateB);
  if (date > dateB) {
    result = true;
  } else {
    result = false;
  }
  return result;
}
async function compareDateFinish(dateFinish, element) {
  let result = false;
  console.log(dateFinish);
  let dateC = moment(new Date(element)).format("YYYY-MM-DD");
  dateC = dateC.split("T")[0];
  let dateB = new Date(dateC);
  console.log(dateB);
  if (dateFinish < dateB) {
    result = false;
  } else {
    result = true;
  }
  return result;
}

async function spliceElementInArray(index, arrayIn) {

  let result = arrayIn.splice(0, index);
  return result;
}

async function checkExistElementInArray(element, array) {
  return array.includes(element)
}

async function compare2Array(dataExist, srOnly, SR) {
  for (let i = 0; i < dataExist.length + 1; i++) {
    if (dataExist[i]) {
      console.log(dataExist[i][0])
      //console.log(srOnly.indexOf(dataExist[i][0]));
      //console.log(output)
      SR.splice(srOnly.indexOf(dataExist[i][0]), 1);
      srOnly.splice(srOnly.indexOf(dataExist[i][0]), 1);
      //console.log(output)
    }
  }
  return SR;
}

async function convertObjectToArray(object) {
  let data = [];
  object.map(el => {
    const pro = Object.values(el)
    data.push(pro)
  })
  return data;
}

main();

async function getServiceRequest(times, department) {
  // Get the username and password inputs
  const browser = await puppeteer.launch({ headless: true });
  try {
    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(0);
    //await page.setViewport({ width: 1200, height: 600 })
    //await page.goto('https://facebook.com');
    await page.goto('https://eam.pvpower.vn/maximo/webclient/login/login.jsp');
    // Login
    console.log('Go to link https://eam.pvpower.vn/maximo/webclient/login/login.jsp')
    //await page.waitForNavigation();
    await page.type('#username', "CM-DVSC-IC");
    await page.type('#password', "ICPVPSCMB");
    await page.click('#loginbutton');
    //wait panel appear
    //await page.waitForNavigation();
    console.log('Login success')
    await page.waitForSelector('#FavoriteApp_SR_VA1');
    await page.click('#FavoriteApp_SR_VA1');
    //await page.waitForSelector('input');
    await page.waitForNavigation();
    //await page.waitForTimeout(15000);
    await page.waitForSelector('#toolbar2_tbs_0_tbcb_0_query-tb');
    await page.evaluate(() => {
      return document.getElementById("toolbar2_tbs_0_tbcb_0_query-tb").click();
    });
    //await page.waitForNavigation();
    await page.waitForTimeout(5000);
    console.log('Go to SR complete')
    await page.waitForSelector('#menu0_useAllRecsQuery_OPTION_a');
    await page.evaluate(() => {
      return document.getElementById("menu0_useAllRecsQuery_OPTION_a").click()
    });
    await page.waitForTimeout(5000);
    await page.type('input[id="m6a7dfd2f_tfrow_[C:9]_txt-tb"]', String(department));
    await page.keyboard.press('Enter');
    await page.waitForTimeout(5000);
    console.log('find by ' + department);
    let sr = await getPage(browser, page, times);
    browser.close();
    return sr;
  } catch (e) {
    console.error(e.message);
  } finally {
    await browser.close();
  }
};


async function getPage(browser, page, times) {
  //collect all content in <span>
  let srIndex = 0;
  let serviceRequest = [];

  for (let i = 0; i < times; i++) {
    serviceRequest = await getPageCount(browser, page, i, serviceRequest, srIndex)
    srIndex = serviceRequest.length + srIndex;
    //console.log(srIndex);
  }
  return serviceRequest;
}

async function getPageCount(browser, page, count, serviceRequest, srIndex) {
  if (count >= 1) {
    await page.click('a[id="m6a7dfd2f-ti7"]');
    await page.waitForTimeout(5000);
  }
  let table = await page.evaluate(() => {
    const tds = Array.from(document.querySelectorAll("table#m6a7dfd2f_tbod-tbd tr td span"))
    return tds.map(td => td.innerText);
  })
  //console.log(table);
  var d = new Date();
  var year = d.getFullYear();
  var includeTime = String("/" + year);
  //console.log(find)
  let element = [];
  let timeIndex = [];
  let j = 0;
  await page.waitForTimeout(100);
  for (var ii = 0; ii <= table.length; ii++) {
    //remove <span> empty
    if (table[ii]) {
      //find index have year now [*/year*]
      if (table[ii].includes(includeTime)) {
        timeIndex[j] = ii;
        j++;
      }
    }
  }
  //console.log(timeIndex);
  await page.waitForTimeout(100);

  for (var iii = 0; iii < timeIndex.length; iii++) {
    element.sr = table[timeIndex[iii] - 5];
    element.summary = table[timeIndex[iii] - 4];
    element.asset = table[timeIndex[iii] - 3];
    element.location = table[timeIndex[iii] - 2];
    element.plant = table[timeIndex[iii] - 1];
    element.timeIndex = convertStringToDate(table[timeIndex[iii]]);
    element.status = table[timeIndex[iii] + 1];
    element.departmentService = table[timeIndex[iii] + 2];
    serviceRequest[iii + srIndex] = {
      ...element
    }
  }
  return serviceRequest;
}