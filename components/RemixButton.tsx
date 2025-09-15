'use client'

import { RemixButtonProps } from '@/lib/types'
import { motion } from 'framer-motion'
import { Shuffle } from 'lucide-react'

export function RemixButton({ contentId, onClick, variant = 'primary', disabled = false }: RemixButtonProps) {
  const handleClick = () => {
    if (!disabled) {
      onClick(contentId)
    }
  }

  const baseClasses = "flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-all duration-200"
  const variantClasses = {
    primary: disabled
      ? "bg-surface text-text/40 cursor-not-allowed"
      : "bg-accent text-text hover:bg-accent/80 hover:scale-105",
    disabled: "bg-surface text-text/40 cursor-not-allowed"
  }

  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      onClick={handleClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]}`}
    >
      <Shuffle className="w-4 h-4" />
      {disabled ? 'Remixing...' : 'Remix'}
    </motion.button>
  )
}

