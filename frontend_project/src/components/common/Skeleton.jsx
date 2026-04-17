import React from 'react'
import { motion } from 'framer-motion'

/**
 * Skeleton Component - Professional Loading UX
 * 
 * Jab data load ho raha hota hai, toh blank screen dikhane ke bajaye
 * hum yeh "shimmering" (chamakti hui) cards dikhate hain.
 * Isse user ko lagta hai ki app instant kaam kar rahi hai.
 */
const Skeleton = ({ className, repeat = 1 }) => {
  const items = Array.from({ length: repeat })

  return (
    <>
      {items.map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0.5 }}
          animate={{ opacity: [0.5, 0.8, 0.5] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "linear"
          }}
          className={`bg-slate-200 dark:bg-slate-700 rounded-xl ${className}`}
        />
      ))}
    </>
  )
}

/**
 * ProfileSkeleton - Specific loader for Guest profiles
 */
export const ProfileSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
    <div className="space-y-4">
      <Skeleton className="h-40 w-full" />
      <Skeleton className="h-8 w-1/2" />
      <Skeleton className="h-20 w-full" />
    </div>
    <div className="space-y-4">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-40 w-full" />
    </div>
    <div className="space-y-4">
      <Skeleton className="h-60 w-full" />
    </div>
  </div>
)

/**
 * RoomCardSkeleton - Loader for PMS Dashboard rooms
 */
export const RoomCardSkeleton = ({ repeat = 8 }) => (
  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 2xl:grid-cols-15">
    <Skeleton className="h-24 w-full" repeat={repeat} />
  </div>
)

export default Skeleton
