import {config, logger} from './config.js';
import {fetchPublishPost} from './dev-to.js';
import {readPostMetadata} from './metadata.js';
import {getPostContent} from './post.js';

import type {DevToArticle} from './type.js';

export async function publishNewPostDevTo(): Promise<void> {
  logger.logMethod?.('publishNewPostDevTo');

  const content = getPostContent(config.contentFilePath);
  const metadata = readPostMetadata(config.metadataFilePath);

  const article: DevToArticle = {
    title: metadata.title,
    published: false,
    tags: metadata.tags,
    canonical_url: metadata.devTo.canonicalUrl,
    description: metadata.description,
    main_image: metadata.coverImage,
    organization_id: metadata.devTo.organizationId,
    series: metadata.devTo.series,
    body_markdown: content,
  };
  logger.logProperty?.('publishNewPostDevTo', {article});

  const response = await fetchPublishPost(article, config.devTo.devToApiToken);
  logger.logProperty?.('publishNewPostDevTo', {response: await response.json()});
}
