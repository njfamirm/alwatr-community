import {fetch} from '@alwatr/fetch';

import {config, logger} from './config.js';

import type {ApodApiResponse} from './type.js';

export async function fetchApodApiResponse(date?: string): Promise<ApodApiResponse | undefined> {
  logger.logMethod?.('fetchApodApiResponse');
  const response = await fetch({
    url: config.apodApiUrl,
    queryParameters: {
      api_key: config.apodApiToken,
      thumbs: true,
      date: date ?? new Date().toISOString().split('T')[0],
    },
  });

  const responseJson = await response.json();
  if (response.status === 200) {
    return responseJson;
  }

  // else
  logger.error('fetchApodApiResponse', 'fetch_failed', responseJson);
  return undefined;
}
