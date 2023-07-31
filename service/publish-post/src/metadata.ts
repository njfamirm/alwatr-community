import {readFileSync} from 'node:fs';

import {logger} from './config.js';

import type {DevToArticleMetadata} from './type.js';

export function readPostMetadata(path: string): DevToArticleMetadata {
  logger.logMethodArgs?.('readPostMetadata', {path});
  return JSON.parse(readFileSync(path, 'utf-8'));
}
