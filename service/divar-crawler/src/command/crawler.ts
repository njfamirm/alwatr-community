import {logger, selector} from '../config.js';
import {crawlerPost} from '../crawler.js';
import {exportCsv} from '../export-csv.js';
import {openPage} from '../lib/puppeteer/pptr-helper.js';

export async function crawlCommand(name: string, url: string): Promise<void> {
  logger.logMethod?.('crawlCommand');

  let postListPage;
  try {
    postListPage = await openPage(url);

    // check page correct loaded
    await postListPage.waitForSelector(selector.productLink, {visible: true, timeout: 10000});
  }
  catch (err) {
    logger.error('crawlCommand', 'page_loading_failed', err);
    return;
  }

  for (;;) {
    if (await crawlerPost(name, postListPage)) break;
  }
}

export async function exportCommand(name: string): Promise<void> {
  exportCsv(name);
}
