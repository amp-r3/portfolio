import { useEffect } from "react";

export function useHeaderScroll<T extends HTMLElement>(
    navRef: React.RefObject<T | null>,
    pathName: string,
    heroId: string = 'hero',
) {
    useEffect(() => {
        const navElement = navRef.current;

        if (!navElement) return;

        const initScrollObserver = () => {
            const heroSection = document.getElementById(heroId);

            if (!heroSection) {
                navElement.classList.add('scrolled');
                return;
            }

            navElement.classList.remove('scrolled');

            const observer = new IntersectionObserver(
                ([entry]) => {
                    if (!entry.isIntersecting) {
                        navElement.classList.add('scrolled');
                    } else {
                        navElement.classList.remove('scrolled');
                    }
                },
                { threshold: 0, rootMargin: '-1px 0px 0px 0px' }
            );

            observer.observe(heroSection);

            return () => observer.disconnect();
        };

        const timer = setTimeout(() => {
            cleanupObserver = initScrollObserver();
        }, 100);

        let cleanupObserver: (() => void) | undefined;

        return () => {
            clearTimeout(timer);
            if (cleanupObserver) cleanupObserver();
            navElement.classList.remove('scrolled');
        };

    }, [navRef, heroId, pathName]);
}