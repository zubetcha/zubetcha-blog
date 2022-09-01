import { useState } from 'react';
import classes from './Header.module.scss';
import { SearchBar } from '../SearchBar';
import { Toggle } from '../Toggle';

export const Header = () => {
    const [isToggle, setIsToggle] = useState(true);
    const onClickThemeToggle = () => {
        setIsToggle((prev) => !prev);
        document.documentElement.setAttribute(
            'data-theme',
            isToggle ? 'light' : 'dark',
        );
    };

    return (
        <div className={classes.container}>
            <SearchBar />
            <Toggle
                status={isToggle ? 'on' : 'off'}
                onClick={onClickThemeToggle}
            />
        </div>
    );
};
