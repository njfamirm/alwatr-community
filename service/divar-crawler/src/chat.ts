import {selector, logger} from './config.js';
import {openPage} from './lib/puppeteer/pptr-helper.js';
import {currentMessage} from './message.js';

import type {Page} from 'puppeteer-core';

// send current message in chat
export async function sendMessageInChat(postId: string): Promise<void> {
  logger.logMethodArgs?.('sendMessageInChat', {postId: postId});

  let page: Page;
  try {
    page = await openPage(`https://chat.divar.ir/${postId}`);
  }
  catch {
    logger.error('sendMessageInChat', 'load_chat_failed', {postId});
    return;
  }

  // close page if chat not exist
  const isPageNotFound = await checkChatExists(page);
  logger.logProperty?.('isPageNotFound', isPageNotFound);
  if (isPageNotFound) {
    await page.close();
    return;
  }

  // send message in chat
  await sendMessage(page);

  // wait to message sent,
  // if sent or timeout close page
  try {
    await checkMessageSent(page);
    logger.logOther?.(`Message sent to ${postId}`);
  }
  catch {
    logger.error('sendMessageInChat', 'send_message_failed', {postId});
  }
  finally {
    await page.close();
  }
}

// type and send message
async function sendMessage(page: Page): Promise<void> {
  logger.logMethod?.('sendMessage');
  await page.type(selector.messageInput, currentMessage as string);
  await page.click(selector.sendMessageButton);
}

// wait to message sent tick visible
async function checkMessageSent(page: Page): Promise<void> {
  logger.logMethod?.('checkMessageSent');
  await page.waitForSelector(selector.sendMessageTick, {timeout: 10000});
}

// waits for the `message input` and `page not found` element
// if `message input` found, chat exists
// else chat not exists
async function checkChatExists(page: Page): Promise<boolean> {
  logger.logMethod?.('checkChatExists');
  let element;
  try {
    element = await Promise.any([
      page.waitForSelector(selector.messageInput, {timeout: 10000}),
      page.waitForSelector(selector.chatNotFoundTitle, {timeout: 10000}),
    ]);
  }
  catch {
    return true;
  }

  // check page not found element visible in Promise
  // return true if visible
  const isPageNotFoundVisible = await element?.evaluate(
      (element, chatNotFoundTitle) => (element as Element).classList.contains(chatNotFoundTitle),
      selector.chatNotFoundTitle.substring(1),
  );

  return isPageNotFoundVisible || false;
}
