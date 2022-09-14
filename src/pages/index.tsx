import type { NextPage } from 'next';
import { GetStaticProps } from 'next';
import { getAllPosts } from '../utils/post';

import Head from 'next/head';
import { Main } from '../components/Main/Main';
import { Typo } from '../components/Elements/Typo/Typo';

const Home: NextPage = ({ posts }) => {
	console.log(posts);
	return (
		<>
			<Head>
				<title>zubetcha</title>
				<meta name='description' content='zubetcha blog' />
				<link rel='icon' href='/favicon.ico' />
			</Head>

			<Main />
		</>
	);
};

export default Home;

export const getStaticProps: GetStaticProps = async () => {
	const allPosts = await getAllPosts();
	return {
		props: { posts: allPosts },
	};
};
