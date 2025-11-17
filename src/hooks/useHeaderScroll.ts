import { useEffect } from "react";

export function useHeaderScroll<T extends HTMLElement>(
    navRef: React.RefObject<T | null>,
    heroId: string = 'hero'
) {
    useEffect(() => {
        let ticking = false;

        const handleScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    if (!navRef.current) {
                        ticking = false;
                        return;
                    }

                    const heroSection = document.getElementById(heroId);
                    const threshold = heroSection ? heroSection.offsetHeight : 600;

                    if (window.scrollY > threshold) {
                        navRef.current.classList.add('scrolled');
                    } else {
                        navRef.current.classList.remove('scrolled');
                    }

                    ticking = false;
                });

                ticking = true;
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();

        return () => window.removeEventListener('scroll', handleScroll);

    }, [navRef, heroId]);
}