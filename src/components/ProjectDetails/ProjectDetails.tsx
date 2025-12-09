import type { FC } from "react";
import style from './projectDetails.module.scss';
import { backIcon, externalLinkIcon, githubIcon } from "@/assets/images";
import { useNavigate } from "react-router";
import Badge from "../UI/Badge/Badge";

interface IProjectDetailsProps {
    title: string;
    desc: string;
    img: string;
    tools: string[];
    demoLink: string;
    githubLink: string;
}

const ProjectDetails: FC<IProjectDetailsProps> = ({ title, desc, img, tools, demoLink, githubLink }) => {
    const navigate = useNavigate()
    return (
        <article className={`${style['project-details']} container page-content`}>

            <header className={style['project-details__header']}>
                <button onClick={()=> navigate(-1)} className={style['project-details__back-link']} aria-label="Go back">
                    <img src={backIcon} alt="" aria-hidden="true" />
                </button>
                <span className={style['project-details__category']}>Web App</span>
            </header>

            <div className={style['project-details__content']}>
                <h1 className={style['project-details__title']}>{title}</h1>
                <p className={style['project-details__description']}>{desc}</p>

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
                <img
                    src={img}
                    alt={`Screenshot of the ${title} project`}
                    className={style['project-details__image']}
                />
            </div>

        </article>
    );
};

export default ProjectDetails;