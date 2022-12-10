import fs from 'fs';
import path from 'path';
import { serialize } from 'next-mdx-remote/serialize';
import { sync } from 'glob';
import matter from 'gray-matter';
import { visit } from 'unist-util-visit';

import remarkToc from 'remark-toc';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import remarkMath from 'remark-math';

import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeKatex from 'rehype-katex';
import rehypePrism from 'rehype-prism-plus';

import { Post, FrontMatter } from '../type/post';

const DIR_REPLACE_STRING = '/posts';
const postsDir = path.join(process.cwd(), 'posts');

export const getAllPosts = async () => {
  const files = sync(`${postsDir}/**/*.md*`).reverse();

  const posts = files
    .reduce<Post[]>((prev, path) => {
      const file = fs.readFileSync(path, { encoding: 'utf-8' });
      const { data, content } = matter(file);

      const slug = path
        .slice(path.indexOf(DIR_REPLACE_STRING) + DIR_REPLACE_STRING.length + 1)
        .replace('.mdx', '')
        .replace('.md', '');

      if (data.published) {
        const tags: string[] = (data.tags || []).map((tag: string) =>
          tag.trim(),
        );

        const result: Post = {
          frontMatter: {
            ...(data as FrontMatter),
            tags,
            date: new Date(data.date).toString(),
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
      return (
        new Date(b.frontMatter.date).getTime() -
        new Date(a.frontMatter.date).getTime()
      );
    });

  return posts;
};

export const getLinkContent = (content: string) => {
  return content.replace(/ /g, '_').toLowerCase();
};

const setAriaLabelToHeading = () => {
  return (tree: Node) => {
    visit(tree as any, 'element', (node: any) => {
      const headingTagList = ['h1', 'h2', 'h3'];
      const tagName = node.tagName || '';

      if (headingTagList.includes(tagName)) {
        node.properties.ariaLabel = getLinkContent(node.children[0].value);
      }
    });
  };
};

export const parseMdx = async (source: string) => {
  return serialize(source, {
    parseFrontmatter: true,
    mdxOptions: {
      remarkPlugins: [remarkGfm, remarkBreaks, remarkMath],
      rehypePlugins: [
        rehypeAutolinkHeadings,
        rehypeKatex,
        rehypePrism,
        // setAriaLabelToHeading,
      ],
    },
  });
};
