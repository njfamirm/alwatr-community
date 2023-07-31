import {env} from 'node:process';

import {createLogger} from '@alwatr/logger';

export const logger = createLogger('publish-post');

const mediumUserId = env.MEDIUM_USER_ID;
if (mediumUserId == null) {
  throw new Error('Medium user ID required, MEDIUM_USER_ID="YOUR_SECRET_API_TOKEN" yarn start');
}
const mediumApiToken = env.MEDIUM_API_TOKEN;
if (mediumApiToken == null) {
  throw new Error('Medium API token required, MEDIUM_API_TOKEN="YOUR_SECRET_API_TOKEN" yarn start');
}

const devToApiToken = env.DEV_TO_API_TOKEN;
if (devToApiToken == null) {
  throw new Error('Dev.to API token required, DEV_TO_API_TOKEN="YOUR_SECRET_API_TOKEN" yarn start');
}
const mediaBaseUrl = env.MEDIA_BASE_URL;
if (mediaBaseUrl == null) {
  throw new
  Error('Media base URL required, MEDIA_BASE_URL="https://github.com/njfamirm/blog-archive/post/" yarn start');
}

export const config = {
  metadataFilePath: env.METADATA_FILE_PATH ?? './data/metadata.yaml',
  contentFilePath: env.CONTENT_FILE_PATH ?? './data/content.md',
  mediaBaseUrl,
  medium: {
    apiUrl: `https://api.medium.com/v1/users/${mediumUserId}/posts/`,
    mediumApiToken,
  },
  devTo: {
    apiUrl: 'https://dev.to/api/articles/',
    devToApiToken,
  },
};
