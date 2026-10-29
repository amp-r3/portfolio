import type { FC, ReactNode } from 'react';
import Image from 'next/image';
import styles from './benefit-card.module.scss';

interface IBenefitCardProps {
  title: string;
  description: string;
  iconSrc?: string;
  icon?: ReactNode;
  className?: string;
}

export const BenefitCard: FC<IBenefitCardProps> = ({ title, description, iconSrc, icon, className = '' }) => {
  return (
    <article className={`${styles.card} ${className}`}>
      <div className={styles.card__header}>
        <div className={styles.card__iconWrapper}>
          {icon ?? (iconSrc ? (
            <Image src={iconSrc} alt="" width={24} height={24} unoptimized aria-hidden="true" className={styles.card__icon} />
          ) : null)}
        </div>
      </div>

      <div className={styles.card__content}>
        <h3 className={styles.card__title}>{title}</h3>
        <p className={styles.card__description}>{description}</p>
      </div>

      <div className={styles.card__glow} aria-hidden="true" />
    </article>
  );
};
