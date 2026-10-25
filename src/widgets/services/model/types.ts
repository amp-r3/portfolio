export type ServiceId = 'fullstack' | 'architecture' | 'backend' | 'performance';

export interface ServiceItemConfig {
  id: ServiceId;
  number: string;
  tags: string[];
}
