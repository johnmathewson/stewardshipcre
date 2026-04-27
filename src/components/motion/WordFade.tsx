'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

interface WordFadeProps {
  text: string
  className?: string
  delay?: number
  stagger?: number
  as?: 'p' | 'span' | 'div' | 'h2' | 'h3' | 'h4'
}

/**
 * Paragraph / text block that reveals word-by-word as it enters the viewport.
 * Each word fades in with a tiny upward shift — the LSCE/agency-grade copy effect.
 */
export function WordFade({
  text,
  className = '',
  delay = 0,
  stagger = 0.04,
  as: Tag = 'p',
}: WordFadeProps) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  const words = text.split(' ')

  return (
    <Tag className={className} ref={ref as React.RefObject<HTMLParagraphElement>}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true" className="inline">
        {words.map((word, i) => (
          <span key={i} className="inline-block overflow-hidden align-top">
            <motion.span
              className="inline-block"
              initial={{ y: '100%', opacity: 0 }}
              animate={inView ? { y: '0%', opacity: 1 } : { y: '100%', opacity: 0 }}
              transition={{
                duration: 0.6,
                delay: delay + i * stagger,
                ease: [0.25, 0.1, 0.25, 1],
              }}
            >
              {word}
              {i < words.length - 1 && '\u00A0'}
            </motion.span>
          </span>
        ))}
      </span>
    </Tag>
  )
}
