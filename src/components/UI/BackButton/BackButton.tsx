import type { FC } from "react";
import styles from "./backButton.module.scss";

interface IBackButtonProps {
    onClick: () => void;
    ariaLabel?: string;
}

const BackButton: FC<IBackButtonProps> = ({ onClick, ariaLabel = "Go back" }) => {
    return (
        <button
            className={styles.backButton}
            onClick={onClick}
            aria-label={ariaLabel}
            type="button"
        >
            <svg
                viewBox="0 0 1024 1024"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
            >
                <path
                    className={styles.arrowShaft}
                    fill="currentColor"
                    d="M224 480h640a32 32 0 1 1 0 64H224a32 32 0 0 1 0-64z"
                />
                <path
                    className={styles.arrowHead}
                    fill="currentColor"
                    d="m237.248 512 265.408 265.344a32 32 0 0 1-45.312 45.312l-288-288a32 32 0 0 1 0-45.312l288-288a32 32 0 1 1 45.312 45.312L237.248 512z"
                />
            </svg>
        </button>
    )
}

export default BackButton;