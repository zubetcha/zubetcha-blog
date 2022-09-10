import fs from 'fs';
import path from 'path';
import { serialize } from 'next-mdx-remote/serialize';
import { sync } from 'glob';

import toc from 'remark-toc';
import remarkGfm from 'remark-gfm';

import rehypeAutolinkHeadings from 'rehype-autolink-headings';

const postsDir = path.join(process.cwd(), 'posts');

export const getAllPosts = async () => {
	const fileNames = fs.readdirSync(postsDir);
};

export const parseMdx = async (source: string) => {
	return serialize(source, {
		parseFrontmatter: true,
		mdxOptions: {
			remarkPlugins: [toc, remarkGfm],
			rehypePlugins: [rehypeAutolinkHeadings],
		},
	});
};
