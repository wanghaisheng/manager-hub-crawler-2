import {createPlaywrightRouter, enqueueLinks} from 'crawlee';
import {CONSTANTS} from "./CONSTANTS.js";
import {checkLoginStatus} from "./checkLoginStatus.js";
import {UtilService} from "./utilService.js";

export const router = createPlaywrightRouter();


// function that check input url string match glob pattern or not. input two argument string that url and glob pattern, return boolean
function matchGlob(url:string, glob:string): boolean {
    const regex = new RegExp(`^${glob.split('*').join('.*')}$`);
    return regex.test(url);
}

// function that check match glob but input glob is list. and return true if match any glob pattern
function matchGlobs(url:string, globs:string[]): boolean {
    return globs.some(glob => matchGlob(url, glob));
}

router.use(async (ctx) => {


    if(matchGlobs(ctx.request.url, ['**/sschkiss', '**/sschkiss/[0-9]*'])){
        // log that match what glob pattern with what url
        UtilService.log('match', {url: ctx.request.url, glob: '**/sschkiss'});

        // delay 30s
        await UtilService.sleep(3000);
    }


});

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
            globs: ['**/sschkiss'],
            label: 'shop-list',
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

router.addHandler('login', async ({ request, page, log, pushData,enqueueLinks }) => {
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
    await UtilService.snapshot(page, 'login-success')

    await enqueueLinks({
        globs: ['**/sschkiss'],
        label: 'shop-list',
    })

});

router.addHandler('shop-list', async (context) => {
    UtilService.log('shop-list 핸들러')
    await UtilService.snapshot(context.page, 'shop-list');


    await context.enqueueLinks({
        globs: ['**/sschkiss/[0-9]*'  ],
        label: 'shop-detail',
    });
})
router.addHandler('shop-detail', async (context) => {
    UtilService.log('shop-detail 핸들러')
    await UtilService.snapshot(context.page, 'shop-detail');
})
