import { useTheme } from '@/hooks/useTheme';
import style from './background.module.scss';

const Background = () => {
    const { theme } = useTheme();

    return (
        <div className={style.backgroundContainer}>
            {/* Dark theme layers */}
            <div
                className={`${style.gradientLayer} ${style.darkBase}`}
                style={{ opacity: theme === 'dark' ? 1 : 0 }}
            />
            <div
                className={`${style.gradientLayer} ${style.darkAccent1}`}
                style={{ opacity: theme === 'dark' ? 1 : 0 }}
            />
            <div
                className={`${style.gradientLayer} ${style.darkAccent2}`}
                style={{ opacity: theme === 'dark' ? 1 : 0 }}
            />

            {/* Light theme layers */}
            <div
                className={`${style.gradientLayer} ${style.lightBase}`}
                style={{ opacity: theme === 'light' ? 1 : 0 }}
            />
            <div
                className={`${style.gradientLayer} ${style.lightAccent1}`}
                style={{ opacity: theme === 'light' ? 1 : 0 }}
            />
            <div
                className={`${style.gradientLayer} ${style.lightAccent2}`}
                style={{ opacity: theme === 'light' ? 1 : 0 }}
            />
        </div>
    );
};

export default Background;