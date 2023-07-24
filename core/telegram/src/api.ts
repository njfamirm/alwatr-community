import {fetch} from '@alwatr/fetch';
import {createLogger} from '@alwatr/logger';

import type {
  AlwatrTelegramApiConfig,
  EditMessageReplyMarkupOption,
  EditTextMessageOption,
  SendMessageOption,
  AnswerCallbackQueryOption,
  CopyMessageOption,
  SendChatActionOption,
} from './type.js';
import type {StringifyableRecord} from '@alwatr/type';
import type {ApiResponse, Message, User} from '@grammyjs/types';

export class AlwatrTelegramApi {
  protected baseApiUrl = `https://api.telegram.org/bot${this.config.token}/`;

  protected logger = createLogger('alwatr/telegram-api');

  constructor(protected readonly config: AlwatrTelegramApiConfig) {
    this.logger.logMethodArgs?.('constructor', config);
  }

  protected escapeText(message: string): string {
    // eslint-disable-next-line no-useless-escape
    return message.replace(/(_|\[|\]|\(|\)|~|`|>|#|\+|-|=|\||\{|\}|\.|!)/g, '\\$1');
  }

  async sendMessage(
      chatId: number | string,
      text: string,
      option: SendMessageOption = {},
  ): Promise<ApiResponse<Message.TextMessage>> {
    option.parse_mode ??= 'MarkdownV2';
    this.logger.logMethodArgs?.('sendMessage', {text, option});
    await this.sendChatAction({chat_id: chatId, action: 'typing', message_thread_id: option.message_thread_id});

    text = this.escapeText(text);
    const response = await this.callApi('sendMessage', {
      chat_id: chatId,
      text,
      ...option,
    } as unknown as StringifyableRecord);

    const responseJson = await response.json();
    if (response.status != 200) {
      this.logger.error('sendMessage', 'send_message_failed', responseJson);
      return responseJson;
    }
    return responseJson;
  }

  async editTextMessage(option: EditTextMessageOption): Promise<Message | ApiResponse<true> | null> {
    this.logger.logMethodArgs?.('editTextMessage', {option});

    option.text = this.escapeText(option.text);
    const response = await this.callApi('editTextMessage', {...option} as unknown as StringifyableRecord);

    const responseJson = await response.json();
    if (response.status != 200) {
      this.logger.error('editTextMessage', 'edit_text_message_failed', responseJson);
      return null;
    }
    return responseJson;
  }

  async editMessageReplyMarkup(option: EditMessageReplyMarkupOption = {}): Promise<Message | ApiResponse<true> | null> {
    this.logger.logMethodArgs?.('editMessageReplyMarkup', {option});

    const response = await this.callApi('editMessageReplyMarkup', {
      ...option,
    } as unknown as StringifyableRecord);

    const responseJson = await response.json();
    if (response.status != 200) {
      this.logger.error('editMessageReplyMarkup', 'edit_message_reply_markup_failed', responseJson);
      return null;
    }
    return responseJson;
  }

  async copyMessage(option: CopyMessageOption): Promise<ApiResponse<{message_id: number}>> {
    this.logger.logMethodArgs?.('copyMessage', {option});
    this.sendChatAction({chat_id: option.chat_id, action: 'typing', message_thread_id: option.message_thread_id});

    const response = await this.callApi('copyMessage', {
      ...option,
    } as unknown as StringifyableRecord);

    const responseJson = (await response.json()) as ApiResponse<{message_id: number}>;
    if (response.status != 200) {
      this.logger.error('copyMessage', 'copy_message_failed', responseJson);
      return responseJson;
    }
    return responseJson;
  }

  async sendChatAction(option: SendChatActionOption): Promise<{ok: boolean; result: {message_id: number}} | null> {
    this.logger.logMethodArgs?.('sendChatAction', {option});

    const response = await this.callApi('sendChatAction', {
      ...option,
    } as unknown as StringifyableRecord);

    const responseJson = await response.json();
    if (response.status != 200) {
      this.logger.error('sendChatAction', 'send_chat_action_failed', responseJson);
      return null;
    }
    return responseJson;
  }

  async getMe(): Promise<User | null> {
    this.logger.logMethod?.('getMe');
    const response = await this.callApi('getMe');

    const responseJson = await response.json();
    if (response.status != 200) {
      this.logger.error('getMe', 'get_bot_info_failed', responseJson);
      return null;
    }
    return responseJson;
  }

  async answerCallbackQuery(
      callbackQueryId: string,
      option?: AnswerCallbackQueryOption,
  ): Promise<ApiResponse<boolean> | null> {
    this.logger.logMethodArgs?.('answerCallbackQuery', {callbackQueryId, option});
    const response = await this.callApi('answerCallbackQuery', {
      callback_query_id: callbackQueryId,
      text: option?.text,
      show_alert: option?.show_alert,
      url: option?.url,
      cache_time: option?.cache_time,
    });
    const responseJson = await response.json();

    if (response.status != 200) {
      this.logger.error('answerCallbackQuery', 'answer_callback_query_failed', responseJson);
      return null;
    }

    return responseJson as ApiResponse<boolean>;
  }

  protected async callApi(method: string, bodyJson?: StringifyableRecord): Promise<Response> {
    this.logger.logMethodArgs?.('callApi', {method, queryParameters: bodyJson});
    return fetch({
      retry: 1,
      method: 'POST',
      url: this.baseApiUrl + method,
      bodyJson,
    });
  }
}
