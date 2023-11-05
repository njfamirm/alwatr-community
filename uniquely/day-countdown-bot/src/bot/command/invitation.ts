import {logger} from '../../config.js';
import {message} from '../../director/l18e-loader.js';
import {bot} from '../../lib/bot.js';
import {isAdmin} from '../../util/admin.js';
import {actionAllChat, deleteChat, subscribe} from '../../util/chat.js';

bot.defineCommandHandler('invitation', async (context) => {
  logger.logMethodArgs?.('command-invitation', {chatId: context.chatId});
  if (!isAdmin(context.chatId)) return;

  const param = context.commandParams ? context.commandParams[0] : null;
  if (param !== 'yes') return;

  let i = 0;
  await actionAllChat(async (chat) => {
    const response = await bot.api.sendMessage(chat.id, message('invitation_message'), {
      message_thread_id: chat.chatDetail?.messageThreadId as number | undefined,
    });

    if (response?.ok === true) {
      i++;
      await subscribe(chat.id);
    }
    else if (response?.error_code === 403) {
      await deleteChat(chat.id);
    }
  });

  await context.reply(message('invitation_message_sent').replace('${count}', i + ''));
});
