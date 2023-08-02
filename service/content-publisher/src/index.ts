import {argv, env} from 'node:process';

import {checkConfig, logger} from './config.js';
import {publishPostToDevTo, publishNewPostMedium} from './publish.js';

logger.logOther?.('..:: Content Publisher ::..');

const publishWebsite = argv[2] ?? env.PUBLISH_WEBSITE;

if (!publishWebsite) {
  throw new Error('Publish website required');
}

logger.logOther?.('Publishing to:', publishWebsite);

checkConfig(publishWebsite);
if (publishWebsite === 'medium') {
  await publishNewPostMedium();
}
else if (publishWebsite === 'dev-to') {
  await publishPostToDevTo();
}
else {
  throw new Error('Invalid publish website');
}
