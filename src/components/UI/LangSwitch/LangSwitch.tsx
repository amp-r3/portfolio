import { langIcon } from '@/assets/images'
import style from './langSwitch.module.scss'
import { useTranslation } from 'react-i18next'

const languages = ['en', 'ru', 'uz']


const LangSwitch = () => {


    const { t, i18n } = useTranslation()

    const changeLanguage = () => {

        const currentLang = i18n.language
        const currentIndex = languages.indexOf(currentLang)
        const nextIndex = (currentIndex + 1) % languages.length

        const newLang = languages[nextIndex]

        i18n.changeLanguage(newLang)

    }

    return (
        <button onClick={changeLanguage} className={style.Btn}>
            <div className={style.sign}>
                <img src={langIcon} alt="" />
            </div>
            <div className={style.text}>{t('header.lang_switcher')}</div>
        </button>
    )
}

export default LangSwitch