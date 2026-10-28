import Image from 'next/image';
import { useTranslations } from 'next-intl';
import type { Project } from '@/entities/project';
import { externalLinkIcon } from '@/shared/assets';
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
                  <Image src={feature.icon} alt="" width={22} height={22} unoptimized />
                </span>
                <span className={style.featureText}>{feature.text}</span>
              </li>
            ))}
          </ul>
        </ProjectSection>
      )}

      {hasTryIt && tryIt && (
        <ProjectSection title={t('labels.section.tryIt')}>
          <ol className={style.tryList}>
            {tryIt.map((item) => (
              <li key={item} className={style.tryItem}>
                {item}
              </li>
            ))}
          </ol>

          {links.demo && (
            <a
              href={links.demo}
              target="_blank"
              rel="noopener noreferrer"
              className={style.demoLink}
            >
              <span>{t('actions.demo')}</span>
              <Image src={externalLinkIcon} alt="" width={14} height={14} unoptimized aria-hidden="true" />
            </a>
          )}
        </ProjectSection>
      )}
    </div>
  );
}
