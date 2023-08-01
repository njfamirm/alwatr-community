import {readFileSync, writeFileSync} from 'node:fs';

import {parse, stringify} from 'yaml';

import {logger} from './config.js';

import type {PostMetadata} from './type.js';

export function readPostMetadata(path: string): PostMetadata {
  logger.logMethodArgs?.('readPostMetadata', {path});
  const file = readFileSync(path, 'utf-8');
  const yml = parse(file) as PostMetadata;
  return yml;
}

export function addPostLinkToMetadata(
    path: string,
    metadata: PostMetadata,
    link: string,
    website: 'dev-to' | 'medium',
): void {
  logger.logMethodArgs?.('addPostLinkToMetadata', {metadata, link});
  if (website === 'medium') {
    metadata.medium.url = link;
  }
  else {
    metadata.devTo.url = link;
  }

  writePostMetadata(path, metadata);
}

function writePostMetadata(path: string, metadata: PostMetadata): void {
  logger.logMethodArgs?.('writePostMetadata', {path, metadata: stringify(metadata)});
  writeFileSync(path, stringify(metadata));
}
