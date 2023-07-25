import {writeFileSync} from 'node:fs';

import type {ApodApiResponse} from './type.js';

let template = `---
date: $date
title: $title
copyright: $copyright
video: $video
---
$explanation
`;

function makeContent(response: ApodApiResponse): string {
  template = template.replace('$date', response.date);
  template = template.replace('$title', response.title);
  template = template.replace('$copyright', response.copyright ?? 'none');
  template = template.replace('$explanation', response.explanation);
  template = template.replace('$video', response.media_type === 'video' ? response.url : 'none');
  return template;
}

export function saveExplanation(response: ApodApiResponse, pathPrefix = ''): void {
  writeFileSync(pathPrefix + 'explanation.md', makeContent(response));
}
