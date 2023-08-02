import {fetch} from '@alwatr/fetch';

import {config, logger} from './config.js';

import type {DevToArticle} from './type.js';

export function devToPublishPost(article: DevToArticle, apiKey: string): Promise<Response> {
  logger.logMethodArgs?.('devToPublishPost', {article});
  return fetch({
    url: config.devTo.apiUrl,
    method: 'POST',
    headers: {
      'api-key': apiKey,
    },
    bodyJson: {
      article: {
        published: false,
        ...article,
      },
    },
  });
}

export function devToUpdatePost(article: DevToArticle, postId: number, apiKey: string): Promise<Response> {
  logger.logMethodArgs?.('devToUpdatePost', {article, postId});
  return fetch({
    url: config.devTo.apiUrl + postId,
    method: 'PUT',
    headers: {
      'api-key': apiKey,
    },
    bodyJson: {
      article,
    },
  });
}
