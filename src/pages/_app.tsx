import '../styles/globals.scss';
import type { AppProps } from 'next/app';

import { ThemeProvider, ExpandedProvider } from '../context';
import { PageLayout } from '../components/Layout/PageLayout';

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
