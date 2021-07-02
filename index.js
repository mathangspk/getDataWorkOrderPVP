const Apify = require('apify')
const { log } = Apify.utils;
Apify.main(async () => {
    // Get the username and password inputs
    const input = await Apify.getValue('INPUT');
    console.log(input)
    const browser = await Apify.launchPuppeteer();
    const page = await browser.newPage();
    //await page.goto('https://facebook.com');
    await page.goto('https://eam.pvpower.vn/maximo/webclient/login/login.jsp');

    // Login
    await page.type('#username', input.username);
    await page.type('#password', input.password);
    await page.click('#loginbutton');
   

   //await page.waitForNavigation();
   await page.waitForSelector('#FavoriteApp_SR_VA1');
   await page.click('#FavoriteApp_SR_VA1');
   await page.waitForSelector('#FavoriteApp_SR_VA1');
   await page.click('#FavoriteApp_SR_VA1');
   await page.waitForNavigation();

    // // Get cookies
    const cookies = await page.cookies();
    console.log(cookies)
    // // Use cookies in another tab or browser
    // const page2 = await browser.newPage();
    // await page2.setCookie(...cookies);
    // // Open the page as a logged-in user
    // await page2.goto('https://eam.pvpower.vn/maximo/webclient/login/login.jsp');

    //await browser.close();

    //log.info('Done.');
})