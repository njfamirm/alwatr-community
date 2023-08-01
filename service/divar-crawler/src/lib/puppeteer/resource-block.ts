import {logger} from '../../config.js';

import type {Page} from 'puppeteer-core';

export async function blockResource(page: Page): Promise<void> {
  logger.logMethod?.('blockResource');
  await page.setRequestInterception(true);
  page.on('request', (req) => {
    if (req.resourceType() === 'image' || req.resourceType() === 'font') {
      req.abort();
    }
    else {
      req.continue();
    }
  });
}
