import {logger} from './config.js';
import {messageStorage} from './lib/storage.js';

export let currentMessage: string | null;

export async function setCurrentMessage(messageId: string | null): Promise<void> {
  if (!(messageId === null)) {
    currentMessage = messageStorage.get(messageId)?.text as string;
    logger.logOther?.(`Message set to ${currentMessage}`);
  }
  else {
    currentMessage = null;
    logger.logOther?.(`Message sending disabled`);
  }
}
