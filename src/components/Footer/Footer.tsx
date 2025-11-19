import { githubIcon, linkedinIcon, telegramIcon } from '@/assets/images'
import style from './footer.module.scss'
import { useTranslation } from 'react-i18next'

const Footer = () => {

    const { t } = useTranslation()


    return (
        <div className={style.footer}>
            <div className={style.footer__content + ' container'}>
                <h1 className={style.footer__title}>{t('footer.title')}</h1>
                <p className={style.footer__desc}>{t('footer.description')}</p>
                <a href="#contact" className={style.footer__btn}>{t('footer.button')}</a>
            </div>
            <div className={style.footer__basement + ' container'}>
                <a href="" className={style.footer__logo}>amp3re</a>
                <div className={style.footer__contacts}>
                    <div>
                        <a href="mailto:ergashevamir06@gmail.com" className={style.footer__email}>ergashevamir06@gmail.com</a>
                    </div>
                    <div className={style.footer__socials}>
                        <a href="https://t.me/amp_r3" target="_blank" className={style.footer__links}><img src={telegramIcon} alt="" /></a>
                        <a href="https://github.com/amp-r3" target="_blank" className={style.footer__links}><img src={githubIcon} alt="" /></a>
                        <a href="https://www.linkedin.com/in/amir-ergashev-96718a396" target="_blank" className={style.footer__links}><img src={linkedinIcon} alt="" /></a>
                    </div>
                </div>
            </div>
            <span className={style.footer__rights}>{t('footer.rights')}</span>
        </div>
    )
}

export default Footer