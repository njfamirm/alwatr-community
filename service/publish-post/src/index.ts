import {logger} from './config.js';
import {publishNewPostDevTo, publishNewPostMedium} from './publish.js';

logger.logOther?.('..:: Publish Post ::..');


await publishNewPostMedium();
await publishNewPostDevTo();
