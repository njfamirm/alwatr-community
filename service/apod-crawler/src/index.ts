import {logger} from './config.js';
import {crawl} from './crawler.js';

logger.banner?.('..:: Nasa APOD Crawler ::..');

crawl();
