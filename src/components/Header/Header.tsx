import { useTranslation } from 'react-i18next'
import ThemeSwitch from '../UI/ThemeSwitch/ThemeSwitch'
import style from './header.module.scss'
import LangSwitch from '../UI/LangSwitch/LangSwitch'
import { useRef, useState } from 'react'
import { useHeaderScroll } from '@/hooks/useHeaderScroll'
import MenuIcon from '../UI/MenuIcon/MenuIcon'
const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const navRef = useRef<HTMLDivElement>(null)
    useHeaderScroll(navRef)

    const handleMenu = () => {
        setIsMenuOpen(!isMenuOpen)
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
                    <li><a href="#skills" className={style.header__link}>{t('header.nav.skills')}</a></li>
                    <li><a href="#projects" className={style.header__link}>{t('header.nav.projects')}</a></li>
                    <li><a href="#contact" className={style.header__link}>{t('header.nav.contact')}</a></li>
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