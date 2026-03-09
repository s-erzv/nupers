'use client';

import { motion } from 'framer-motion';
import { skills } from '@/data/skills';
import type { CSSProperties } from 'react';

export function OrbitRing() {
  // Select high-impact skills
  const highImpactSkills = [
    'Next.js', 'React', 'TypeScript', 'Solidity', 'Tailwind CSS', 
    'PostgreSQL', 'Spring', 'Ethereum', 'Rust', 'Solana', 
    'Supabase', 'Figma'
  ];

  const orbitSkills = skills.filter(s => highImpactSkills.includes(s.name));

  return (
    <div className="absolute inset-0 pointer-events-none z-0">
      {/* Unified Single Ring Orbit with 3D-depth effect */}
      {orbitSkills.map((skill, i) => {
        const Icon = skill.icon;
        const angle = (i / orbitSkills.length) * 360;
        const delay = i * (40 / orbitSkills.length);
        
        return (
          <motion.div
            key={skill.name}
            className="absolute top-1/2 left-1/2"
            animate={{ rotate: 360 }}
            transition={{ duration: 50, repeat: Infinity, ease: 'linear', delay: -delay }}
            style={{ 
              width: 'var(--orbit-radius)', 
              height: 'var(--orbit-radius)',
              marginLeft: 'calc(var(--orbit-radius) / -2)',
              marginTop: 'calc(var(--orbit-radius) / -2)',
              '--orbit-radius': 'clamp(300px, 60vw, 680px)',
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
              <motion.div 
                animate={{ 
                  scale: [1, 1.1, 1],
                  opacity: [0.5, 0.8, 0.5] 
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.5
                }}
                whileHover={{ scale: 1.3, opacity: 1, rotate: 12 }}
                className="w-8 h-8 sm:w-11 sm:h-11 rounded-xl bg-white/40 dark:bg-zinc-800/30 backdrop-blur-[2px] border border-sky-200/20 dark:border-violet-500/10 flex items-center justify-center shadow-sm -translate-x-1/2 -translate-y-1/2 group transition-all hover:bg-white/90 dark:hover:bg-zinc-800/90 hover:border-sky-400 hover:shadow-sky-500/20 hover:backdrop-blur-xl"
              >
                <Icon 
                  size={18} 
                  style={{ color: skill.iconColor }} 
                  className="sm:w-[22px] sm:h-[22px] grayscale-[0.5] group-hover:grayscale-0 transition-all opacity-80 group-hover:opacity-100" 
                />
              </motion.div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
