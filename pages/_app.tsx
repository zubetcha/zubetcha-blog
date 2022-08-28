import { useEffect } from 'react';
import '../styles/globals.scss';
import type { AppProps } from 'next/app'

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "light");
  }, []);

  return <Component {...pageProps} />
}

export default MyApp
