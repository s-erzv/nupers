'use client';

import { useState } from 'react';
import { ExternalLink, Github, X, ShieldCheck, Zap, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { Project } from '@/types';
import Image from 'next/image';

export function ProjectCard({ thumbnail, title, description, longDescription, features, languageIcons, link }: Project) {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasLink = link.url !== '#';
  const isGitHub = link.url.includes('github.com');

  return (
    <>
      <motion.div
        layoutId={`card-${title}`}
        onClick={() => setIsExpanded(true)}
        whileHover={{ y: -6 }}
        transition={{ type: 'spring', stiffness: 400, damping: 24 }}
        className={cn(
          'group flex flex-col rounded-2xl overflow-hidden h-full cursor-pointer',
          'border border-sky-200/60 dark:border-zinc-800',
          'bg-white/70 dark:bg-zinc-900/60 backdrop-blur-sm',
          'hover:border-sky-400/60 dark:hover:border-violet-500/40',
          'hover:shadow-[0_12px_30px_-10px_rgba(14,165,233,0.15)] dark:hover:shadow-[0_12px_30px_-10px_rgba(139,92,246,0.15)]',
          'transition-all duration-300',
        )}
      >
        {/* Thumbnail */}
        <div className="relative w-full aspect-video bg-sky-50 dark:bg-zinc-800 overflow-hidden">
          <Image
            src={thumbnail}
            alt={`Thumbnail of ${title}`}
            fill
            className="object-cover object-top transition-transform duration-700 group-hover:scale-110"
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
            <span className="text-white text-[10px] font-bold uppercase tracking-[0.2em] bg-sky-500/90 backdrop-blur-md px-3 py-1.5 rounded-md shadow-lg shadow-sky-500/20">
              View Details
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col gap-3 p-5 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-bold text-zinc-900 dark:text-zinc-50 text-base leading-tight group-hover:text-sky-600 dark:group-hover:text-violet-400 transition-colors">
              {title}
            </h3>
            <div className="flex-shrink-0 p-1.5 rounded-lg bg-sky-50 dark:bg-zinc-800 text-sky-500 dark:text-violet-400">
              <Zap size={14} />
            </div>
          </div>

          <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed line-clamp-3">
            {description}
          </p>

          {/* Tech icons */}
          <div className="flex items-center gap-2.5 flex-wrap mt-auto pt-4 border-t border-sky-100/60 dark:border-zinc-800/80">
            {languageIcons.map((Icon, i) => (
              <div key={i} className="text-zinc-400 dark:text-zinc-500 group-hover:text-sky-500 dark:group-hover:text-violet-400 transition-colors duration-300">
                <Icon size={16} />
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Detail Modal */}
      <AnimatePresence>
        {isExpanded && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 lg:p-20 overflow-hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsExpanded(false)}
              className="absolute inset-0 bg-zinc-950/80 backdrop-blur-xl"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ 
                opacity: 1, 
                scale: 1, 
                y: 0,
                transition: { type: 'spring', stiffness: 300, damping: 30 } 
              }}
              exit={{ opacity: 0, scale: 0.95, y: 20, transition: { duration: 0.2 } }}
              className="relative w-full max-w-6xl max-h-[90vh] md:max-h-full overflow-hidden rounded-[1.5rem] sm:rounded-[2rem] border border-sky-200/50 dark:border-violet-500/20 bg-white dark:bg-zinc-900 shadow-2xl flex flex-col md:flex-row"
            >
              {/* Elegant Animated Brackets */}
              <div className="hidden md:block absolute top-6 left-6 w-8 h-8 border-t-[3px] border-l-[3px] border-sky-400/70 dark:border-sky-500/70 rounded-tl-xl animate-pulse pointer-events-none z-10" />
              <div className="hidden md:block absolute bottom-6 right-6 w-8 h-8 border-b-[3px] border-r-[3px] border-violet-400/70 dark:border-violet-500/70 rounded-br-xl animate-pulse pointer-events-none z-10" />

              {/* Sidebar: Tech Stack & Close */}
              <div className="hidden md:flex w-20 flex-col items-center py-8 border-r border-sky-100 dark:border-zinc-800/50 gap-8 bg-sky-50/30 dark:bg-zinc-900/50 z-20">
                <div className="flex flex-col gap-4">
                   {languageIcons.map((Icon, i) => (
                    <motion.div 
                      key={i} 
                      whileHover={{ scale: 1.15, color: '#0ea5e9' }}
                      className="p-3 rounded-xl bg-white dark:bg-zinc-800/80 text-zinc-400 border border-sky-100 dark:border-zinc-700 hover:border-sky-400/50 transition-all shadow-sm"
                      title={Icon.name.replace('Si', '')}
                    >
                      <Icon size={20} />
                    </motion.div>
                  ))}
                </div>
                <div className="mt-auto flex flex-col items-center">
                   <button
                    onClick={() => setIsExpanded(false)}
                    className="p-3 rounded-full bg-white dark:bg-zinc-800 text-zinc-500 hover:bg-rose-50 hover:text-rose-500 dark:hover:bg-rose-500/10 transition-colors shadow-sm border border-zinc-200 dark:border-zinc-700"
                    aria-label="Close modal"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* Main Console: Visual Viewport */}
              <div className="w-full md:w-[45%] h-48 sm:h-64 md:h-auto relative bg-sky-50 dark:bg-zinc-950 overflow-hidden group/viewport shrink-0">
                 <Image
                  src={thumbnail}
                  alt={`Preview of ${title}`}
                  fill
                  className="object-cover object-top transition-transform duration-1000 group-hover/viewport:scale-105"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-white dark:to-zinc-900 opacity-0 md:opacity-100" />
              </div>

              {/* Right Side: Project Details */}
              <div className="flex-1 p-6 sm:p-8 md:p-12 md:pl-8 overflow-y-auto custom-scrollbar bg-white dark:bg-zinc-900 z-20 relative">
                 {/* Mobile Close Button */}
                 <button
                    onClick={() => setIsExpanded(false)}
                    className="md:hidden absolute top-4 right-4 p-2 bg-white/90 dark:bg-zinc-800/90 backdrop-blur-sm text-zinc-600 dark:text-zinc-300 rounded-full z-20 shadow-sm border border-zinc-100 dark:border-zinc-700"
                  >
                    <X size={18} />
                  </button>

                <div className="flex flex-col gap-6 sm:gap-8 relative">
                  <header>
                    <div className="flex items-center gap-2 sm:gap-3 mb-4">
                      <div className="h-1 w-8 sm:w-12 rounded-full bg-gradient-to-r from-sky-400 to-violet-500" />
                      <div className="h-px flex-1 bg-gradient-to-r from-zinc-200 dark:from-zinc-800 to-transparent" />
                      <span className="text-[9px] sm:text-[11px] font-bold uppercase tracking-[0.2em] text-sky-500 dark:text-violet-400">Overview</span>
                    </div>
                    <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight leading-tight mb-4 sm:mb-6">
                      {title}
                    </h2>
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                       {languageIcons.map((Icon, i) => (
                          <div key={i} className="flex items-center gap-1 sm:gap-1.5 px-2 py-1 sm:px-3 sm:py-1.5 rounded-full bg-sky-50 dark:bg-violet-500/10 border border-sky-100 dark:border-violet-500/20">
                             <Icon size={10} className="text-sky-500 dark:text-violet-400 sm:w-[12px]" />
                             <span className="text-[8px] sm:text-[10px] font-semibold text-sky-700 dark:text-violet-300 tracking-wide uppercase">
                               {Icon.name.replace('Si', '')}
                             </span>
                          </div>
                       ))}
                    </div>
                  </header>

                  <section className="space-y-6 sm:space-y-8">
                     <div className="relative p-5 sm:p-6 rounded-xl sm:rounded-2xl bg-white dark:bg-zinc-900/50 border border-sky-100 dark:border-zinc-800 shadow-[0_4px_20px_-10px_rgba(14,165,233,0.1)] dark:shadow-none">
                        <div className="absolute -top-2.5 left-4 sm:-top-3 sm:left-6 px-2.5 py-0.5 sm:px-3 sm:py-1 bg-sky-50 dark:bg-zinc-800 border border-sky-200 dark:border-zinc-700 rounded-full text-[8px] sm:text-[10px] font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wider">
                          About
                        </div>
                        <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-300 leading-relaxed mt-1 sm:mt-2">
                          {longDescription || description}
                        </p>
                     </div>
                    
                    {features && features.length > 0 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                        {features.map((feature, i) => (
                          <motion.div 
                            key={i}
                            initial={{ x: 10, opacity: 0 }}
                            whileInView={{ x: 0, opacity: 1 }}
                            transition={{ delay: i * 0.05 }}
                            viewport={{ once: true }}
                            className="flex items-start gap-2.5 sm:gap-3 p-3.5 sm:p-4 rounded-xl border border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-800/40 hover:bg-sky-50/50 dark:hover:bg-violet-500/5 hover:border-sky-200 dark:hover:border-violet-500/30 transition-colors group/feat"
                          >
                             <div className="mt-0.5 text-sky-400 dark:text-violet-400 group-hover/feat:scale-110 transition-transform shrink-0">
                                <ShieldCheck size={14} className="sm:w-[16px]" />
                             </div>
                             <span className="text-[11px] sm:text-sm font-medium text-zinc-700 dark:text-zinc-300 leading-tight group-hover/feat:text-zinc-900 dark:group-hover/feat:text-zinc-100 transition-colors">
                               {feature}
                             </span>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </section>

                  <footer className="mt-auto pt-6 sm:pt-8 border-t border-zinc-100 dark:border-zinc-800 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                    {hasLink && (
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="relative overflow-hidden flex items-center justify-center gap-2.5 px-6 py-3.5 sm:px-8 sm:py-4 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs sm:text-sm font-bold transition-all hover:shadow-lg active:scale-[0.98] group/btn"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-sky-500 to-violet-500 opacity-0 group-hover/btn:opacity-10 dark:group-hover/btn:opacity-20 transition-opacity duration-300" />
                        {isGitHub ? <Github size={16} className="relative z-10 sm:w-[18px]" /> : <Globe size={16} className="relative z-10 sm:w-[18px]" />}
                        <span className="tracking-wide relative z-10">{isGitHub ? 'Source Code' : 'Live Site'}</span>
                        <ExternalLink size={14} className="opacity-50 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform relative z-10 sm:w-[16px]" />
                      </a>
                    )}
                  </footer>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}