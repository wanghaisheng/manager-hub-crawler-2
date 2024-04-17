import { utils } from 'crawlee'
import {Page} from "playwright";
import moment from "moment";

// global counter to keep track of how many times the snapshot function has been called
let snapshotCounter = 0

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
    snapshotCounter++




    UtilService.log('스냅샷 촬영 시작')
    // const title = await page.title();
    const title = ''

    // format current time to nice readable string with moment. but no blank space in the string. format is 'YYYY-MM-DDTHH_mm_ss'
    const currentTimeInIsoString =
        moment().format('YYYY-MM-DDTHH_mm_ss')


    // set counter indicater
    await utils.puppeteer.saveSnapshot(page, { key: `${currentTimeInIsoString}---${title}---${key}---${
          "("+snapshotCounter+")"
      }`, saveHtml: true })
    UtilService.log('스냅샷 촬영 완료')
    const pages = ( page.context()).pages()
    UtilService.log(`pages.length: ${pages.length}`)
    UtilService.log(`pages: \n${pages.map((value, index) => `[${index}] ${value.url()}`).join('\n')}`)
  }
}
