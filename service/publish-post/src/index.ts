import {logger} from './config.js';
import {publishNewPostDevTo} from './dev-to.js';
import {getPostContent} from './post.js';

import type {DevToArticle} from './type.js';

logger.logOther?.('..:: Publish Post ::..');

const content = getPostContent('./data/article.md');

const article: DevToArticle = {
  title: 'A sample article about...',
  body_markdown: content,
  published: false,
  tags: ['discuss', 'javascript'],
};

publishNewPostDevTo(article);
