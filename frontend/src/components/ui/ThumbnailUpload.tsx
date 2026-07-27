'use client'

import { useRef, useState } from 'react'
import api from '@/lib/api'
import { useLang } from '@/contexts/LanguageContext'

interface Props {
  value: string
  onChange: (url: string) => void
  label?: string
}

export default function ThumbnailUpload({ value, onChange, label }: Props) {
  const { t } = useLang()
  const fileRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')

  const handleFile = async (file: File) => {
    setUploadError('')
    setUploading(true)
    try {
      const form = new FormData()
      form.append('image', file)
      const res = await api.post('/uploads/thumbnail', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      onChange(res.data.url)
    } catch {
      setUploadError(t.articles.upload_error)
    } finally {
      setUploading(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) handleFile(file)
  }

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-semibold text-ui-text">{label}</label>
      )}

      {/* URL input + upload button */}
      <div className="flex gap-2">
        <input
          type="url"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="https://…"
          className="flex-1 border border-ui-border rounded-xl px-4 py-3 text-sm text-ui-text placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition bg-ui-bg"
        />
        <button
          type="button"
          disabled={uploading}
          onClick={() => fileRef.current?.click()}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-ui-border text-sm font-semibold text-ui-text hover:border-brand-400 hover:text-brand-600 transition disabled:opacity-50 whitespace-nowrap"
        >
          {uploading ? (
            <>
              <span className="w-4 h-4 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
              {t.articles.uploading}
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              {t.articles.upload_file}
            </>
          )}
        </button>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={e => {
          const file = e.target.files?.[0]
          if (file) handleFile(file)
          e.target.value = ''
        }}
      />

      {uploadError && (
        <p className="text-red-500 text-xs">{uploadError}</p>
      )}

      {/* Drop zone hint */}
      {!value && (
        <div
          onDrop={handleDrop}
          onDragOver={e => e.preventDefault()}
          className="border-2 border-dashed border-ui-border rounded-xl p-6 text-center text-sm text-ui-muted hover:border-brand-400 transition cursor-pointer"
          onClick={() => fileRef.current?.click()}
        >
          <svg className="w-8 h-8 mx-auto mb-2 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="font-medium text-ui-text">{t.articles.drop_here}</p>
          <p className="text-xs mt-1">JPG, PNG, WebP · 3 MB max</p>
        </div>
      )}

      {/* Preview */}
      {value && (
        <div className="relative rounded-xl overflow-hidden border border-ui-border w-full max-w-sm h-40 group">
          <img
            src={value}
            alt="preview"
            className="w-full h-full object-cover"
            onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
          />
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition hover:bg-black/80"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
    </div>
  )
}
