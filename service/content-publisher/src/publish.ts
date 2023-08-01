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


  content = `![${metadata.title}](${config.mediaBaseUrl + metadata.coverImage})\n${content}`;

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

  const mediumResponse = await mediumPublishPost(mediumArticle, config.medium.apiToken);

  if (mediumResponse.status !== 201) {
    throw new Error(`medium.com response status code is ${mediumResponse.status}`);
  }

  const mediumResponseJson = await mediumResponse.json() as MediumPublishPostResponse;
  logger.logProperty?.('publishNewPostMedium', {mediumResponseJson});

  addPostLinkToMetadata(metadataPath, metadata, mediumResponseJson.data.url, 'medium');
  return mediumResponseJson.data.url;
}

export async function publishNewPostDevTo(): Promise<string> {
  logger.logMethod?.('publishNewPostDevTo');

  const content = getPostContent(config.contentFilePath);
  const metadata = readPostMetadata(config.metadataFilePath);


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
    throw new Error(`dev.to response status code is ${devToResponse.status}`);
  }

  const devToResponseJson = await devToResponse.json() as DevToPublishPostResponse;
  logger.logProperty?.('publishNewPostDevTo', {devToResponseJson});

  addPostLinkToMetadata(config.metadataFilePath, metadata, devToResponseJson.url, 'dev-to');
  return devToResponseJson.url;
}
