import { useEffect } from 'react';
import { useTheme } from '../../context/theme';
import classes from './Layout.module.scss';

import { ThemeUnionType } from '../../context/theme/theme.types';

import { NavBar } from '../NavBar';
import { Header } from '../Header';

import { LayoutProps } from './Layout.types';

export const Layout = ({ children }: LayoutProps) => {
    const { theme, setTheme } = useTheme();

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    useEffect(() => {
        const newTheme = localStorage.getItem('theme');

        if (newTheme) {
            setTheme(newTheme as ThemeUnionType);
        }
        document.documentElement.setAttribute('data-theme', newTheme || theme);
    }, []);

    return (
        <div className={classes.container}>
            <NavBar />
            <div className={classes.body}>
                <Header />
                {children}
            </div>
        </div>
    );
};
