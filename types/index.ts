import type { IconType } from 'react-icons'; 

export interface Project {
  thumbnail: string;
  title: string;
  link: {
    label: string;
    url: string;
  };
  description: string;
  longDescription?: string;
  features?: string[];
  languageIcons: IconType[];
}

export interface Skill {
  name: string;
  icon: IconType;
  iconColor: string;
  description: string;
  category: 'Frontend' | 'Backend' | 'Tools' | 'Web3';
}

// export interface Experience {
//   role: string;
//   description: string;
//   duration: string;
//   stats: string;
//   stack: string[];
// }