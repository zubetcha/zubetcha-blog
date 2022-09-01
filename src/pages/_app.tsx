import { useEffect } from 'react';
import '../styles/globals.scss';
import type { AppProps } from 'next/app';

import { ThemeProvider } from '../context/ThemeContext';
import { Layout } from '../components/Layout';

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<ThemeProvider>
			<Layout>
				<Component {...pageProps} />
			</Layout>
		</ThemeProvider>
	);
}

export default MyApp;
