import {
  SiNextdotjs,
  SiTailwindcss,
  SiFigma,
  SiReact,
  SiSupabase,
  SiSpring,
  SiFirebase,
  SiWordpress,
  SiHtml5,
  SiCss,
  SiJavascript,
  SiGooglegemini,
  SiAndroid,
  SiGooglesheets,
  SiThreedotjs,
  SiRust,
} from 'react-icons/si';
import type { IconBaseProps } from 'react-icons';
import type { Project } from '@/types';

// Custom Web3 Icons for Portfolio
const SolidityIcon = (props: IconBaseProps) => (
  <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 32 32" height="1em" width="1em" {...props}>
    <path d="M19.3 2L24.5 11.5H14.1L19.3 2Z" opacity="0.9" />
    <path d="M8.7 11.5L13.9 2H24.1L18.9 11.5H8.7Z" opacity="0.5" />
    <path d="M12.7 30L7.5 20.5H17.9L12.7 30Z" opacity="0.9" />
    <path d="M23.3 20.5L18.1 30H7.9L13.1 20.5H23.3Z" opacity="0.5" />
  </svg>
);

const ArbitrumIcon = (props: IconBaseProps) => (
  <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 32 32" height="1em" width="1em" {...props}>
    <path d="M16 2L28 9V23L16 30L4 23V9L16 2Z" opacity="0.25" stroke="none" />
    <path d="M16 2L28 9V23L16 30L4 23V9L16 2Z" fill="none" stroke="currentColor" strokeWidth="1.5" />
    <path d="M11 22L16 9L21 22H18.5L16 15.5L13.5 22H11Z" stroke="none" />
  </svg>
);

const BaseIcon = (props: IconBaseProps) => (
  <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 32 32" height="1em" width="1em" {...props}>
    <circle cx="16" cy="16" r="13" />
    <path
      d="M11 10.5H17.5C20.2 10.5 22 12.2 22 14.5C22 16.8 20.2 18.5 17.5 18.5H14V21.5H11V10.5ZM14 16H17.2C18.3 16 19 15.4 19 14.5C19 13.6 18.3 13 17.2 13H14V16Z"
      fill="currentColor" 
    />
  </svg>
);

const SolanaIcon = (props: IconBaseProps) => (
  <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 32 32" height="1em" width="1em" {...props}>
    <path d="M5 22.5H25.5L22.5 25.5H5L7.5 22.5Z" />
    <path d="M5 14.5H27.5L24.5 17.5H5L7.5 14.5Z" />
    <path d="M7.5 6.5H27.5L24.5 9.5H5L7.5 6.5Z" />
  </svg>
);

