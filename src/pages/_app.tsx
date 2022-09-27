import '../styles/globals.scss';
import type { AppProps } from 'next/app';

import { ThemeProvider } from '@context/theme';
import { ExpandedProvider } from '@context/expanded';
import { PageLayout } from '@components/index';

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<ThemeProvider>
			<ExpandedProvider>
				<PageLayout>
					<Component {...pageProps} />
				</PageLayout>
			</ExpandedProvider>
		</ThemeProvider>
	);
}

export default MyApp;
