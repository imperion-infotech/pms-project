import React, { useState, useEffect } from 'react';
import api from '../../../services/api';

export const AuthImage = ({ src, alt, className, fallback }) => {
  const [imgSrc, setImgSrc] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let objectUrl = null;
    let isMounted = true;

    const fetchImage = async () => {
      if (!src) {
        setImgSrc(null);
        setLoading(false);
        return;
      }

      // If it's a blob url or local data url, just use it
      if (src.startsWith('blob:') || src.startsWith('data:')) {
        setImgSrc(src);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const response = await api.get(src, { responseType: 'blob' });
        if (isMounted) {
          objectUrl = URL.createObjectURL(response.data);
          setImgSrc(objectUrl);
        }
      } catch (error) {
        console.error(`Failed to load image from ${src}:`, error);
        setImgSrc(null);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchImage();

    return () => {
      isMounted = false;
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [src]);

  if (loading && !imgSrc) {
    return <div className={`flex items-center justify-center bg-slate-100 dark:bg-slate-800 animate-pulse ${className}`} />;
  }

  if (!imgSrc) {
    return fallback || null;
  }

  return <img src={imgSrc} alt={alt} className={className} />;
};
