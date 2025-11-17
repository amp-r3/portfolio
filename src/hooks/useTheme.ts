import { ThemeContext } from '@/context/themeDefinition';
import { useContext } from 'react';


export const useTheme = () => {
    const context = useContext(ThemeContext);

    if (context === undefined) {
        throw new Error('useTheme должен использоваться внутри ThemeProvider');
    }

    return context;
};