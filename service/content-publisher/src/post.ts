import {readFileSync} from 'node:fs';

import {config, logger} from './config.js';

function readPost(path: string): string {
  logger.logMethodArgs?.('readPost', {path});
  return readFileSync(path, 'utf-8');
}

export function addCoverToPost(text: string, coverURL: string): string {
  logger.logMethodArgs?.('addCoverToPost', {text, cover: coverURL});
  return `![cover](${coverURL})
  ${text}`;
}

function absolutePathToRelative(text: string, baseUrl: string): string {
  logger.logMethodArgs?.('absolutePathToRelative', {text, baseUrl});
  return text.replace(/\[(.+?)\]\((\.\/.+?)\)/g, `[$1](${baseUrl}$2)`).replaceAll('/./', '/');
}

function flatNewLine(text: string): string {
  logger.logMethodArgs?.('flatNewLine', {text});
  return text.replace(/^\n|\n$/g, '');
}

export function getPostContent(path: string): string {
  logger.logMethodArgs?.('getPostContent', {path});
  const text = readPost(path);
  const relativePathContent = absolutePathToRelative(text, config.mediaBaseUrl);
  const finalText = flatNewLine(relativePathContent);

  logger.logProperty?.('getPostContent', {finalText});
  return finalText;
}
