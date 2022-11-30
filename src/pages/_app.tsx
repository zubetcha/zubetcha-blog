import { useEffect } from 'react';
import '../styles/globals.scss';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { RecoilRoot } from 'recoil';

import * as gtag from '@utils/gtag';
import { PageLayout } from '@components/index';
import { EXCLUSION_PATH_LIST } from '@constants/navigation';

function MyApp({ Component, pageProps }: AppProps) {
	const router = useRouter();

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
			<RecoilRoot>
				{EXCLUSION_PATH_LIST.includes(router.asPath) ? (
					<Component {...pageProps} />
				) : (
					<PageLayout>
						<Component {...pageProps} />
					</PageLayout>
				)}
			</RecoilRoot>
		</>
	);
}

export default MyApp;
