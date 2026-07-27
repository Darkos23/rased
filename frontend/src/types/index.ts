export type Role = 'admin' | 'teacher' | 'researcher'
export type Locale = 'fr' | 'en'

export interface User {
  id: number
  name: string
  email: string
  role: Role
  avatar?: string
  bio?: string
  locale: Locale
  email_verified_at: string | null
}

export interface Article {
  id: number
  title: string
  slug: string
  body: string
  thumbnail?: string
  status: 'draft' | 'published'
  category?: string
  lang: Locale
  author: Pick<User, 'id' | 'name' | 'avatar'>
  created_at: string
}

export interface Lesson {
  id: number
  course_id: number
  title: string
  content?: string
  video_url?: string
  order: number
  duration_min: number
}

export interface Course {
  id: number
  title: string
  slug: string
  description?: string
  thumbnail?: string
  level: 'beginner' | 'intermediate' | 'advanced'
  status: 'draft' | 'published'
  teacher: Pick<User, 'id' | 'name' | 'avatar'>
  lessons?: Lesson[]
  created_at: string
}

export interface Meeting {
  id: number
  title: string
  description?: string
  host: Pick<User, 'id' | 'name' | 'avatar'>
  google_meet_url?: string
  recording_url?: string
  scheduled_at: string
  status: 'scheduled' | 'live' | 'ended'
}

export interface PaginatedResponse<T> {
  data: T[]
  current_page: number
  last_page: number
  per_page: number
  total: number
}
