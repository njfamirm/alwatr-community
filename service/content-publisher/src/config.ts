import {env} from 'node:process';

import {createLogger} from '@alwatr/logger';

export const logger = createLogger('publish-post');

const mediaBaseUrl = env.MEDIA_BASE_URL;
if (mediaBaseUrl == null) {
  throw new
  Error('Media base URL required, MEDIA_BASE_URL="https://github.com/njfamirm/blog-archive/post/" yarn start');
}

const mediumUserId = env.MEDIUM_USER_ID;
export const config = {
  metadataFilePath: env.METADATA_FILE_PATH ?? 'metadata.yaml',
  contentFilePath: env.CONTENT_FILE_PATH ?? 'content.md',
  mediaBaseUrl,
  medium: {
    apiUrl: `https://api.medium.com/v1/users/${mediumUserId}/posts/`,
    apiToken: env.MEDIUM_API_TOKEN as string,
  },
  devTo: {
    apiUrl: 'https://dev.to/api/articles/',
    apiToken: env.DEV_TO_API_TOKEN as string,
  },
};

export function checkConfig(publishWebsite: string): void {
  if (publishWebsite === 'medium') {
    if (config.medium.apiToken == null) {
      throw new Error('Medium API token required, MEDIUM_API_TOKEN="YOUR_SECRET_API_TOKEN" yarn start');
    }
    else if (mediumUserId == null) {
      throw new Error('Medium user ID required, MEDIUM_USER_ID="YOUR_SECRET_API_TOKEN" yarn start');
    }
  }
  else if (publishWebsite === 'dev-to') {
    if (config.devTo.apiToken == null) {
      throw new Error('Dev.to API token required, DEV_TO_API_TOKEN="YOUR_SECRET_API_TOKEN" yarn start');
    }
  }
}
