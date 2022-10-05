import '../styles/globals.scss';
import type { AppProps } from 'next/app';
import Head from 'next/head';

import { ThemeProvider } from '@context/theme';
import { ExpandedProvider } from '@context/expanded';
import { PageLayout } from '@components/index';

function MyApp({ Component, pageProps }: AppProps) {
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
