import {logger} from '../config.js';
import {browser} from '../lib/puppeteer/browser.js';

export async function exit(): Promise<void> {
  logger.logMethod?.('exit');
  await browser.close();
  process.exit();
}
