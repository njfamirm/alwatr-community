import {config, logger} from './config.js';
import {fetchPublishPost} from './dev-to.js';
import {readPostMetadata} from './metadata.js';
import {getPostContent} from './post.js';

export async function publishNewPostDevTo(): Promise<void> {
  logger.logMethod?.('publishNewPostDevTo');

  const content = getPostContent(config.devTo.contentFilePath);
  const metadata = readPostMetadata(config.devTo.metadataFilePath);

  const article = {
    ...metadata,
    body_markdown: content,
  };
  logger.logProperty?.('publishNewPostDevTo', {article});

  const response = await fetchPublishPost(article, config.devTo.devToApiToken);
  logger.logProperty?.('publishNewPostDevTo', {response: await response.json()});
}
