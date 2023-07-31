import {createLogger} from '@alwatr/logger';

export const logger = createLogger('publish-post');

const mediaBaseUrl = process.env.MEDIA_BASE_URL;
const devToApiToken = process.env.DEV_TO_API_TOKEN;
if (devToApiToken == null) {
  throw new Error('Dev.to API token required, DEV_TO_API_TOKEN="YOUR_SECRET_API_TOKEN" yarn start');
}
if (mediaBaseUrl == null) {
  throw new
  Error('Media base URL required, MEDIA_BASE_URL="https://github.com/njfamirm/blog-archive/post/" yarn start');
}

export const config = {
  devTo: {
    apiUrl: 'https://dev.to/api/articles',
    devToApiToken,
  },
  mediaBaseUrl,
};