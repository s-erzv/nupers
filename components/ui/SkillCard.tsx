'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { Skill } from '@/types';

export function SkillCard({ name, icon: Icon, iconColor, description }: Skill) {
  const isDarkColor = iconColor === '#000000' || iconColor === '#181717' || iconColor === '#363636';

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.04 }}
      transition={{ type: 'spring', stiffness: 400, damping: 18 }}
      className={cn(
        'group relative flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-default',
        'border border-sky-200/60 dark:border-zinc-800',
        'bg-white/70 dark:bg-zinc-900/60 backdrop-blur-sm',
        'hover:border-sky-400/70 dark:hover:border-violet-500/50',
        'hover:shadow-md hover:shadow-sky-500/10 dark:hover:shadow-violet-500/8',
        'transition-all duration-300',
      )}
    >
      {/* Icon */}
      <div
        className="flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-lg"
        style={{ backgroundColor: `${iconColor}18` }}
      >
        <Icon
          size={16}
          style={{ color: isDarkColor ? undefined : iconColor }}
          className={isDarkColor ? 'text-zinc-700 dark:text-zinc-300' : ''}
        />
      </div>

      {/* Name */}
      <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 truncate leading-none">
        {name}
      </span>

      {/* Tooltip */}
      <div
        className={cn(
          'absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-20 w-52 p-3',
          'rounded-xl border border-sky-200/60 dark:border-zinc-700',
          'bg-white/95 dark:bg-zinc-800/95 backdrop-blur-md shadow-xl shadow-sky-500/10 dark:shadow-none',
          'text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed text-center',
          'opacity-0 group-hover:opacity-100 pointer-events-none',
          'transition-opacity duration-200',
          'hidden md:block',
        )}
      >
        <span className="font-semibold text-zinc-700 dark:text-zinc-200 block mb-1">{name}</span>
        {description}
        <span className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-sky-200/60 dark:border-t-zinc-700" />
      </div>
    </motion.div>
  );
}
