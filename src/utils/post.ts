import fs from 'fs';
import path from 'path';
import { serialize } from 'next-mdx-remote/serialize';
import { sync } from 'glob';

import remarkToc from 'remark-toc';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import remarkMath from 'remark-math';

import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeKatex from 'rehype-katex';
import rehypePrism from 'rehype-prism-plus/.';

const postsDir = path.join(process.cwd(), 'posts');

export const getAllPosts = async () => {
	const fileNames = fs.readdirSync(postsDir);
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
