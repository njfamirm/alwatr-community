import {logger} from './config.js';

export async function crawl(): Promise<void> {
  logger.logMethod?.('crawl');
}
