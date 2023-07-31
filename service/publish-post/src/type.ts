import type {StringifyableRecord} from '@alwatr/type';

export interface DevToArticle extends StringifyableRecord {
  title: string,
  body_markdown: string,
  published: boolean,
  tags: string[],
}
