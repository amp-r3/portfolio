'use client';

import { useId, type KeyboardEvent, type ReactNode, type Ref } from 'react';
import { AnimatePresence, motion, type Transition } from 'motion/react';
import { MOTION_EASING, usePrefersReducedMotion } from '@/shared/config';
import styles from './accordion.module.scss';

type AccordionTriggerRole = 'button' | 'tab';
type AccordionPanelPlacement = 'sibling' | 'inside';
type AccordionPanelMode = 'persistent' | 'unmount';
type AccordionHeadingLevel = 2 | 3 | 4;
type AccordionSummaryPlacement = 'body' | 'below';

interface IAccordionPanelProps {
  id: string;
  labelledBy?: string;
  open: boolean;
  reducedMotion: boolean;
  mode: AccordionPanelMode;
  role?: 'region';
  className: string;
  innerClassName: string;
  children: ReactNode;
}

const PANEL_TRANSITION: Transition = {
  height: { duration: 0.35, ease: MOTION_EASING },
  opacity: { duration: 0.25, ease: 'easeOut' },
};

function AccordionPanel({
  id,
  labelledBy,
  open,
  reducedMotion,
  mode,
  role,
  className,
  innerClassName,
  children,
}: IAccordionPanelProps) {
  if (mode === 'unmount') {
    return (
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key={id}
            id={id}
            className={className}
            initial={reducedMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
            animate={reducedMotion ? { opacity: 1 } : { height: 'auto', opacity: 1 }}
            exit={reducedMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={PANEL_TRANSITION}
          >
            <div className={innerClassName}>{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  return (
    <motion.div
      id={id}
      role={role}
      aria-labelledby={role ? labelledBy : undefined}
      aria-hidden={!open}
      inert={!open}
      initial={false}
      animate={
        reducedMotion
          ? { height: open ? 'auto' : 0 }
          : { height: open ? 'auto' : 0, opacity: open ? 1 : 0 }
      }
      transition={reducedMotion ? { duration: 0 } : PANEL_TRANSITION}
      className={className}
    >
      <div className={innerClassName}>{children}</div>
    </motion.div>
  );
}

import { ChevronRight } from 'lucide-react';

function ChevronIcon() {
  return <ChevronRight aria-hidden="true" />;
}

export interface IAccordionItemProps {
  id?: string;
  /** Explicit ids keep existing markup stable and make `aria-controls` predictable. */
  triggerId?: string;
  panelId?: string;
  /** Overrides `aria-controls` when the panel lives somewhere else (Skills desktop preview). */
  ariaControls?: string;
  open: boolean;
  onToggle: () => void;
  header: ReactNode;
  /** Optional one-line summary shown under the header in both states. */
  summary?: ReactNode;
  /** Keeps the summary inside the title column (default) or moves it to a full-width row. */
  summaryPlacement?: AccordionSummaryPlacement;
  icon?: ReactNode;
  indicator?: ReactNode;
  iconClassName?: string;
  indicatorClassName?: string;
  headingLevel?: AccordionHeadingLevel;
  /** `tab` preserves the Skills tablist semantics; `button` is a regular disclosure. */
  triggerRole?: AccordionTriggerRole;
  selected?: boolean;
  panelPlacement?: AccordionPanelPlacement;
  panelMode?: AccordionPanelMode;
  panelRole?: 'region';
  triggerClassName?: string;
  summaryClassName?: string;
  panelClassName?: string;
  panelInnerClassName?: string;
  triggerRef?: Ref<HTMLDivElement>;
  triggerTabIndex?: number;
  onTriggerMouseEnter?: () => void;
  children: ReactNode;
}

export function AccordionItem({
  id,
  triggerId,
  panelId,
  ariaControls,
  open,
  onToggle,
  header,
  summary,
  summaryPlacement = 'body',
  icon,
  indicator,
  iconClassName,
  indicatorClassName,
  headingLevel = 2,
  triggerRole = 'button',
  selected,
  panelPlacement,
  panelMode = 'persistent',
  panelRole,
  triggerClassName,
  summaryClassName,
  panelClassName,
  panelInnerClassName,
  triggerRef,
  triggerTabIndex,
  onTriggerMouseEnter,
  children,
}: IAccordionItemProps) {
  const generatedId = useId();
  const baseId = id ?? generatedId;
  const resolvedTriggerId = triggerId ?? `${baseId}-trigger`;
  const resolvedPanelId = panelId ?? `${baseId}-panel`;
  const resolvedControls = ariaControls ?? resolvedPanelId;
  const reducedMotion = usePrefersReducedMotion();

  const placement = panelPlacement ?? (triggerRole === 'tab' ? 'inside' : 'sibling');
  const Heading = `h${headingLevel}` as 'h2';

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    onToggle();
  };

  const panel = (
    <AccordionPanel
      id={resolvedPanelId}
      labelledBy={resolvedTriggerId}
      open={open}
      reducedMotion={reducedMotion}
      mode={panelMode}
      role={panelRole}
      className={[styles.panel, panelClassName].filter(Boolean).join(' ')}
      innerClassName={panelInnerClassName ?? styles.panelInner}
    >
      {children}
    </AccordionPanel>
  );

  const resolvedSummaryClassName = summaryClassName ?? styles.summary;
  const SummaryTag = triggerRole === 'tab' ? 'p' : 'span';
  const summaryNode =
    summary !== undefined ? (
      <SummaryTag
        className={[
          resolvedSummaryClassName,
          summaryPlacement === 'below' ? styles.summaryBelow : '',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {summary}
      </SummaryTag>
    ) : null;

  if (triggerRole === 'tab') {
    return (
      <div
        ref={triggerRef}
        id={resolvedTriggerId}
        role="tab"
        aria-selected={selected}
        aria-expanded={open}
        aria-controls={resolvedControls}
        tabIndex={triggerTabIndex}
        className={triggerClassName}
        onClick={onToggle}
        onKeyDown={handleKeyDown}
        onMouseEnter={onTriggerMouseEnter}
      >
        {header}
        {summaryNode}
        {placement === 'inside' && panel}
      </div>
    );
  }

  return (
    <>
      <Heading className={styles.heading}>
        <button
          type="button"
          id={resolvedTriggerId}
          className={[
            styles.trigger,
            summaryPlacement === 'below' ? styles.triggerStacked : '',
            triggerClassName,
          ]
            .filter(Boolean)
            .join(' ')}
          aria-expanded={open}
          aria-controls={resolvedControls}
          onClick={onToggle}
        >
          {icon !== undefined && (
            <span className={[styles.icon, iconClassName].filter(Boolean).join(' ')} aria-hidden="true">
              {icon}
            </span>
          )}
          <span className={styles.body}>
            <span className={styles.header}>{header}</span>
            {summaryPlacement === 'body' && summaryNode}
          </span>
          <span
            className={[
              styles.indicator,
              indicatorClassName,
              open ? styles.indicatorOpen : '',
            ]
              .filter(Boolean)
              .join(' ')}
            aria-hidden="true"
          >
            {indicator ?? <ChevronIcon />}
          </span>
          {summaryPlacement === 'below' && summaryNode}
        </button>
      </Heading>
      {placement === 'sibling' && panel}
    </>
  );
}
