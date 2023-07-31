import {logger} from './config.js';
import {publishNewPostDevTo} from './dev-to.js';

logger.logOther?.('..:: Publish Post ::..');

const article = {
  title: 'A sample article about...',
  body_markdown: '',
  published: false,
  tags: ['discuss', 'javascript'],
};

publishNewPostDevTo(article);
