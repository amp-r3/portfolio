import  {githubIcon, linkedinIcon, telegramIcon}  from '@/assets/images'
import style from './heroSection.module.scss'
import { useTranslation } from 'react-i18next'
const HeroSection = () => {

    const { t } = useTranslation()


    return (
        <div id='hero' className={style.hero}>
            <div className={style.hero__content + ' container'}>
                <h1 className={style.hero__title}>{t('hero.title')}</h1>
                <p className={style.hero__desc}>{t('hero.description')}</p>
                <a href="#projects" className={style.hero__btn}>{t('hero.button')}</a>
                <div className={style.hero__contacts}>
                    <a href="https://t.me/amp_r3" target="_blank" className={style.hero__links}><img src={telegramIcon} alt="" /></a>
                    <a href="https://github.com/amp-r3" target="_blank" className={style.hero__links}><img src={githubIcon} alt="" /></a>
                    <a href="https://www.linkedin.com/in/amir-ergashev-96718a396" target="_blank" className={style.hero__links}><img src={linkedinIcon} alt="" /></a>
                </div>
            </div>
        </div>
    )
}

export default HeroSection