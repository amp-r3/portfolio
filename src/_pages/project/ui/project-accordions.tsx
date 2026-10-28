'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import type { Project } from '@/entities/project';
import { packageIcon } from '@/shared/assets';
import { AccordionItem, Badge } from '@/shared/ui';
import { ProjectSection } from './project-section';
import style from './project-accordions.module.scss';

interface IProjectAccordionsProps {
  project: Project;
  className?: string;
}

export function ProjectAccordions({ project, className }: IProjectAccordionsProps) {
  const t = useTranslations('projects');
  const { deepDive, stack, limitations } = project;
  const [openItems, setOpenItems] = useState<ReadonlySet<string>>(() => new Set());

  const toggle = (id: string) => {
    setOpenItems((previous) => {
      const next = new Set(previous);

      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }

      return next;
    });
  };

  const hasDeepDive = deepDive.length > 0;
  const hasStack = stack.groups.length > 0;
  const hasLimitations = Boolean(limitations?.length);

  if (!hasDeepDive && !hasStack && !hasLimitations) {
    return null;
  }

  const triggerClassName = style.trigger;
  const summaryClassName = style.summary;
  const panelInnerClassName = style.panel;

  return (
    <div className={[style.accordions, className].filter(Boolean).join(' ')}>
      <ProjectSection title={t('labels.section.deepDive')}>
        <ul className={style.list}>
          {deepDive.map((item, index) => {
            const id = `deep-dive-${index}`;

            return (
              <li key={id} className={style.card}>
                <AccordionItem
                  id={id}
                  open={openItems.has(id)}
                  onToggle={() => toggle(id)}
                  headingLevel={3}
                  panelRole="region"
                  summaryPlacement="below"
                  header={<span className={style.title}>{item.title}</span>}
                  summary={item.summary}
                  icon={<Image src={item.icon} alt="" width={22} height={22} unoptimized />}
                  iconClassName={style.icon}
                  indicatorClassName={style.indicator}
                  triggerClassName={triggerClassName}
                  summaryClassName={summaryClassName}
                  panelInnerClassName={panelInnerClassName}
                >
                  <p className={style.details}>{item.details}</p>
                </AccordionItem>
              </li>
            );
          })}

          {hasStack && (
            <li className={style.card}>
              <AccordionItem
                id="full-stack"
                open={openItems.has('full-stack')}
                onToggle={() => toggle('full-stack')}
                headingLevel={3}
                panelRole="region"
                summaryPlacement="below"
                header={<span className={style.title}>{t('labels.section.stack')}</span>}
                icon={<Image src={packageIcon} alt="" width={22} height={22} unoptimized />}
                iconClassName={style.icon}
                indicatorClassName={style.indicator}
                triggerClassName={triggerClassName}
                panelInnerClassName={panelInnerClassName}
              >
                <div className={style.groups}>
                  {stack.groups.map((group) => (
                    <div key={group.id} className={style.group}>
                      <h4 className={style.groupTitle}>{t(`labels.stackGroup.${group.id}`)}</h4>
                      <div className={style.chips}>
                        {group.items.map((item) => (
                          <Badge key={item} label={item} />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </AccordionItem>
            </li>
          )}

          {hasLimitations && limitations && (
            <li className={style.card}>
              <AccordionItem
                id="limitations"
                open={openItems.has('limitations')}
                onToggle={() => toggle('limitations')}
                headingLevel={3}
                panelRole="region"
                summaryPlacement="below"
                header={<span className={style.title}>{t('labels.section.limitations')}</span>}
                icon={<span className={style.iconPlaceholder} />}
                iconClassName={style.icon}
                indicatorClassName={style.indicator}
                triggerClassName={triggerClassName}
                panelInnerClassName={panelInnerClassName}
              >
                <ul className={style.limitations}>
                  {limitations.map((item) => (
                    <li key={item} className={style.limitation}>
                      {item}
                    </li>
                  ))}
                </ul>
              </AccordionItem>
            </li>
          )}
        </ul>
      </ProjectSection>
    </div>
  );
}
