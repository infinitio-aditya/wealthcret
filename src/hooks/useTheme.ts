import { useThemeContext } from '../context/ThemeContext';

export const useTheme = () => {
    const { theme } = useThemeContext();
    return theme;
};
