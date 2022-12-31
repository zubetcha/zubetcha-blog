import { useRouter } from 'next/router';
import Head from 'next/head';
import Image from 'next/image';
import classes from './about.module.scss';
import { BLOG_INFO } from '@constants/blog';
import { PageTitleContainer } from '@components/Container';
import Zubetcha from '../../assets/images/zubetcha.jpeg';

const AboutPage = () => {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>{BLOG_INFO.author}</title>
        <meta name='description' content={BLOG_INFO.title} />
      </Head>
      <PageTitleContainer title='About'>
        <div className={classes.container}>
          <div className={classes['profile-image-wrapper']}>
            <Image
              src={Zubetcha}
              className={classes['profile-image']}
              alt='profile-image'
            />
          </div>
          <div className={classes['intro-wrapper']}>
            <p className={classes.intro}>
              I&apos;m zubetcha,
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
      </PageTitleContainer>
    </>
  );
};

export default AboutPage;
