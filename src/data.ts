export type Category = 'E-commerce' | 'Business' | 'Web3' | 'Civic tech' | 'Education' | 'AI' | 'Website'

export type Project = {
  slug: string
  name: string
  year: string
  category: Category
  /** Where the work happened, only when known */
  context?: string
  tagline: string
  description: string
  highlights?: string[]
  stats?: { value: string; label: string }[]
  stack: string[]
  image?: string
  /** Add live demo / repo links here, e.g. { label: 'Visit site', href: 'https://…' } */
  links?: { label: string; href: string }[]
  tone: 'lavender' | 'lime' | 'amber'
}

export const profile = {
  name: 'Sarah Fajriah Rahmah',
  handle: 'nuza',
  role: 'Fullstack web developer',
  email: 'sarahfajriarahmah@gmail.com',
  resume: '/Resume_Sarah_Fajriah_Rahmah.pdf',
  socials: [
    { label: 'GitHub', handle: 's-erzv', href: 'https://github.com/s-erzv' },
    { label: 'LinkedIn', handle: 'in/serzv', href: 'https://www.linkedin.com/in/serzv' },
    { label: 'X', handle: '@nuzaahz', href: 'https://x.com/nuzaahz' },
    { label: 'Instagram', handle: '@nuza.sol', href: 'https://instagram.com/nuza.sol' },
  ],
}

const BSM = 'Built at PT. Bikin Semua Mudah'

export const featured: Project[] = [
  {
    slug: 'luckoo',
    name: 'Luckoo',
    year: '2026',
    category: 'E-commerce',
    context: BSM,
    tagline: 'A campus marketplace that thousands of students actually shop on.',
    description:
      'Multi-vendor e-commerce for campus merch and faculty bundles. I architected it end to end, from the Supabase schema and payment flow to the storefront, seller dashboard and admin finance pages.',
    highlights: [
      'Midtrans checkout with split bill for group orders',
      'Real-time buyer–seller chat that renders product bubbles',
      'Shipping quotes from both RajaOngkir and Komerce',
      'Multi-tier product filtering across vendors',
    ],
    stats: [{ value: '4,300+', label: 'registered users' }],
    stack: ['Next.js', 'TypeScript', 'Supabase', 'React Query', 'Zustand', 'Tailwind'],
    image: '/work/luckoo.webp',
    tone: 'lime',
  },
  {
    slug: 'ringkas-2',
    name: 'Ringkas 2.0',
    year: '2026',
    category: 'Business',
    context: BSM,
    tagline: 'One operations hub instead of a dozen spreadsheets.',
    description:
      'A central operations hub for growing companies. Marketplace payouts, audits, attendance and payroll live in one place and share the same data.',
    highlights: [
      'Automatic reconciliation of marketplace payouts',
      'Financial audits and performance dashboards',
      'Employee attendance and payroll in the same system',
    ],
    stats: [
      { value: '15+', label: 'integrated modules' },
      { value: '2', label: 'companies running on it' },
    ],
    stack: ['Next.js', 'Tailwind', 'Supabase'],
    image: '/work/ringkas2.webp',
    tone: 'lavender',
  },
  {
    slug: 'ringkas-1',
    name: 'Ringkas 1.0',
    year: '2026',
    category: 'Business',
    context: BSM,
    tagline: 'Inventory, distribution and money, in one offline-first app.',
    description:
      'Business management SaaS for brick-and-mortar teams. It replaced notebooks and chat groups for stock, returns, deliveries and bookkeeping.',
    highlights: [
      'Real-time inventory with return tracking',
      'Distribution map of every customer and delivery',
      'Financial reports and retail analytics',
    ],
    stats: [
      { value: '7', label: 'companies onboard' },
      { value: '135+', label: 'orders a month at one client' },
      { value: 'Rp114M+', label: 'revenue managed there' },
    ],
    stack: ['React', 'Tailwind', 'Supabase'],
    image: '/work/ringkas1.webp',
    tone: 'amber',
  },
  {
    slug: 'saku',
    name: 'Saku',
    year: '2026',
    category: 'Web3',
    tagline: 'Send crypto to a phone number, not a wallet address.',
    description:
      'A non-custodial payment wallet on Arbitrum that hides crypto UX behind something everyone already knows: a phone number.',
    highlights: [
      'USDC transfers straight to a phone number',
      'QRIS-style QR payments and Amplop digital envelopes',
      'USDC staking from the same wallet',
      'Keccak256-hashed numbers on-chain, AES-GCM encrypted keys',
    ],
    stack: ['Next.js', 'Solidity', 'Arbitrum', 'Supabase'],
    image: '/work/saku.webp',
    tone: 'amber',
  },
  {
    slug: 'accounting',
    name: 'Accounting System',
    year: '2025',
    category: 'Web3',
    tagline: 'Books you can verify, because every entry leaves a hash on-chain.',
    description:
      'An accounting platform where the ledger can prove it was never edited. Each transaction is hashed and anchored on Base, and AI reviews the books.',
    highlights: [
      'Transaction hashes anchored on Base Sepolia',
      'Gemini audits the ledger and flags anomalies',
      'Automated PDF financial reports',
    ],
    stack: ['Next.js', 'Solidity', 'Base Sepolia', 'Supabase', 'Gemini'],
    image: '/work/accounting.webp',
    tone: 'lavender',
  },
  {
    slug: 'demokratos',
    name: 'Demokratos',
    year: '2025',
    category: 'Civic tech',
    tagline: 'A calmer place for citizens and government to talk.',
    description:
      'A public participation platform where people report problems, vote on policy and discuss it, with AI keeping the conversation constructive.',
    highlights: [
      'Public complaint reports with photos and location',
      'Policy voting and open discussion threads',
      'Gemini-powered moderation',
    ],
    stack: ['React', 'Firebase', 'Gemini', 'Tailwind'],
    image: '/work/demokratos.webp',
    tone: 'lime',
  },
]

