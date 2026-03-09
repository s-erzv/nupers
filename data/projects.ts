import {
  SiNextdotjs,
  SiTailwindcss,
  SiFigma,
  SiReact,
  SiSupabase,
  SiSpringboot,
  SiFirebase,
  SiWordpress,
  SiHtml5,
  SiCss,
  SiJavascript,
  SiGooglegemini,
  SiAndroid,
  SiGooglesheets,
} from 'react-icons/si';
import type { Project } from '@/types';

export const projects: Project[] = [
  {
    thumbnail: '/tech edify app.png',
    title: 'TechEdify Mobile App',
    link: { label: 'Live Demo', url: '#' },
    description: 'Android-based informatics learning platform built with Kodular and Google Sheets backend.',
    longDescription: 'A comprehensive mobile learning platform developed using Kodular. It features interactive informatics modules, real-time quiz assessments, and progress tracking. The app leverages Google Sheets as a lightweight backend for dynamic content management and student performance data storage.',
    features: [
      'Interactive Learning Modules',
      'Real-time Quiz Assessments',
      'Dynamic Content Management via Google Sheets',
      'Student Progress Tracking',
      'Offline Access to Core Lessons'
    ],
    languageIcons: [SiAndroid, SiGooglesheets],
  },
  {
    thumbnail: '/wp cc.svg',
    title: 'CodeFundamental Portal',
    link: { label: 'Live Demo', url: '#' },
    description: 'WordPress-based platform designed to simplify coding fundamentals for beginners.',
    longDescription: 'An educational portal designed to simplify coding fundamentals for beginners. Built on WordPress, it integrates customized learning paths, interactive code snippets, and automated quizzes. The UI was meticulously crafted in Figma to ensure a seamless and engaging student journey.',
    features: [
      'Customized Learning Paths',
      'Interactive Code Snippet Examples',
      'Automated Quiz & Certification System',
      'Responsive Figma-based Design',
      'Rich Media Educational Content'
    ],
    languageIcons: [SiWordpress, SiFigma],
  },
  {
    thumbnail: '/wp tech edify.svg',
    title: 'High School Informatics LMS',
    link: { label: 'Live Demo', url: '#' },
    description: 'Robust Learning Management System tailored for high school informatics curricula.',
    longDescription: 'A robust Learning Management System (LMS) tailored for high school informatics curricula. It supports rich media lessons, downloadable PDF resources, and discussion forums to foster collaborative learning. Optimized for mobile and desktop viewing to ensure accessibility for all students.',
    features: [
      'Rich Media Lesson Integration',
      'Downloadable PDF Resources',
      'Collaborative Discussion Forums',
      'Optimized Cross-Platform Viewing',
      'Grade Tracking & Assignment Management'
    ],
    languageIcons: [SiWordpress, SiFigma],
  },
  {
    thumbnail: '/globeTrekker.svg',
    title: 'Globe Trekker UI/UX',
    link: { label: 'View Case Study', url: 'https://bit.ly/studycaseUIUX_sarah' },
    description: 'Extensive user research and UI/UX design exploration for a modern travel platform.',
    longDescription: 'A detailed UI/UX exploration for a modern travel platform. This project involved extensive user research, wireframing, and high-fidelity prototyping in Figma. The focus was on optimizing the booking funnel, enhancing visual hierarchy, and creating a vibrant, trustworthy brand identity.',
    features: [
      'In-depth User Research & Personas',
      'Optimized Booking Funnel Design',
      'High-Fidelity Figma Prototyping',
      'Visual Hierarchy & Branding Strategy',
      'Accessibility-focused UI Components'
    ],
    languageIcons: [SiFigma],
  },
  {
    thumbnail: '/pubmedia.svg',
    title: 'Pubmedia Corporate Web',
    link: { label: 'Live Demo', url: 'https://services.pubmedia.co.id' },
    description: 'Corporate landing page for publishing services featuring DOI Traffic management.',
    longDescription: 'A professional corporate website developed for a publishing services provider. The project encompassed full-cycle development from initial UI design in Figma to a custom WordPress implementation. It features service showcases, a DOI traffic management overview, and integrated contact leads.',
    features: [
      'Custom WordPress Theme Development',
      'Service Showcase with DOI Integration',
      'Lead Generation & Contact Management',
      'Responsive Figma-to-WP Workflow',
      'SEO Optimized Corporate Profile'
    ],
    languageIcons: [SiFigma, SiWordpress],
  },
  {
    thumbnail: '/Wedding.svg',
    title: 'Digital Wedding Invitation',
    link: { label: 'Live Demo', url: 'https://wedding-invitation-rho-six.vercel.app/' },
    description: 'Premium digital invitation with RSVP, custom animations, and interactive map.',
    longDescription: 'An elegant, highly interactive digital wedding invitation. Built with Next.js and Tailwind CSS, it features custom animations via Framer Motion, RSVP management, and a dynamic location map. Designed to provide a premium and personal experience for wedding guests across all devices.',
    features: [
      'Dynamic RSVP Management System',
      'Interactive Maps & Location Navigation',
      'Framer Motion Micro-animations',
      'Personalized Guest Invitation Flow',
      'Responsive Premium Visual Design'
    ],
    languageIcons: [SiNextdotjs, SiTailwindcss, SiFigma],
  },
  {
    thumbnail: '/bibu.svg',
    title: 'Bibu AMDK Profile',
    link: { label: 'GitHub', url: 'https://github.com/s-erzv/companyProfileBibuAMDK' },
    description: 'Fast, responsive company profile built with vanilla web technologies.',
    longDescription: 'A modern company profile for a bottled water manufacturer. Developed using vanilla HTML, CSS, and JS to achieve lightning-fast load times. The design emphasizes product purity and brand reliability through a clean, aquatic-themed visual language and responsive layouts.',
    features: [
      'Ultra-Fast Loading Performance',
      'Clean Aquatic-themed UI Design',
      'Mobile-First Responsive Layouts',
      'Product & Service Showcase',
      'Optimized Core Web Vitals'
    ],
    languageIcons: [SiHtml5, SiCss, SiJavascript],
  },
  {
    thumbnail: '/codify.svg',
    title: 'Codify LMS Ecosystem',
    link: { label: 'GitHub', url: 'https://github.com/Codify-LMS/codify-lms' },
    description: 'Full-stack programming LMS with Next.js, Spring Boot, and student ranking system.',
    longDescription: 'A full-stack Learning Management System dedicated to programming. Features a sophisticated backend built with Spring Boot and Supabase for secure data handling. The frontend, powered by Next.js, offers interactive coding exercises, community discussions, and real-time student rankings.',
    features: [
      'Full-stack Next.js & Spring Boot Architecture',
      'Secure Supabase Data Orchestration',
      'Interactive Coding Exercises System',
      'Real-time Gamified Ranking System',
      'Scalable Multi-course Architecture'
    ],
    languageIcons: [SiNextdotjs, SiSpringboot, SiSupabase, SiTailwindcss],
  },
  {
    thumbnail: '/tech edify web ap.svg',
    title: 'Tech Edify Web Platform',
    link: { label: 'GitHub', url: 'https://github.com/s-erzv/TechEdify' },
    description: 'Gamified informatics education app with daily streaks and progress visualization.',
    longDescription: 'A high-performance web application designed for interactive informatics education. Utilizing React and Supabase, it provides a gamified experience with daily streaks, progress visualization, and achievement badges. Styled with Tailwind CSS for a sharp, modern developer-centric aesthetic.',
    features: [
      'Gamified Education with Streaks & Badges',
      'Interactive Progress Visualization',
      'Secure Supabase Authentication',
      'Developer-centric Modern UI Aesthetic',
      'High-performance React Core'
    ],
    languageIcons: [SiReact, SiSupabase, SiTailwindcss],
  },
  {
    thumbnail: '/annajm.svg',
    title: 'RA Annajm Educational Web',
    link: { label: 'GitHub', url: 'https://github.com/s-erzv/annajm' },
    description: 'Professional web presence for educational institutions built with React.',
    longDescription: 'A professional and welcoming web presence for an educational institution. Developed with React, this site offers an intuitive interface for parents to explore school facilities, curricula, and news. The design focuses on clarity, warmth, and easy navigation.',
    features: [
      'User-Friendly Curricula Navigation',
      'Interactive School Facility Gallery',
      'Latest News & Announcement System',
      'Clean, Warm Visual Identity',
      'Fully Responsive Contact Flow'
    ],
    languageIcons: [SiReact, SiTailwindcss],
  },
  {
    thumbnail: '/bluework.svg',
    title: 'Blue Work Recruitment',
    link: { label: 'GitHub', url: 'https://github.com/s-erzv/bluework.id' },
    description: 'Streamlined recruitment platform with admin dashboard and resume export.',
    longDescription: 'A comprehensive recruitment platform streamlining the hiring process. Built with React and Supabase, it enables users to build profiles, apply for jobs, and export professional resumes. Features an admin dashboard for efficient applicant tracking and job posting management.',
    features: [
      'End-to-End Recruitment Management',
      'Dynamic Resume Generation & Export',
      'Advanced Applicant Tracking Dashboard',
      'Scalable Job Posting Engine',
      'Secure Profile & Application Flow'
    ],
    languageIcons: [SiReact, SiSupabase, SiTailwindcss],
  },
  {
    thumbnail: '/planix.svg',
    title: 'Planix AI Regional Planner',
    link: { label: 'Coming Soon', url: '#' },
    description: 'AI-powered regional planning tool integrated with Google Gemini AI.',
    longDescription: 'A cutting-edge regional planning tool integrated with Google Gemini AI. Planix helps urban planners and decision-makers by generating data-driven insights and automated reports. The application is built with React and Firebase, featuring a clean, data-intensive dashboard UI.',
    features: [
      'Integrated Google Gemini AI Insights',
      'Automated Planning Report Generation',
      'Data-Intensive Regional Dashboard',
      'Real-time Firebase Data Integration',
      'Advanced Decision-Support UI'
    ],
    languageIcons: [SiReact, SiFirebase, SiTailwindcss, SiGooglegemini],
  },
];
