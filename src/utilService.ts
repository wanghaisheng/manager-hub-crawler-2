import { utils } from 'crawlee'
import {Page} from "playwright";
import moment from "moment";

export const UtilService = {
  log: (message: string, data?: Record<string, any> | null) => {
    utils.log.info(`[${moment().toISOString()}] ${message}`, data)
  },
  sleep: async (ms: number) => {
    UtilService.log(`sleep start for ${ms}ms`)
    await utils.sleep(ms)
    UtilService.log('sleep end')
  },
  snapshot: async (page: Page, key?: string) => {
    UtilService.log('스냅샷 촬영 시작')
    // const title = await page.title();
    const title = ''
    await utils.puppeteer.saveSnapshot(page, { key: `${new Date().getTime()}---${title}---${key}`, saveHtml: true })
    UtilService.log('스냅샷 촬영 완료')
    const pages = ( page.context()).pages()
    UtilService.log(`pages.length: ${pages.length}`)
    UtilService.log(`pages: \n${pages.map((value, index) => `[${index}] ${value.url()}`).join('\n')}`)
  }
}
