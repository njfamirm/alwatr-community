import {delay} from '@alwatr/util';

import {browser} from './browser.js';
import {blockResource} from './resource-block.js';
import {logger} from '../../config.js';

import type {Page, WaitForOptions} from 'puppeteer-core';

export async function openPage(
    url: string,
    page?: Page,
    w4option: WaitForOptions = {waitUntil: 'load', timeout: 15000},
): Promise<Page> {
  if (page === undefined) {
    page = await browser.newPage();
    // prevent add new request handler
    await blockResource(page);
  }

  await page.goto(url, w4option);

  return page;
}

export function scrollDown(page: Page): Promise<void> {
  return page.evaluate(() => {
    window.scrollTo({left: 0, top: document.body.scrollHeight, behavior: 'smooth'});
  });
}

// remove all cookie from page
export async function removePageCookie(page: Page): Promise<void> {
  (await page.target().createCDPSession()).send('Network.clearBrowserCookies');
}

export async function getCookieValue(name: string, page: Page, retry = 0): Promise<string> {
  // first time
  retry++;

  while (retry > 0) {
    const pageCookie = await page.cookies();
    const value = pageCookie.filter((obj) => obj.name === name)[0]?.value;
    retry--;
    if (value) return value;
    await delay(500);
  }
  return '';
}

// Checks if the end of the page has been reached,
// if true, check network idle for 30 second and then exit
export async function checkEndOfPage(page: Page): Promise<boolean> {
  let isEndOfPage = page.evaluate(() => document.body.scrollHeight <= window.scrollY + window.innerHeight);
  if (!(await isEndOfPage)) return false;

  try {
    await page.waitForNetworkIdle({idleTime: 10000});
  }
  catch {
    return false;
  }

  isEndOfPage = page.evaluate(() => document.body.scrollHeight <= window.scrollY + window.innerHeight);
  if (await isEndOfPage) {
    page.close();
    logger.logOther?.('Reached the end of the page');
    return true;
  }

  return false;
}
