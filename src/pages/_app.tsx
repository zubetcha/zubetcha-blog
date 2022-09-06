import { useEffect } from 'react';
import '../styles/globals.scss';
import type { AppProps } from 'next/app';

import { ThemeProvider, ExpandedProvider } from '../context';
import { EntireLayout } from '../components/Layout/EntireLayout';

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<ThemeProvider>
			<ExpandedProvider>
				<EntireLayout>
					<Component {...pageProps} />
				</EntireLayout>
			</ExpandedProvider>
		</ThemeProvider>
	);
}

export default MyApp;
