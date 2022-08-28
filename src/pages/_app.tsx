import { useEffect } from 'react';
import '../styles/globals.scss';
import type { AppProps } from 'next/app';
import { Layout } from '../components/Layout/Layout';

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'dark');
  }, []);

  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp;
