import {argv, env} from 'node:process';

import {checkConfig, logger} from './config.js';
import {publishNewPostDevTo, publishNewPostMedium} from './publish.js';

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
  await publishNewPostDevTo();
}
else {
  throw new Error('Invalid publish website');
}
