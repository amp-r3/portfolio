import type { ServiceItemConfig } from './types';

export const SERVICES_LIST: ServiceItemConfig[] = [
  {
    id: 'fullstack',
    number: '01',
    tags: ['Next.js 16', 'React 19', 'TypeScript', 'SSR / SSG', 'Full-stack'],
  },
  {
    id: 'architecture',
    number: '02',
    tags: ['Feature-Sliced Design', 'Modular Architecture', 'Strict Boundaries', 'Clean Code'],
  },
  {
    id: 'backend',
    number: '03',
    tags: ['Supabase', 'PostgreSQL', 'RTK Query', 'Zod', 'REST API'],
  },
  {
    id: 'performance',
    number: '04',
    tags: ['Playwright', 'Web Vitals', 'Motion', 'a11y', 'Locomotive Scroll'],
  },
];
