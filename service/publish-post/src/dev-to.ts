import {fetch} from '@alwatr/fetch';

import {config, logger} from './config.js';

import type {DevToArticle} from './type.js';

export function fetchPublishPost(article: DevToArticle, apiKey: string): Promise<Response> {
  logger.logMethodArgs?.('fetchPublishPost', {article});
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

export function fetchUpdatePost(article: DevToArticle, postId: number, apiKey: string): Promise<Response> {
  logger.logMethodArgs?.('fetchUpdatePost', {article, postId});
  return fetch({
    url: `${config.devTo.apiUrl}/${postId}`,
    method: 'PUT',
    headers: {
      'api-key': apiKey,
    },
    bodyJson: {
      article,
    },
  });
}

export async function publishNewPostDevTo(article: DevToArticle): Promise<void> {
  logger.logMethodArgs?.('publishNewPostDevTo', {article});
  article.published ??= false;
  article.tags ??= [];

  const response = await fetchPublishPost(article, config.devTo.devToApiToken);
  logger.logProperty?.('publishNewPostDevTo', {response});
}
