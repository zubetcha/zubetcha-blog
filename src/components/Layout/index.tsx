import { useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import classes from './Layout.module.scss';

import { NavBar } from '../NavBar';
import { Header } from '../Header';

import { LayoutProps } from './Layout.types';

export const Layout = ({ children }: LayoutProps) => {
	const { theme } = useTheme();

	useEffect(() => {
		document.documentElement.setAttribute('data-theme', theme);
	}, [theme]);

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
