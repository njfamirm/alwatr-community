import {writeFileSync} from 'node:fs';

import type {ApodApiResponse} from './type.js';

export function saveResponse(response: ApodApiResponse, pathPrefix = ''): void {
  writeFileSync(pathPrefix + 'response.json', JSON.stringify(response, null, 2));
}
