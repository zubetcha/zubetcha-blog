import { useEffect } from 'react';
import '../styles/globals.scss';
import type { AppProps } from 'next/app';

import { ThemeProvider, ExpandedProvider } from '../context';
import { Layout } from '../components/Layout';

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <ThemeProvider>
            <ExpandedProvider>
                <Layout>
                    <Component {...pageProps} />
                </Layout>
            </ExpandedProvider>
        </ThemeProvider>
    );
}

export default MyApp;
