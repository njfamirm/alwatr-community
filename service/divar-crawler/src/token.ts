import {logger} from './config.js';
import {tmpPage} from './lib/puppeteer/browser.js';
import {removePageCookie} from './lib/puppeteer/pptr-helper.js';
import {tokenStorage} from './lib/storage.js';
import {exit} from './util/exit.js';

import type {Token} from './type.js';

let tokenIndex = 0;
export let currentToken = '';
let tokenObjectList: string[];

export function setTokenLimit(): void {
  logger.logMethodArgs?.('setTokenLimit', {phoneNumber: getCurrentTokenPhoneNumber()});
  const currentTokenObject = tokenStorage.get(tokenObjectList[tokenIndex]);

  // set limited time
  tokenStorage.set({
    ...(currentTokenObject as Token),
    limitTime: Date.now(),
  });
}

export async function setToken(): Promise<void> {
  logger.logMethod?.('setToken');

  setTokenList();

  if (tokenStorage.length === 0) {
    logger.error('setToken', 'empty_phone_number_list');
    await exit();
  }

  logger.logProperty?.('tokenIndex', tokenIndex);

  const tokenListLength = tokenObjectList.length;

  const newToken = tokenStorage.get(tokenObjectList[tokenIndex]);

  // check a day has passed
  if (isLimited(newToken as Token)) {
    logger.error('setToken', `${getCurrentTokenPhoneNumber()} limited`);
    if (tokenListLength - 1 === tokenIndex) {
      logger.error('setToken', 'all_phone_number_limited');
      await exit();
    }

    if (tokenListLength - 1 > tokenIndex) tokenIndex++;
    else tokenIndex = 0;
    return setToken();
  }

  currentToken = newToken!.token;

  try {
    await setChatToken();
  }
  catch (err) {
    logger.error('setToken', 'set_chat_token_failed', err);
    await exit();
  }

  logger.logProperty?.('tokenIndex', tokenIndex);

  logger.logOther?.(`Switch to phone number ${getCurrentTokenPhoneNumber()}`);
}

export function removeCurrentToken(): void {
  logger.logMethodArgs?.('removeCurrentToken', {
    currentTokenPhoneNumber: getCurrentTokenPhoneNumber(),
  });

  tokenStorage.delete(tokenObjectList[tokenIndex]);
}

export function getCurrentTokenPhoneNumber(): string {
  logger.logMethod?.('getCurrentTokenPhoneNumber');
  return tokenStorage.get(tokenObjectList[tokenIndex])!.id;
}

export function setTokenList(): void {
  logger.logMethod?.('setTokenList');
  tokenObjectList = tokenStorage.keys;
}

// set token cookie for chat
export async function setChatToken(): Promise<void> {
  logger.logMethod?.('setChatToken');
  await removePageCookie(tmpPage);
  await tmpPage.goto('https://chat.divar.ir/');
  await tmpPage.setCookie({
    name: 'token',
    value: currentToken,
  });
}

function isLimited(user: Token): boolean {
  logger.logMethodArgs?.('isLimited', {phoneNumber: user.id});
  const limitTime = user?.limitTime;

  if (limitTime && Date.now() - limitTime < 86500000) return true;

  return false;
}
