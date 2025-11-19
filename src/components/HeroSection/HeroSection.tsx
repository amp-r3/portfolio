import { githubIcon, linkedinIcon, telegramIcon } from '@/assets/images'
import style from './heroSection.module.scss'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import type { Variants } from 'framer-motion'

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            delayChildren: 0.2,
            staggerChildren: 0.2
        }
    }
}

const itemVariants: Variants = {
    hidden: {
        y: 30,
        opacity: 0
    },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            type: "spring",
            stiffness: 80,
            damping: 13
        }
    }
}

const HeroSection = () => {
    const { t } = useTranslation()

    return (
        <section id='hero' className={style.hero}>
            <motion.div
                className={`${style.hero__content} container`}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <motion.h1 variants={itemVariants} className={style.hero__title}>
                    {t('hero.title')}
                </motion.h1>

                <motion.p variants={itemVariants} className={style.hero__desc}>
                    {t('hero.description')}
                </motion.p>

                <motion.a
                    variants={itemVariants}
                    href="#projects"
                    className={style.hero__btn}
                >
                    {t('hero.button')}
                </motion.a>

                <motion.div variants={itemVariants} className={style.hero__contacts}>
                    <a href="https://t.me/amp_r3" target="_blank" rel="noreferrer" className={style.hero__links}>
                        <img src={telegramIcon} alt="Telegram" />
                    </a>
                    <a href="https://github.com/amp-r3" target="_blank" rel="noreferrer" className={style.hero__links}>
                        <img src={githubIcon} alt="GitHub" />
                    </a>
                    <a href="https://www.linkedin.com/in/amir-ergashev-96718a396" target="_blank" rel="noreferrer" className={style.hero__links}>
                        <img src={linkedinIcon} alt="LinkedIn" />
                    </a>
                </motion.div>

            </motion.div>
        </section>
    )
}

export default HeroSection