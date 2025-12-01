import { githubIcon, linkedinIcon, telegramIcon } from '@/assets/images'
import style from './footer.module.scss'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import FooterBackground from './FooterBackground'

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

const smoothRevealVariants: Variants = {
    hidden: {
        opacity: 0,
        y: 30,
        filter: 'blur(10px)', 
        scale: 0.98
    },
    visible: {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        scale: 1,
        transition: {
            duration: 1.2,
            ease: [0.22, 1, 0.36, 1]
        }
    }
}

const itemRevealVariants: Variants = {
    hidden: {
        opacity: 0,
        y: 20,
        filter: 'blur(5px)'
    },
    visible: {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        transition: {
            duration: 0.8,
            ease: [0.22, 1, 0.36, 1]
        }
    }
}

const Footer = () => {
    const { t } = useTranslation()

    return (
        <footer className={style.footer}>
            {/* Main content (CTA) */}
            <motion.div
                className={`${style.footer__content} container`}
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3, margin: "0px 0px -100px 0px" }}
            >
                <motion.h1
                    variants={smoothRevealVariants}
                    className={style.footer__title}
                >
                    {t('footer.title')}
                </motion.h1>
                <motion.p
                    variants={smoothRevealVariants}
                    className={style.footer__desc}
                >
                    {t('footer.description')}
                </motion.p>
                <motion.a
                    href="#contact"
                    className={style.footer__btn}
                    variants={itemRevealVariants}
                >
                    {t('footer.button')}
                </motion.a>
            </motion.div>

            {/* Contacts */}
            <motion.div
                className={`${style.footer__basement} container`}
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.5 }}
            >
                <motion.a
                    variants={itemRevealVariants}
                    href=""
                    className={style.footer__logo}
                >
                    amp3re
                </motion.a>

                <div className={style.footer__contacts}>
                    <motion.div variants={itemRevealVariants}>
                        <motion.a
                            href="mailto:ergashevamir06@gmail.com"
                            className={style.footer__email}
                        >
                            ergashevamir06@gmail.com
                        </motion.a>
                    </motion.div>

                    <div className={style.footer__socials}>
                        <motion.a
                            variants={itemRevealVariants}
                            href="https://t.me/amp_r3"
                            target="_blank"
                            className={style.footer__links}
                        >
                            <img src={telegramIcon} alt="Telegram" />
                        </motion.a>
                        <motion.a
                            variants={itemRevealVariants}
                            href="https://github.com/amp-r3"
                            target="_blank"
                            className={style.footer__links}
                        >
                            <img src={githubIcon} alt="GitHub" />
                        </motion.a>
                        <motion.a
                            variants={itemRevealVariants}
                            href="https://www.linkedin.com/in/amir-ergashev-96718a396"
                            target="_blank"
                            className={style.footer__links}
                        >
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
                transition={{
                    duration: 1.5,
                    delay: 0.5,
                    ease: "easeOut"
                }}
            >
                {t('footer.rights')}
            </motion.span>
            <FooterBackground />
        </footer>
    )
}

export default Footer