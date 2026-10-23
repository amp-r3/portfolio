'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/shared/i18n';
import styles from './error-page.module.scss';

export interface ErrorPageProps {
  error?: Error & { digest?: string };
  reset?: () => void;
}

export function ErrorPage({ error, reset }: ErrorPageProps) {
  const t = useTranslations('error');

  useEffect(() => {
    if (error) {
      console.error('Unhandled runtime error in route:', error);
    }
  }, [error]);

  return (
    <main className={styles['error-boundary']}>
      <h1 className={styles['error-boundary__code']} data-text="500">
        500
      </h1>

      <div className={styles['error-boundary__content']}>
        <h2 className={styles['error-boundary__title']}>{t('runtimeErrorTitle')}</h2>
        <p className={styles['error-boundary__description']}>{t('runtimeErrorDescription')}</p>

        <div className={styles['error-boundary__actions']}>
          {reset && (
            <button
              onClick={() => reset()}
              className={`${styles['error-boundary__link']} ${styles['error-boundary__link--secondary']}`}
            >
              {t('tryAgain')}
            </button>
          )}

          <Link href="/" className={styles['error-boundary__link']}>
            {t('home')}
          </Link>
        </div>
      </div>
    </main>
  );
}
