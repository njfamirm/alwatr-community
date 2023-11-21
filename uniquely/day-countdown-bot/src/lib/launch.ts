import {bot} from './bot.js';
import {config, logger} from '../config.js';
import {message} from '../director/l18e-loader.js';
import {notifyAdmin} from '../util/admin.js';

export async function launchBot(): Promise<void> {
  logger.logMethod?.('launchBot');
  try {
    bot.setWebhook(config.telegram.host, config.telegram.port);

    const botInfo = await bot.api.getMe();
    if (botInfo == null) throw new Error('authentication_failed');
    logger.logProperty?.('botInfo', botInfo);

    if (process.env.NODE_ENV === 'production') {
      await notifyAdmin(message('startup_message'));
    }
  }
  catch (err) {
    logger.error('launchBot', 'launch_bot_failed', err);
  }
}
