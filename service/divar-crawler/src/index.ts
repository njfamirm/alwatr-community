import {crawlCommand} from './command/crawler.js';
import {logger} from './config.js';
import {setToken} from './token.js';

logger.logOther?.('..:: Alwatr Divar Crawler ::..');

setToken();
crawlCommand('test', 'https://divar.ir/s/alborz-province?q=%D8%B3%D9%82%D9%81%20%DA%A9%D8%A7%D8%B0%D8%A8');
