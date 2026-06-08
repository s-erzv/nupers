'use client';

import { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import {
  Github, Linkedin, ArrowRight, FileText, Sparkles, Code2, Layers, Cpu, MapPin,
  ExternalLink, Globe, Zap, Box, Database
} from 'lucide-react';
import { OrbitRing } from '@/components/ui/OrbitRing';

const XIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.259 5.63L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
  </svg>
);

function MagneticButton({ children, className = '', onClick, href, target, rel }: {
  children: React.ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
  href?: string;
  target?: string;
  rel?: string;
}) {
  const ref = useRef<HTMLAnchorElement & HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 20 });
  const sy = useSpring(y, { stiffness: 200, damping: 20 });

  const onMove = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const cx = e.clientX - rect.left - rect.width / 2;
    const cy = e.clientY - rect.top - rect.height / 2;
    x.set(cx * 0.25);
    y.set(cy * 0.25);
  };
  const onLeave = () => { x.set(0); y.set(0); };

  const props = {
    ref,
    onMouseMove: onMove,
    onMouseLeave: onLeave,
    style: { x: sx, y: sy },
    className,
  };

  if (href) {
    return (
      <motion.a href={href} target={target} rel={rel} onClick={onClick} {...props}>
        {children}
      </motion.a>
    );
  }
  return <motion.button onClick={onClick} {...props}>{children}</motion.button>;
}

function Counter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !inView.current) {
        inView.current = true;
        let start = 0;
        const step = () => {
          start += Math.ceil(target / 30);
          if (start >= target) { setCount(target); return; }
          setCount(start);
          requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      }
    });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return <span ref={ref}>{count}{suffix}</span>;
}

function TypingText({ words }: { words: string[] }) {
  const [idx, setIdx] = useState(0);
  const [text, setText] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = words[idx];
    const timeout = setTimeout(() => {
      if (!deleting) {
        if (text.length < current.length) {
          setText(current.slice(0, text.length + 1));
        } else {
          setTimeout(() => setDeleting(true), 1800);
        }
      } else {
        if (text.length > 0) {
          setText(current.slice(0, text.length - 1));
        } else {
          setDeleting(false);
          setIdx((i) => (i + 1) % words.length);
        }
      }
    }, deleting ? 45 : 80);
    return () => clearTimeout(timeout);
  }, [text, deleting, idx, words]);

  return (
    <span className="relative inline-flex items-center">
      <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-blue-600 dark:from-violet-400 dark:to-fuchsia-400">
        {text}
      </span>
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.6, repeat: Infinity }}
        className="ml-1 inline-block w-[3px] h-[0.9em] bg-sky-500 dark:bg-violet-400"
      />
    </span>
  );
}


const stats = [
  { label: 'Projects', value: 15, suffix: '+', icon: Layers },
  { label: 'Tech Stack', value: 25, suffix: '+', icon: Cpu },
  { label: 'Years Exp.', value: 3, suffix: '+', icon: Sparkles },
];

