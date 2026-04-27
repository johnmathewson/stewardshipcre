'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface TextRevealProps {
  text: string
  className?: string
  delay?: number
}

export function TextReveal({ text, className, delay = 0 }: TextRevealProps) {
  const words = text.split(' ')

  return (
    <motion.span
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className={cn('inline', className)}
    >
      {words.map((word, i) => (
        <motion.span
          key={i}
          variants={{
            hidden: { opacity: 0, y: 20, filter: 'blur(4px)' },
            visible: {
              opacity: 1,
              y: 0,
              filter: 'blur(0px)',
              transition: { duration: 0.4, delay: delay + i * 0.05 },
            },
          }}
          className="inline-block mr-[0.25em]"
        >
          {word}
        </motion.span>
      ))}
    </motion.span>
  )
}
