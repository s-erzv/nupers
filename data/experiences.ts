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
    description: 'Developed production-grade web applications across e-commerce, fintech, civic-tech, and Web3 domains — handling full-cycle development from system design to deployment.',
    duration: '2025 — Present',
    stats: 'Enterprise & Freelance',
    stack: ['Next.js', 'TypeScript', 'Supabase', 'Solidity', 'Tailwind CSS'],
    details: [
      {
        title: 'Fullstack Developer',
        context: 'PT. Bikin Semua Mudah',
        duration: 'Mar 2026 – Present',
        description: 'Built Luckoo — a campus e-commerce platform with Midtrans payment, real-time chat, hierarchical product filtering, Split Bill, and dual-API shipping (RajaOngkir & Komerce). Developed Ringkas 1.0 & 2.0 (business SaaS for inventory, distribution, financial reporting, and employee management). Also built Web BMT Mandiri Artha Sejahtera (Islamic cooperative financial system).',
        stack: ['Next.js', 'TypeScript', 'Supabase', 'React Query', 'Zustand', 'Tailwind CSS', 'Midtrans'],
      },
      {
        title: 'Freelance Web Developer',
        context: 'Self-Employed',
        duration: 'Jan 2025 – Mar 2026',
        description: 'Developed Web Bimbingan Karya Ilmiah — an academic mentoring platform integrated with Google Calendar, Drive, and Meet. Built BlueWork.ID full-stack recruitment app with admin dashboard and PDF/Excel export. Delivered responsive company profiles for BIBU AMDK (HTML/CSS/JS) and RA An-Najm (React + Tailwind CSS).',
        stack: ['React', 'Next.js', 'Supabase', 'Tailwind CSS', 'Google APIs'],
      },
      {
        title: 'Full Stack Engineer',
        context: 'Mosya Gold',
        description: 'Architected the modern storefront for Mosya Gold — high-performance frontend with smooth animations and backend logic optimized for conversion.',
        stack: ['Next.js', 'Tailwind CSS', 'Framer Motion', 'API Integration'],
      },
    ],
  },
  {
    id: 'web3',
    role: 'Web3 Developer',
    description: 'Architected and deployed smart contracts and decentralized applications on Arbitrum L2 and Base Sepolia — covering DeFi protocols, non-custodial wallets, and blockchain-anchored financial systems.',
    duration: '2025 — Present',
    stats: 'Blockchain & DeFi',
    stack: ['Solidity', 'Arbitrum L2', 'Base Sepolia', 'Next.js', 'Supabase'],
    details: [
      {
        title: 'Protocol Developer',
        context: 'Saku — Web3 Payment Wallet',
        duration: '2026',
        description: 'Phone-number-based crypto payment protocol on Arbitrum Sepolia. Features USDC transfer, QRIS-style QR payment, Amplop (digital envelopes), and USDC staking. SakuRegistry contract uses Keccak256 phone hashing with AES-GCM encrypted private keys.',
        stack: ['Next.js', 'Solidity', 'Arbitrum Sepolia', 'Supabase'],
      },
      {
        title: 'Protocol Developer',
        context: 'Harsa — Decentralized Agri-Finance',
        duration: '2026',
        description: 'Gasless Arbitrum-based DeFi protocol for agricultural trade with on-chain escrow, QR asset traceability, and intermediary-free settlements.',
        stack: ['Next.js', 'Solidity', 'Arbitrum', 'Supabase'],
      },
      {
        title: 'Core Developer',
        context: 'Accounting System — Blockchain-Anchored Finance',
        duration: '2025',
        description: 'AI-integrated accounting system on Base Sepolia that anchors transaction hashes on-chain for financial integrity. Includes Gemini AI audit and automated PDF reporting.',
        stack: ['Next.js', 'Solidity', 'Base Sepolia', 'Supabase', 'Gemini AI'],
      },
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
        description: 'Delivered highly optimized, visually appealing company profile websites for various clients — BIBU AMDK, RA An-Najm, Mosya Gold — ensuring SEO best practices and fast load times.',
        stack: ['HTML', 'CSS', 'JavaScript', 'React', 'Next.js'],
      },
    ],
  },
  {
    id: 'landing-page',
    role: 'Landing Page Builder',
    description: 'Designed and deployed high-converting landing pages using WordPress and Berdu. Focused on user flow, mobile-first responsiveness, and brand aesthetics.',
    duration: 'Jan 2025 — Apr 2025',
    stats: '3 Internships',
    stack: ['WordPress', 'Elementor', 'Berdu', 'UI/UX Design'],
    details: [
      {
        title: 'Landing Page Builder Intern',
        context: 'Kafamilk',
        duration: 'Jan 2025 – Apr 2025',
        description: 'Designed website structures with intuitive user flow. Implemented clean, informative designs using the Berdu platform, ensuring full device responsiveness.',
        stack: ['Berdu', 'UI Design', 'Responsive Web'],
      },
      {
        title: 'Landing Page Builder Intern',
        context: 'Pubmedia Yogyakarta',
        duration: 'Jan 2025 – Mar 2025',
        description: 'Created UI designs focusing on usability. Implemented functional layouts on WordPress using Elementor.',
        stack: ['WordPress', 'Elementor', 'UI/UX'],
      },
      {
        title: 'Landing Page Builder Intern',
        context: 'Serena Hills',
        duration: 'Jan 2025 – Mar 2025',
        description: 'Converted client requirements into responsive WordPress pages, balancing aesthetics and technical device optimization.',
        stack: ['WordPress', 'Elementor', 'Client Communication'],
      },
    ],
  },
  {
    id: 'admin-community',
    role: 'IT Admin & Community',
    description: 'Managed technical infrastructure, digital presence, and actively fostered developer communities through workshops, training sessions, and public speaking.',
    duration: 'Nov 2023 — Present',
    stats: 'Google & GDGoC',
    stack: ['GCP', 'Web Administration', 'Public Speaking'],
    details: [
      {
        title: 'Staff of Web Development',
        context: 'GDGoC UIN Jakarta',
        duration: 'Nov 2025 – Present',
        description: 'Conducted weekly Web Development training on Web 2.0 & 3.0 concepts, prepared learning modules, reviewed coding tasks, and mentored participants. Speaker at GDGoC Weekly Class on Advanced CSS, CSS Frameworks, and Tailwind CSS.',
        stack: ['HTML', 'CSS', 'Tailwind CSS', 'JavaScript', 'Web3'],
      },
      {
        title: 'Google Student Ambassador',
        context: 'Google Indonesia',
        duration: 'Sep 2025 – Jan 2026',
        description: 'Promoted Google educational tools (Gemini, NotebookLM) to students and educators. Acted as liaison between Google Indonesia and the student community to encourage innovation and digital literacy on campus.',
        stack: ['Google Gemini', 'NotebookLM', 'AI Education'],
      },
      {
        title: 'Website Administrator',
        context: 'Yayasan Al-Hadiid',
        duration: 'Nov 2023 – Jan 2025',
        description: 'Maintained and organized the institution\'s website, optimized site performance, and implemented critical updates and timely institutional content.',
        stack: ['Web Admin', 'Performance Optimization', 'Content Management'],
      },
    ],
  },
];
