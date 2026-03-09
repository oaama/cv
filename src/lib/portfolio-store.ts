
"use client"

export interface Venture {
  title: string;
  role: string;
  description: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  tech: string;
  image: string;
  demo: string;
  github: string;
  drive: string;
}

export interface TechItem {
  id: string;
  name: string;
  category: 'Web' | 'Mobile' | 'Backend' | 'Cloud';
}

export interface PortfolioData {
  hero: {
    name: string;
    specialty: string;
    bio: string;
  };
  about: {
    title: string;
    bio: string;
    ventures: Venture[];
  };
  projects: Project[];
  techStack: TechItem[];
  contact: {
    email: string;
    whatsapp: string;
    linkedin: string;
    github: string;
  };
}

const STORAGE_KEY = 'apex_portfolio_complete_data';

const initialData: PortfolioData = {
  hero: {
    name: "Angelo",
    specialty: "Web & Flutter",
    bio: "I build modern websites and powerful mobile applications. Founder of Zone A & Sidra."
  },
  about: {
    title: "Driven by Innovation, Led by Passion.",
    bio: "I am a Software Engineer based in Egypt, specializing in crafting premium web experiences and cross-platform mobile applications using Flutter. My journey is about building ecosystems through Zone A and driving innovation with Sidra.",
    ventures: [
      {
        title: "Zone A",
        role: "Founder & CEO",
        description: "An integrated software house and tech academy empowering businesses and developers."
      },
      {
        title: "Sidra",
        role: "Founder",
        description: "Innovative tech venture focused on driving digital transformation."
      }
    ]
  },
  projects: [
    {
      id: "1",
      name: "Royal Cut",
      description: "A premium barber booking mobile app designed for seamless scheduling.",
      tech: "Flutter, Firebase, Dart",
      image: "https://picsum.photos/seed/88/800/600",
      demo: "https://example.com",
      github: "https://github.com",
      drive: ""
    }
  ],
  techStack: [
    { id: '1', name: 'React', category: 'Web' },
    { id: '2', name: 'Flutter', category: 'Mobile' },
    { id: '3', name: 'Node.js', category: 'Backend' },
    { id: '4', name: 'Firebase', category: 'Cloud' }
  ],
  contact: {
    email: "angelo@technomedia.com",
    whatsapp: "01127570256",
    linkedin: "https://www.linkedin.com/in/angluos-rezq-4405b221a",
    github: "@oaama"
  }
};

export const getPortfolioData = (): PortfolioData => {
  if (typeof window === 'undefined') return initialData;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
    return initialData;
  }
  return JSON.parse(stored);
};

export const savePortfolioData = (data: PortfolioData) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  // Dispatch custom event to notify components
  window.dispatchEvent(new Event('portfolio-update'));
};
