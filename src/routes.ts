import { createPlaywrightRouter } from 'crawlee';
import {CONSTANTS} from "./CONSTANTS.js";

export const router = createPlaywrightRouter();

router.addDefaultHandler(async ({ enqueueLinks, log }) => {
    log.info(`enqueueing new URLs`);
    await enqueueLinks({
        globs: ['https://crawlee.dev/**'],
        label: 'detail',
    });

    // join url with base url with library
    const targetUrl = new URL('/**', CONSTANTS.BASE_URL).href;

    await enqueueLinks({
        globs: [targetUrl],
        label: 'detail',
    });

});

router.addHandler('detail', async ({ request, page, log, pushData }) => {
    const title = await page.title();
    log.info(`${title}`, { url: request.loadedUrl });

    await pushData({
        url: request.loadedUrl,
        title,
    });
});