export const more: Project[] = [
  {
    slug: 'harsa',
    name: 'Harsa',
    year: '',
    category: 'Web3',
    tagline: 'Gasless agri-finance on Arbitrum.',
    description:
      'Decentralized infrastructure for agricultural trade: on-chain escrow, QR traceability and settlements without intermediary fees.',
    highlights: ['Gasless on-chain escrow', 'QR traceability from farm to buyer', 'Intermediary-free settlements'],
    stack: ['Next.js', 'Solidity', 'Arbitrum', 'Supabase'],
    image: '/work/harsa.webp',
    tone: 'lime',
  },
  {
    slug: 'techedify',
    name: 'Tech Edify',
    year: '2025',
    category: 'Education',
    tagline: 'An LMS for learning informatics.',
    description: 'A learning management system for informatics students, with an admin panel to manage it all.',
    highlights: ['Learning materials and interactive quizzes', 'Daily progress tracking and streaks', 'Admin management'],
    stack: ['React', 'Supabase', 'Tailwind'],
    image: '/work/techedify.webp',
    tone: 'lavender',
  },
  {
    slug: 'bluework',
    name: 'BlueWork',
    year: '',
    category: 'Business',
    context: 'Freelance project',
    tagline: 'Hiring, from job post to shortlist.',
    description: 'A full-stack recruitment platform that takes a hiring team from job post to shortlist.',
    highlights: ['Job listings and applications', 'Applicant tracking with an admin dashboard', 'One-click PDF and Excel export'],
    stack: ['React', 'Supabase', 'Tailwind'],
    image: '/work/bluework.webp',
    tone: 'lavender',
  },
  {
    slug: 'planix',
    name: 'Planix',
    year: '',
    category: 'AI',
    tagline: 'AI help for regional planning.',
    description:
      'Analyzes land suitability with AI and real-time environmental data so planners can make data-driven spatial decisions.',
    highlights: ['Smart terrain analysis', 'AI-driven zoning layouts', 'Planning chatbot on an interactive map'],
    stack: ['React', 'Firebase', 'Gemini', 'Tailwind'],
    image: '/work/planix.webp',
    tone: 'lime',
  },
  {
    slug: 'anatomy',
    name: 'Anatomy Edu',
    year: '',
    category: 'Education',
    tagline: 'Learn the human body in 3D.',
    description: 'Interactive anatomy lessons with 3D models, visual simulations and quizzes.',
    stack: ['Next.js', 'Tailwind'],
    image: '/work/anatomy.webp',
    tone: 'amber',
  },
  {
    slug: 'finedu',
    name: 'Finedu',
    year: '',
    category: 'Education',
    tagline: 'Personal finance, one lesson at a time.',
    description: 'Budgeting and saving made approachable with simple interactive tools and resources.',
    stack: ['React', 'Tailwind', 'Figma'],
    image: '/work/finedu.webp',
    tone: 'lavender',
  },
  {
    slug: 'wedding',
    name: 'Wedding Invitation',
    year: '',
    category: 'Website',
    tagline: 'An invitation guests can RSVP to.',
    description: 'Digital invitation with RSVP, event details and a photo gallery, built mobile-first.',
    stack: ['Next.js', 'Tailwind'],
    image: '/work/wedding.webp',
    tone: 'amber',
  },
  {
    slug: 'annajm',
    name: 'RA An-Najm',
    year: '',
    category: 'Website',
    context: 'Freelance client',
    tagline: 'Company profile for a kindergarten.',
    description: 'Lightweight, responsive profile site for RA An-Najm in Bekasi Utara, including an admissions page.',
    stack: ['React', 'Tailwind'],
    image: '/work/annajm.webp',
    tone: 'lime',
  },
  {
    slug: 'bibu',
    name: 'BIBU AMDK',
    year: '',
    category: 'Website',
    context: 'Freelance client',
    tagline: 'Company profile for a water brand.',
    description: 'Product and service showcase for a bottled water company, written in plain HTML, CSS and JavaScript.',
    stack: ['HTML', 'CSS', 'JavaScript'],
    image: '/work/bibu.webp',
    tone: 'lavender',
  },
]

