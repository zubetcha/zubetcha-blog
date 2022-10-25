import { Html, Head, Main, NextScript } from 'next/document';
import { GA_TRACKING_ID } from '@utils/gtag';

export default function Document() {
	return (
		<Html>
			<Head>
				<meta charSet='utf-8'></meta>
				<meta name='mobile-web-app-capable' content='yes'></meta>
				<meta name='apple-mobile-web-app-title' content='zubetcha blog'></meta>
				<meta name='apple-mobile-web-app-capable' content='yes'></meta>
				<meta
					name='apple-mobile-web-app-status-bar-style'
					content='black-translucent'
				></meta>
				<link rel='manifest' href='/manifest.json'></link>
				<meta property='og:type' content='blog' />
				<meta property='og:locale' content='ko_KR' />
				<link
					rel='apple-touch-icon'
					sizes='57x57'
					href='/apple-icon-57x57.png'
				></link>
				<link
					rel='apple-touch-icon'
					sizes='60x60'
					href='/apple-icon-60x60.png'
				></link>
				<link
					rel='apple-touch-icon'
					sizes='72x72'
					href='/apple-icon-72x72.png'
				></link>
				<link
					rel='apple-touch-icon'
					sizes='76x76'
					href='/apple-icon-76x76.png'
				></link>
				<link
					rel='apple-touch-icon'
					sizes='114x114'
					href='/apple-icon-114x114.png'
				></link>
				<link
					rel='apple-touch-icon'
					sizes='120x120'
					href='/apple-icon-120x120.png'
				></link>
				<link
					rel='apple-touch-icon'
					sizes='144x144'
					href='/apple-icon-144x144.png'
				></link>
				<link
					rel='apple-touch-icon'
					sizes='152x152'
					href='/apple-icon-152x152.png'
				></link>
				<link
					rel='apple-touch-icon'
					sizes='180x180'
					href='/apple-icon-180x180.png'
				></link>
				<link
					rel='icon'
					type='image/png'
					sizes='192x192'
					href='/android-icon-192x192.png'
				></link>
				<link
					rel='icon'
					type='image/png'
					sizes='32x32'
					href='/favicon-32x32.png'
				></link>
				<link
					rel='icon'
					type='image/png'
					sizes='96x96'
					href='/favicon-96x96.png'
				></link>
				<link
					rel='icon'
					type='image/png'
					sizes='16x16'
					href='/favicon-16x16.png'
				></link>
				<meta name='msapplication-TileColor' content='#ffffff'></meta>
				<meta
					name='msapplication-TileImage'
					content='/ms-icon-144x144.png'
				></meta>
				<meta name='theme-color' content='#ffffff'></meta>
			</Head>
			<body>
				<Main />
				<NextScript />
				<script
					async
					src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
				/>
				<script
					dangerouslySetInnerHTML={{
						__html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', '${GA_TRACKING_ID}', {
              page_path: window.location.pathname,
            });
          `,
					}}
				/>
			</body>
		</Html>
	);
}
