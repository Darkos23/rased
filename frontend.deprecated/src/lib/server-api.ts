import { Article, Course, Meeting } from '@/types'

const BASE = process.env.API_URL ?? 'http://127.0.0.1:8000/api'

async function apiFetch<T>(path: string, fallback: T): Promise<T> {
  try {
    const res = await fetch(`${BASE}${path}`, {
      next: { revalidate: 60 }, // revalide chaque minute
      headers: { Accept: 'application/json' },
    })
    if (!res.ok) return fallback
    return res.json()
  } catch {
    return fallback
  }
}

export async function getLatestArticles(limit = 3): Promise<Article[]> {
  const data = await apiFetch<{ data: Article[] }>('/articles?per_page=10', { data: [] })
  return data.data.slice(0, limit)
}

export async function getLatestCourses(limit = 3): Promise<Course[]> {
  const data = await apiFetch<{ data: Course[] }>('/courses?per_page=10', { data: [] })
  return data.data.slice(0, limit)
}

export async function getUpcomingMeetings(limit = 3): Promise<Meeting[]> {
  const data = await apiFetch<{ data: Meeting[] }>('/meetings?per_page=10', { data: [] })
  return data.data.slice(0, limit)
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  try {
    const res = await fetch(`${BASE}/articles/${slug}`, {
      next: { revalidate: 60 },
      headers: { Accept: 'application/json' },
    })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

export async function getCourseBySlug(slug: string): Promise<Course | null> {
  try {
    const res = await fetch(`${BASE}/courses/${slug}`, {
      next: { revalidate: 60 },
      headers: { Accept: 'application/json' },
    })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

export async function getStats() {
  const [articles, courses, meetings] = await Promise.all([
    apiFetch<{ total: number }>('/articles?per_page=1', { total: 0 }),
    apiFetch<{ total: number }>('/courses?per_page=1', { total: 0 }),
    apiFetch<{ total: number }>('/meetings?per_page=1', { total: 0 }),
  ])
  return {
    articles: articles.total,
    courses: courses.total,
    meetings: meetings.total,
  }
}
