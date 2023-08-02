import type {StringifyableRecord} from '@alwatr/type';

export interface PostMetadata extends StringifyableRecord {
  title: string,
  published: boolean,
  description?: string,
  coverImage?: string,
  tags?: string[],
  devTo?: {
    postId?: number,
    url?: string,
    publishStatus?: 'public' | 'draft' | 'no',
    series?: string,
    canonicalUrl?: string,
    organizationId?: number
  },
  medium?: {
    url?: string,
    canonicalUrl?: string,
    publishStatus?: 'public' | 'draft' | 'unlisted' | 'no',
    license?: MediumArticle['license'],
  }
}

export interface MediumArticle extends StringifyableRecord {
  title: string,
  contentFormat?: 'html' | 'markdown',
  content: string,
  canonicalUrl?: string,
  tags?: string[],
  publishStatus?: 'public' | 'draft' | 'unlisted',
  // eslint-disable-next-line max-len
  license?: 'all-rights-reserved' | 'cc-40-by' | 'cc-40-by-sa' | 'cc-40-by-nd' | 'cc-40-by-nc' | 'cc-40-by-nc-nd' | 'cc-40-by-nc-sa' | 'cc-40-zero' | 'public-domain',
  notifyFollowers?: boolean
}

export interface MediumPublishPostResponse {
  data: {
    id: string,
    title: string,
    authorId: string,
    tags: string[],
    url: string,
    canonicalUrl: string,
    publishStatus: MediumArticle['publishStatus'],
    publishedAt: number,
    license: MediumArticle['license'],
    licenseUrl: string
  }
}

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

export interface DevToPublishPostResponse {
  type_of: 'article',
  id: number,
  title: string,
  description: string,
  cover_image: string,
  readable_publish_date: string,
  social_image: string,
  tag_list: string[],
  tags: string,
  slug: string,
  path: string,
  url: string,
  canonical_url: string,
  comments_count: number,
  positive_reactions_count: number,
  public_reactions_count: number,
  collection_id: number,
  created_at: string,
  edited_at: string,
  crossposted_at: string,
  published_at: string,
  last_comment_at: string,
  published_timestamp: string,
  body_html: string,
  user: {
    name: string,
    username: string,
    twitter_username: string,
    github_username: string,
    website_url: string,
    profile_image: string,
    profile_image_90: string
  },
  organization: {
    name: string,
    username: string,
    slug: string,
    profile_image: string,
    profile_image_90: string
  }
}


