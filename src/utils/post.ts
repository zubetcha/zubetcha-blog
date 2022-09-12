import fs from 'fs';
import path from 'path';
import { serialize } from 'next-mdx-remote/serialize';
import { sync } from 'glob';
import matter from 'gray-matter';

import remarkToc from 'remark-toc';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import remarkMath from 'remark-math';

import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeKatex from 'rehype-katex';
import rehypePrism from 'rehype-prism-plus/.';

import { Post, FrontMatter } from '../types/post';

const DIR_REPLACE_STRING = '/posts';
const postsDir = path.join(process.cwd(), 'posts');

export const getAllPosts = async () => {
	const files = sync(`${postsDir}/**/*.md*`).reverse();

	const posts = files
		.reduce<Post[]>((prev, path) => {
			const file = fs.readFileSync(path, { encoding: 'utf-8' });
			const { data, content } = matter(file);
			const {
				title,
				description,
				date,
				updated,
				published,
				tags: fmTags,
				category,
			} = data as FrontMatter;

			const slug = path
				.slice(path.indexOf(DIR_REPLACE_STRING) + DIR_REPLACE_STRING.length + 1)
				.replace('.mdx', '')
				.replace('.md', '');

			if (published) {
				const tags: string[] = (fmTags || []).map((tag: string) => tag.trim());

				const result: Post = {
					frontMatter: {
						...(data as FrontMatter),
						tags,
						date: new Date(date).toISOString().substring(0, 19),
					},
					content,
					fields: {
						slug,
					},
					path,
				};
				prev.push(result);
			}
			return prev;
		}, [])
		.sort((a, b) => {
			if (a.frontMatter.date < b.frontMatter.date) {
				return 1;
			}
			if (a.frontMatter.date > b.frontMatter.date) {
				return -1;
			}
			return 0;
		});

	return posts;
};

export const parseMdx = async (source: string) => {
	return serialize(source, {
		parseFrontmatter: true,
		mdxOptions: {
			remarkPlugins: [remarkToc, remarkGfm, remarkBreaks, remarkMath],
			rehypePlugins: [rehypeAutolinkHeadings, rehypeKatex, rehypePrism],
		},
	});
};
