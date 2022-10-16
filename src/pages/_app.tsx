import { useEffect } from 'react';
import '../styles/globals.scss';
import type { AppProps } from 'next/app';
import Head from 'next/head';

import { ThemeProvider } from '@context/theme';
import { ExpandedProvider } from '@context/expanded';
import { PageLayout } from '@components/index';

function MyApp({ Component, pageProps }: AppProps) {
	useEffect(() => {
		const setVhProperty = () => {
			let vh = window.innerHeight * 0.01;
			document.documentElement.style.setProperty('--vh', `${vh}px`);
		};

		setVhProperty();
		window.addEventListener('resize', setVhProperty);

		return () => {
			window.removeEventListener('resize', setVhProperty);
		};
	}, []);

	return (
		<>
			<Head>
				<meta name='viewport' content='initial-scale=1.0, width=device-width' />
			</Head>
			<ThemeProvider>
				<ExpandedProvider>
					<PageLayout>
						<Component {...pageProps} />
					</PageLayout>
				</ExpandedProvider>
			</ThemeProvider>
		</>
	);
}

export default MyApp;
