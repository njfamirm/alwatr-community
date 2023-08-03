import {readFileSync, writeFileSync} from 'node:fs';

import {logger} from './config.js';

import type {PostMetadata} from './type.js';

export function updatePostMetadata(path: string, newMetadata: Partial<PostMetadata>): void {
  logger.logMethodArgs?.('updatePostMetadata', {metadata: newMetadata});
  const metadata = readPostMetadata(path);

  writePostMetadata(path, {
    ...metadata,
    ...newMetadata,
    medium: {
      ...metadata.medium,
      ...newMetadata.medium,
    },
    devTo: {
      ...metadata.devTo,
      ...newMetadata.devTo,
    },
  });
}

export function readPostMetadata(path: string): PostMetadata {
  logger.logMethodArgs?.('readPostMetadata', {path});
  const json = readFileSync(path, 'utf-8');
  return JSON.parse(json);
}

function writePostMetadata(path: string, metadata: PostMetadata): void {
  logger.logMethodArgs?.('writePostMetadata', {path, metadata});
  writeFileSync(path, JSON.stringify(metadata, null, 2));
}
