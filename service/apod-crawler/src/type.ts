export type ApodApiResponse = {
  date: string,
  service_version: string,
  copyright?: string,
  title: string,
  url: string
  explanation: string,
} & ({
  media_type: 'video',
  thumbnail_url?: 'https://img.youtube.com/vi/0fKBhvDjuy0/0.jpg',
} | {
  media_type: 'image',
  hdurl?: string,
})
