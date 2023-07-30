import {config, logger} from './config.js';
import {downloadResponseMedia} from './download.js';
import {saveResponse} from './explanation.js';
import {fetchApodApiResponse} from './fetch.js';
import {mkdirp} from './util.js';

export async function crawl(): Promise<void> {
  logger.logMethod?.('crawl');
  const response = await fetchApodApiResponse();
  if (response != null) {
    const pathPrefix = config.dataPathPrefix + response.date.replace(/-/g, '/') + '/';
    await mkdirp(pathPrefix);
    saveResponse(response, pathPrefix);
    await downloadResponseMedia(response, pathPrefix);
  }
  else {
    throw new Error('No response from API');
  }
}
