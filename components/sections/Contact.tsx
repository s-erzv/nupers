'use client';

import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, ArrowUpRight } from 'lucide-react';

const XIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.259 5.63L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
  </svg>
);

const socialLinks = [
  { href: 'https://github.com/s-erzv', label: 'GitHub', type: 'github' },
  { href: 'https://www.linkedin.com/in/serzv', label: 'LinkedIn', type: 'linkedin' },
  { href: 'https://x.com/nupers_sv', label: 'X (@nupers_sv)', type: 'x' },
];

export default function Contact() {
  return (
    <section id="contact" className="section-padding">
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="relative rounded-2xl overflow-hidden border border-sky-200/60 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/60 backdrop-blur-md shadow-xl shadow-sky-500/8 dark:shadow-violet-500/5"
        >
          {/* Background decorations */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-sky-400/10 dark:from-violet-500/6 to-transparent" />
            <div className="absolute bottom-0 left-0 w-1/3 h-2/3 bg-gradient-to-tr from-blue-400/10 dark:from-purple-500/5 to-transparent" />
            <motion.div
              animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-sky-300/20 dark:bg-violet-500/8 blur-3xl"
            />
          </div>

          <div className="relative z-10 p-8 md:p-12">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
              {/* Text */}
              <div className="flex flex-col gap-3 max-w-lg">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-500 dark:text-violet-400 uppercase tracking-widest">
                  <span className="w-4 h-px bg-sky-500 dark:bg-violet-400" />
                  Contact
                  <span className="w-4 h-px bg-sky-500 dark:bg-violet-400" />
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">
                  Let&apos;s Connect!
                </h2>
                <p className="text-zinc-500 dark:text-zinc-400 text-sm md:text-base leading-relaxed">
                  I&apos;d love to hear from you! Whether you have questions, need advice, or
                  just want to say hello — feel free to reach out. Find me on:
                </p>

                {/* Social Links */}
                <div className="flex items-center gap-2 pt-1">
                  {socialLinks.map(({ href, label, type }) => (
                    <a
                      key={type}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="p-2.5 rounded-xl border border-sky-200/60 dark:border-zinc-700 bg-white/60 dark:bg-transparent backdrop-blur-sm text-sky-600 dark:text-zinc-400 hover:text-sky-900 dark:hover:text-zinc-100 hover:border-sky-400 dark:hover:border-zinc-500 hover:bg-white dark:hover:bg-zinc-800 hover:shadow-md hover:shadow-sky-500/10 dark:hover:shadow-violet-500/10 transition-all duration-200"
                    >
                      {type === 'github' && <Github size={18} />}
                      {type === 'linkedin' && <Linkedin size={18} />}
                      {type === 'x' && <XIcon size={18} />}
                    </a>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div className="flex flex-col items-start md:items-end gap-4">
                <a
                  href="mailto:sarahfajriarahmah@gmail.com"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-sky-500 dark:bg-violet-600 hover:bg-sky-600 dark:hover:bg-violet-700 text-white text-sm font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-sky-500/30 dark:hover:shadow-violet-500/30 active:scale-[0.97] group"
                >
                  <Mail size={16} />
                  Hire Me
                  <ArrowUpRight
                    size={14}
                    className="opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                  />
                </a>
                <p className="text-xs text-zinc-400 dark:text-zinc-600 md:text-right">
                  Usually responds within 24 hours
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-10 pt-6 border-t border-sky-100 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-2">
              <p className="text-xs text-zinc-400 dark:text-zinc-600">
                Copyright &copy; 2025 nupers. All rights reserved.
              </p>
              <p className="text-xs text-zinc-400 dark:text-zinc-600">
                Built with Next.js &amp; Tailwind CSS
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
