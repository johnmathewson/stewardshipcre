'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

interface SplitTextProps {
  text: string
  className?: string
  delay?: number
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span'
  staggerDelay?: number
  once?: boolean
}

export function SplitText({
  text,
  className = '',
  delay = 0,
  as: Tag = 'h2',
  staggerDelay = 0.03,
  once = true,
}: SplitTextProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once, margin: '-100px' })

  const words = text.split(' ')

  return (
    <Tag className={className} ref={ref as React.RefObject<HTMLHeadingElement>}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((word, wordIndex) => (
          <span key={wordIndex} className="inline-block mr-[0.25em]">
            {word.split('').map((char, charIndex) => {
              const index = words
                .slice(0, wordIndex)
                .reduce((acc, w) => acc + w.length, 0) + charIndex

              return (
                <motion.span
                  key={charIndex}
                  className="inline-block"
                  initial={{ y: '100%', opacity: 0 }}
                  animate={isInView ? { y: '0%', opacity: 1 } : { y: '100%', opacity: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: delay + index * staggerDelay,
                    ease: [0.25, 0.1, 0.25, 1],
                  }}
                >
                  {char}
                </motion.span>
              )
            })}
          </span>
        ))}
      </span>
    </Tag>
  )
}
