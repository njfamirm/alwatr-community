import {readFileSync} from 'node:fs';

import {config, logger} from './config.js';

function readPost(path: string): string {
  logger.logMethodArgs?.('readPost', {path});
  return readFileSync(path, 'utf-8');
}

function flatFrontMatter(text: string): string {
  logger.logMethodArgs?.('flatFrontMatter', {text});
  return text.replace(/^---\n[\s\S]*?\n---\n/, '');
}

function convertAbsoluteMediaPathToRelative(text: string, baseUrl: string): string {
  logger.logMethodArgs?.('convertAbsoluteMediaPathToRelative', {text, baseUrl});
  return text.replace(/\[(.+?)\]\((\.\/.+?)\)/g, `[$1](${baseUrl}$2)`).replaceAll('/./', '/');
}

function removeFirstAndLastNewLine(text: string): string {
  logger.logMethodArgs?.('removeFirstAndLastNewLine', {text});
  return text.replace(/^\n|\n$/g, '');
}

export function getPostContent(path: string): string {
  logger.logMethodArgs?.('getPostContent', {path});
  const text = readPost(path);
  const flattedContent = flatFrontMatter(text);
  const relativePathContent = convertAbsoluteMediaPathToRelative(flattedContent, config.mediaBaseUrl);
  const finalText = removeFirstAndLastNewLine(relativePathContent);

  logger.logProperty?.('getPostContent', {finalText});
  return finalText;
}
