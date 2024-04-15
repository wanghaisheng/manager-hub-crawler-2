// For more information, see https://crawlee.dev/
import { PlaywrightCrawler, ProxyConfiguration } from 'crawlee';

import { router } from './routes.js';

// playwright-extra is a drop-in replacement for playwright,
// it augments the installed playwright with plugin functionality
import {chromium} from "playwright-extra";

import puppeteerExtraPluginStealth from 'puppeteer-extra-plugin-stealth'
import puppeteerExtraPluginRecaptcha from 'puppeteer-extra-plugin-recaptcha'
import puppeteerExtraPluginAnonymizeUa from 'puppeteer-extra-plugin-anonymize-ua'


// Load the stealth plugin and use defaults (all tricks to hide playwright usage)
// Note: playwright-extra is compatible with most puppeteer-extra plugins
// Add the plugin to playwright (any number of plugins can be added)
chromium.use(puppeteerExtraPluginStealth())

// @ts-ignore
chromium.use(puppeteerExtraPluginAnonymizeUa())

chromium.use(
// @ts-ignore
    puppeteerExtraPluginRecaptcha({
        provider: { id: '2captcha', token: '03be056750ef2d44999aac82101409c9' },
        visualFeedback: true
    })
)


const startUrls = ['https://crawlee.dev'];

const crawler = new PlaywrightCrawler({
    // proxyConfiguration: new ProxyConfiguration({ proxyUrls: ['...'] }),
    requestHandler: router,
    // Comment this option to scrape the full website.
    maxRequestsPerCrawl: 20,
    launchContext: {
        launcher: chromium,
        launchOptions: {
            headless: true
        }
    }
});

await crawler.run(startUrls);
