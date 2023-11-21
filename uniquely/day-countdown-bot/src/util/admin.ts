import {logger} from '../config.js';
import {bot} from '../lib/bot.js';
import {configStorageClient} from '../lib/storage.js';

import type {AdminChatInfo} from '../type.js';
import type {SendMessageOption} from '@alwatr-community/telegram';

export const adminInfoList: AdminChatInfo[] = (await configStorageClient.get('admin_list'))?.adminInfoList ?? [];

export function isAdmin(chatId: number | string): boolean {
  const isAdmin = adminInfoList.some((info) => info.chatId === +chatId);
  logger.logMethodArgs?.('isAdmin', {chatId, isAdmin});
  return isAdmin;
}

export async function addAdmin(chatId: number | string, messageThreadId?: number): Promise<void> {
  logger.logMethodArgs?.('addAdmin', {chatId});
  adminInfoList.push({chatId: +chatId, messageThreadId});
  await configStorageClient.set({
    id: 'admin_list',
    adminInfoList: adminInfoList,
  });
}

export async function notifyAdmin(text: string, options: SendMessageOption = {}) {
  for (let i = adminInfoList.length - 1; 0 <= i; i--) {
    await bot.api.sendMessage(adminInfoList[i].chatId, text, {
      message_thread_id: adminInfoList[i].messageThreadId,
      ...options,
    });
  }
}

// TODO: use storage client
