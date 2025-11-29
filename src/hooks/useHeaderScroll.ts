import { useEffect } from "react";

export function useHeaderScroll<T extends HTMLElement>(
    navRef: React.RefObject<T | null>,
    heroId: string = 'hero'
) {
    useEffect(() => {
        if (!navRef.current) return;

        const heroSection = document.getElementById(heroId);
        if (!heroSection) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (!navRef.current) return;

                // When hero NOT visible (user scrolled down)
                if (!entry.isIntersecting) {
                    navRef.current.classList.add('scrolled');
                } else {
                    navRef.current.classList.remove('scrolled');
                }
            },
            {
                threshold: 0,
                rootMargin: '-1px 0px 0px 0px'
            }
        );

        observer.observe(heroSection);

        return () => {
            observer.disconnect();
        };

    }, [navRef, heroId]);
}