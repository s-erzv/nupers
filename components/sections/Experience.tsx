'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence, useInView, useMotionValue, useSpring, useTransform } from 'framer-motion';
import {
  Briefcase, Code2, LayoutTemplate, Network,
  Calendar, ChevronDown, Sparkles, ArrowRight,
  type LucideIcon
} from 'lucide-react';
import { experiences } from '@/data/experiences';
import { SectionHeader } from '@/components/ui/SectionHeader';

/* ─── Role Config ─────────────────────────────────────────────── */
const roleConfig: Record<string, {
  icon: LucideIcon;
  color: string;
  glow: string;
  gradient: string;
  pill: string;
  orb: string;
  line: string;
  dot: string;
}> = {
  'Full Stack Developer': {
    icon: Code2,
    color: 'text-cyan-500 dark:text-cyan-400',
    glow: 'hover:shadow-cyan-500/20',
    gradient: 'from-cyan-500/15 via-cyan-400/5 to-transparent',
    pill: 'bg-cyan-50 text-cyan-600 border border-cyan-200 dark:bg-cyan-500/10 dark:text-cyan-400 dark:border-cyan-500/20',
    orb: 'bg-cyan-400',
    line: 'from-cyan-500 to-cyan-400/0',
    dot: 'bg-cyan-400 shadow-[0_0_8px_2px_rgba(34,211,238,0.5)]',
  },
  'Front End Developer': {
    icon: LayoutTemplate,
    color: 'text-violet-500 dark:text-violet-400',
    glow: 'hover:shadow-violet-500/20',
    gradient: 'from-violet-500/15 via-violet-400/5 to-transparent',
    pill: 'bg-violet-50 text-violet-600 border border-violet-200 dark:bg-violet-500/10 dark:text-violet-400 dark:border-violet-500/20',
    orb: 'bg-violet-400',
    line: 'from-violet-500 to-violet-400/0',
    dot: 'bg-violet-400 shadow-[0_0_8px_2px_rgba(167,139,250,0.5)]',
  },
  'Landing Page Builder': {
    icon: Briefcase,
    color: 'text-emerald-500 dark:text-emerald-400',
    glow: 'hover:shadow-emerald-500/20',
    gradient: 'from-emerald-500/15 via-emerald-400/5 to-transparent',
    pill: 'bg-emerald-50 text-emerald-600 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20',
    orb: 'bg-emerald-400',
    line: 'from-emerald-500 to-emerald-400/0',
    dot: 'bg-emerald-400 shadow-[0_0_8px_2px_rgba(52,211,153,0.5)]',
  },
  'IT Admin & Community': {
    icon: Network,
    color: 'text-amber-500 dark:text-amber-400',
    glow: 'hover:shadow-amber-500/20',
    gradient: 'from-amber-500/15 via-amber-400/5 to-transparent',
    pill: 'bg-amber-50 text-amber-600 border border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20',
    orb: 'bg-amber-400',
    line: 'from-amber-500 to-amber-400/0',
    dot: 'bg-amber-400 shadow-[0_0_8px_2px_rgba(251,191,36,0.5)]',
  },
};

/* ─── 3D Tilt Card ─────────────────────────────────────────────── */
function TiltCard({ children, disabled = false }: { children: React.ReactNode; disabled?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [3, -3]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-3, 3]), { stiffness: 300, damping: 30 });

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled) return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const onLeave = () => { x.set(0); y.set(0); };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ rotateX, rotateY, transformPerspective: 1200 }}
    >
      {children}
    </motion.div>
  );
}

/* ─── Particle Burst ───────────────────────────────────────────── */
function ParticleBurst({ color, active }: { color: string; active: boolean }) {
  return (
    <AnimatePresence>
      {active && [...Array(8)].map((_, i) => (
        <motion.span
          key={i}
          className={`absolute w-1 h-1 rounded-full ${color} pointer-events-none`}
          style={{ top: '50%', left: '50%' }}
          initial={{ opacity: 1, scale: 1, x: 0, y: 0 }}
          animate={{
            opacity: 0,
            scale: 0,
            x: Math.cos((i / 8) * Math.PI * 2) * 32,
            y: Math.sin((i / 8) * Math.PI * 2) * 32,
          }}
          transition={{ duration: 0.55, ease: 'easeOut', delay: i * 0.02 }}
        />
      ))}
    </AnimatePresence>
  );
}

