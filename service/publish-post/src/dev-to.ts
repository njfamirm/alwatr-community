import {fetch} from '@alwatr/fetch';

import {config} from './config.js';

import type {DevToArticle} from './type.js';

export function fetchPublishPost(article: DevToArticle, apiKey: string): Promise<Response> {
  return fetch({
    url: config.devTo.apiUrl,
    method: 'POST',
    headers: {
      'api-key': apiKey,
    },
    bodyJson: {
      article,
    },
  });
}

export async function publishNewPostDevTo(article: DevToArticle): Promise<void> {
  const response = await fetchPublishPost(article, config.devTo.devToApiToken);
  console.log(response);
}
