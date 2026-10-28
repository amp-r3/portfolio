import type { ServiceItemConfig } from './types';

export const SERVICES_LIST: ServiceItemConfig[] = [
  {
    id: 'fullstack',
    number: '01',
    tags: ['Next.js 16', 'React 19', 'TypeScript', 'App Router', 'SCSS Modules'],
  },
  {
    id: 'architecture',
    number: '02',
    tags: ['Feature-Sliced Design', 'eslint-plugin-boundaries', 'TypeScript'],
  },
  {
    id: 'backend',
    number: '03',
    tags: ['Supabase', 'PostgreSQL', 'RTK Query', 'Zod', 'REST API'],
  },
  {
    id: 'performance',
    number: '04',
    tags: ['Vitest', 'Motion', 'Lenis'],
  },
];
