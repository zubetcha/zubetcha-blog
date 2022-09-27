import { useEffect } from 'react';
import { useTheme } from '../../context/theme';
import { useExpanded } from '../../context';
import classNames from 'classnames';
import classes from './Layout.module.scss';

import { ThemeUnionType } from '../../context/theme/theme.types';

import { NavBar } from '../NavBar/NavBar';
import { Header } from '../Header/Header';

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
			</div>
		</div>
	);
};
