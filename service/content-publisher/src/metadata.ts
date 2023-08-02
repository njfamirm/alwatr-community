import {readFileSync, writeFileSync} from 'node:fs';

import {parse, stringify} from 'yaml';

import {logger} from './config.js';

import type {PostMetadata} from './type.js';

export function updatePostMetadata(path: string, newMetadata: Partial<PostMetadata>): void {
  logger.logMethodArgs?.('updatePostMetadata', {metadata: newMetadata});
  const metadata = readPostMetadata(path);

  writePostMetadata(path, {
    ...metadata,
    ...newMetadata,
  });
}

export function readPostMetadata(path: string): PostMetadata {
  logger.logMethodArgs?.('readPostMetadata', {path});
  const yaml = readFileSync(path, 'utf-8');
  return parse(yaml);
}

function writePostMetadata(path: string, metadata: PostMetadata): void {
  logger.logMethodArgs?.('writePostMetadata', {path, metadata: stringify(metadata)});
  writeFileSync(path, stringify(metadata));
}
