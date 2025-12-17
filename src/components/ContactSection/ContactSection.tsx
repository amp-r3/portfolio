import style from './contact.module.scss'
import { useTranslation } from 'react-i18next'
import { motion } from 'motion/react'
import type { Variants } from 'motion/react'
import { socialsData } from '@/data/socialsData'

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.1
        }
    }
}

const itemVariants: Variants = {
    hidden: {
        opacity: 0,
        y: 30,
        filter: 'blur(8px)',
        scale: 0.95
    },
    visible: {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        scale: 1,
        transition: {
            type: 'spring',
            damping: 22,
            stiffness: 100
        }
    }
}

const ContactSection = () => {
    const { t } = useTranslation()

    return (
        <section id='contact'>
            <motion.div
                className={`${style.contact} container`}
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3, margin: "-50px" }}
            >
                <div className={style.contact__left}>
                    <motion.h1 variants={itemVariants} className={style.contact__title}>
                        {t('contact.title')}
                    </motion.h1>
                    <motion.p variants={itemVariants} className={style.contact__desc}>
                        {t('contact.description')}
                    </motion.p>
                </div>
                
                <div className={style.contact__content}>
                    <motion.div variants={itemVariants} className={style.contact__info}>
                        <h4 className={style.contact__subtitle}>{t('contact.info.title')}</h4>
                        <a href={`mailto:${socialsData.email.link}}`} className={style.contact__email}>{socialsData.email.link}</a>
                        <span className={style.contact__location}>{t('contact.info.location')}</span>
                    </motion.div>

                    <motion.div variants={itemVariants} className={style.contact__phone}>
                        <h4 className={style.contact__subtitle}>{t('contact.phone.title')}</h4>
                        <a href={`tel:+${socialsData.phone.link}`} className={style.contact__number}>+ 998 20 000 53 69</a>
                    </motion.div>

                    <motion.div variants={itemVariants} className={style.contact__social}>
                        <h4 className={style.contact__subtitle}>{t('contact.social.title')}</h4>
                        <div className={style.contact__social_links}>
                            <a href={socialsData.telegram.link} target="_blank" className={style.contact__links}>
                                <img src={socialsData.telegram.icon} alt="Telegram" />
                            </a>
                            <a href={socialsData.github.link} target="_blank" className={style.contact__links}>
                                <img src={socialsData.github.icon} alt="GitHub" />
                            </a>
                            <a href={socialsData.linkedin.link} target="_blank" className={style.contact__links}>
                                <img src={socialsData.linkedin.icon} alt="LinkedIn" />
                            </a>
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </section>
    )
}

export default ContactSection