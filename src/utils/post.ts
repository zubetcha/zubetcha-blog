import { serialize } from 'next-mdx-remote/serialize';
import remarkToc from 'remark-toc';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import remarkMath from 'remark-math';

import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeKatex from 'rehype-katex';
import rehypePrism from 'rehype-prism-plus';

export const getLinkContent = (content: string) => {
  return content.replace(/ /g, '_').toLowerCase();
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
