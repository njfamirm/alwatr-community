import {readFileSync, writeFileSync} from 'node:fs';

import {parse, stringify} from 'yaml';

import {logger} from './config.js';

import type {PostMetadata} from './type.js';

export function addPostLinkToMetadata(
    path: string,
    oldMetadata: PostMetadata,
    metadata: {link: string, postId?: number},
    website: 'dev-to' | 'medium',
): void {
  logger.logMethodArgs?.('updateMetadata', {metadata});
  if (website === 'medium') {
    oldMetadata.medium ??= {};
    oldMetadata.medium.url = metadata.link;
  }
  else {
    oldMetadata.devTo ??= {};
    oldMetadata.devTo.url = metadata.link;
    oldMetadata.devTo.postId = metadata.postId;
  }

  writePostMetadata(path, oldMetadata);
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
