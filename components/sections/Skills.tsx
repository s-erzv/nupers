'use client';

import { motion } from 'framer-motion';
import { Code2, Server, Wrench, Hexagon, type LucideIcon } from 'lucide-react';
import { skills } from '@/data/skills';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { SkillCard } from '@/components/ui/SkillCard';
import type { Skill } from '@/types';

const categories: {
  name: Skill['category'];
  icon: LucideIcon;
  color: string;
}[] = [
  { name: 'Frontend', icon: Code2, color: 'text-sky-500 dark:text-sky-400' },
  { name: 'Backend', icon: Server, color: 'text-emerald-500 dark:text-emerald-400' },
  { name: 'Tools', icon: Wrench, color: 'text-orange-500 dark:text-orange-400' },
  { name: 'Web3', icon: Hexagon, color: 'text-violet-500 dark:text-violet-400' },
];

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.04 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

export default function Skills() {
  const groupedSkills = categories.reduce(
    (acc, cat) => {
      acc[cat.name] = skills.filter((s) => s.category === cat.name);
      return acc;
    },
    {} as Record<Skill['category'], Skill[]>,
  );

  return (
    <section id="skills" className="section-padding">
      <div className="container-wide">
        <SectionHeader label="Tech Stack" title="This is my Tech Stack" />

        <div className="flex flex-col gap-8">
          {categories.map(({ name, icon: CatIcon, color }, catIdx) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.4, delay: catIdx * 0.1 }}
            >
              {/* Category header */}
              <div className="flex items-center gap-2.5 mb-3">
                <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-sky-50 dark:bg-zinc-800/80 border border-sky-100/80 dark:border-zinc-700/50">
                  <CatIcon size={14} className={color} />
                </div>
                <span className={`text-xs font-bold uppercase tracking-widest ${color}`}>
                  {name}
                </span>
                <span className="text-xs text-zinc-400 dark:text-zinc-600 font-medium">
                  ({groupedSkills[name].length})
                </span>
                <div className="flex-1 h-px bg-sky-100 dark:bg-zinc-800" />
              </div>

              {/* Skills grid */}
              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: '-40px' }}
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2"
              >
                {groupedSkills[name].map((skill) => (
                  <motion.div key={skill.name} variants={itemVariants}>
                    <SkillCard {...skill} />
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
