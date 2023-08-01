import {isNumber} from '@alwatr/math';
import {delay} from '@alwatr/util';

import {sendMessageInChat} from './chat.js';
import {selector, logger} from './config.js';
import {browser} from './lib/puppeteer/browser.js';
import {checkEndOfPage, openPage, scrollDown} from './lib/puppeteer/pptr-helper.js';
import {postStorageProvider} from './lib/storage.js';
import {currentMessage} from './message.js';
import {currentToken, setToken, setTokenLimit, removeCurrentToken, getCurrentTokenPhoneNumber} from './token.js';

import type {PostData} from './type.js';
import type {Page} from 'puppeteer-core';

export let postIdList: string[] = [];

async function getPostTitle(postId: string): Promise<string> {
  let postPage;
  try {
    postPage = await openPage(`https://divar.ir/v/${postId}`);
  }
  catch (err) {
    logger.error('getPostTitle', 'page_loading_failed', err);
    await postPage?.close();
    return '';
  }

  let title = '';
  try {
    await postPage.waitForSelector(selector.postTitle, {timeout: 10000});
    title = await postPage.$eval(selector.postTitle, (title) => {
      return (title as HTMLDivElement).innerText;
    });
  }
  catch (err) {
    logger.error('getPostTitle', 'get_post_title_failed', err);
  }

  await postPage.close();

  return title;
}

// returns new post id found
async function findPostIdList(name: string, page: Page): Promise<string[] | undefined> {
  const postStorage = postStorageProvider.get<PostData>({name});
  postIdList = postStorage.keys;

  logger.logProperty?.('postIdListLength', postIdList.length);

  const newPostIdList = await page.$$eval(
      selector.productLink,

      (products, linkList): string[] | undefined => {
        const newLink: string[] = [];

        products.forEach((product) => {
        // find post id
          let productLink = (product as HTMLLinkElement).href;
          // @TODO: use parseShortenedUrl
          productLink = productLink.substring(productLink.lastIndexOf('/') + 1);

          // The length of all post IDs is 8 characters
          // this will prevent divar suggestion box links from being added
          if (productLink.length !== 8) return;

          // avoid adding duplicate post id
          if (linkList.includes(productLink) || newLink.includes(productLink)) return;
          newLink.push(productLink);
        });
        return newLink;
      },
      postIdList,
  );

  return newPostIdList;
}

/**
 * The last part of the link is the short link of the product,
 * it separates it and returns shortened link
 */
export function parseShortenedUrl(url: string): string {
  return url.substring(url.lastIndexOf('/') + 1);
}

/**
 * fetch phone number with currentToken
 * return phone number from response json,
 * if not exists, it tries to handle the error
 *
 * if phone number exists this function return it with PostPhoneNumber type,
 * if error occurred or phone number hided it return PostPhoneNumber without phone number
 * because avoid from crawling this post Id again
 */
async function fetchPostPhoneNumber(postId: string): Promise<PostData | undefined> {
  logger.logMethodArgs?.('fetchPostPhoneNumber', {postId});
  const userAgent = await browser.userAgent();
  const response = await fetch(`https://api.divar.ir/v8/postcontact/web/contact_info/${postId}`, {
    headers: {
      'Authorization': `Basic ${currentToken}`,
      'User-Agent': userAgent,
    },
  });

  const data = await response.json();
  let phoneNumber;

  try {
    phoneNumber = data.widget_list[0].data.action.payload.phone_number;
  }
  catch {
    // check phone number limited, if true set limit for current token
    // and get new token
    if (data.code === 8) {
      logger.error('fetchPostPhoneNumber',
          `${getCurrentTokenPhoneNumber()} limited, the limitation will be lifted within the next 24 hours`);
      setTokenLimit();
      await setToken();

      // retry fetching
      return fetchPostPhoneNumber(postId);
    }
    else if (data.type === 'LOGIN_REQUIRED' || data.message === 'Unauthorized') {
      logger.error('fetchPostPhoneNumber',
          `Please login again with ${getCurrentTokenPhoneNumber()}, It's token revoked`);
      removeCurrentToken();
      await setToken();
    }
    else {
      logger.error('fetchPostPhoneNumber', 'UNKNOWN_ERROR', JSON.stringify(data));
      return;
    }
  }

  // phone number hided in divar
  if (!isNumber(phoneNumber)) return {id: postId};

  return {
    id: postId,
    phoneNumber: +phoneNumber,
  };
}

/**
 * 1. scroll to end of page for loading more post
 * 2. find new post list
 * 3. return true, if page completely crawled
 * 4. get post data
 */
export async function crawlerPost(name: string, page: Page): Promise<boolean> {
  await scrollDown(page);

  const postLinkList = await findPostIdList(name, page);

  // if no product were found, check crawler at end of page
  if (!postLinkList || postLinkList.length === 0) {
    if (await checkEndOfPage(page)) return true;
    return false;
  }

  logger.logProperty?.('postLinkList', postLinkList);

  for (const postLink of postLinkList) {
    // first request to API for better handling Token error
    await getPostData(name, postLink);
    if (currentMessage) await sendMessageInChat(postLink);
    logger.logOther?.(`'${postLink}' checked out`);
    await delay(500);
  }

  return false;
}

async function getPostData(name: string, postId: string): Promise<void> {
  logger.logMethodArgs?.('getPostData', {name, postId});
  const title = await getPostTitle(postId);

  let postPhoneNumber: PostData | undefined;
  try {
    postPhoneNumber = await fetchPostPhoneNumber(postId);
  }
  catch (err) {
    logger.error('getPostData', 'fetch_failed', err);
    return;
  }

  if (!postPhoneNumber) return;
  const postStorage = postStorageProvider.get<PostData>({name});

  if (title) {
    postStorage.set({
      ...postPhoneNumber,
      title: title,
    });
  }
  else {
    postStorage.set(postPhoneNumber);
  }
}
