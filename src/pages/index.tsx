import type { NextPage } from 'next';
import Head from 'next/head';
import { PostCard } from '../components/PostCard';
import { Typo } from '../components/Elements/Typo';

const Home: NextPage = () => {
	return (
		<>
			<Head>
				<title>zubetcha</title>
				<meta name='description' content='zubetcha blog' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<Typo role='display-medium' style={{ fontWeight: '700' }}>
				All Posts
			</Typo>
			<div>
				<div>divider</div>
				<div>드롭다운: 태그, 최신순</div>
				<PostCard />
			</div>
		</>
	);
};

export default Home;
