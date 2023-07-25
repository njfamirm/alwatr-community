import {writeFileSync} from 'node:fs';

import {fetch} from '@alwatr/fetch';

import {logger} from './config.js';

import type {ApodApiResponse} from './type.js';

export async function downloadApiMedia(response: ApodApiResponse): Promise<void> {
  if (response.media_type === 'image') {
    await downloadMedia(response.date + '.jpg', response.url);
    await downloadMedia(response.date + '-hd.jpg', response.hdurl);
  }
  else if (response.media_type === 'video') {
    if (response.thumbnail_url != null) {
      await downloadMedia(response.date + '-thumbnail.jpg', response.thumbnail_url);
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
