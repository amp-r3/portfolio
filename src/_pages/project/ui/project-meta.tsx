import { useTranslations } from 'next-intl';
import type { Project, ProjectStatus } from '@/entities/project';
import { Badge } from '@/shared/ui';
import { formatPeriod } from '../model/format-period';
import style from './project-meta.module.scss';

interface IProjectMetaProps {
  project: Project;
}

interface IProjectMetaItem {
  key: string;
  label: string;
  status?: ProjectStatus;
}

export function ProjectMeta({ project }: IProjectMetaProps) {
  const t = useTranslations('projects');
  const { type, role, period, status } = project;

  const items: IProjectMetaItem[] = [];

  if (type) {
    items.push({ key: 'type', label: t(`labels.type.${type}`) });
  }

  if (role) {
    items.push({ key: 'role', label: t(`labels.role.${role}`) });
  }

  if (period) {
    items.push({ key: 'period', label: formatPeriod(period, t('labels.period.present')) });
  }

  if (status) {
    items.push({ key: 'status', label: t(`labels.status.${status}`), status });
  }

  if (items.length === 0) {
    return null;
  }

  return (
    <ul className={style.meta}>
      {items.map((item) => (
        <li key={item.key} className={style.item}>
          <Badge
            label={item.label}
            className={[style.badge, item.status ? style.badgeStatus : ''].filter(Boolean).join(' ')}
            leading={
              item.status ? (
                <span className={style.dot} data-status={item.status} aria-hidden="true" />
              ) : undefined
            }
          />
        </li>
      ))}
    </ul>
  );
}
