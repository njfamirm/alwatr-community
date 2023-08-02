import {config, logger} from './config.js';
import {devToPublishPost} from './dev-to.js';
import {mediumPublishPost} from './medium.js';
import {addPostLinkToMetadata, readPostMetadata} from './metadata.js';
import {getPostContent} from './post.js';

import type {DevToArticle, DevToPublishPostResponse, MediumArticle, MediumPublishPostResponse} from './type.js';

export async function publishNewPostMedium(): Promise<string> {
  logger.logMethod?.('publishNewPostMedium');

  let content = getPostContent(config.contentFilePath);
  const metadata = readPostMetadata(config.metadataFilePath);

  if (metadata.medium?.publishStatus === 'no') {
    logger.logProperty?.('publishNewPostMedium', 'publish_status_no');
    return '';
  }

  content = `![${metadata.title}](${config.mediaBaseUrl + metadata.coverImage})\n${content}`;

  const mediumArticle: MediumArticle = {
    title: metadata.title,
    contentFormat: 'markdown',
    content,
    tags: metadata.tags,
    canonicalUrl: metadata.medium.canonicalUrl,
    publishStatus: 'draft',
    license: metadata.medium.license,
    notifyFollowers: true,
  };
  logger.logProperty?.('publishNewPostMedium', {article: mediumArticle});

  const mediumResponse = await mediumPublishPost(mediumArticle, config.medium.apiToken);

  if (mediumResponse.status !== 201) {
    logger.error('publishNewPostMedium', 'publish_post_failed', {mediumResponse});
    throw new Error(`medium.com response status code is ${mediumResponse.status}`);
  }

  const mediumResponseJson = await mediumResponse.json() as MediumPublishPostResponse;
  logger.logProperty?.('publishNewPostMedium', {mediumResponseJson});

  addPostLinkToMetadata(config.metadataFilePath, metadata, mediumResponseJson.data.url, 'medium');
  return mediumResponseJson.data.url;
}

export async function publishNewPostDevTo(): Promise<string> {
  logger.logMethod?.('publishNewPostDevTo');

  const content = getPostContent(config.contentFilePath);
  const metadata = readPostMetadata(config.metadataFilePath);

  if (metadata.devTo?.publishStatus === 'no') {
    logger.logProperty?.('publishNewPostDevTo', 'publish_status_no');
    return '';
  }

  const devToArticle: DevToArticle = {
    title: metadata.title,
    published: false,
    tags: metadata.tags,
    canonical_url: metadata.devTo.canonicalUrl,
    description: metadata.description,
    main_image: config.mediaBaseUrl + metadata.coverImage,
    organization_id: metadata.devTo.organizationId,
    series: metadata.devTo.series,
    body_markdown: content,
  };
  logger.logProperty?.('publishNewPostDevTo', {article: devToArticle});

  const devToResponse = await devToPublishPost(devToArticle, config.devTo.apiToken);

  if (devToResponse.status !== 201) {
    logger.error('publishNewPostDevTo', 'publish_post_failed', {devToResponse});
    throw new Error(`dev.to response status code is ${devToResponse.status}`);
  }

  const devToResponseJson = await devToResponse.json() as DevToPublishPostResponse;
  logger.logProperty?.('publishNewPostDevTo', {devToResponseJson});

  addPostLinkToMetadata(config.metadataFilePath, metadata, devToResponseJson.url, 'dev-to');
  return devToResponseJson.url;
}
