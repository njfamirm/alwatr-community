import {createLogger} from '@alwatr/logger';

import type {PuppeteerLaunchOptions} from 'puppeteer-core';

export const logger = createLogger('divar-crawler');


export const config = {
  puppeteer: {
    product: 'chrome',
    channel: 'chrome-beta',
    userDataDir: './chrome-profile/',
    headless: process.env.HEADLESS === '1' ? true : false,
    slowMo: 10,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-infobars',
      '--window-position=0,0',
      '--ignore-certifcate-errors',
      '--ignore-certifcate-errors-spki-list',
      // eslint-disable-next-line max-len
      '--user-agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4758.66 Safari/537.36"',
    ],
  } as PuppeteerLaunchOptions,
};

logger.logProperty?.('config', config);

export const selector = {
  productLink: '.browse-post-list-f3858 > div > a',
  contactButton: '.post-actions__get-contact',
  phoneNumber: '.kt-unexpandable-row__action.kt-text-truncate',
  loginPhoneNumberInput: '.kt-textfield__input',
  submitPhoneNumberButton: '.auth-actions__submit-button',
  submitVerifyCodeButton: '.auth-actions__submit-button',
  loginBox: '.kt-form-hint__text',
  messageInput: '.kt-chat-input__input.kt-body--stable',
  chatNotFoundTitle: '.kt-empty-state__description',
  sendMessageButton: '.kt-button--primary.kt-button--circular',
  sendMessageTick: '.kt-icon-check-o.kt-message-info__icon',
  postTitle: '.kt-page-title__title',
};
