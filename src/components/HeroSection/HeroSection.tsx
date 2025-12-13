import { useRef } from 'react'
import style from './heroSection.module.scss'
import { useTranslation } from 'react-i18next'
import { motion, useScroll, useTransform } from 'framer-motion'
import type { Variants } from 'framer-motion'
import HeroBackground from './HeroBackground'
import { socialsData } from '@/data/socialsData'

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.12,
            delayChildren: 0.2
        }
    }
}

const heroRevealVariants: Variants = {
    hidden: {
        opacity: 0,
        y: 40,
        filter: 'blur(12px)',
        scale: 0.96
    },
    visible: {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        scale: 1,
        transition: {
            duration: 1.4, 
            ease: [0.22, 1, 0.36, 1] 
        }
    }
}

const HeroSection = () => {
    const { t } = useTranslation()
    const targetRef = useRef<HTMLElement>(null)

    const { scrollYProgress } = useScroll({
        target: targetRef,
        offset: ["start start", "end start"]
    })

    const scale = useTransform(scrollYProgress, [0, 1], [1, 0.9])
    const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"])
    const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])

    return (
        <section ref={targetRef} id='hero' className={style.hero}>
            <motion.div
                className={`${style.hero__content} container`}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                style={{ scale, opacity, y }}
            >
                <motion.h1 variants={heroRevealVariants} className={style.hero__title}>
                    {t('hero.title')}
                </motion.h1>

                <motion.p variants={heroRevealVariants} className={style.hero__desc}>
                    {t('hero.description')}
                </motion.p>

                <motion.div variants={heroRevealVariants}>
                    <a
                        href="#projects"
                        className={style.hero__btn}
                    >
                        {t('hero.button')}
                    </a>
                </motion.div>

                <motion.div variants={heroRevealVariants} className={style.hero__contacts}>
                    <a href={socialsData.telegram.link} target="_blank" rel="noreferrer" className={style.hero__links}>
                        <img src={socialsData.telegram.icon} alt="Telegram" />
                    </a>
                    <a href={socialsData.github.link} target="_blank" rel="noreferrer" className={style.hero__links}>
                        <img src={socialsData.github.icon} alt="GitHub" />
                    </a>
                    <a href={socialsData.linkedin.link} target="_blank" rel="noreferrer" className={style.hero__links}>
                        <img src={socialsData.linkedin.icon} alt="LinkedIn" />
                    </a>
                    <a href={`mailto:${socialsData.email.link}`} className={style.hero__links}>
                        <img src={socialsData.email.icon} alt="Email" />
                    </a>
                </motion.div>
            </motion.div>

            <HeroBackground />
        </section>
    )
}

export default HeroSection