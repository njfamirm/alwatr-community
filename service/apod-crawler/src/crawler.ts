import {logger} from './config.js';
import {downloadApiMedia} from './download.js';
import {fetchApodApiResponse} from './fetch.js';

export async function crawl(): Promise<void> {
  logger.logMethod?.('crawl');
  const response = await fetchApodApiResponse();
  console.log(response);
  if (response != null) {
    await downloadApiMedia(response);
  }
}
