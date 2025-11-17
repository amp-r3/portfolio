import type { FC } from "react";
import style from './menuIcon.module.scss'

interface IMenuIconProps {
    isOpen: boolean;
}

const MenuIcon: FC<IMenuIconProps> = ({ isOpen }) => {
    return (
        <svg
            className={style.menuIcon}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <line
                className={`${style.lineTop} ${isOpen ? style.active : ''}`}
                x1="4" y1="6" x2="20" y2="6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <line
                className={`${style.lineMiddle} ${isOpen ? style.active : ''}`}
                x1="4" y1="12" x2="20" y2="12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <line
                className={`${style.lineBottom} ${isOpen ? style.active : ''}`}
                x1="4" y1="18" x2="20" y2="18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    )
}

export default MenuIcon