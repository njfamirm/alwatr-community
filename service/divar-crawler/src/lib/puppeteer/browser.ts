import {launch, type Browser} from 'puppeteer-core';

import {blockResource} from './resource-block.js';
import {config, logger} from '../../config.js';

function launchBrowser(): Promise<Browser> {
  logger.logMethod?.('launchBrowser');
  return launch(config.puppeteer);
}

export const browser = await launchBrowser();

// Page for temporary and short jobs
export const tmpPage = (await browser.pages())[0];
await blockResource(tmpPage);