export const projects: Project[] = [
  // --- WEB3 & BLOCKCHAIN PROJECTS ---
  {
    thumbnail: '/pulse.png', // TODO: Tambahkan gambar thumbnail pulsee ke folder public
    title: 'Pulsee — AI-Powered Web3 Event Marketplace',
    link: { label: 'GitHub', url: 'https://github.com/riyqnn/pulsee' },
    description:
      'A decentralized ticketing and event marketplace built on Solana. Features an autonomous AI agent scheduler, smart contract-based escrows, primary/secondary markets, and seamless Web3 onboarding infrastructure.',
    languageIcons: [SiReact, SolanaIcon, SiRust, SiSupabase, SiTailwindcss],
  },
  {
    thumbnail: '/saku.png',
    title: 'Saku — Onchain Payment Protocol',
    link: { label: 'Live Demo', url: '#' },
    description:
      'A non-custodial onchain payment protocol that lets users send crypto to phone numbers instead of wallet addresses. It removes crypto UX friction by translating human intent directly into trustless onchain execution.',
    languageIcons: [SiNextdotjs, ArbitrumIcon, SolidityIcon, SiTailwindcss],
  },
  {
    thumbnail: '/harsa.png',
    title: 'Harsa — Decentralized Agri-Finance',
    link: { label: 'Live Demo', url: '#' },
    description:
      'A gasless Arbitrum-based protocol streamlining agricultural trade through on-chain escrow, QR traceability, and intermediary-free settlements.',
    languageIcons: [SiNextdotjs, ArbitrumIcon, SolidityIcon, SiTailwindcss],
  },
  {
    thumbnail: '/accounting.png',
    title: 'AI-Integrated Accounting System',
    link: { label: 'Live Demo', url: '#' },
    description:
      'An AI-integrated accounting system on Base Sepolia that ensures financial integrity by anchoring cryptographic transaction hashes on-chain.',
    languageIcons: [SiNextdotjs, BaseIcon, SiGooglegemini, SiTailwindcss],
  },

  // --- AI, 3D & ADVANCED PLATFORMS ---
  {
    thumbnail: '/anatomy-edu.png',
    title: 'Anatomy Edu',
    link: { label: 'Live Demo', url: '#' },
    description:
      'An interactive web platform that helps students learn anatomy through 3D models, visual simulations, and engaging learning materials.',
    languageIcons: [SiReact, SiThreedotjs, SiTailwindcss],
  },
  {
    thumbnail: '/planix.svg',
    title: 'Planix — AI Regional Planner',
    link: { label: 'Coming Soon', url: '#' },
    description:
      'Web-based platform that leverages AI and real-time environmental data to analyze land suitability for urban planning, helping users make smarter and data-driven spatial decisions.',
    languageIcons: [SiReact, SiFirebase, SiTailwindcss, SiGooglegemini],
  },
  {
    thumbnail: '/demokratos.png',
    title: 'Demokratos',
    link: { label: 'Live Demo', url: '#' },
    description:
      'Combines AI moderation and digital policy tools to create a safer, smarter, and more inclusive space for citizen-government interaction.',
    languageIcons: [SiNextdotjs, SiGooglegemini, SiTailwindcss],
  },

  // --- BUSINESS & MANAGEMENT SYSTEMS ---
  {
    thumbnail: '/ringkas2.png',
    title: 'RingKas 2.0',
    link: { label: 'Live Demo', url: '#' },
    description:
      'A centralized operations hub that automates marketplace data ingestion, financial reporting, and session tracking to streamline business oversight.',
    languageIcons: [SiNextdotjs, SiSupabase, SiTailwindcss],
  },
  {
    thumbnail: '/ringkas1.png',
    title: 'RingKas 1.0',
    link: { label: 'Live Demo', url: '#' },
    description:
      'An offline-first management ecosystem streamlining brick-and-mortar operations through real-time inventory tracking, return logistics, and integrated retail analytics.',
    languageIcons: [SiReact, SiSupabase, SiTailwindcss],
  },
  {
    thumbnail: '/finedu.png',
    title: 'Finedu',
    link: { label: 'Live Demo', url: '#' },
    description:
      'Helps people understand money better - from budgeting to saving through simple, interactive tools and resources built for everyone.',
    languageIcons: [SiNextdotjs, SiTailwindcss],
  },

  // --- PREVIOUS PROJECTS ---
  {
    thumbnail: '/tech edify web ap.svg',
    title: 'Tech Edify — Informatics Learning Web App',
    link: { label: 'GitHub', url: 'https://github.com/s-erzv/TechEdify' },
    description:
      'A web-based version of the Tech Edify platform for learning informatics. Includes daily progress tracking, learning streaks, and interactive UI. Built using React, Supabase, and Tailwind CSS.',
    languageIcons: [SiReact, SiSupabase, SiTailwindcss],
  },
  {
    thumbnail: '/bluework.svg',
    title: 'BlueWork.ID — Recruitment Application',
    link: { label: 'GitHub', url: 'https://github.com/s-erzv/bluework.id' },
    description:
      'A recruitment platform that allows users to browse job openings, submit applications, and export their data in PDF/Excel formats. Built with React for the frontend, Supabase for the backend, and styled with Tailwind CSS.',
    languageIcons: [SiReact, SiSupabase, SiTailwindcss],
  },
  {
    thumbnail: '/Wedding.svg',
    title: 'Digital Wedding Invitation Website',
    link: { label: 'Live Demo', url: 'https://wedding-invitation-rho-six.vercel.app/' },
    description:
      'A digital wedding invitation site with RSVP functionality, event details, and image gallery. Developed using Next.js and Tailwind CSS for a smooth, mobile-responsive experience.',
    languageIcons: [SiNextdotjs, SiTailwindcss, SiFigma],
  },
  {
    thumbnail: '/bibu.svg',
    title: 'Company Profile for Bibu AMDK',
    link: { label: 'GitHub', url: 'https://github.com/s-erzv/companyProfileBibuAMDK' },
    description:
      'A company profile website for Bibu AMDK designed to present their bottled water products and services. Built with clean and responsive HTML, CSS, and JavaScript.',
    languageIcons: [SiHtml5, SiCss, SiJavascript],
  },
  {
    thumbnail: '/annajm.svg',
    title: 'RA Annajm Company Profile',
    link: { label: 'GitHub', url: 'https://github.com/s-erzv/annajm' },
    description:
      'A lightweight, responsive company profile site for RA Annajm based in Bekasi Utara. Developed using React and Tailwind CSS to provide an elegant and informative user interface.',
    languageIcons: [SiReact, SiTailwindcss],
  },
  {
    thumbnail: '/codify.svg',
    title: 'Codify — LMS for Learning How to Code',
    link: { label: 'GitHub', url: 'https://github.com/Codify-LMS/codify-lms' },
    description:
      'An online learning platform (LMS) that helps users learn programming via lessons, quizzes, discussions, and a ranking system. Built using Next.js, Spring Boot, Supabase, and Tailwind CSS for scalability and interactivity.',
    languageIcons: [SiNextdotjs, SiSpring, SiSupabase, SiTailwindcss],
  },
  {
    thumbnail: '/tech edify app.png',
    title: 'Mobile App Android-Based Informatics Learning',
    link: { label: 'Live Demo', url: '#' },
    description:
      'A mobile learning app built with Kodular for Android devices, designed to teach basic informatics through interactive lessons, embedded quizzes, and visual-rich content. Uses spreadsheets as a backend for quiz data and progress tracking.',
    languageIcons: [SiAndroid, SiGooglesheets],
  },
  {
    thumbnail: '/wp cc.svg',
    title: 'WordPress-Based Learn Fundamental Coding Website',
    link: { label: 'Live Demo', url: '#' },
    description:
      'A WordPress-based website that teaches basic coding through interactive content, embedded quizzes, and downloadable resources. Designed with Figma for an intuitive and student-friendly experience.',
    languageIcons: [SiWordpress, SiFigma],
  },
  {
    thumbnail: '/wp tech edify.svg',
    title: 'WordPress-Based Informatics Learning Website for High School',
    link: { label: 'Live Demo', url: '#' },
    description:
      'An educational website built with WordPress to help high school students learn informatics. Features include downloadable PDFs, multiple-choice quizzes, discussion forums, and responsive learning modules.',
    languageIcons: [SiWordpress, SiFigma],
  },
  {
    thumbnail: '/globeTrekker.svg',
    title: 'UI Design Globe Trekker — Tour & Travel Website',
    link: { label: 'View Case Study', url: 'https://bit.ly/studycaseUIUX_sarah' },
    description:
      'A UI/UX design project for a travel agency website focusing on ease of booking, clean layout, and user journey clarity. Created as a study case to demonstrate design thinking and flow optimization.',
    languageIcons: [SiFigma],
  },
  {
    thumbnail: '/pubmedia.svg',
    title: 'UI Design and WP-Based Pubmedia Website',
    link: { label: 'Live Demo', url: 'https://services.pubmedia.co.id' },
    description:
      'A corporate landing page for a publishing company offering DOI Traffic services. Built with WordPress and designed in Figma, the site provides company profile, service overviews, and direct contact options.',
    languageIcons: [SiFigma, SiWordpress],
  },
];