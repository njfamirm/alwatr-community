import {argv} from 'node:process';

import {checkConfig, logger} from './config.js';
import {publishNewPostDevTo, publishNewPostMedium} from './publish.js';

logger.logOther?.('..:: Content Publisher ::..');

const publishWebsite = argv[argv.indexOf('-w') + 1];
const basePath = argv[argv.indexOf('-b') + 1];

if (publishWebsite == '') {
  throw new Error('Website name required, -w medium|dev-to');
}
else if (basePath == '') {
  throw new Error('Base path required, -b ./data/');
}

logger.logOther?.('Publishing to:', publishWebsite);
logger.logOther?.('Base path:', basePath);

checkConfig(publishWebsite);
if (publishWebsite === 'medium') {
  await publishNewPostMedium(basePath);
}
else if (publishWebsite === 'dev-to') {
  await publishNewPostDevTo(basePath);
}
else {
  throw new Error('Invalid publish website');
}
