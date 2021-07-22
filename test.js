const puppeteer = require('puppeteer');
(async () => {
    // Get the username and password inputs
    //const input = await puppeteer.getValue('INPUT');
    //console.log(input)
    const browser = await puppeteer.launch({headless:false});
    const page = await browser.newPage();
    await page.setViewport({width:720,height:360})
    //await page.goto('https://facebook.com');
    //await page.goto('https://eam.pvpower.vn/maximo/webclient/login/login.jsp');
    await page.goto('https://www.tools4testing.com/contents/selenium/testpages/registration-form-testpage');
    const fullName = await page.$("#fullname");
await fullName.focus();
await fullName.type("aloalo");
    // Login

    // await page.type('#username', "CM-DVSC-IC");
    // await page.type('#password', "ICPVPSCMB");
    // await page.click('#loginbutton');
   

   //await page.waitForNavigation();
//    await page.waitForSelector('#FavoriteApp_SR_VA1');
//    await page.mouse.click(100,173);
//    await page.click('#FavoriteApp_SR_VA1');
//    await page.waitForSelector('#FavoriteApp_SR_VA1');
//    await page.click('#FavoriteApp_SR_VA1');
//    await page.waitForSelector('input');
//    await page.mouse.move(0,0);
//    await page.mouse.click(60,67);
//    await page.type('#m6a7dfd2f_tfrow_[C:1]_txt-tb', "sddsf")
//    await page.waitForSelector('input#toolbar2_tbs_0_tbcb_0_query-tb.fld.text.tbctb.ib');
//    await page.click('input#toolbar2_tbs_0_tbcb_0_query-tb.fld.text.tbctb.ib')
   //await page.focus('input');

   //await page.waitForNavigation();


    // // Get cookies
    // const cookies = await page.cookies();
    // console.log(cookies)
    // // Use cookies in another tab or browser
    // const page2 = await browser.newPage();
    // await page2.setCookie(...cookies);
    // // Open the page as a logged-in user
    // await page2.goto('https://eam.pvpower.vn/maximo/webclient/login/login.jsp');

    //await browser.close();

    //log.info('Done.');
})();