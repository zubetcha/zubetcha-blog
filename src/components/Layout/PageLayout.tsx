import { useRouter } from 'next/router';
import { useEffect, useRef } from 'react';
import { useTheme, ThemeUnionType } from '@context/theme';
import { useExpanded } from '@context/expanded';
import classNames from 'classnames';
import classes from './Layout.module.scss';

import { Header, NavBar, Footer } from '..';

interface Props {
	children: JSX.Element[] | JSX.Element;
}

export const PageLayout = ({ children }: Props) => {
	const { asPath } = useRouter();
	const { theme, setTheme } = useTheme();
	const { expanded } = useExpanded();

	const container = useRef<HTMLDivElement | null>(null);

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

	useEffect(() => {
		if (!container.current) return;
		container.current.scrollTo({ top: 0 });
	}, [asPath]);

	return (
		<div className={classes.page_container}>
			<NavBar />
			<div
				className={classNames(classes.body, { [classes.expanded]: expanded })}
				ref={container}
			>
				<Header />
				{children}
				<Footer />
			</div>
		</div>
	);
};