const badges = [
  { label: 'Next.js', cls: 'bg-zinc-900 text-zinc-100 dark:bg-zinc-100 dark:text-zinc-900' },
  { label: 'React', cls: 'bg-sky-100 text-sky-700 dark:bg-sky-900/60 dark:text-sky-300' },
  { label: 'Solidity', cls: 'bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300' },
  { label: 'Supabase', cls: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300' },
];

function HeroCard() {
  const cardRef = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotX = useSpring(useTransform(my, [-0.5, 0.5], [6, -6]), { stiffness: 200, damping: 25 });
  const rotY = useSpring(useTransform(mx, [-0.5, 0.5], [-6, 6]), { stiffness: 200, damping: 25 });

  const onMove = (e: React.MouseEvent) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const onLeave = () => { mx.set(0); my.set(0); };

  return (
    <motion.div
      initial={{ opacity: 0, x: 60, filter: 'blur(12px)' }}
      animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
      transition={{ duration: 1, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="relative w-full max-w-[340px] sm:max-w-[440px] lg:max-w-[560px] h-[500px] sm:h-[560px] shrink-0 mx-auto lg:mx-0"
    >
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.6, 0.4] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute inset-[-10px] sm:inset-[-20px] rounded-[2rem] sm:rounded-[2.5rem] bg-sky-300/30 dark:bg-violet-600/20 blur-2xl sm:blur-3xl -z-10"
      />

      <motion.div
        ref={cardRef}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        style={{ rotateX: rotX, rotateY: rotY, transformPerspective: 1000 }}
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="relative w-full h-full flex flex-col rounded-[1.5rem] sm:rounded-[2rem] border border-sky-200/70 dark:border-zinc-700/50 bg-white/90 dark:bg-zinc-900/80 backdrop-blur-2xl shadow-[0_20px_50px_rgba(14,165,233,0.1)] sm:shadow-[0_32px_80px_rgba(14,165,233,0.15)] dark:shadow-[0_32px_80px_rgba(139,92,246,0.12)] overflow-hidden"
      >
        <div className="absolute inset-0 rounded-[1.5rem] sm:rounded-[2rem] bg-gradient-to-br from-white/60 via-transparent to-transparent dark:from-white/5 pointer-events-none z-20" />

        <div className="h-24 sm:h-32 shrink-0 bg-gradient-to-br from-sky-400/40 via-blue-300/25 to-violet-300/15 dark:from-violet-700/40 dark:via-purple-600/25 dark:to-fuchsia-600/10 relative overflow-hidden border-b border-sky-100/50 dark:border-zinc-800">
          <div className="absolute inset-0 opacity-[0.06]"
            style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")' }}
          />
          <motion.div
            animate={{ x: [0, 20, 0], y: [0, -10, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute inset-0"
            style={{ background: 'radial-gradient(ellipse at 70% 60%, rgba(14,165,233,0.5) 0%, transparent 65%)' }}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.2 }}
            className="absolute top-4 right-4 sm:top-5 sm:right-5 flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border border-white/60 dark:border-zinc-700/50 shadow-sm z-10"
          >
            <span className="relative flex h-1.5 w-1.5 sm:h-2 sm:w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 sm:h-2 sm:w-2 bg-emerald-500" />
            </span>
            <span className="text-[9px] sm:text-[11px] font-bold text-zinc-700 dark:text-zinc-300 tracking-wide uppercase">Open to work</span>
          </motion.div>
        </div>

        <div className="relative px-5 pt-14 pb-5 sm:px-6 sm:pt-16 sm:pb-6 lg:px-8 lg:pt-20 lg:pb-8 flex-1 flex flex-col">
          <div className="absolute -top-10 left-5 sm:-top-12 sm:left-6 lg:left-8 z-10">
            <motion.div
              whileHover={{ scale: 1.05, rotate: -4 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="w-20 h-20 sm:w-24 sm:h-24 relative rounded-[1rem] sm:rounded-[1.25rem] bg-zinc-100 dark:bg-zinc-800 shadow-xl shadow-sky-500/30 dark:shadow-violet-500/30 border-2 sm:border-4 border-white dark:border-zinc-900 cursor-default overflow-hidden"
            >
              <Image src="/me.jpg" alt="Sarah Fajriah Rahmah" fill className="object-cover" draggable={false} />
            </motion.div>
          </div>

          <div className="mb-4 sm:mb-6 mt-1 sm:mt-2">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="font-black text-zinc-900 dark:text-zinc-50 text-xl sm:text-2xl tracking-tight leading-tight">
                  Sarah Fajriah Rahmah
                </h2>
                <p className="text-xs sm:text-sm font-medium text-zinc-500 dark:text-zinc-400 mt-0.5 sm:mt-1 flex items-center gap-1.5">
                  <Code2 size={13} className="text-sky-500 dark:text-violet-400 sm:w-[14px]" />
                  Full Stack Developer
                </p>
              </div>
              <div className="flex items-center gap-1 text-[9px] sm:text-[11px] font-semibold text-zinc-400 dark:text-zinc-500 mt-1 sm:mt-1.5 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-md bg-zinc-100 dark:bg-zinc-800/50">
                <MapPin size={9} className="sm:w-[11px]" />
                <span>ID</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4 sm:mb-6">
            {stats.map(({ label, value, suffix, icon: Icon }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 + i * 0.1 }}
                whileHover={{ y: -2, scale: 1.03 }}
                className="flex flex-col items-center gap-1.5 sm:gap-2 p-2 sm:p-3.5 rounded-xl sm:rounded-2xl bg-sky-50/70 dark:bg-zinc-800/50 border border-sky-100/60 dark:border-zinc-700/30 cursor-default transition-colors hover:bg-sky-100/70 dark:hover:bg-zinc-800"
              >
                <Icon size={14} className="text-sky-500 dark:text-violet-400 sm:w-[16px]" />
                <span className="text-sm sm:text-lg font-black text-zinc-900 dark:text-zinc-50 leading-none tabular-nums">
                  <Counter target={value} suffix={suffix} />
                </span>
                <span className="text-[8px] sm:text-[10px] text-zinc-500 dark:text-zinc-400 uppercase font-bold tracking-wider text-center leading-none sm:leading-normal">{label}</span>
              </motion.div>
            ))}
          </div>

          <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-auto">
            {badges.map(({ label, cls }, i) => (
              <motion.span
                key={label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.3 + i * 0.07, type: 'spring', stiffness: 400 }}
                whileHover={{ scale: 1.05, y: -1 }}
                className={`px-2 py-1 sm:px-3 sm:py-1.5 rounded-md sm:rounded-lg text-[10px] sm:text-xs font-bold tracking-tight shadow-sm cursor-default ${cls}`}
              >
                {label}
              </motion.span>
            ))}
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.65 }}
              className="px-2 py-1 sm:px-3 sm:py-1.5 rounded-md sm:rounded-lg text-[10px] sm:text-xs font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 shadow-sm cursor-default"
            >
              +21
            </motion.span>
          </div>
        </div>

        <div className="px-5 py-3 sm:px-6 sm:py-4 lg:px-8 lg:py-4 border-t border-sky-100/60 dark:border-zinc-800/80 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-900/50 shrink-0">
          <div className="flex items-center gap-2">
            <motion.div animate={{ rotate: [0, 20, -20, 0] }} transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 4 }}>
              <Sparkles size={12} className="text-sky-500 dark:text-violet-400 sm:w-[14px]" />
            </motion.div>
            <p className="text-[9px] sm:text-[11px] font-bold tracking-wide text-zinc-500 dark:text-zinc-400 uppercase">Building in public</p>
          </div>
          <ExternalLink size={12} className="text-zinc-400 dark:text-zinc-600 sm:w-[14px]" />
        </div>

        <motion.div
          animate={{ y: [-10, 500, -10] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', repeatDelay: 3 }}
          className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-sky-400/50 dark:via-violet-400/50 to-transparent pointer-events-none z-30"
        />
      </motion.div>

      <div className="absolute -top-4 -right-4 sm:-top-8 sm:-right-8 w-10 h-10 sm:w-16 sm:h-16 rounded-full border border-sky-300/30 dark:border-violet-400/20 border-dashed pointer-events-none" style={{ animation: 'orbit-cw 22s linear infinite' }} />
      <div className="absolute -bottom-4 -left-4 sm:-bottom-6 sm:-left-6 w-12 h-12 sm:w-20 sm:h-20 rounded-full border border-sky-200/30 dark:border-violet-500/20 border-dashed pointer-events-none" style={{ animation: 'orbit-cw 17s linear reverse infinite' }} />
    </motion.div>
  );
}

