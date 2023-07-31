import {config, logger} from './config.js';
import {devToPublishPost} from './dev-to.js';
import {mediumPublishPost} from './medium.js';
import {readPostMetadata} from './metadata.js';
import {getPostContent} from './post.js';

import type {DevToArticle, MediumArticle} from './type.js';

export async function publishNewPostMedium(): Promise<void> {
  logger.logMethod?.('publishNewPostMedium');

  let content = getPostContent(config.contentFilePath);
  const metadata = readPostMetadata(config.metadataFilePath, config.mediaBaseUrl);

  content = `![${metadata.title}](${metadata.coverImage})\n${content}`;

  const mediumArticle: MediumArticle = {
    title: metadata.title,
    contentFormat: 'markdown',
    content,
    tags: metadata.tags,
    canonicalUrl: metadata.medium.canonicalUrl,
    publishStatus: 'draft',
    license: metadata.medium.license,
    notifyFollowers: false,
  };
  logger.logProperty?.('publishNewPostMedium', {article: mediumArticle});

  const mediumResponse = await mediumPublishPost(mediumArticle, config.medium.mediumApiToken);
  logger.logProperty?.('publishNewPostMedium', {response: await mediumResponse.json()});
}

export async function publishNewPostDevTo(): Promise<void> {
  logger.logMethod?.('publishNewPostDevTo');

  const content = getPostContent(config.contentFilePath);
  const metadata = readPostMetadata(config.metadataFilePath, config.mediaBaseUrl);

  const devToArticle: DevToArticle = {
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
  logger.logProperty?.('publishNewPostDevTo', {article: devToArticle});

  const devToResponse = await devToPublishPost(devToArticle, config.devTo.devToApiToken);
  logger.logProperty?.('publishNewPostDevTo', {response: await devToResponse.json()});
}
