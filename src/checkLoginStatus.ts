import {Page} from "playwright";
import {UtilService} from "./utilService.js";
export const checkLoginStatus = async (page:Page, injectJQuery: ()=>Promise<unknown>):Promise<'logined' | 'logouted'> => {
  await injectJQuery()

  const content = await page.content();
  UtilService.log('checkLoginStatus', {content})

  return page.evaluate(() => {


  if ($(content).find('a[href*="dispMemberLogout"]').length > 0) {
    return 'logined';
  }

    if ($(content).find('a[href*="dispMemberLoginForm"]').length > 0) {
        return 'logouted';
    }

  // Default to logged out if no definitive links are found
  return 'logouted';
  })








}