/* ─── Main ─────────────────────────────────────────────────────── */
export default function Experience() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [burstId, setBurstId] = useState<string | null>(null);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => {
      if (prev !== id) {
        setBurstId(id);
        setTimeout(() => setBurstId(null), 700);
      }
      return prev === id ? null : id;
    });
  };

  return (
    <section
      id="experience"
      ref={sectionRef}
      className="relative py-28 overflow-hidden"
    >
      {/* ── Background atmosphere ── */}
      <div className="absolute inset-0 -z-10 pointer-events-none select-none">
        {/* Light mode: warm grid */}
        <div
          className="absolute inset-0 dark:hidden"
          style={{
            backgroundImage:
              'linear-gradient(rgba(0,0,0,0.035) 1px,transparent 1px),linear-gradient(90deg,rgba(0,0,0,0.035) 1px,transparent 1px)',
            backgroundSize: '52px 52px',
          }}
        />
        {/* Dark mode: dot grid */}
        <div
          className="absolute inset-0 hidden dark:block"
          style={{
            backgroundImage:
              'radial-gradient(circle,rgba(255,255,255,0.035) 1px,transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />
        {/* Ambient blobs */}
        <motion.div
          animate={{ scale: [1, 1.12, 1], opacity: [0.25, 0.45, 0.25] }}
          transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-48 -left-48 w-[700px] h-[700px] rounded-full blur-3xl
            bg-gradient-to-br from-cyan-200/40 via-violet-200/20 to-transparent
            dark:from-cyan-500/10 dark:via-violet-500/5 dark:to-transparent"
        />
        <motion.div
          animate={{ scale: [1, 1.08, 1], opacity: [0.2, 0.35, 0.2] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut', delay: 5 }}
          className="absolute -bottom-48 -right-48 w-[600px] h-[600px] rounded-full blur-3xl
            bg-gradient-to-br from-violet-200/30 via-emerald-200/20 to-transparent
            dark:from-violet-500/8 dark:via-emerald-500/5 dark:to-transparent"
        />
      </div>

      <div className="container max-w-3xl mx-auto px-6">

        {/* ── Section header ── */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <SectionHeader label="Experience" title="Professional Trajectory" />
        </motion.div>

        {/* ── Hint label ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.4 }}
          className="flex items-center gap-2 mb-10 mt-2"
        >
          <motion.div
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            <Sparkles size={12} className="text-zinc-300 dark:text-zinc-600" />
          </motion.div>
          <span className="text-[11px] text-zinc-400 dark:text-zinc-600 tracking-widest uppercase font-medium">
            Click any card to expand
          </span>
        </motion.div>

        {/* ── Cards ── */}
        <div className="flex flex-col gap-3">
          {experiences.map((exp, cardIdx) => {
            const cfg = roleConfig[exp.role] ?? roleConfig['Full Stack Developer'];
            const Icon = cfg.icon;
            const isExpanded = expandedId === exp.id;

            return (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, x: -32, filter: 'blur(4px)' }}
                animate={isInView ? { opacity: 1, x: 0, filter: 'blur(0px)' } : {}}
                transition={{ duration: 0.55, delay: cardIdx * 0.1 + 0.25, ease: [0.22, 1, 0.36, 1] }}
              >
                <TiltCard disabled={isExpanded}>
                  <div
                    className={`
                      group relative rounded-2xl overflow-hidden
                      border transition-all duration-500
                      ${isExpanded
                        ? 'border-zinc-200 dark:border-zinc-700/80 shadow-2xl ' + cfg.glow
                        : 'border-zinc-200/70 dark:border-zinc-800/60 hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-xl ' + cfg.glow
                      }
                    `}
                  >
                    {/* Glass base */}
                    <div className="absolute inset-0 bg-white/85 dark:bg-zinc-900/75 backdrop-blur-md" />

                    {/* Color wash on expand / hover */}
                    <div className={`
                      absolute inset-0 bg-gradient-to-br ${cfg.gradient}
                      transition-opacity duration-500
                      ${isExpanded ? 'opacity-100' : 'opacity-0 group-hover:opacity-60'}
                    `} />

                    {/* Shimmer top line */}
                    <motion.div
                      className={`absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r ${cfg.line}`}
                      initial={false}
                      animate={{ scaleX: isExpanded ? 1 : 0 }}
                      style={{ originX: 0 }}
                      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    />

                    {/* ── Header button ── */}
                    <button
                      onClick={() => toggleExpand(exp.id)}
                      className="relative z-10 w-full text-left p-5 md:p-6 flex items-start gap-4 focus:outline-none"
                      aria-expanded={isExpanded}
                      aria-controls={`sect-${exp.id}`}
                    >
                      {/* Icon + effects */}
                      <div className="relative flex-shrink-0">
                        <motion.div
                          animate={isExpanded
                            ? { scale: 1.1, rotate: 6 }
                            : { scale: 1, rotate: 0 }}
                          whileHover={{ scale: 1.05 }}
                          transition={{ type: 'spring', stiffness: 350, damping: 22 }}
                          className={`
                            w-12 h-12 rounded-xl flex items-center justify-center
                            border transition-colors duration-300
                            border-zinc-200 dark:border-zinc-700/60
                            bg-white dark:bg-zinc-800/80
                            shadow-sm
                            ${cfg.color}
                            ${isExpanded ? 'border-transparent shadow-md' : 'group-hover:border-zinc-300 dark:group-hover:border-zinc-600'}
                          `}
                        >
                          <Icon size={20} strokeWidth={1.8} />
                        </motion.div>

                        {/* Particle burst */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                          <ParticleBurst color={cfg.orb} active={burstId === exp.id} />
                        </div>

                        {/* Pulse ring */}
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ scale: 0.9, opacity: 0.6 }}
                              animate={{ scale: 1.8, opacity: 0 }}
                              exit={{}}
                              transition={{ duration: 0.6, ease: 'easeOut' }}
                              className={`absolute inset-0 rounded-xl ${cfg.orb}`}
                            />
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Text content */}
                      <div className="flex-1 min-w-0 pr-10">
                        <div className="flex flex-wrap items-center gap-2 mb-1.5">
                          <h3 className="font-bold text-zinc-900 dark:text-zinc-50 text-base leading-tight tracking-tight">
                            {exp.role}
                          </h3>
                          <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full ${cfg.pill}`}>
                            {exp.stats}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 text-[11px] text-zinc-400 dark:text-zinc-500 font-medium mb-2.5">
                          <Calendar size={11} strokeWidth={2} />
                          <span>{exp.duration}</span>
                        </div>

                        <p className={`text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed transition-all duration-300 ${isExpanded ? '' : 'line-clamp-1'}`}>
                          {exp.description}
                        </p>
                      </div>

                      {/* Chevron */}
                      <motion.div
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ type: 'spring', stiffness: 280, damping: 24 }}
                        className={`
                          absolute right-5 top-5 md:right-6 md:top-6 flex-shrink-0
                          w-8 h-8 rounded-full flex items-center justify-center
                          border transition-all duration-300
                          ${isExpanded
                            ? `border-transparent ${cfg.color} shadow-md`
                            : 'border-zinc-200 dark:border-zinc-700/60 bg-zinc-50 dark:bg-zinc-800 text-zinc-400 group-hover:border-zinc-300 dark:group-hover:border-zinc-600 group-hover:text-zinc-600 dark:group-hover:text-zinc-300'
                          }
                        `}
                      >
                        <ChevronDown size={15} strokeWidth={2.5} />
                      </motion.div>
                    </button>

                    {/* ── Expanded content ── */}
                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <motion.div
                          id={`sect-${exp.id}`}
                          key="body"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                          className="overflow-hidden relative z-10"
                        >
                          {/* Divider */}
                          <motion.div
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ duration: 0.5, delay: 0.05 }}
                            className="mx-5 md:mx-6 h-px bg-gradient-to-r from-transparent via-zinc-200 dark:via-zinc-700/60 to-transparent origin-left"
                          />

                          <div className="p-5 md:p-6 pt-5">
                            <div className="flex flex-col gap-6 ml-16">
                              {exp.details.map((detail, idx) => (
                                <motion.div
                                  key={idx}
                                  initial={{ opacity: 0, x: -16 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: idx * 0.09 + 0.12, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                                  className="relative pl-6"
                                >
                                  {/* Timeline line */}
                                  <motion.div
                                    initial={{ scaleY: 0 }}
                                    animate={{ scaleY: 1 }}
                                    transition={{ delay: idx * 0.09 + 0.2, duration: 0.4 }}
                                    className="absolute left-0 top-2 bottom-0 w-px bg-gradient-to-b from-zinc-300 dark:from-zinc-700 to-transparent origin-top"
                                  />

                                  {/* Glowing timeline dot */}
                                  <motion.div
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: idx * 0.09 + 0.18, type: 'spring', stiffness: 450 }}
                                    className={`absolute -left-[3px] top-2 w-[7px] h-[7px] rounded-full ${cfg.dot}`}
                                  />

                                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-0.5 mb-1.5">
                                    <h4 className="font-semibold text-zinc-800 dark:text-zinc-100 text-sm leading-snug">
                                      {detail.title}
                                      <span className="text-zinc-400 dark:text-zinc-500 font-normal ml-1.5 text-xs">
                                        @ {detail.context}
                                      </span>
                                    </h4>
                                    {detail.duration && (
                                      <span className="text-[10px] text-zinc-400 font-mono tracking-tight shrink-0">
                                        {detail.duration}
                                      </span>
                                    )}
                                  </div>

                                  <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed mb-3">
                                    {detail.description}
                                  </p>

                                  {/* Tech tags */}
                                  <div className="flex flex-wrap gap-1.5">
                                    {detail.stack.map((tech, ti) => (
                                      <motion.span
                                        key={tech}
                                        initial={{ opacity: 0, scale: 0.75 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: idx * 0.06 + ti * 0.04 + 0.25, type: 'spring', stiffness: 400 }}
                                        whileHover={{ scale: 1.08, y: -1 }}
                                        className="
                                          px-2 py-0.5 rounded-md text-[10px] font-semibold cursor-default
                                          border border-zinc-200 dark:border-zinc-700/50
                                          bg-white dark:bg-zinc-800/80
                                          text-zinc-500 dark:text-zinc-400
                                          transition-colors duration-150
                                          hover:border-zinc-300 dark:hover:border-zinc-600
                                        "
                                      >
                                        {tech}
                                      </motion.span>
                                    ))}
                                  </div>
                                </motion.div>
                              ))}

                              {/* Footer pill */}
                              <motion.div
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: exp.details.length * 0.09 + 0.25 }}
                                className={`flex items-center gap-1.5 text-[11px] font-semibold ${cfg.color}`}
                              >
                                <ArrowRight size={11} />
                                <span>{exp.details.length} project{exp.details.length !== 1 ? 's' : ''} in this role</span>
                              </motion.div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </TiltCard>
              </motion.div>
            );
          })}
        </div>

        {/* ── Bottom decoration ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: experiences.length * 0.1 + 0.6 }}
          className="mt-14 flex items-center gap-4"
        >
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-zinc-200 dark:via-zinc-800 to-transparent" />
          <span className="text-[10px] text-zinc-300 dark:text-zinc-700 font-mono tracking-widest uppercase">
            {experiences.length} roles · still growing
          </span>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-zinc-200 dark:via-zinc-800 to-transparent" />
        </motion.div>
      </div>
    </section>
  );
}