const socials = [
  { href: 'https://github.com/s-erzv', label: 'GitHub', type: 'github' },
  { href: 'https://www.linkedin.com/in/serzv', label: 'LinkedIn', type: 'linkedin' },
  { href: 'https://x.com/nupers_sv', label: 'X', type: 'x' },
];

// Pre-computed so Math.random() doesn't run on every render
const FLOATERS = [
  { iconIdx: 0, y: -52, x: -8,  dur: 7.2, delay: 0.0, left: 12, top: 18, size: 22 },
  { iconIdx: 1, y: -38, x: 11,  dur: 9.5, delay: 1.2, left: 28, top: 62, size: 28 },
  { iconIdx: 2, y: -44, x: -14, dur: 6.8, delay: 2.5, left: 55, top: 25, size: 20 },
  { iconIdx: 3, y: -60, x: 7,   dur: 8.1, delay: 0.7, left: 72, top: 78, size: 32 },
  { iconIdx: 4, y: -35, x: -10, dur: 7.6, delay: 3.1, left: 85, top: 40, size: 24 },
  { iconIdx: 5, y: -48, x: 13,  dur: 9.0, delay: 1.8, left: 40, top: 85, size: 26 },
  { iconIdx: 6, y: -42, x: -6,  dur: 6.3, delay: 4.0, left: 8,  top: 72, size: 20 },
  { iconIdx: 7, y: -55, x: 9,   dur: 8.7, delay: 2.3, left: 63, top: 15, size: 30 },
] as const;

