import { axiosIcon, cssIcon, figmaIcon, githubIcon, gitIcon, htmlIcon, JSIcon, netlifyIcon, reactIcon, reactRouterIcon, reduxIcon, sassIcon, TSIcon, viteIcon } from '@/assets/images/SkillIcon'

import style from './skills.module.scss'
import SkillCard from './SkillCard'

import Marquee from 'react-fast-marquee'
import { useTranslation } from 'react-i18next'

const row1 = [
    { label: 'React',        icon: reactIcon,       glowColor: 'rgba(97, 218, 251, 0.6)'  },
    { label: 'TypeScript',   icon: TSIcon,           glowColor: 'rgba(49, 120, 198, 0.6)'  },
    { label: 'Redux',        icon: reduxIcon,        glowColor: 'rgba(118, 74, 188, 0.6)'  },
    { label: 'React Router', icon: reactRouterIcon,  glowColor: 'rgba(202, 66, 69, 0.6)'   },
    { label: 'Axios',        icon: axiosIcon,        glowColor: 'rgba(90, 41, 228, 0.6)'   },
    { label: 'Git',          icon: gitIcon,          glowColor: 'rgba(240, 80, 50, 0.6)'   },
    { label: 'GitHub',       icon: githubIcon,       glowColor: 'rgba(180, 180, 180, 0.5)' },
]

const row2 = [
    { label: 'HTML',       icon: htmlIcon,    glowColor: 'rgba(227, 79, 38, 0.6)'   },
    { label: 'CSS',        icon: cssIcon,     glowColor: 'rgba(21, 114, 182, 0.6)'  },
    { label: 'SCSS',       icon: sassIcon,    glowColor: 'rgba(204, 102, 153, 0.6)' },
    { label: 'JavaScript', icon: JSIcon,      glowColor: 'rgba(247, 223, 30, 0.55)' },
    { label: 'Vite',       icon: viteIcon,    glowColor: 'rgba(100, 108, 255, 0.6)' },
    { label: 'Figma',      icon: figmaIcon,   glowColor: 'rgba(242, 78, 30, 0.6)'   },
    { label: 'Netlify',    icon: netlifyIcon, glowColor: 'rgba(0, 199, 183, 0.6)'   },
]

const SkillsSection = () => {
    const { t } = useTranslation()

    return (
        <section id='skills' className={style.skills}>
            <div className="container">
                <h1 className={style.skills__title}>{t('skills.title')}</h1>

                <div className={style.skills__content}>
                    <div className={style.skills__row}>
                        <Marquee gradient={false} speed={50} pauseOnHover={true} style={{'minWidth': 'none'} as React.CSSProperties}>
                            {row1.map((elem) => (
                                <div key={elem.label} className={style.skills__item}>
                                    <SkillCard icon={elem.icon} label={elem.label} glowColor={elem.glowColor} />
                                </div>
                            ))}
                        </Marquee>
                    </div>

                    <div className={style.skills__row}>
                        <Marquee direction="right" gradient={false} speed={45} pauseOnHover={true}>
                            {row2.map((elem) => (
                                <div key={elem.label} className={style.skills__item}>
                                    <SkillCard icon={elem.icon} label={elem.label} glowColor={elem.glowColor} />
                                </div>
                            ))}
                        </Marquee>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default SkillsSection