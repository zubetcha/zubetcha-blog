import { useTheme } from '../../context/theme';
import classes from './Header.module.scss';

import { SearchBar } from '../SearchBar';
import { Toggle } from '../Toggle';

export const Header = () => {
    const { theme, setTheme } = useTheme();
    const newTheme = theme === 'dark' ? 'light' : 'dark';

    const onClickToggle = () => {
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    };

    return (
        <div className={classes.container}>
            <SearchBar />
            <Toggle status={theme} onClick={onClickToggle} />
        </div>
    );
};
