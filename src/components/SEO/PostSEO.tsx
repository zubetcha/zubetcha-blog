import Head from 'next/head';
import { getBlogJSONLD } from '@utils/page';
import { BLOG_INFO } from '@constants/blog';
interface Props {
  title: string;
  description: string;
  path: string;
  date: string;
}

export const PostSEO = ({ title, description, path, date }: Props) => {
  const url = BLOG_INFO.baseUrl + path;
  const jsonld = getBlogJSONLD({
    path,
    title,
    description,
    datePublished: new Date(date).toISOString(),
  });

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
      <link rel='canonical' href={url} />
      {Object.keys(jsonld).length > 0 && (
        <script type='application/ld+json'>{JSON.stringify(jsonld)}</script>
      )}
    </Head>
  );
};
