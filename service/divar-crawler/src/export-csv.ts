import {writeFileSync} from 'fs';

import {logger} from './config.js';
import {postStorageProvider} from './lib/storage.js';

import type {PostData} from './type.js';

// export csv from storage
export function exportCsv(name: string): void {
  logger.logMethod?.('exportCsv');

  const postStorage = postStorageProvider.get<PostData>({name});

  const keys = postStorage.keys;

  // get post data from storage
  let data = keys.map((key) => {
    const postData = postStorage.get(key);
    if (postData === null || postData.phoneNumber === undefined) return;
    return {
      postId: postData.id,
      title: postData.title,
      phoneNumber: postData.phoneNumber,
    };
  });

  // remove posts that not have phone number
  data = data.filter((data) => data !== undefined);

  if (data.length === 0) {
    logger.error('exportCsv', 'zero_post_length');
    return;
  }

  const csvData = data.map((obj) => {
    return `"${obj!.postId}", "${obj?.title ?? ''}", "+98${obj!.phoneNumber}", "https://divar.ir/v/${obj!.postId}"`;
  });

  // create csv string
  let csvString = csvData.join('\n');
  csvString = `"postId", "title", "phoneNumber", "link"\n` + csvString;

  const path = postStorage.storagePath.replace('.json', '.csv');

  writeFileSync(`${path}`, csvString);
  logger.logOther?.(`Csv file saved completely in ${path}`);
}
