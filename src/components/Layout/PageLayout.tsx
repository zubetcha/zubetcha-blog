import { useRouter } from 'next/router';
import { useEffect, useRef } from 'react';
import { useTheme } from '@recoil/theme';
import { useExpandedValue } from '@recoil/expanded';
import classNames from 'classnames';
import classes from './Layout.module.scss';

import { Header, NavBar, Footer } from '..';

interface Props {
	children: JSX.Element[] | JSX.Element;
}

export const PageLayout = ({ children }: Props) => {
	const { asPath } = useRouter();
	const [theme, setTheme] = useTheme();
	const expanded = useExpandedValue();

	const container = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		if (!theme) return;

		document.documentElement.setAttribute('data-theme', theme);
	}, [theme]);

	useEffect(() => {
		if (!window.matchMedia || theme) return;

		const preferredTheme = window.matchMedia('(prefers-color-scheme: Dark)')
			.matches
			? 'dark'
			: 'light';

		document.documentElement.setAttribute('data-theme', preferredTheme);
		setTheme(preferredTheme);
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
