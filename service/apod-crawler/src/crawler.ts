import {config, logger} from './config.js';
import {downloadApiMedia} from './download.js';
import {saveExplanation} from './explanation.js';
import {fetchApodApiResponse} from './fetch.js';
import {mkdirp} from './util.js';

export async function crawl(): Promise<void> {
  logger.logMethod?.('crawl');
  const response = await fetchApodApiResponse();
  if (response != null) {
    const pathPrefix = config.dataPathPrefix + response.date + '/';
    mkdirp(pathPrefix);
    await downloadApiMedia(response, pathPrefix);
    saveExplanation(response, pathPrefix);
  }
}
