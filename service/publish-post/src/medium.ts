import {fetch} from '@alwatr/fetch';

import {config, logger} from './config.js';

import type {MediumArticle} from './type.js';

export function mediumPublishPost(article: MediumArticle, apiKey: string): Promise<Response> {
  logger.logMethodArgs?.('mediumPublishPost', {article});
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
