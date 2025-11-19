import { useTheme } from '@/hooks/useTheme';
import style from './background.module.scss';

const Background = () => {
    const { theme } = useTheme();

    return (
        <div className={style.backgroundContainer}>
            <div 
                className={`${style.gradientLayer} ${style.darkLayer}`}
                style={{ opacity: theme === 'dark' ? 1 : 0 }} 
            />
            <div 
                className={`${style.gradientLayer} ${style.lightLayer}`}
                style={{ opacity: theme === 'light' ? 1 : 0 }}
            />
        </div>
    );
};

export default Background;