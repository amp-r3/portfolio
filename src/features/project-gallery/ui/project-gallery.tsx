'use client';

import { useContext, useState } from 'react';
import { getImageProps } from 'next/image';
import { useTranslations } from 'next-intl';
import type { ProjectImages } from '@/entities/project';
import { ThemeContext } from '@/shared/lib';
import { ImageViewer, type IImageViewerSlide, type IImageViewerTab } from '@/shared/ui';
import { DesktopIcon, ExpandIcon, MobileIcon } from './gallery-icons';
import style from './project-gallery.module.scss';

type ScreenshotVariant = 'desktop' | 'mobile';

interface IProjectGalleryProps {
  images: ProjectImages;
  title: string;
}

const DESKTOP_IMAGE = { width: 1920, height: 1080 };
const MOBILE_IMAGE = { width: 1080, height: 2400 };
const DESKTOP_IMAGE_SIZES = '(min-width: 1024px) 55vw, 100vw';
const MOBILE_IMAGE_SIZES = '100vw';

export function ProjectGallery({ images, title }: IProjectGalleryProps) {
  const t = useTranslations('projects');
  const themeContext = useContext(ThemeContext);
  const isLight = themeContext?.theme === 'light';
  const [isOpen, setIsOpen] = useState(false);
  const [activeVariant, setActiveVariant] = useState<ScreenshotVariant>('desktop');

  const screenshotAlt = t('screenshotAlt', { title });
  const hasMobile = Boolean(images.mobileLight || images.mobileDark);

  const lightMain = images.light;
  const darkMain = images.dark ?? images.light;
  const lightMobile = images.mobileLight ?? images.light;
  const darkMobile = images.mobileDark ?? images.mobileLight ?? images.dark ?? images.light;

  const lightDesktopImage = getImageProps({
    src: lightMain,
    alt: screenshotAlt,
    sizes: DESKTOP_IMAGE_SIZES,
    loading: isLight ? 'eager' : 'lazy',
    ...(isLight ? { fetchPriority: 'high' as const } : {}),
    ...DESKTOP_IMAGE,
  }).props;
  const lightMobileImage = getImageProps({
    src: lightMobile,
    alt: screenshotAlt,
    sizes: MOBILE_IMAGE_SIZES,
    loading: isLight ? 'eager' : 'lazy',
    ...(isLight ? { fetchPriority: 'high' as const } : {}),
    ...MOBILE_IMAGE,
  }).props;
  const darkDesktopImage = getImageProps({
    src: darkMain,
    alt: screenshotAlt,
    sizes: DESKTOP_IMAGE_SIZES,
    loading: !isLight ? 'eager' : 'lazy',
    ...(!isLight ? { fetchPriority: 'high' as const } : {}),
    ...DESKTOP_IMAGE,
  }).props;
  const darkMobileImage = getImageProps({
    src: darkMobile,
    alt: screenshotAlt,
    sizes: MOBILE_IMAGE_SIZES,
    loading: !isLight ? 'eager' : 'lazy',
    ...(!isLight ? { fetchPriority: 'high' as const } : {}),
    ...MOBILE_IMAGE,
  }).props;

  const desktopSrc = isLight ? lightMain : darkMain;
  const mobileSrc = isLight ? lightMobile : darkMobile;

  const slides: IImageViewerSlide[] = [
    { id: 'desktop', src: desktopSrc, alt: screenshotAlt, ...DESKTOP_IMAGE },
    ...(hasMobile ? [{ id: 'mobile', src: mobileSrc, alt: screenshotAlt, ...MOBILE_IMAGE }] : []),
  ];

  const tabs: IImageViewerTab[] = [
    { id: 'desktop', label: t('viewer.desktop'), icon: <DesktopIcon /> },
    ...(hasMobile ? [{ id: 'mobile', label: t('viewer.mobile'), icon: <MobileIcon /> }] : []),
  ];

  const handleOpen = () => {
    const isMobileViewport =
      typeof window !== 'undefined' && window.matchMedia('(max-width: 639px)').matches;

    setActiveVariant(isMobileViewport && hasMobile ? 'mobile' : 'desktop');
    setIsOpen(true);
  };

  const handleTabChange = (id: string) => {
    setActiveVariant(id === 'mobile' && hasMobile ? 'mobile' : 'desktop');
  };

  return (
    <>
      <div className={style.gallery}>
        {/* Light theme picture */}
        <picture className={`${style.picture} ${style.pictureLight}`}>
          <source media="(max-width: 639px)" srcSet={lightMobileImage.srcSet} sizes={lightMobileImage.sizes} />
          <img {...lightDesktopImage} alt={screenshotAlt} className={style.image} />
        </picture>

        {/* Dark theme picture */}
        <picture className={`${style.picture} ${style.pictureDark}`}>
          <source media="(max-width: 639px)" srcSet={darkMobileImage.srcSet} sizes={darkMobileImage.sizes} />
          <img {...darkDesktopImage} alt={screenshotAlt} className={style.image} />
        </picture>

        <button
          type="button"
          className={style.open}
          onClick={handleOpen}
          aria-label={t('viewer.open')}
          aria-haspopup="dialog"
        >
          <span className={style.openBadge} aria-hidden="true">
            <ExpandIcon />
          </span>
        </button>
      </div>

      {isOpen && (
        <ImageViewer
          slides={slides}
          tabs={tabs}
          activeTabId={activeVariant}
          onTabChange={handleTabChange}
          onClose={() => setIsOpen(false)}
          dialogLabel={t('viewer.dialog', { title })}
          labels={{
            close: t('viewer.close'),
            zoomIn: t('viewer.zoomIn'),
            zoomOut: t('viewer.zoomOut'),
            resetZoom: t('viewer.resetZoom'),
            tabsLabel: t('viewer.tabs'),
          }}
        />
      )}
    </>
  );
}