export const allProjects = [...featured, ...more]

export const alsoBuilt = [
  { name: 'Nusa', note: 'a WhatsApp bot that logs your spending from a chat message' },
  { name: 'CropSage', note: 'crop recommendations with explainable Random Forest' },
  { name: 'Sims', note: 'an information system with a Solidity module' },
  { name: 'Web BMT Mandiri Artha Sejahtera', note: 'digitizing an Islamic cooperative, as project manager' },
  { name: 'Web Bimbingan Karya Ilmiah', note: 'mentoring platform wired to Google Calendar, Drive and Meet' },
]

export type Publication = {
  title: string
  /** Journal or conference name */
  venue: string
  year: string
  authors: string
  kind: 'Journal' | 'Conference' | 'Preprint' | 'Book chapter'
  /** One or two sentences in plain language */
  summary?: string
  /** e.g. 'SINTA 3', 'Scopus Q2' */
  badge?: string
  keywords?: string[]
  doi?: string
  href?: string
  cite?: { apa: string; bibtex: string }
}

// Newest first. The Research section stays hidden while this list is empty.
export const publications: Publication[] = [
  {
    title: 'Strategi Platform Governance dan Sertifikasi dalam Membangun User Trust Aset Digital',
    venue: 'Jurnal Ilmiah Bisnis Digital, Vol. 2 No. 2',
    year: '2026',
    authors: 'Sarah Fajriah Rahmah, Evy Nurmiati',
    kind: 'Journal',
    summary:
      'Compares how Indonesia (moving from Bappebti to OJK), the EU’s MiCA and US regulation govern digital asset platforms. The takeaway: user trust comes from aligning regulation, IT certification and professional ethics standards, not from technology like MPC alone. Proof of Reserves and custodial insurance are the practical levers.',
    keywords: ['Digital assets', 'Fintech', 'Digital trust', 'Regulation', 'IT certification'],
    doi: '10.69533/nc9hfd44',
    href: 'https://ejournal.rizaniamedia.com/index.php/bisnistek/article/view/498',
    cite: {
      apa: 'Rahmah, S. F., & Nurmiati, E. (2026). Strategi platform governance dan sertifikasi dalam membangun user trust aset digital. Jurnal Ilmiah Bisnis Digital, 2(2). https://doi.org/10.69533/nc9hfd44',
      bibtex: `@article{rahmah2026strategi,
  title   = {Strategi Platform Governance dan Sertifikasi dalam Membangun User Trust Aset Digital},
  author  = {Rahmah, Sarah Fajriah and Nurmiati, Evy},
  journal = {Jurnal Ilmiah Bisnis Digital},
  volume  = {2},
  number  = {2},
  year    = {2026},
  doi     = {10.69533/nc9hfd44}
}`,
    },
  },
]

