import {config, logger} from './config.js';
import {devToPublishPost, devToUpdatePost} from './dev-to.js';
import {mediumPublishPost} from './medium.js';
import {updatePostMetadata as updateMetadata, readPostMetadata} from './metadata.js';
import {getPostContent} from './post.js';

import type {DevToArticle, DevToPublishPostResponse, MediumArticle, MediumPublishPostResponse} from './type.js';

export async function publishNewPostMedium(): Promise<string> {
  logger.logMethod?.('publishNewPostMedium');

  let content = getPostContent(config.contentFilePath);
  const metadata = readPostMetadata(config.metadataFilePath);
  metadata.medium ??= {};

  if (metadata.medium?.publishStatus === 'no') {
    logger.logProperty?.('publishNewPostMedium', 'publish_status_no');
    return '';
  }

  content = `![${metadata.title}](${config.mediaBaseUrl + metadata.coverImage})\n${content}`;

  const mediumArticle: MediumArticle = {
    title: metadata.title,
    contentFormat: 'markdown',
    content,
    tags: metadata.medium.tags,
    canonicalUrl: metadata.medium?.canonicalUrl,
    publishStatus: 'draft',
    license: metadata.medium?.license,
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

  updateMetadata(config.metadataFilePath, {medium: {url: mediumResponseJson.data.url}});
  return mediumResponseJson.data.url;
}

export async function publishPostToDevTo(): Promise<string> {
  logger.logMethod?.('publishPostToDevTo');

  const content = getPostContent(config.contentFilePath);
  const metadata = readPostMetadata(config.metadataFilePath);
  metadata.devTo ??= {};

  if (metadata.devTo?.publishStatus === 'no') {
    logger.logProperty?.('publishPostToDevTo', 'publish_status_no');
    return '';
  }

  if (!metadata.devTo.canonicalUrl) {
    metadata.devTo.canonicalUrl = metadata.medium?.url;
  }

  const devToArticle: DevToArticle = {
    title: metadata.title,
    published: false,
    tags: metadata.devTo.tags,
    canonical_url: metadata.devTo.canonicalUrl,
    description: metadata.description,
    main_image: config.mediaBaseUrl + metadata.coverImage,
    organization_id: metadata.devTo.organizationId,
    series: metadata.devTo.series,
    body_markdown: content,
  };
  logger.logProperty?.('publishPostToDevTo', {article: devToArticle});

  const postId = metadata.devTo.postId;
  let devToResponse;
  if (!postId) {
    devToResponse = await devToPublishPost(devToArticle, config.devTo.apiToken);
  }
  else {
    devToResponse = await devToUpdatePost(devToArticle, postId, config.devTo.apiToken);
  }

  if (devToResponse.status !== 200 && devToResponse.status !== 201) {
    logger.error('publishPostToDevTo', 'publish_post_failed', {devToResponse});
    throw new Error(`dev.to response status code is ${devToResponse.status}`);
  }

  const devToResponseJson = await devToResponse.json() as DevToPublishPostResponse;
  logger.logProperty?.('publishPostToDevTo', {devToResponseJson});

  updateMetadata(config.metadataFilePath, {devTo: {url: devToResponseJson.url, postId: devToResponseJson.id}});
  return devToResponseJson.url;
}
