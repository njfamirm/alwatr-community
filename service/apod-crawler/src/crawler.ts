import {config, logger} from './config.js';
import {downloadApiMedia} from './download.js';
import {fetchApodApiResponse} from './fetch.js';

export async function crawl(): Promise<void> {
  logger.logMethod?.('crawl');
  const response = await fetchApodApiResponse();
  if (response != null) {
    await downloadApiMedia(response, config.mediaPathPrefix);
  }
}
