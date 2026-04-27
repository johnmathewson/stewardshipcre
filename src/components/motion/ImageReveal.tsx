'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

interface ImageRevealProps {
  src: string
  alt: string
  className?: string
  imgClassName?: string
  parallax?: boolean
  parallaxAmount?: number
}

/**
 * Image with a clip-path reveal on first scroll-in + optional parallax drift.
 * Uses CSS transition for the clip-path + a 100ms polling interval for
 * viewport detection (RAF-based detection got canceled too fast in React 19
 * strict mode and IntersectionObserver missed Lenis scrolls).
 */
export function ImageReveal({
  src,
  alt,
  className = '',
  imgClassName = '',
  parallax = true,
  parallaxAmount = 0.12,
}: ImageRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [revealed, setRevealed] = useState(false)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    [`${parallaxAmount * 100}%`, `-${parallaxAmount * 100}%`],
  )

  useEffect(() => {
    if (revealed) return
    const intervalId = setInterval(() => {
      const el = ref.current
      if (el) {
        const rect = el.getBoundingClientRect()
        // Reveal if element top is in or above the viewport
        if (rect.top < window.innerHeight + 100) {
          setRevealed(true)
          clearInterval(intervalId)
        }
      }
    }, 100)
    return () => clearInterval(intervalId)
  }, [revealed])

  return (
    <div
      ref={ref}
      className={className}
      style={{ overflow: 'hidden' }}
    >
      <div
        className="absolute inset-0"
        style={{
          clipPath: revealed ? 'inset(0% 0% 0% 0%)' : 'inset(100% 0% 0% 0%)',
          transition: 'clip-path 1.1s cubic-bezier(0.77, 0, 0.175, 1)',
          willChange: 'clip-path',
        }}
      >
        {parallax ? (
          <motion.div
            style={{ y, willChange: 'transform' }}
            className="absolute inset-[-15%] w-[130%] h-[130%]"
          >
            <img src={src} alt={alt} className={`w-full h-full object-cover ${imgClassName}`} />
          </motion.div>
        ) : (
          <img src={src} alt={alt} className={`w-full h-full object-cover ${imgClassName}`} />
        )}
      </div>
    </div>
  )
}
