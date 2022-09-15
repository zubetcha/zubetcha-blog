import type { NextPage } from 'next';
import { GetStaticProps } from 'next';
import { getAllPosts } from '../utils/post';

import Head from 'next/head';
import { Main } from '../components/Main/Main';
import { Typo } from '../components/Elements/Typo/Typo';

import { Post } from '../types/post';

const Home = ({ posts }: { posts: Post[] }) => {
	console.log(posts);
	return (
		<>
			<Head>
				<title>zubetcha</title>
				<meta name='description' content='zubetcha blog' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<Main posts={posts} />
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
