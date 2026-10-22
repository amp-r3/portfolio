import type { FC } from 'react';
import style from './badge.module.scss';

interface IBadgeProps {
  label: string;
  className?: string;
}

export const Badge: FC<IBadgeProps> = ({ label, className = '' }) => {
  const combinedClasses = `${style.badge} ${className}`.trim();

  return <div className={combinedClasses}>{label}</div>;
};
