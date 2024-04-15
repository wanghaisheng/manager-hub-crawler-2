import {Page} from "playwright";
export const checkLoginStatus = async (page:Page):Promise<'logined' | 'logouted'> => {

  if ((await page.$('a[href*="dispMemberLogout"]')) !== null) {
    return 'logined';
  }

  if((await page.$('a[href*="dispMemberLoginForm"]')) !== null){
    return 'logouted';
  }

  return 'logouted';









}
