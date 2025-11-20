import { githubIcon, linkedinIcon, telegramIcon } from '@/assets/images'
import style from './footer.module.scss'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import type { Variants } from 'framer-motion'

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.1
        }
    }
}

const itemVariants: Variants = {
    hidden: {
        opacity: 0,
        y: 20,
        filter: 'blur(5px)',
        scale: 0.95
    },
    visible: {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        scale: 1,
        transition: {
            type: 'spring',
            damping: 20,
            stiffness: 100
        }
    }
}

const Footer = () => {
    const { t } = useTranslation()

    return (
        <footer className={style.footer}>
            {/* Основной контент (CTA) */}
            <motion.div
                className={`${style.footer__content} container`}
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
            >
                <motion.h1 variants={itemVariants} className={style.footer__title}>
                    {t('footer.title')}
                </motion.h1>
                <motion.p variants={itemVariants} className={style.footer__desc}>
                    {t('footer.description')}
                </motion.p>
                <motion.div variants={itemVariants}>
                    <a href="#contact" className={style.footer__btn}>
                        {t('footer.button')}
                    </a>
                </motion.div>
            </motion.div>

            {/* Нижняя панель с контактами */}
            <motion.div
                className={`${style.footer__basement} container`}
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.5 }}
            >
                <motion.a variants={itemVariants} href="" className={style.footer__logo}>
                    amp3re
                </motion.a>
                
                <div className={style.footer__contacts}>
                    <motion.div variants={itemVariants}>
                        <a href="mailto:ergashevamir06@gmail.com" className={style.footer__email}>
                            ergashevamir06@gmail.com
                        </a>
                    </motion.div>
                    
                    <div className={style.footer__socials}>
                        <motion.a variants={itemVariants} href="https://t.me/amp_r3" target="_blank" className={style.footer__links}>
                            <img src={telegramIcon} alt="Telegram" />
                        </motion.a>
                        <motion.a variants={itemVariants} href="https://github.com/amp-r3" target="_blank" className={style.footer__links}>
                            <img src={githubIcon} alt="GitHub" />
                        </motion.a>
                        <motion.a variants={itemVariants} href="https://www.linkedin.com/in/amir-ergashev-96718a396" target="_blank" className={style.footer__links}>
                            <img src={linkedinIcon} alt="LinkedIn" />
                        </motion.a>
                    </div>
                </div>
            </motion.div>

            <motion.span 
                className={style.footer__rights}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 0.7 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.5 }}
            >
                {t('footer.rights')}
            </motion.span>
        </footer>
    )
}

export default Footer