'use client';

import { useTranslations } from 'next-intl';
import { Link, useRouter } from '@/shared/i18n';
import styles from './not-found-page.module.scss';

export function NotFoundPage() {
  const router = useRouter();
  const t = useTranslations('error');

  return (
    <main className={styles['error-boundary']}>
      <h1 className={styles['error-boundary__code']} data-text="404">
        404
      </h1>

      <div className={styles['error-boundary__content']}>
        <p className={styles['error-boundary__description']}>
          {t.rich('description', {
            code: (chunks) => <span className={styles['error-boundary__highlight']}>{chunks}</span>,
          })}
        </p>

        <div className={styles['error-boundary__actions']}>
          <button
            onClick={() => router.back()}
            className={`${styles['error-boundary__link']} ${styles['error-boundary__link--secondary']}`}
          >
            {t('goBack')}
          </button>

          <Link href="/" className={styles['error-boundary__link']}>
            {t('home')}
          </Link>
        </div>
      </div>
    </main>
  );
}
