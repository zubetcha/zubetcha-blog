import { useEffect } from 'react';
import '../styles/globals.scss';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useRouter } from 'next/router';

import * as gtag from '@utils/gtag';
import { ThemeProvider } from '@context/theme';
import { ExpandedProvider } from '@context/expanded';
import { PageLayout } from '@components/index';

function MyApp({ Component, pageProps }: AppProps) {
	const router = useRouter();
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

	useEffect(() => {
		const handleRouteChange = (url: string) => {
			gtag.pageview(url);
		};
		router.events.on('routeChangeComplete', handleRouteChange);
		router.events.on('hashChangeComplete', handleRouteChange);
		return () => {
			router.events.off('routeChangeComplete', handleRouteChange);
			router.events.off('hashChangeComplete', handleRouteChange);
		};
	}, [router.events]);

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
