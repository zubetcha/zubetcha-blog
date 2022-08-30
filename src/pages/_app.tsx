import { useEffect } from 'react';
import '../styles/globals.scss';
import type { AppProps } from 'next/app';
import { Layout } from '../components/Layout/Layout';
import { IconContext } from 'react-icons';

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'dark');
  }, []);

  return (
    <IconContext.Provider value={{ className: 'react-icon' }}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </IconContext.Provider>
  );
}

export default MyApp;
