import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useTranslation } from 'react-i18next'
import style from './langSwitch.module.scss'

const languages = ['en', 'ru', 'uz']

const LangSwitch = () => {
    const { i18n } = useTranslation()
    const [currentLang, setCurrentLang] = useState(i18n.language || 'en')

    useEffect(() => {
        setCurrentLang(i18n.language)
    }, [i18n.language])

    const changeLanguage = () => {
        const currentIndex = languages.indexOf(currentLang)
        const nextIndex = (currentIndex + 1) % languages.length
        const newLang = languages[nextIndex]
        
        setCurrentLang(newLang)
        i18n.changeLanguage(newLang)
    }

    const variants = {
        initial: { 
            opacity: 0,
            y: -20,
            scale: 0.8,
            rotateX: -90,
            filter: 'blur(4px)'
        },
        animate: { 
            opacity: 1,
            y: 0,
            scale: 1,
            rotateX: 0,
            filter: 'blur(0px)'
        },
        exit: { 
            opacity: 0,
            y: 20,
            scale: 0.8,
            rotateX: 90,
            filter: 'blur(4px)'
        }
    }

    return (
        <button onClick={changeLanguage} className={style.Btn} aria-label="Change language">
            <div className={style.contentContainer}>
                <AnimatePresence mode='wait'>
                    <motion.span
                        key={currentLang}
                        variants={variants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={{ 
                            duration: 0.12,
                            ease: [0.34, 1.56, 0.64, 1]
                        }}
                        className={style.langText}
                    >
                        {currentLang.toUpperCase()}
                    </motion.span>
                </AnimatePresence>
            </div>
        </button>
    )
}

export default LangSwitch