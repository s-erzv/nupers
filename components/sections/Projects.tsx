'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { projects } from '@/data/projects';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { ProjectCard } from '@/components/ui/ProjectCard';

const PROJECTS_PER_PAGE = 3;

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const item = {
  hidden: { opacity: 0, x: -16 },
  show: { opacity: 1, x: 0, transition: { duration: 0.35 } },
};

export default function Projects() {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(projects.length / PROJECTS_PER_PAGE);
  const paginatedProjects = projects.slice(
    (currentPage - 1) * PROJECTS_PER_PAGE,
    currentPage * PROJECTS_PER_PAGE,
  );

  const goToPage = (page: number) => {
    setCurrentPage(page);
    setTimeout(() => {
      document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  const getVisiblePages = () => {
    const pages: (number | string)[] = [];
    const range = 1; // Number of neighbors to show

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - range && i <= currentPage + range)
      ) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== '...') {
        pages.push('...');
      }
    }
    return pages;
  };

  return (
    <section
      id="projects"
      className="section-padding bg-sky-50/50 dark:bg-zinc-900/30 border-y border-sky-100/60 dark:border-zinc-900"
    >
      <div className="container-wide">
        <SectionHeader
          label="Projects"
          title="Some of my Best Work"
          description="A collection of projects I've built — from learning platforms to AI-powered tools and company profiles."
        />

        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            variants={container}
            initial="hidden"
            animate="show"
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {paginatedProjects.map((project) => (
              <motion.div key={project.title} variants={item} className="h-full">
                <ProjectCard {...project} />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Pagination */}
        {totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="flex flex-col items-center gap-4 mt-12 px-4"
          >
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap justify-center">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-1.5 sm:p-2 rounded-lg border border-sky-200/80 dark:border-zinc-700 bg-white/70 dark:bg-zinc-900/60 backdrop-blur-sm text-sky-600 dark:text-zinc-400 hover:border-sky-400 dark:hover:border-zinc-500 hover:bg-sky-50 dark:hover:bg-zinc-800 disabled:opacity-35 disabled:cursor-not-allowed transition-all duration-200"
                aria-label="Previous page"
              >
                <ChevronLeft size={16} />
              </button>

              <div className="flex items-center gap-1 sm:gap-1.5">
                {getVisiblePages().map((page, i) => (
                  <button
                    key={i}
                    onClick={() => typeof page === 'number' && goToPage(page)}
                    disabled={page === '...'}
                    className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg text-xs sm:text-sm font-bold transition-all duration-200 ${
                      currentPage === page
                        ? 'bg-sky-500 dark:bg-violet-600 text-white shadow-md shadow-sky-500/20 scale-105'
                        : page === '...'
                        ? 'cursor-default text-zinc-400 border-none bg-transparent'
                        : 'border border-sky-200/80 dark:border-zinc-700 bg-white/70 dark:bg-zinc-900/60 backdrop-blur-sm text-sky-600 dark:text-zinc-400 hover:border-sky-400 dark:hover:border-zinc-500 hover:bg-sky-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-1.5 sm:p-2 rounded-lg border border-sky-200/80 dark:border-zinc-700 bg-white/70 dark:bg-zinc-900/60 backdrop-blur-sm text-sky-600 dark:text-zinc-400 hover:border-sky-400 dark:hover:border-zinc-500 hover:bg-sky-50 dark:hover:bg-zinc-800 disabled:opacity-35 disabled:cursor-not-allowed transition-all duration-200"
                aria-label="Next page"
              >
                <ChevronRight size={16} />
              </button>
            </div>

            <p className="text-center text-[9px] sm:text-[10px] text-zinc-400 dark:text-zinc-600 uppercase font-bold tracking-[0.2em]">
              Showing {Math.min(projects.length, (currentPage - 1) * PROJECTS_PER_PAGE + 1)}–
              {Math.min(currentPage * PROJECTS_PER_PAGE, projects.length)} of {projects.length} nodes
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
}
