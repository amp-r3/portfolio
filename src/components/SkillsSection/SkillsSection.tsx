import { axiosIcon, cssIcon, figmaIcon, githubIcon, gitIcon, htmlIcon, JSIcon, netlifyIcon, reactIcon, reactRouterIcon, reduxIcon, sassIcon, TSIcon, viteIcon } from '@/assets/images/SkillIcon'

import style from './skills.module.scss'
import SkillCard from './SkillCard'

import Marquee from 'react-fast-marquee'
import { useTranslation } from 'react-i18next'

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



const SkillsSection = () => {
    const { t } = useTranslation()
    
    return (
        <section id='skills' className={style.skills}>
            <div className="container">
                <h1 className={style.skills__title}>{t('skills.title')}</h1>

                <div className={style.skills__content}>

                    <div>
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
                    </div>

                    <div>
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
                    </div>

                </div>
            </div>
        </section>
    )
}

export default SkillsSection