export default function Hero() {
  const scrollToProjects = (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
  };

  const typingWords = [
    'web apps.',
    'clean UI.',
    'Web3 products.',
    'smart systems.'
  ];

  return (
    <section id="home" className="relative min-h-screen flex items-center px-4 md:px-6 pt-24 pb-16 overflow-hidden">
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute inset-0 dark:hidden" style={{ backgroundImage: 'linear-gradient(rgba(14,165,233,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(14,165,233,0.06) 1px, transparent 1px)', backgroundSize: '56px 56px' }} />
        <div className="absolute inset-0 hidden dark:block" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)', backgroundSize: '30px 30px' }} />

        <div className="absolute -top-32 -right-32 w-[700px] h-[700px] rounded-full blur-3xl bg-gradient-to-br from-sky-300/35 via-blue-300/20 to-transparent dark:from-violet-600/15 dark:via-purple-500/10 dark:to-transparent blob-pulse-a" />
        <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] rounded-full blur-3xl bg-gradient-to-br from-blue-200/30 via-cyan-200/15 to-transparent dark:from-fuchsia-600/10 dark:via-violet-500/8 dark:to-transparent blob-pulse-b" />
        <div className="absolute top-1/3 left-1/3 w-80 h-80 rounded-full blur-3xl bg-sky-200/20 dark:bg-violet-400/5 blob-pulse-c" />
        <div className="absolute inset-0 dark:hidden" style={{ background: 'radial-gradient(ellipse at 50% 0%, transparent 60%, rgba(241,245,249,0.4) 100%)' }} />
      </div>

      {(() => {
        const Icons = [Code2, Cpu, Zap, Box, Layers, Sparkles, Globe, Database] as const;
        return FLOATERS.map((f, i) => {
          const Icon = Icons[f.iconIdx];
          return (
            <motion.div
              key={i}
              className="absolute pointer-events-none text-sky-500/20 dark:text-violet-400/15 -z-10"
              animate={{ y: [0, f.y, 0], x: [0, f.x, 0], rotate: [0, 10, -10, 0], opacity: [0.1, 0.4, 0.1] }}
              transition={{ duration: f.dur, repeat: Infinity, delay: f.delay, ease: 'easeInOut' }}
              style={{ left: `${f.left}%`, top: `${f.top}%` }}
            >
              <Icon size={f.size} />
            </motion.div>
          );
        });
      })()}

      <div className="container-wide relative z-10 w-full max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-center gap-12 lg:gap-24">
          <div className="flex flex-col gap-6 sm:gap-7 flex-1 text-left items-start">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
              <MagneticButton className="inline-flex items-center gap-2.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-[10px] sm:text-xs font-bold bg-white/80 dark:bg-zinc-800/70 text-sky-700 dark:text-zinc-300 border border-sky-200/80 dark:border-zinc-700/60 backdrop-blur-md shadow-sm shadow-sky-500/10 hover:shadow-md hover:shadow-sky-500/20 transition-shadow duration-200 cursor-default">
                <span className="relative flex h-1.5 w-1.5 sm:h-2 sm:w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 sm:h-2 sm:w-2 bg-emerald-500" />
                </span>
                Available for new opportunities
                <span className="w-px h-3 bg-sky-200 dark:bg-zinc-700" />
                <MapPin size={10} className="text-zinc-400 sm:w-[11px]" />
                <span className="text-zinc-400 font-medium">Indonesia</span>
              </MagneticButton>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="text-4xl sm:text-5xl md:text-[4.25rem] font-black text-zinc-900 dark:text-zinc-50 leading-[1.1] tracking-tight min-h-[100px] sm:min-h-[160px] md:min-h-[200px]"
            >
              Turning late-night ideas into{' '}
              <span className="whitespace-nowrap">
                <TypingText words={typingWords} />
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="text-base sm:text-lg md:text-xl text-zinc-500 dark:text-zinc-400 max-w-lg leading-relaxed sm:px-0"
            >
              Information Systems Student | Currently exploring{' '}
              <span className="relative font-bold text-sky-600 dark:text-violet-400 inline-block">
                Web3 ecosystems
                <motion.span animate={{ scaleX: [0, 1, 1, 0] }} transition={{ duration: 2, delay: 1.5, repeat: Infinity, repeatDelay: 5, ease: [0.22, 1, 0.36, 1] }} className="absolute -bottom-0.5 left-0 right-0 h-px bg-sky-500 dark:bg-violet-400 origin-left" />
              </span>{' '}
              and building things that matter.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.45, ease: [0.22, 1, 0.36, 1] }} className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mt-2 w-full sm:w-auto sm:px-0">
              <MagneticButton href="#projects" onClick={scrollToProjects} className="group w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 sm:px-8 sm:py-4 rounded-xl sm:rounded-2xl bg-sky-500 hover:bg-sky-600 dark:bg-violet-600 dark:hover:bg-violet-700 active:scale-[0.97] text-white text-sm sm:text-base font-bold transition-all duration-200 hover:shadow-xl hover:shadow-sky-500/40 dark:hover:shadow-violet-500/35 shadow-lg shadow-sky-500/25">
                View Projects
                <motion.span className="inline-flex" animate={{ x: [0, 3, 0] }} transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}><ArrowRight size={16} className="sm:w-[18px]" /></motion.span>
              </MagneticButton>

              <MagneticButton href="/resume.pdf" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 sm:px-8 sm:py-4 rounded-xl sm:rounded-2xl border border-sky-200 dark:border-zinc-700 bg-white/80 dark:bg-transparent backdrop-blur-sm text-sky-700 dark:text-zinc-300 text-sm sm:text-base font-bold hover:bg-sky-50 dark:hover:bg-zinc-800/80 hover:border-sky-400 dark:hover:border-zinc-600 transition-all duration-200 active:scale-[0.97] shadow-sm hover:shadow-md">
                <FileText size={16} className="sm:w-[18px]" /> View Resume
              </MagneticButton>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.65 }} className="flex items-center gap-3 mt-4 lg:mt-2">
              {socials.map(({ href, label, type }, i) => (
                <motion.a key={type} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.7 + i * 0.08, type: 'spring', stiffness: 400 }} whileHover={{ scale: 1.15, y: -2 }} whileTap={{ scale: 0.95 }} className="p-2.5 sm:p-3 rounded-lg sm:rounded-xl border border-sky-200/80 dark:border-zinc-800 bg-white/70 dark:bg-transparent backdrop-blur-sm text-sky-600 dark:text-zinc-400 hover:text-sky-900 dark:hover:text-zinc-100 hover:border-sky-400 dark:hover:border-zinc-600 hover:bg-white dark:hover:bg-zinc-800 hover:shadow-md hover:shadow-sky-500/15 transition-all duration-200">
                  {type === 'github' && <Github size={17} className="sm:w-[18px]" />}
                  {type === 'linkedin' && <Linkedin size={17} className="sm:w-[18px]" />}
                  {type === 'x' && <XIcon size={17} />}
                </motion.a>
              ))}
              <motion.div initial={{ opacity: 0, scaleX: 0 }} animate={{ opacity: 1, scaleX: 1 }} transition={{ delay: 0.95 }} className="w-6 sm:w-10 h-px bg-zinc-200 dark:bg-zinc-800 mx-2 origin-left" />
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="text-xs sm:text-sm font-medium text-zinc-400 dark:text-zinc-600">Find me on</motion.span>
            </motion.div>
          </div>

          <div className="flex-shrink-0 w-full lg:w-auto flex justify-center mt-2 sm:mt-12 lg:mt-0 relative">
            {/* Background Orbit Ring - Now relative to the card */}
            <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
              <div className="relative w-full h-full max-w-[900px] aspect-square scale-[0.8] sm:scale-100 lg:scale-[1.1] opacity-90">
                <OrbitRing />
              </div>
            </div>
            <HeroCard />
          </div>
        </div>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.2, duration: 0.8 }} className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 sm:gap-1.5 text-zinc-300 dark:text-zinc-700">
        <span className="text-[9px] sm:text-[10px] font-bold tracking-[0.2em] sm:tracking-[0.3em] uppercase">Scroll</span>
        <div className="relative w-4 h-7 sm:w-5 sm:h-9 rounded-full border border-zinc-300/50 dark:border-zinc-700/50 flex items-start justify-center pt-1 sm:pt-1.5">
          <motion.div animate={{ y: [0, 10, 0], opacity: [1, 0, 1] }} transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }} className="w-0.5 h-1 sm:w-1 sm:h-1.5 rounded-full bg-sky-400 dark:bg-violet-500" />
        </div>
      </motion.div>
    </section>
  );
}