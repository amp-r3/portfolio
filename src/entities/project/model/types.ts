import type { ProjectId } from './project-id';

export type ProjectType = 'personal' | 'client' | 'learning';
export type ProjectStatus = 'live' | 'wip';
export type ProjectRole = 'solo' | 'team';
export type ProjectStackGroupId = 'core' | 'data' | 'forms' | 'tooling';

export interface ProjectPeriod {
  start: number;
  end?: number;
}

export interface ProjectLinks {
  demo?: string;
  github?: string;
}

/**
 * Resolved image sources ready for rendering. `dark` is omitted when a project
 * uses one screenshot for both themes (a string in the content JSON).
 */
export interface ProjectImages {
  light: string;
  dark?: string;
  mobileLight?: string;
  mobileDark?: string;
}

export interface ProjectStackGroup {
  id: ProjectStackGroupId;
  items: string[];
}

export interface ProjectStack {
  primary: string[];
  groups: ProjectStackGroup[];
}

export interface ProjectFeature {
  icon: string;
  text: string;
}

export interface ProjectDeepDive {
  icon: string;
  title: string;
  summary: string;
  details: string;
}

/** @deprecated Use ProjectDeepDive. Kept as an alias for the public entity API. */
export type ProjectBenefit = ProjectDeepDive;

export interface ProjectTryItStep {
  title?: string;
  text: string;
}

export interface Project {
  id: ProjectId;
  order: number;
  type?: ProjectType;
  status?: ProjectStatus;
  period?: ProjectPeriod;
  role?: ProjectRole;
  title: string;
  tagline: string;
  seoDescription: string;
  links: ProjectLinks;
  images: ProjectImages;
  stack: ProjectStack;
  features: ProjectFeature[];
  deepDive: ProjectDeepDive[];
  tryIt?: ProjectTryItStep[];
  limitations?: string[];
}

export type { ProjectId };
