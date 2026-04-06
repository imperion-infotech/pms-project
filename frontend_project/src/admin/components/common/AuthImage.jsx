import React, { useState, useEffect } from 'react'

/**
 * AuthImage Component
 *
 * Purpose:
 * Fetches an image from the backend using an Authorization token.
 * This is necessary for protected static assets.
 *
 * Props:
 * - src: The relative path or URL of the image.
 * - alt: Alternate text for the image.
 * - className: CSS classes for styling.
 * - fallback: Optional React element to show if the image fails to load.
 */
export const AuthImage = ({ src, alt, className, fallback }) => {
  const [imgSrc, setImgSrc] = useState(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    let active = true
    let objectUrl = null

    if (!src) {
      setError(true)
      return
    }

    // If it's a blob, data URL, or external HTTP link, use it directly
    if (src.startsWith('blob:') || src.startsWith('data:') || src.startsWith('http')) {
      setImgSrc(src)
      setError(false)
      return
    }

    const fetchImage = async () => {
      try {
        const token = localStorage.getItem('access_token')
        const cleanToken = token ? token.replace(/^"|"$/g, '') : null

        const response = await fetch(src, {
          method: 'GET',
          headers: {
            Authorization: cleanToken ? `Bearer ${cleanToken}` : '',
          },
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const blob = await response.blob()
        if (active) {
          objectUrl = URL.createObjectURL(blob)
          setImgSrc(objectUrl)
          setError(false)
        }
      } catch (err) {
        console.error('AuthImage Load Failed:', src, err)
        if (active) {
          setError(true)
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

  // If there's an error and a fallback is provided, render the fallback
  if (error && fallback) {
    return <>{fallback}</>
  }

  // Show a pulsing placeholder while loading unless a source is already available
  if (!imgSrc && !error) {
    return (
      <div className={`${className} animate-pulse rounded-lg bg-slate-100 dark:bg-slate-800`} />
    )
  }

  return (
    <img
      src={imgSrc || src}
      alt={alt}
      className={className}
      onError={() => setError(true)}
      loading="lazy"
    />
  )
}

export default AuthImage
