import type { NextPage } from 'next';
import Head from 'next/head';
import { Main } from '../components/Main';

const Home: NextPage = () => {
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
