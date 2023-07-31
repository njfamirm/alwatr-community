import {readFileSync} from 'node:fs';

import {parse} from 'yaml';

import {logger} from './config.js';

import type {PostMetadata} from './type.js';

export function readPostMetadata(path: string): PostMetadata {
  logger.logMethodArgs?.('readPostMetadata', {path});
  const file = readFileSync(path, 'utf-8');
  return parse(file);
}
