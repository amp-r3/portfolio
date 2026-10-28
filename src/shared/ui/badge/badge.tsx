import type { FC, ReactNode } from 'react';
import style from './badge.module.scss';

interface IBadgeProps {
  label: string;
  className?: string;
  /** Optional decorative element rendered before the label (e.g. a status dot). */
  leading?: ReactNode;
}

export const Badge: FC<IBadgeProps> = ({ label, className = '', leading }) => {
  const combinedClasses = `${style.badge} ${className}`.trim();

  return (
    <div className={combinedClasses}>
      {leading}
      {label}
    </div>
  );
};
