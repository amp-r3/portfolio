import type { ProjectId } from './project-id';

export interface ProjectBenefit {
  title: string;
  description: string;
  icon: string;
}

export interface ProjectLinks {
  demo: string;
  github: string;
}

export interface ProjectImages {
  light: string;
  dark?: string;
  mobileLight?: string;
  mobileDark?: string;
}

export interface Project {
  id: ProjectId;
  title: string;
  description: string;
  tools: string[];
  links: ProjectLinks;
  images: ProjectImages;
  benefits: ProjectBenefit[];
  demoLink: string;
  githubLink: string;
  image: string;
  darkImage?: string;
  mobileImage?: string;
  mobileDarkImage?: string;
}

export type { ProjectId };
