import Head from 'next/head';
import { NextSeo, ArticleJsonLd } from 'next-seo';
import { BLOG_INFO } from '@constants/blog';

import type { NextSeoProps, ArticleJsonLdProps } from 'next-seo';

interface Props {
  title: string;
  description: string;
  path: string;
  date: string;
  tags: string[];
}

export const PostSEO = ({ title, description, path, date, tags }: Props) => {
  const { author, baseUrl } = BLOG_INFO;
  const publishedAt = new Date(date).toISOString();
  const modifiedAt = new Date(date).toISOString();
  const url = baseUrl + path;

  const seoProps: NextSeoProps = {
    title: `${title} - ${author}`,
    description,
    canonical: url,
    openGraph: {
      type: 'article',
      url,
      title,
      description,
      article: {
        publishedTime: publishedAt,
        modifiedTime: modifiedAt,
        authors: [`${BLOG_INFO.baseUrl}/about`],
        tags,
      },
    },
    additionalMetaTags: [],
  };

  const jsonLdProps: ArticleJsonLdProps = {
    authorName: author,
    dateModified: modifiedAt,
    datePublished: publishedAt,
    description,
    images: [],
    publisherName: author,
    title,
    url,
  };

  return (
    <>
      <NextSeo {...seoProps} />
      <ArticleJsonLd {...jsonLdProps} />
    </>
  );
};
