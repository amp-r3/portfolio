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
            staggerChildren: 0.15,
            delayChildren: 0.1
        }
    }
}

const titleVariants: Variants = {
    hidden: {
        opacity: 0,
        y: 30,
        filter: 'blur(12px)',
        scale: 0.9
    },
    visible: {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        scale: 1,
        transition: {
            type: 'spring',
            damping: 25,
            stiffness: 100
        }
    }
}

const itemVariants: Variants = {
    hidden: {
        opacity: 0,
        y: 20,
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
            damping: 20,
            stiffness: 100
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
                <motion.h1 variants={titleVariants} className={style.hero__title}>
                    {t('hero.title')}
                </motion.h1>

                <motion.p variants={itemVariants} className={style.hero__desc}>
                    {t('hero.description')}
                </motion.p>

                <motion.a
                    variants={itemVariants}
                    href="#projects"
                    className={style.hero__btn}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
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