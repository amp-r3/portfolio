import { useTheme } from '@/hooks/useTheme';
import style from './footerBackground.module.scss';

const FooterBackground = () => {
    const { theme } = useTheme();

    return (
        <div className={style.backgroundContainer}>
            {/* Dark theme layers */}
            <div
                className={`${style.gradientLayer} ${style.darkBase}`}
                style={{ opacity: theme === 'dark' ? 1 : 0 }}
            />
            <div
                className={`${style.gradientLayer} ${style.darkAccent}`}
                style={{ opacity: theme === 'dark' ? 1 : 0 }}
            />

            {/* Light theme layers */}
            <div
                className={`${style.gradientLayer} ${style.lightBase}`}
                style={{ opacity: theme === 'light' ? 1 : 0 }}
            />
            <div
                className={`${style.gradientLayer} ${style.lightAccent}`}
                style={{ opacity: theme === 'light' ? 1 : 0 }}
            />
        </div>
    );
};

export default FooterBackground;