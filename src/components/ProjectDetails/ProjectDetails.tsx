import type { FC } from "react";
import style from './projectDetails.module.scss';
import { externalLinkIcon, githubIcon } from "@/assets/images";
import { useNavigate } from "react-router";
import Badge from "../UI/Badge/Badge";
import { useTranslation } from "react-i18next";
import BenefitCard from "../UI/BenefitCard/BenefitCard";
import type { Project } from "@/data/projectsData";
import { useTheme } from "@/hooks/useTheme";
import BackButton from "../UI/BackButton/BackButton";

interface IProjectDetailsProps {
    project: Project;
}

const ProjectDetails: FC<IProjectDetailsProps> = ({ project }) => {
    const navigate = useNavigate()
    const { t } = useTranslation()
    const { theme } = useTheme()

    const { title, descKey, tools, githubLink, demoLink, image, darkImage, mobileImage, mobileDarkImage, benefits } = project

    const themeImage = theme === 'dark'
        ? (darkImage ?? image ?? null)
        : (image ?? null);

    const mobileThemeImage = theme === 'dark'
        ? (mobileDarkImage ?? mobileImage ?? darkImage ?? image ?? null)
        : (mobileImage ?? image ?? null);

    return (
        <article className={`${style['project-details']} container page-content`}>

            <header className={style['project-details__header']}>
                <BackButton onClick={() => navigate(-1)} ariaLabel="Go back" />
                <span className={style['project-details__category']}>Web App</span>
            </header>

            <div className={style['project-details__content']}>
                <h1 className={style['project-details__title']}>{title}</h1>
                <div className={style['project-details__description-wrapper']}>
                    <p className={style['project-details__description']}>{t(descKey)}</p>
                </div>

                <div className={style['project-details__tools']}>
                    {tools.map((label) => (
                        <Badge key={label} label={label} />
                    ))}
                </div>

                <div className={style['project-details__actions']}>
                    <a
                        href={demoLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`${style['project-details__action']} ${style['project-details__action--primary']}`}
                    >
                        <img src={externalLinkIcon} alt="" aria-hidden="true" />
                        <span>Live Demo</span>
                    </a>
                    <a
                        href={githubLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`${style['project-details__action']} ${style['project-details__action--secondary']}`}
                    >
                        <img src={githubIcon} alt="" aria-hidden="true" />
                        <span>GitHub Repo</span>
                    </a>
                </div>
            </div>

            <div className={style['project-details__media']}>
                <picture>

                    <source
                        media="(max-width: 576px)"
                        srcSet={mobileThemeImage}
                    />

                    <img
                        src={themeImage}
                        alt={`Screenshot of the ${title} project`}
                        className={style['project-details__image']}
                    />
                </picture>
            </div>

            <section className={style['project-details__benefits']}>
                <div className={style['project-details__grid']}>
                    {benefits && benefits.map((item, index) => (
                        <BenefitCard
                            key={index}
                            title={t(item.titleKey)}
                            description={t(item.descKey)}
                            iconSrc={item.icon}
                        />
                    ))}
                </div>
            </section>

        </article>
    );
};

export default ProjectDetails;