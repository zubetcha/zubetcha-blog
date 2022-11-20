import { useRouter } from 'next/router';
import Head from 'next/head';
import Image from 'next/image';
import classes from './about.module.scss';
import { BLOG_INFO } from '@constants/blog';
import { ContentLayout } from '@components/index';
import Zubetcha from '../../assets/images/zubetcha.jpeg';

const AboutPage = () => {
	const router = useRouter();

	return (
		<>
			<Head>
				<title>{BLOG_INFO.author}</title>
				<meta name='description' content={BLOG_INFO.title} />
			</Head>
			<ContentLayout title='About'>
				<div className={classes.container}>
					<div className={classes['profile-image-wrapper']}>
						<Image src={Zubetcha} className={classes['profile-image']} />
					</div>
					<div className={classes['intro-wrapper']}>
						<p className={classes.intro}>
							I'm zubetcha,
							<br />a web frontend developer.
						</p>
						<p
							onClick={() => router.push('/resume')}
							className={classes.resume}
						>
							view resume
						</p>
					</div>
				</div>
			</ContentLayout>
		</>
	);
};

export default AboutPage;
