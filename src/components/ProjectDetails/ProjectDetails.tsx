import type { FC } from "react";
import style from './projectDetails.module.scss';
import { backIcon } from "@/assets/images";
import { Paths } from "@/Routes/paths";
import { Link } from "react-router";
import Badge from "../UI/Badge/Badge";

interface IProjectDetailsProps {
    title: string;
    desc: string;
    img: string;
    tools: string[];
    link: string;
}

const ProjectDetails: FC<IProjectDetailsProps> = ({ title, desc, img, tools }) => {
    return (
        <article className={`${style['project-details']} container page-content`}>

            <header className={style['project-details__header']}>
                <Link to={Paths.home} className={style['project-details__back-link']} aria-label="Go back">
                    <img src={backIcon} alt="" aria-hidden="true" />
                </Link>
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