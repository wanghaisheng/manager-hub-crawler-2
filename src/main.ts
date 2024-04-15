// For more information, see https://crawlee.dev/
import { PlaywrightCrawler, ProxyConfiguration } from 'crawlee';

import { router } from './routes.js';

// playwright-extra is a drop-in replacement for playwright,
// it augments the installed playwright with plugin functionality
import {chromium} from "playwright-extra";

import puppeteerExtraPluginStealth from 'puppeteer-extra-plugin-stealth'

// Load the stealth plugin and use defaults (all tricks to hide playwright usage)
// Note: playwright-extra is compatible with most puppeteer-extra plugins
const stealth = puppeteerExtraPluginStealth()

// Add the plugin to playwright (any number of plugins can be added)
chromium.use(stealth)

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
