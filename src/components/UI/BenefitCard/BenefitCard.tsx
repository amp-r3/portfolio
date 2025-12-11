import type { FC } from 'react';
import styles from './benefitCard.module.scss';

interface IBenefitCardProps {
    title: string;
    description: string;
    iconSrc: string;
    className?: string;
}

const BenefitCard: FC<IBenefitCardProps> = ({ title, description, iconSrc, className = '' }) => {
    return (
        <article className={`${styles.card} ${className}`}>
            <div className={styles.card__header}>
                <div className={styles.card__iconWrapper}>
                    <img 
                        src={iconSrc} 
                        alt="" 
                        aria-hidden="true" 
                        className={styles.card__icon} 
                    />
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

export default BenefitCard;