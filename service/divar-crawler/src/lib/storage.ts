import {AlwatrStorageEngine} from '@alwatr/storage-engine';
import {AlwatrStorageEngineProvider} from '@alwatr/storage-engine/provider.js';

import type {Message, Token} from '../type.js';

export const postStorageProvider = new AlwatrStorageEngineProvider({path: 'data'});

export const tokenStorage = new AlwatrStorageEngine<Token>({
  name: 'user-list',
  path: 'data',
});

export const messageStorage = new AlwatrStorageEngine<Message>({
  name: 'message',
  path: 'data',
});
