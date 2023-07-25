import {writeFileSync} from 'node:fs';

import {fetch} from '@alwatr/fetch';

import {logger} from './config.js';

import type {ApodApiResponse} from './type.js';

export async function downloadApiMedia(response: ApodApiResponse, pathPrefix = ''): Promise<void> {
  logger.logMethod?.('downloadApiMedia');
  if (response.media_type === 'image') {
    await downloadMedia(pathPrefix + 'photo.jpg', response.url);
    await downloadMedia(pathPrefix + 'photo-hd.jpg', response.hdurl);
  }
  else if (response.media_type === 'video') {
    if (response.thumbnail_url != null) {
      await downloadMedia(pathPrefix + 'thumbnail.jpg', response.thumbnail_url);
    }
  }
}

async function downloadMedia(fileName: string, url: string): Promise<void> {
  logger.logMethodArgs?.('downloadMedia', {fileName, url});
  const response = await fetch({
    url: url,
  });

  if (response.status !== 200) {
    return;
  }

  const blob = await response.blob();
  const buffer = Buffer.from(await blob.arrayBuffer());
  writeFileSync(fileName, buffer);
}
