import React, { useState, useEffect } from 'react'
import { Building2, Loader2 } from 'lucide-react'
import api from '../../../services/api'

/**
 * AuthImage Component
 * - Handles protected & public images
 * - Fixes 403 issue for /uploads
 * - Supports fallback + loading UI
 */
export const AuthImage = ({ src, alt, className, fallback }) => {
  const [imgSrc, setImgSrc] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    let active = true
    let objectUrl = null

    // Reset states when src changes
    setLoading(true)
    setError(false)
    setImgSrc(null)

    if (!src || src === 'string' || src === '') {
      setError(true)
      setLoading(false)
      return
    }

    // If it's a blob, data URL, or external HTTP link, use it directly
    if (src.startsWith('blob:') || src.startsWith('data:') || src.startsWith('http')) {
      setImgSrc(src)
      setLoading(false)
      setError(false)
      return
    }

    const fetchImage = async () => {
      try {
        // Using the centralized axios instance so headers are managed automatically
        const response = await api.get(src, {
          responseType: 'blob',
        })

        if (active) {
          objectUrl = URL.createObjectURL(response.data)
          setImgSrc(objectUrl)
          setError(false)
        }
      } catch (err) {
        console.error(`[AuthImage] Failed to fetch: ${src}`, {
          message: err.message,
          status: err.response?.status,
          data: err.response?.data, // ← yeh important
          headers: err.response?.headers,
        })
        if (active) {
          setError(true)
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    fetchImage()

    return () => {
      active = false
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl)
      }
    }
  }, [src])

  // While loading, show a pulsing placeholder with a spinner
  if (loading) {
    return (
      <div
        className={`${className} flex animate-pulse items-center justify-center bg-slate-100 dark:bg-slate-800`}
      >
        <Loader2 className="animate-spin text-slate-300" size={20} />
      </div>
    )
  }

  // If there's an error and NO source, return fallback
  if (error || !imgSrc) {
    return fallback ? (
      <>{fallback}</>
    ) : (
      <div className={`${className} flex items-center justify-center bg-slate-50 text-slate-300`}>
        <Building2 size={24} />
      </div>
    )
  }

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      loading="lazy"
      onError={() => {
        setError(true)
        setLoading(false)
      }}
    />
  )
}

export default AuthImage
