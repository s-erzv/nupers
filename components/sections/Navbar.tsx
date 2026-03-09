'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Menu, X } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

const navLinks = [
  { label: 'Home', id: 'home' },
  { label: 'Skills', id: 'skills' },
  { label: 'Projects', id: 'projects' },
  { label: 'Experience', id: 'experience' },
  { label: 'Contact', id: 'contact' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [scrolled, setScrolled] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      const sections = navLinks.map(({ id }) => document.getElementById(id));
      const scrollPos = window.scrollY + 120;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= scrollPos) {
          setActiveSection(navLinks[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    setActiveSection(id);
    setIsOpen(false);
  }, []);

  if (!mounted) return null;

  const isDark = resolvedTheme === 'dark';

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-4">
      <div className="relative w-full max-w-6xl">
        {/* Main Navbar */}
        <motion.nav
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={cn(
            'flex items-center justify-between px-4 py-2.5 rounded-2xl border transition-all duration-300',
            scrolled
              ? 'bg-white/85 dark:bg-zinc-900/85 backdrop-blur-lg border-sky-200/60 dark:border-zinc-800 shadow-lg shadow-sky-500/5 dark:shadow-zinc-900/20'
              : 'bg-white/65 dark:bg-zinc-900/50 backdrop-blur-md border-sky-200/40 dark:border-zinc-800/60',
          )}
        >
          {/* Logo */}
          <button
            onClick={() => scrollToSection('home')}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <Image
              src="/logo.svg"
              alt="logo"
              width={28}
              height={28}
              className="rounded-full bg-sky-100 dark:bg-zinc-800 p-0.5"
              unoptimized
            />
            <span className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm">
              s.erzv
            </span>
          </button>

          {/* Desktop Navigation */}
          <ul className="hidden md:flex items-center gap-0.5">
            {navLinks.map(({ label, id }) => (
              <li key={id}>
                <button
                  onClick={() => scrollToSection(id)}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200',
                    activeSection === id
                      ? 'bg-sky-500 dark:bg-violet-600 text-white shadow-sm shadow-sky-500/30 dark:shadow-violet-500/30'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-sky-50 dark:hover:bg-zinc-800',
                  )}
                >
                  {label}
                </button>
              </li>
            ))}
          </ul>

          {/* Right Controls */}
          <div className="flex items-center gap-1">
            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(isDark ? 'light' : 'dark')}
              aria-label="Toggle theme"
              className="p-2 rounded-lg text-zinc-500 dark:text-zinc-400 hover:text-sky-600 dark:hover:text-zinc-100 hover:bg-sky-50 dark:hover:bg-zinc-800 transition-all"
            >
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            {/* Mobile Burger */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
              className="md:hidden p-2 rounded-lg text-zinc-500 dark:text-zinc-400 hover:text-sky-600 dark:hover:text-zinc-100 hover:bg-sky-50 dark:hover:bg-zinc-800 transition-all"
            >
              {isOpen ? <X size={16} /> : <Menu size={16} />}
            </button>
          </div>
        </motion.nav>

        {/* Mobile Dropdown */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.97 }}
              transition={{ duration: 0.18 }}
              className={cn(
                'absolute top-full left-0 right-0 mt-2 rounded-xl border p-2',
                'bg-white/92 dark:bg-zinc-900/95 backdrop-blur-lg',
                'border-sky-200/60 dark:border-zinc-800',
                'shadow-xl shadow-sky-500/8 dark:shadow-zinc-900/20',
                'md:hidden',
              )}
            >
              <ul className="flex flex-col gap-0.5">
                {navLinks.map(({ label, id }) => (
                  <li key={id}>
                    <button
                      onClick={() => scrollToSection(id)}
                      className={cn(
                        'w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                        activeSection === id
                          ? 'bg-sky-500/10 dark:bg-violet-500/10 text-sky-600 dark:text-violet-400'
                          : 'text-zinc-600 dark:text-zinc-400 hover:bg-sky-50 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100',
                      )}
                    >
                      {label}
                    </button>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
