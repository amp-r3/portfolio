import { useTranslation } from 'react-i18next'
import ThemeSwitch from '../UI/ThemeSwitch/ThemeSwitch'
import style from './header.module.scss'
import LangSwitch from '../UI/LangSwitch/LangSwitch'
import { useEffect, useRef, useState } from 'react'
import { useHeaderScroll } from '@/hooks/useHeaderScroll'
import MenuIcon from '../UI/MenuIcon/MenuIcon'
const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const navRef = useRef<HTMLDivElement>(null)
    useHeaderScroll(navRef)

    useEffect(() => {
        if (!isMenuOpen) return;

        const scrollYStart = window.scrollY;
        const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

        document.body.style.position = 'fixed';
        document.body.style.top = `-${scrollYStart}px`;
        document.body.style.width = '100%';
        document.body.style.paddingRight = `${scrollbarWidth}px`;
        document.body.style.overflowY = 'hidden';

        return () => {
            const scrollYEnd = document.body.style.top;

            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
            document.body.style.paddingRight = '';
            document.body.style.overflowY = '';
            document.documentElement.style.scrollBehavior = 'auto';

            window.scrollTo({
                top: parseInt(scrollYEnd || '0') * -1,
                left: 0,
                behavior: 'instant'
            });

            setTimeout(() => {
                document.documentElement.style.scrollBehavior = '';
            }, 0);
        };
    }, [isMenuOpen]);

    const handleMenu = () => {
        setIsMenuOpen(!isMenuOpen)
    }

    const onLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
        e.preventDefault();

        setIsMenuOpen(false);

        setTimeout(() => {
            const element = document.getElementById(targetId);
            if (element) {
                element.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });

                window.history.pushState(null, '', `#${targetId}`);
            }
        }, 100);
    }


    const { t } = useTranslation()


    return (
        <div ref={navRef} className={style.header}>
            <div className={style.header__wrapper + ' container'}>
                <a href="" className={style.header__logo}>amp3re</a>
                <button onClick={handleMenu} className={style.header__menu_btn}>
                    <MenuIcon isOpen={isMenuOpen} />
                </button>
                <ul className={`${style.header__menu} ${isMenuOpen ? 'active' : ''}`}>
                    <li><a onClick={(e) => { onLinkClick(e, 'skills') }} href="#skills" className={style.header__link}>{t('header.nav.skills')}</a></li>
                    <li><a onClick={(e) => { onLinkClick(e, 'projects') }} href="#projects" className={style.header__link}>{t('header.nav.projects')}</a></li>
                    <li><a onClick={(e) => { onLinkClick(e, 'contact') }} href="#contact" className={style.header__link}>{t('header.nav.contact')}</a></li>
                </ul>
                <div className={`${style.header__option} ${isMenuOpen ? 'active' : ''}`}>
                    <LangSwitch />
                    <ThemeSwitch />
                </div>
            </div>
        </div>
    )
}

export default Header