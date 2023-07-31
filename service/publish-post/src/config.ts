import {createLogger} from '@alwatr/logger';

export const logger = createLogger('publish-post');

const devToApiToken = process.env.DEV_TO_API_TOKEN;
if (devToApiToken == null) {
  throw new Error('Dev.to API token required, DEV_TO_API_TOKEN="YOUR_SECRET_API_TOKEN" yarn start');
}

export const config = {
  devTo: {
    apiUrl: 'https://dev.to/api/articles',
    devToApiToken,
  },
};
