export type SubExperience = {
  title: string;
  context: string; // Company or Project context
  duration?: string;
  description: string;
  stack: string[];
};

export type ExperienceGroup = {
  id: string;
  role: string;
  description: string;
  duration: string;
  stats: string;
  stack: string[];
  details: SubExperience[];
};

export const experiences: ExperienceGroup[] = [
  {
    id: 'fullstack',
    role: 'Full Stack Developer',
    description: 'Developed full-featured web applications, handling complex business logic, real-time data synchronization, and secure administrative workflows.',
    duration: '2023 — Present',
    stats: 'Enterprise & Freelance',
    stack: ['React', 'Next.js', 'Supabase', 'TypeScript', 'Tailwind CSS'],
    details: [
      {
        title: 'Freelance Web Developer',
        context: 'PT. IRS Gemilang Food',
        duration: 'Aug 2025 - Nov 2025',
        description: 'Developed comprehensive web applications for managing inventory and financial operations, including Ringkas 1.0 and Ringkas 2.0. Implemented end-to-end business processes, product tracking, and financial reporting with real-time data sync.',
        stack: ['React', 'Next.js', 'Supabase', 'Tailwind CSS'],
      },
      {
        title: 'Full Stack Engineer',
        context: 'Mosya Gold',
        description: 'Architected and developed the modern storefront for Mosya Gold. Handled both high-performance front-end interfaces with smooth animations and back-end logic to ensure a seamless user experience and high conversion rates.',
        stack: ['Next.js', 'Tailwind CSS', 'Framer Motion', 'API Integration'],
      },
      {
        title: 'Freelance Web Developer',
        context: 'Bluework',
        duration: 'Jul 2025',
        description: 'Built a full-stack application enabling user submissions and secure admin dashboards for data review. Implemented authentication and CRUD functionalities for smooth workflows.',
        stack: ['React', 'Supabase', 'Tailwind CSS'],
      },
      {
        title: 'Core Developer',
        context: 'Various Projects',
        description: 'Architected and developed complex systems including Tech Edify and an AI Voice Detector system, focusing on performance, data integrity, and AI integrations.',
        stack: ['Next.js', 'TypeScript', 'PostgreSQL', 'Python'],
      }
    ],
  },
  {
    id: 'frontend',
    role: 'Front End Developer',
    description: 'Crafted intuitive, high-performance interfaces and user experiences with a focus on modern frameworks, responsive design, and pixel-perfect implementation.',
    duration: '2024 — Present',
    stats: 'Agency & Client Work',
    stack: ['React', 'Next.js', 'Framer Motion', 'Tailwind CSS'],
    details: [
      {
        title: 'UI Implementation',
        context: 'Anatomy Edu',
        description: 'Built an interactive and accessible educational interface for anatomy studies, ensuring clear data visualization and user engagement.',
        stack: ['React', 'TypeScript', 'CSS Modules'],
      },
      {
        title: 'Web Developer',
        context: 'Multiple Company Profiles',
        description: 'Delivered highly optimized, visually appealing company profile websites for various clients, ensuring SEO best practices and fast load times.',
        stack: ['HTML', 'CSS', 'JavaScript', 'React'],
      }
    ],
  },
  {
    id: 'landing-page',
    role: 'Landing Page Builder',
    description: 'Designed and deployed high-converting landing pages using WordPress. Focused on user flow, mobile-first responsiveness, and brand aesthetics.',
    duration: 'Jan 2025 — Apr 2025',
    stats: '3 Internships',
    stack: ['WordPress', 'Elementor', 'Berdu', 'UI/UX Design'],
    details: [
      {
        title: 'Landing Page Builder Intern',
        context: 'Kafamilk',
        duration: 'Jan 2025 - Apr 2025',
        description: 'Designed website structures with intuitive user flow. Implemented clean, informative designs using the Berdu platform, ensuring full device responsiveness.',
        stack: ['Berdu', 'UI Design', 'Responsive Web'],
      },
      {
        title: 'Landing Page Builder Intern',
        context: 'Pubmedia Yogyakarta',
        duration: 'Jan 2025 - Mar 2025',
        description: 'Created UI designs focusing on usability. Implemented functional layouts on WordPress using Elementor.',
        stack: ['WordPress', 'Elementor', 'UI/UX'],
      },
      {
        title: 'Landing Page Builder Intern',
        context: 'Serena Hills',
        duration: 'Jan 2025 - Mar 2025',
        description: 'Converted client requirements into responsive WordPress pages, balancing aesthetics and technical device optimization.',
        stack: ['WordPress', 'Elementor', 'Client Communication'],
      }
    ],
  },
  {
    id: 'admin-community',
    role: 'IT Admin & Community',
    description: 'Managed technical infrastructure, digital presence, and actively fostered developer communities through workshops and events.',
    duration: 'Nov 2023 — Jan 2026',
    stats: 'Google & Education',
    stack: ['GCP', 'Web Administration', 'Public Speaking'],
    details: [
      {
        title: 'Google Student Ambassador',
        context: 'Google Indonesia',
        duration: 'Sep 2025 - Jan 2026',
        description: 'Promoted Google\'s educational and productivity tools to students and educators. Focused on exploring AI technologies, organizing workshops, and building communities around tools like Google Gemini and NotebookLM[cite: 9, 10].',
        stack: ['Google Gemini', 'NotebookLM', 'AI Education'],
      },
      {
        title: 'Website Administrator',
        context: 'Yayasan Al-Hadiid',
        duration: 'Nov 2023 - Jan 2025',
        description: 'Maintained and organized the institution\'s website, optimized site performance, and implemented critical updates.',
        stack: ['Web Admin', 'Performance Optimization', 'Content Management'],
      }
    ],
  }
];