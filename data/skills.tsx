import {
  SiHtml5,
  SiCss,
  SiJavascript,
  SiTypescript,
  SiReact,
  SiNextdotjs,
  SiTailwindcss,
  SiFigma,
  SiSpring,
  SiLaravel,
  SiMysql,
  SiPostgresql,
  SiSupabase,
  SiFirebase,
  SiGit,
  SiGithub,
  SiRust,
  SiEthereum,
} from 'react-icons/si';
import { FaJava } from 'react-icons/fa';
import { SolidityIcon, SolanaIcon, ArbitrumIcon, BaseIcon } from '@/components/ui/Web3Icons';
import type { Skill } from '@/types';

export const skills: Skill[] = [
  // Frontend
  {
    name: 'HTML',
    icon: SiHtml5,
    iconColor: '#E34F26',
    description: 'Solid foundation in semantic, standards-compliant HTML markup for structuring web content.',
    category: 'Frontend',
  },
  {
    name: 'CSS',
    icon: SiCss,
    iconColor: '#1572B6',
    description: 'Skilled in responsive, modern CSS — layouts, animations, and custom design systems.',
    category: 'Frontend',
  },
  {
    name: 'JavaScript',
    icon: SiJavascript,
    iconColor: '#F7DF1E',
    description: 'Strong JS skills for building dynamic, interactive front-end experiences.',
    category: 'Frontend',
  },
  {
    name: 'TypeScript',
    icon: SiTypescript,
    iconColor: '#3178C6',
    description: 'Write more robust, type-safe code with TypeScript for scalable applications.',
    category: 'Frontend',
  },
  {
    name: 'React',
    icon: SiReact,
    iconColor: '#61DAFB',
    description: 'Building component-driven UIs and SPAs with React hooks and modern patterns.',
    category: 'Frontend',
  },
  {
    name: 'Next.js',
    icon: SiNextdotjs,
    iconColor: '#000000',
    description: 'Full-stack React framework for SSR, SSG, and performant web apps.',
    category: 'Frontend',
  },
  {
    name: 'Tailwind CSS',
    icon: SiTailwindcss,
    iconColor: '#06B6D4',
    description: 'Utility-first CSS framework for rapidly building modern, consistent UIs.',
    category: 'Frontend',
  },
  {
    name: 'Figma',
    icon: SiFigma,
    iconColor: '#F24E1E',
    description: 'Designing wireframes, prototypes, and UI components with strong UX principles.',
    category: 'Frontend',
  },

  // Backend
  {
    name: 'Java',
    icon: FaJava,
    iconColor: '#007396',
    description: 'Core Java with OOP principles, used for back-end development and algorithms.',
    category: 'Backend',
  },
  {
    name: 'Spring',
    icon: SiSpring,
    iconColor: '#6DB33F',
    description: 'Building robust, scalable REST APIs and back-end services with Spring Boot.',
    category: 'Backend',
  },
  {
    name: 'Laravel',
    icon: SiLaravel,
    iconColor: '#FF2D20',
    description: 'PHP framework for building web apps with MVC architecture and Eloquent ORM.',
    category: 'Backend',
  },
  {
    name: 'MySQL',
    icon: SiMysql,
    iconColor: '#4479A1',
    description: 'Designing and querying relational databases for structured data management.',
    category: 'Backend',
  },
  {
    name: 'PostgreSQL',
    icon: SiPostgresql,
    iconColor: '#4169E1',
    description: 'Advanced open-source relational database with support for complex queries.',
    category: 'Backend',
  },
  {
    name: 'Supabase',
    icon: SiSupabase,
    iconColor: '#3ECF8E',
    description: 'Open-source Firebase alternative — real-time DB, auth, and storage in one.',
    category: 'Backend',
  },
  {
    name: 'Firebase',
    icon: SiFirebase,
    iconColor: '#FFCA28',
    description: "Google's BaaS platform for real-time database, authentication, and hosting.",
    category: 'Backend',
  },

  // Tools
  {
    name: 'Git',
    icon: SiGit,
    iconColor: '#F05032',
    description: 'Version control for tracking changes and collaborating on code projects.',
    category: 'Tools',
  },
  {
    name: 'GitHub',
    icon: SiGithub,
    iconColor: '#181717',
    description: 'Managing repos, pull requests, and open-source contributions on GitHub.',
    category: 'Tools',
  },

  // Web3
  {
    name: 'Solidity',
    icon: SolidityIcon,
    iconColor: '#363636',
    description: 'Writing smart contracts for Ethereum-compatible blockchains.',
    category: 'Web3',
  },
  {
    name: 'Rust',
    icon: SiRust,
    iconColor: '#CE422B',
    description: 'Systems-level programming language used for Solana program development.',
    category: 'Web3',
  },
  {
    name: 'Solana',
    icon: SolanaIcon,
    iconColor: '#9945FF',
    description: 'High-performance blockchain for building fast, low-cost dApps and programs.',
    category: 'Web3',
  },
  {
    name: 'Ethereum',
    icon: SiEthereum,
    iconColor: '#627EEA',
    description: 'The leading smart contract platform powering DeFi, NFTs, and Web3.',
    category: 'Web3',
  },
  {
    name: 'Arbitrum',
    icon: ArbitrumIcon,
    iconColor: '#28A0F0',
    description: 'Ethereum Layer 2 scaling solution for fast and affordable transactions.',
    category: 'Web3',
  },
  {
    name: 'Base',
    icon: BaseIcon,
    iconColor: '#0052FF',
    description: "Coinbase's L2 blockchain built on Optimism for fast, low-fee dApps.",
    category: 'Web3',
  },
];
