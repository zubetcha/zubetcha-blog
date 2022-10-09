import { useEffect } from 'react';
import { useTheme, ThemeUnionType } from '@context/theme';
import { useExpanded } from '@context/expanded';
import classNames from 'classnames';
import classes from './Layout.module.scss';

import { Header, NavBar, Footer } from '..';

interface Props {
	children: JSX.Element[] | JSX.Element;
}

export const PageLayout = ({ children }: Props) => {
	const { theme, setTheme } = useTheme();
	const { expanded } = useExpanded();

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
		<div className={classes.page_container}>
			<NavBar />
			<div
				className={classNames(classes.body, { [classes.expanded]: expanded })}
			>
				<Header />
				{children}
				<Footer />
			</div>
		</div>
	);
};
