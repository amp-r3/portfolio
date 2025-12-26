import { Link, useNavigate } from 'react-router' // Импортируем хук
import styles from './errorBoundary.module.scss'
import { Trans, useTranslation } from 'react-i18next';

const ErrorBoundary = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <main className={styles['error-boundary']}>

      <h1 className={styles['error-boundary__code']} data-text="404">
        404
      </h1>

      <div className={styles['error-boundary__content']}>
        <p className={styles['error-boundary__description']}>
          <Trans
            i18nKey="error.description"
            components={[
              <span key="highlight" className={styles['error-boundary__highlight']} />
            ]}
          >
            It looks like you've ventured into {"<0>undefined</0>"} territory. This route hasn't been committed yet.
        </Trans>
      </p>

      <div className={styles['error-boundary__actions']}>
        <button
          onClick={() => navigate(-1)}
          className={`${styles['error-boundary__link']} ${styles['error-boundary__link--secondary']}`}
        >
          {t('error.goBack')}
        </button>

        <Link to="/" className={styles['error-boundary__link']}>
          {t('error.home')}
        </Link>
      </div>
    </div>
    </main >
  )
}

export default ErrorBoundary