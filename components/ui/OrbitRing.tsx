'use client';

import { skills } from '@/data/skills';
import type { CSSProperties } from 'react';

const HIGH_IMPACT = [
  'Next.js', 'React', 'TypeScript', 'Solidity', 'Tailwind CSS',
  'PostgreSQL', 'Spring', 'Ethereum', 'Rust', 'Solana',
  'Supabase', 'Figma',
];

export function OrbitRing() {
  const orbitSkills = skills.filter(s => HIGH_IMPACT.includes(s.name));

  return (
    <div className="absolute inset-0 pointer-events-none z-0">
      {orbitSkills.map((skill, i) => {
        const Icon = skill.icon;
        const angle = (i / orbitSkills.length) * 360;
        const duration = 50;
        // offset each item so they appear evenly distributed from the start
        const delay = -(i / orbitSkills.length) * duration;

        return (
          <div
            key={skill.name}
            className="absolute top-1/2 left-1/2"
            style={{
              width: 'var(--orbit-radius)',
              height: 'var(--orbit-radius)',
              marginLeft: 'calc(var(--orbit-radius) / -2)',
              marginTop: 'calc(var(--orbit-radius) / -2)',
              '--orbit-radius': 'clamp(300px, 60vw, 680px)',
              animation: `orbit-cw ${duration}s linear ${delay}s infinite`,
            } as CSSProperties}
          >
            <div
              className="absolute"
              style={{
                top: '50%',
                left: '50%',
                transform: `rotate(${angle}deg) translateY(calc(var(--orbit-radius) / -2)) rotate(-${angle}deg)`,
              }}
            >
              <div
                className="w-8 h-8 sm:w-11 sm:h-11 rounded-xl bg-white/40 dark:bg-zinc-800/30 backdrop-blur-[2px] border border-sky-200/20 dark:border-violet-500/10 flex items-center justify-center shadow-sm -translate-x-1/2 -translate-y-1/2 orbit-icon-pulse transition-all hover:bg-white/90 dark:hover:bg-zinc-800/90 hover:border-sky-400 hover:shadow-sky-500/20 hover:backdrop-blur-xl"
                style={{
                  animationDelay: `${i * 0.5}s`,
                  counterRotate: `${angle}deg`,
                } as CSSProperties}
              >
                <Icon
                  size={18}
                  style={{ color: skill.iconColor }}
                  className="sm:w-[22px] sm:h-[22px] grayscale-[0.5] hover:grayscale-0 transition-all opacity-80 hover:opacity-100"
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
