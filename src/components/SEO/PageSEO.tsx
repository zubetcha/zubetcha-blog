import Head from 'next/head';
import { BLOG_INFO } from '@constants/blogInfo';

interface Props {
	title: string;
	description: string;
	path: string;
}
export const PageSEO = ({ title, description, path }: Props) => {
	const url = BLOG_INFO.baseUrl + path;

	return (
		<Head>
			<title>{`${title} - ${BLOG_INFO.author}`}</title>
			<meta name='description' content={description} />
			<meta property='og:title' content={title} />
			<meta property='og:description' content={description} />
			<meta property='og:type' content='article' />
			<meta property='og:url' content={url} />
			<meta property='og:image' content={BLOG_INFO.image} />
			<meta property='og:article:author' content={BLOG_INFO.author} />
			<meta property='twitter:card' content='summary' />
			<meta property='twitter:title' content={title} />
			<meta property='twitter:description' content={description} />
			<meta property='twitter:image' content={BLOG_INFO.image} />
		</Head>
	);
};
