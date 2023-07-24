import {AlwatrTelegram} from '@alwatr-community/telegram';

import {config} from '../config.js';

export const bot = new AlwatrTelegram(config.telegram);
