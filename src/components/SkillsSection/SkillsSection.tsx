import { axiosIcon, cssIcon, figmaIcon, githubIcon, gitIcon, htmlIcon, JSIcon, netlifyIcon, reactIcon, reactRouterIcon, reduxIcon, sassIcon, TSIcon, viteIcon } from '@/assets/images/SkillIcon'

import style from './skills.module.scss'
import SkillCard from './SkillCard'

import Marquee from 'react-fast-marquee'
import { useTranslation } from 'react-i18next'

import type { Variants } from 'framer-motion'
import { motion } from 'framer-motion'

const row1 = [
    { label: 'React', icon: reactIcon },
    { label: 'TypeScript', icon: TSIcon },
    { label: 'Redux', icon: reduxIcon },
    { label: 'React Router', icon: reactRouterIcon },
    { label: 'Axios', icon: axiosIcon },
    { label: 'GIt', icon: gitIcon },
    { label: 'GIthub', icon: githubIcon },
]

const row2 = [
    { label: 'HTML', icon: htmlIcon },
    { label: 'CSS', icon: cssIcon },
    { label: 'SCSS', icon: sassIcon },
    { label: 'JavaScript', icon: JSIcon },
    { label: 'Vite', icon: viteIcon },
    { label: 'Figma', icon: figmaIcon },
    { label: 'Netlify', icon: netlifyIcon },
]

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
        y: 20,
        filter: 'blur(10px)',
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
const rowVariants: Variants = {
    hidden: { 
        opacity: 0, 
        y: 40,
        scale: 0.9,
        filter: 'blur(5px)' 
    },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        filter: 'blur(0px)',
        transition: {
            type: 'spring',
            damping: 20,
            stiffness: 90,
            mass: 0.8
        }
    }
}

const SkillsSection = () => {
    const { t } = useTranslation()
    
    return (
        <section id='skills' className={style.skills}>
            <motion.div
                className="container"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3, margin: "-50px" }}
            >
                <motion.h1 variants={titleVariants} className={style.skills__title}>
                    {t('skills.title')}
                </motion.h1>

                <div className={style.skills__content}>

                    <motion.div variants={rowVariants}>
                        <Marquee
                            gradient={false}
                            speed={50}
                            pauseOnHover={true}
                        >
                            {row1.map((elem) => (
                                <div
                                    key={elem.label}
                                    style={{ marginRight: '30px' }}
                                >
                                    <SkillCard icon={elem.icon} label={elem.label} />
                                </div>
                            ))}
                        </Marquee>
                    </motion.div>

                    <motion.div variants={rowVariants}>
                        <Marquee
                            direction="right"
                            gradient={false}
                            speed={45}
                            pauseOnHover={true}
                        >
                            {row2.map((elem) => (
                                <div
                                    key={elem.label}
                                    style={{ marginRight: '30px' }}
                                >
                                    <SkillCard icon={elem.icon} label={elem.label} />
                                </div>
                            ))}
                        </Marquee>
                    </motion.div>

                </div>
            </motion.div>
        </section>
    )
}

export default SkillsSection