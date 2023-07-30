import {existsSync} from 'node:fs';

import {config, logger} from './config.js';
import {downloadResponseMedia} from './download.js';
import {saveResponse} from './explanation.js';
import {fetchApodApiResponse} from './fetch.js';
import {mkdirp} from './util.js';

export async function crawl(): Promise<void> {
  logger.logMethod?.('crawl');
  const response = await fetchApodApiResponse(config.date);
  if (response != null) {
    const pathPrefix = config.dataPathPrefix + response.date.replace(/-/g, '/') + '/';
    if (existsSync(pathPrefix)) {
      logger.error('crawl', 'apod_exists_already', pathPrefix);
      throw new Error('APOD exists already');
    }
    await mkdirp(pathPrefix);

    saveResponse(response, pathPrefix);
    await downloadResponseMedia(response, pathPrefix);
  }
  else {
    throw new Error('No response from API');
  }
}
