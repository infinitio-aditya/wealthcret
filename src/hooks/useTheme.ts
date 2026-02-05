import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { getThemeById } from '../theme/themes';

export const useTheme = () => {
    const currentTheme = useSelector((state: RootState) => state.theme.currentTheme);
    const theme = getThemeById(currentTheme);
    return theme;
};
