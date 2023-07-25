import {logger} from './config.js';
import {crawl} from './crawler.js';

logger.logOther?.('..:: Nasa APOD Crawler ::..');

crawl();
