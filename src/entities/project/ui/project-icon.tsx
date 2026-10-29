import type { ComponentType, FC } from 'react';
import Image from 'next/image';
import {
  ExternalLink,
  FlaskConical,
  MapPin,
  Package,
  Palette,
  Puzzle,
  Search,
  Server,
  Shield,
  ShoppingCart,
  Smartphone,
  User,
  Zap,
  type LucideProps,
} from 'lucide-react';
import type { ProjectIconKey } from '../model/icon-keys';

const PROJECT_ICON_MAP: Record<ProjectIconKey, ComponentType<LucideProps>> = {
  geo: MapPin,
  adaptive: Smartphone,
  performance: Zap,
  server: Server,
  link: ExternalLink,
  puzzle: Puzzle,
  search: Search,
  cart: ShoppingCart,
  user: User,
  package: Package,
  shield: Shield,
  test: FlaskConical,
  palette: Palette,
  mobile: Smartphone,
};

export interface IProjectIconProps extends LucideProps {
  name: ProjectIconKey | string;
}

export const ProjectIcon: FC<IProjectIconProps> = ({ name, size = 22, ...rest }) => {
  const IconComponent = PROJECT_ICON_MAP[name as ProjectIconKey];

  if (IconComponent) {
    return <IconComponent size={size} aria-hidden="true" {...rest} />;
  }

  const numericSize = typeof size === 'number' ? size : Number(size) || 22;

  return <Image src={name} alt="" width={numericSize} height={numericSize} unoptimized aria-hidden="true" />;
};
