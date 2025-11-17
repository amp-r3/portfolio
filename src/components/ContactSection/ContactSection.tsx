import { githubIcon, linkedinIcon, telegramIcon } from '@/assets/images'
import style from './contact.module.scss'
import { useTranslation } from 'react-i18next'

const ContactSection = () => {

    const { t } = useTranslation()


    return (
        <div id='contact' className={style.contact + ' container'}>
            <div className={style.contact__left}>
                <h1 className={style.contact__title}>{t('contact.title')}</h1>
                <p className={style.contact__desc}>{t('contact.description')}</p>
            </div>
            <div className={style.contact__content}>
                <div className={style.contact__info}>
                    <h4 className={style.contact__subtitle}>{t('contact.info.title')}</h4>
                    <a href="mailto:ergashevamir06@gmail.com" className={style.contact__email}>ergashevamir06@gmail.com</a>
                    <span className={style.contact__location}>{t('contact.info.location')}</span>
                </div>
                <div className={style.contact__phone}>
                    <h4 className={style.contact__subtitle}>{t('contact.phone.title')}</h4>
                    <a href="tel:+998200005369" className={style.contact__number}>+ 998 20 000 53 69</a>
                    <a href="tel:+998330095369" className={style.contact__number}>+ 998 33 009 53 69</a>
                </div>
                <div className={style.contact__social}>
                    <h4 className={style.contact__subtitle}>{t('contact.social.title')}</h4>
                    <div className={style.contact__social_links}>
                        <a href="https://t.me/amp_r3" target="_blank" className={style.contact__links}><img src={telegramIcon} alt="" /></a>
                        <a href="https://github.com/amp-r3" target="_blank" className={style.contact__links}><img src={githubIcon} alt="" /></a>
                        <a href="https://www.linkedin.com/in/amir-ergashev-96718a396" target="_blank" className={style.contact__links}><img src={linkedinIcon} alt="" /></a>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ContactSection