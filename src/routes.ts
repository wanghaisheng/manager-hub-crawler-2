import { createPlaywrightRouter } from 'crawlee';
import {CONSTANTS} from "./CONSTANTS.js";
import {checkLoginStatus} from "./checkLoginStatus.js";
import {UtilService} from "./utilService.js";

export const router = createPlaywrightRouter();

router.addDefaultHandler(async ({ enqueueLinks, log ,page}) => {
    log.info(`enqueueing new URLs`);
    await UtilService.snapshot(page, 'defaultHandler');



    const loginStatus =  await checkLoginStatus(page);

    UtilService.log('loginStatus', {loginStatus});

    if(loginStatus === 'logouted'){
        await enqueueLinks({
            globs: ['**/*?*act=dispMemberLoginForm*'],
            label: 'login',
        })
        // await enqueueLinks({
        //     globs: ['/sschkiss'],
        //     label: 'login',
        // });
    }else{
        await enqueueLinks({
            globs: ['/sschkiss'],
            label: 'shops',
        });
    }


    // // join url with base url with library
    // const targetUrl = new URL('/**', CONSTANTS.BASE_URL).href;
    //
    //
    // await enqueueLinks({
    //     globs: [targetUrl],
    //     label: 'detail',
    // });

});

router.addHandler('detail', async ({ request, page, log, pushData }) => {
    const title = await page.title();
    log.info(`${title}`, { url: request.loadedUrl });

    await pushData({
        url: request.loadedUrl,
        title,
    });
});

router.addHandler('login', async ({ request, page, log, pushData }) => {
    log.info('login 핸들러 실행');
    await UtilService.snapshot(page, 'loginHandler');
    const title = await page.title();
    log.info(`${title}`, { url: request.loadedUrl });

    await pushData({
        url: request.loadedUrl,
        title,
    });

    UtilService.log(`UA: ${( page.context()?.browser()?.contexts())}`)
    const ID = 'test211016'
    const PW = 'dltnwjd8'

    UtilService.log('Solve recaptcha')
    await page.solveRecaptchas()
    UtilService.log('Solve recaptcha done')
    UtilService.log('Fill ID and PW')
    await page.fill('#uid', ID)
    await page.fill('#upw', PW)

    await page.click('.submit.btn');
    UtilService.log('Submit search form')
    await page.waitForURL('**\/main*')
    UtilService.log('login success')
    UtilService.snapshot(page, 'login-success')

});
