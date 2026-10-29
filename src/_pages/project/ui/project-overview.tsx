import { ExternalLink } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { ProjectIcon, type Project } from '@/entities/project';
import { ProjectSection } from './project-section';
import style from './project-overview.module.scss';

interface IProjectOverviewProps {
  project: Project;
  className?: string;
}

export function ProjectOverview({ project, className }: IProjectOverviewProps) {
  const t = useTranslations('projects');
  const { features, tryIt, links } = project;

  const hasFeatures = features.length > 0;
  const hasTryIt = Boolean(tryIt?.length);

  if (!hasFeatures && !hasTryIt) {
    return null;
  }

  return (
    <div className={[style.overview, className].filter(Boolean).join(' ')}>
      {hasFeatures && (
        <ProjectSection title={t('labels.section.features')}>
          <ul className={style.features}>
            {features.map((feature) => (
              <li key={feature.text} className={style.feature}>
                <span className={style.featureIcon} aria-hidden="true">
                  <ProjectIcon name={feature.icon} size={22} />
                </span>
                <span className={style.featureText}>{feature.text}</span>
              </li>
            ))}
          </ul>
        </ProjectSection>
      )}

      {hasTryIt && tryIt && (
        <section className={style.trySection}>
          <h2 className={style.tryTitle}>{t('labels.section.tryIt')}</h2>

          <ol className={style.tryList}>
            {tryIt.map((step, index) => {
              const stepNumber = String(index + 1).padStart(2, '0');

              return (
                <li key={step.title ?? step.text} className={style.tryCard}>
                  <div className={style.tryNumberCol}>
                    <span className={style.tryNumber} aria-hidden="true">
                      {stepNumber}
                    </span>
                    <span className={style.tryTimelineLine} aria-hidden="true" />
                  </div>
                  <div className={style.tryBody}>
                    {step.title && <h3 className={style.tryStepTitle}>{step.title}</h3>}
                    <p className={style.tryStepText}>{step.text}</p>
                  </div>
                </li>
              );
            })}
          </ol>

          {links.demo && (
            <a
              href={links.demo}
              target="_blank"
              rel="noopener noreferrer"
              className={style.demoLink}
            >
              <span>{t('actions.demo')}</span>
              <ExternalLink size={14} aria-hidden="true" />
            </a>
          )}
        </section>
      )}
    </div>
  );
}
