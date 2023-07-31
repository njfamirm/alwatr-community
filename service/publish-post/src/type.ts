import type {StringifyableRecord} from '@alwatr/type';

export interface DevToArticle extends StringifyableRecord {
  title: string,
  description?: string,
  body_markdown?: string,
  series?: string,
  main_image?: string,
  canonical_url?: string,
  organization_id?: number,
  published?: boolean,
  tags?: string[],
}

export type DevToArticleMetadata = Exclude<DevToArticle, 'body_markdown'>;
