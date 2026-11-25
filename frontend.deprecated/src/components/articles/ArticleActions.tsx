'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import api from '@/lib/api'

interface Props {
  articleId: number
  authorId: number
  slug: string
}

export default function ArticleActions({ articleId, authorId, slug }: Props) {
  const { user } = useAuth()
  const router = useRouter()
  const [deleting, setDeleting] = useState(false)

  if (!user || (user.id !== authorId && user.role !== 'admin')) return null

  const handleDelete = async () => {
    if (!confirm('Supprimer cet article ? Cette action est irréversible.')) return
    setDeleting(true)
    try {
      await api.delete(`/articles/${articleId}`)
      router.push('/articles')
    } catch {
      alert('Une erreur est survenue.')
      setDeleting(false)
    }
  }

  return (
    <div className="flex items-center gap-2 flex-shrink-0">
      <Link
        href={`/articles/${slug}/edit`}
        className="px-4 py-2 rounded-full border border-white/30 text-white text-sm font-semibold hover:bg-white/10 transition"
      >
        Modifier
      </Link>
      <button
        onClick={handleDelete}
        disabled={deleting}
        className="px-4 py-2 rounded-full border border-red-300/60 text-red-200 text-sm font-semibold hover:bg-red-500/20 transition disabled:opacity-50"
      >
        {deleting ? 'Suppression…' : 'Supprimer'}
      </button>
    </div>
  )
}
