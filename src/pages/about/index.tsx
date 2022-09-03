import classes from './about.module.scss';

import Head from 'next/head';
import Image from 'next/image';
import { Typo } from '../../components/Elements/Typo';

import Zubetcha from '../../assets/images/zubetcha.jpeg';

const AboutPage = () => {
	return (
		<>
			<Head>
				<title>about</title>
				<meta name='description' content='about zubetcha' />
				<link rel='icon' href='/favicon.ico' />
			</Head>

			<div className={classes.container}>
				<Typo role='display-medium' style={{ fontWeight: '700' }}>
					About
				</Typo>
				<div className={classes.contents_wrapper}>
					<div className={classes.profile_image_wrapper}>
						<Image src={Zubetcha} className={classes.profile_image} />
					</div>
					<div className={classes.intro_wrapper}>
						<Typo role='title-small' style={{ fontWeight: '700' }}>
							안녕하세요, <br />
							프론트엔드 개발자 zubetcha 입니다.
						</Typo>
						<Typo>
							동물과 초록색,
							<br /> 산,
							<br /> 떡볶이,
							<br />집
							<br />을 좋아합니다.
						</Typo>
					</div>
				</div>
			</div>
		</>
	);
};

export default AboutPage;
