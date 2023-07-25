import {createLogger} from '@alwatr/logger';

export const logger = createLogger('apod-crawler');

const apodApiToken = process.env.APOD_API_TOKEN;
if (apodApiToken == null) {
  throw new Error('APOD API token required, APOD_API_TOKEN="NASA_API_TOKEN" yarn start');
}

export const config = {
  apodApiUrl: 'https://api.nasa.gov/planetary/apod',
  apodApiToken,
  dataPathPrefix: process.env.DATA_PATH_PREFIX ?? 'data/',
};
