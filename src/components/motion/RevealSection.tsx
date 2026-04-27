'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

interface RevealSectionProps {
  children: React.ReactNode
  className?: string
  parallax?: boolean
  speed?: number
}

export function RevealSection({
  children,
  className = '',
  parallax = true,
  speed = 50,
}: RevealSectionProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const y = useTransform(scrollYProgress, [0, 1], [speed, -speed])
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])

  return (
    <div ref={ref} className={`relative ${className}`}>
      {parallax ? (
        <motion.div style={{ y, opacity }}>
          {children}
        </motion.div>
      ) : (
        <motion.div style={{ opacity }}>
          {children}
        </motion.div>
      )}
    </div>
  )
}
