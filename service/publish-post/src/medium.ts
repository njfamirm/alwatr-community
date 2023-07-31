import {fetch} from '@alwatr/fetch';

import {config, logger} from './config.js';

import type {MediumArticle} from './type.js';

export function mediumPublishPost(article: MediumArticle, apiKey: string): Promise<Response> {
  logger.logMethodArgs?.('fetchPublishPost', {article});
  return fetch({
    url: config.medium.apiUrl,
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
    },
    bodyJson: {
      contentFormat: 'markdown',
      publishStatus: 'draft',
      license: 'all-rights-reserved',
      notifyFollowers: true,
      ...article,
    },
  });
}

// export function fetchUpdatePost(article: MediumArticle, postId: number, apiKey: string): Promise<Response> {
//   logger.logMethodArgs?.('fetchUpdatePost', {article, postId});
//   return fetch({
//     url: `${config.medium.apiUrl}/${postId}`,
//     method: 'PUT',
//     headers: {
//       'Authorization': `Bearer ${apiKey}`,
//     },
//     bodyJson: {
//       article,
//     },
//   });
// }
