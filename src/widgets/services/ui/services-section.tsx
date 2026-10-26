'use client';

import { useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { AnimatePresence, motion } from 'motion/react';
import { Badge } from '@/shared/ui';
import { usePrefersReducedMotion } from '@/shared/config';
import { scrollToElement } from '@/shared/lib';
import { SERVICES_LIST } from '../model/services-data';
import type { ServiceId, ServiceItemConfig } from '../model/types';
import style from './services-section.module.scss';

function CheckIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path
        d="M13.3334 4L6.00008 11.3333L2.66675 8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path
        d="M6 3L11 8L6 13"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ServicesSection() {
  const t = useTranslations('services');
  const [desktopActiveId, setDesktopActiveId] = useState<ServiceId>('fullstack');
  const [mobileExpandedId, setMobileExpandedId] = useState<ServiceId | null>(null);
  const itemRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const prefersReduced = usePrefersReducedMotion();

  const activeConfig =
    SERVICES_LIST.find((item) => item.id === desktopActiveId) ?? SERVICES_LIST[0];

  const handleItemClick = (id: ServiceId) => {
    setDesktopActiveId(id);

    // Accordion toggle & smooth scroll are strictly for mobile/tablet screens (<= 992px)
    if (typeof window !== 'undefined' && window.innerWidth <= 992) {
      const isAlreadyExpanded = mobileExpandedId === id;
      const nextExpanded = isAlreadyExpanded ? null : id;
      setMobileExpandedId(nextExpanded);

      if (nextExpanded) {
        setTimeout(() => {
          const element = itemRefs.current[id];
          if (element) {
            scrollToElement(element);
          }
        }, 60);
      }
    }
  };

  const handleMouseEnter = (id: ServiceId) => {
    setDesktopActiveId(id);
  };

  const renderDeliverables = (item: ServiceItemConfig) => {
    const deliverables = [
      t(`items.${item.id}.deliverables.first`),
      t(`items.${item.id}.deliverables.second`),
      t(`items.${item.id}.deliverables.third`),
    ];

    return (
      <div className={style.services__deliverablesBlock}>
        <div className={style.services__blockHeading}>{t('deliverablesTitle')}</div>
        <ul className={style.services__deliverablesList}>
          {deliverables.map((text, idx) => (
            <li key={idx} className={style.services__deliverableItem}>
              <span className={style.services__checkIcon}>
                <CheckIcon />
              </span>
              <span>{text}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const renderTags = (item: ServiceItemConfig) => (
    <div className={style.services__stackBlock}>
      <div className={style.services__blockHeading}>{t('stackTitle')}</div>
      <div className={style.services__tags}>
        {item.tags.map((tag) => (
          <Badge key={tag} label={tag} />
        ))}
      </div>
    </div>
  );

  return (
    <section id="services" className={style.services}>
      {/* Fallback anchor preserving compatibility for #skills links */}
      <span id="skills" className={style.services__legacyAnchor} aria-hidden="true" />

      <div className="container">
        <header className={style.services__header}>
          <span className={style.services__tag}>{t('tag')}</span>
          <h2 className={style.services__title}>{t('title')}</h2>
          <p className={style.services__subtitle}>{t('description')}</p>
        </header>

        <div className={style.services__layout}>
          {/* Left Column: Interactive List */}
          <div className={style.services__list} role="tablist" aria-orientation="vertical">
            {SERVICES_LIST.map((item) => {
              const isDesktopActive = item.id === desktopActiveId;
              const isMobileExpanded = item.id === mobileExpandedId;
              const title = t(`items.${item.id}.title`);
              const shortDesc = t(`items.${item.id}.shortDesc`);

              const itemClasses = [
                style.services__item,
                isDesktopActive ? style.services__item_activeDesktop : '',
                isMobileExpanded ? style.services__item_expandedMobile : '',
              ]
                .filter(Boolean)
                .join(' ');

              const arrowClasses = [
                style.services__itemArrow,
                isDesktopActive ? style.services__itemArrow_activeDesktop : '',
                isMobileExpanded ? style.services__itemArrow_openMobile : '',
              ]
                .filter(Boolean)
                .join(' ');

              return (
                <div
                  key={item.id}
                  ref={(el) => {
                    itemRefs.current[item.id] = el;
                  }}
                  role="tab"
                  id={`service-tab-${item.id}`}
                  aria-selected={isDesktopActive}
                  aria-expanded={isMobileExpanded}
                  aria-controls={`service-panel-${item.id}`}
                  tabIndex={0}
                  className={itemClasses}
                  onClick={() => handleItemClick(item.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleItemClick(item.id);
                    }
                  }}
                  onMouseEnter={() => handleMouseEnter(item.id)}
                >
                  <div className={style.services__itemHeader}>
                    <div className={style.services__itemLeft}>
                      <span className={style.services__itemNumber}>{item.number}</span>
                      <h3 className={style.services__itemTitle}>{title}</h3>
                    </div>
                    <span className={arrowClasses} aria-hidden="true">
                      <ArrowIcon />
                    </span>
                  </div>

                  <p className={style.services__itemShortDesc}>{shortDesc}</p>

                  {/* Mobile-only animated expandable content */}
                  <AnimatePresence initial={false}>
                    {isMobileExpanded && (
                      <motion.div
                        key={`mobile-collapse-${item.id}`}
                        initial={prefersReduced ? { opacity: 0 } : { height: 0, opacity: 0 }}
                        animate={prefersReduced ? { opacity: 1 } : { height: 'auto', opacity: 1 }}
                        exit={prefersReduced ? { opacity: 0 } : { height: 0, opacity: 0 }}
                        transition={{
                          height: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
                          opacity: { duration: 0.25, ease: 'easeOut' },
                        }}
                        className={style.services__mobileCollapse}
                        id={`service-panel-mobile-${item.id}`}
                      >
                        <div className={style.services__mobileContent}>
                          {renderDeliverables(item)}
                          {renderTags(item)}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          {/* Right Column: Desktop Sticky Live Preview Panel */}
          <div className={style.services__previewWrapper}>
            <div
              className={style.services__previewCard}
              id={`service-panel-${activeConfig.id}`}
              role="tabpanel"
              aria-labelledby={`service-tab-${activeConfig.id}`}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeConfig.id}
                  initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={prefersReduced ? { opacity: 0 } : { opacity: 0, y: -12 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                >
                  <div className={style.services__previewNumber}>{activeConfig.number}</div>
                  <h3 className={style.services__previewTitle}>
                    {t(`items.${activeConfig.id}.title`)}
                  </h3>
                  <p className={style.services__previewDesc}>
                    {t(`items.${activeConfig.id}.shortDesc`)}
                  </p>

                  {renderDeliverables(activeConfig)}
                  {renderTags(activeConfig)}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