export type Skill = { name: string; group: 'front' | 'back' | 'chain' | 'tools' }

export const skills: Skill[] = [
  ...['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Three.js', 'JavaScript', 'React Query', 'Zustand', 'HTML', 'CSS'].map(
    (name) => ({ name, group: 'front' as const }),
  ),
  ...['Supabase', 'PostgreSQL', 'Node.js', 'Firebase', 'Laravel', 'Python', 'FastAPI', 'Spring Boot', 'MySQL', 'Redis'].map(
    (name) => ({ name, group: 'back' as const }),
  ),
  ...['Solidity', 'Arbitrum', 'Base', 'Solana', 'SUI', 'Stellar', 'Rust'].map((name) => ({ name, group: 'chain' as const })),
  ...['Figma', 'Git', 'Playwright', 'Midtrans', 'GCP', 'Gemini'].map((name) => ({ name, group: 'tools' as const })),
]

export const skillGroups: Record<Skill['group'], string> = {
  front: 'Frontend',
  back: 'Backend & data',
  chain: 'Web3',
  tools: 'Tools & integrations',
}

export type Role = {
  title: string
  org: string
  period: string
  points: string[]
  current?: boolean
  mode?: string
  skills?: string[]
}

export const experience: Role[] = [
  {
    title: 'Fullstack Developer',
    org: 'PT. Bikin Semua Mudah',
    current: true,
    mode: 'On-site',
    skills: ['Next.js', 'TypeScript', 'Supabase', 'Midtrans', 'Playwright', 'Agile'],
    period: 'Mar 2026 – now',
    points: [
      'Architected and shipped Luckoo, Ringkas 1.0 and Ringkas 2.0, from system design to production.',
      'Led Web BMT Mandiri Artha Sejahtera as project manager, from requirements to deployment.',
      'Unit, black-box and Playwright end-to-end testing in an Agile team.',
    ],
  },
  {
    title: 'Staff of Web Development',
    org: 'GDGoC UIN Jakarta',
    mode: 'Community',
    skills: ['Teaching', 'Tailwind CSS', 'Web3', 'Public speaking'],
    period: 'Nov 2025 – Sep 2026',
    points: [
      'Ran weekly Web 2.0 and Web3 classes, wrote the modules and reviewed coding tasks.',
      'Spoke at Weekly Class Web Dev 2.0 on advanced CSS and Tailwind.',
    ],
  },
  {
    title: 'Google Student Ambassador',
    org: 'Google Indonesia',
    mode: 'Campus',
    skills: ['Gemini', 'NotebookLM', 'Community'],
    period: 'Sep 2025 – Jan 2026',
    points: ['Introduced Gemini and NotebookLM to students and lecturers on campus.'],
  },
  {
    title: 'Freelance Web Developer',
    org: 'Self-employed',
    mode: 'Remote',
    skills: ['React', 'Supabase', 'Google APIs', 'Tailwind CSS'],
    period: 'Jan 2025 – Mar 2026',
    points: ['Built BlueWork, Web Bimbingan Karya Ilmiah, and company profiles for BIBU AMDK and RA An-Najm.'],
  },
  {
    title: 'Landing Page Builder Intern',
    org: 'Kafamilk, Pubmedia, Serena Hills',
    mode: 'Remote',
    skills: ['WordPress', 'Elementor', 'Berdu'],
    period: 'Jan – Apr 2025',
    points: ['Designed and built landing pages for three clients with Berdu and WordPress.'],
  },
  {
    title: 'Website Administrator',
    org: 'Yayasan Al-Hadiid Cileungsi',
    mode: 'On-site',
    skills: ['CMS', 'Web performance'],
    period: 'Nov 2023 – Jan 2025',
    points: ['Kept the school website current and fast. Where it all started.'],
  },
]
