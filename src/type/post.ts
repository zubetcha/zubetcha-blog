export interface FrontMatter {
  title: string;
  category: string;
  tags: string[];
  published: boolean;
  date: string;
  updated: string;
  description: string;
}

export interface Post {
  fields: {
    slug: string;
  };
  frontMatter: FrontMatter;
  content: string;
  path: string;
}

export interface HeadingContent {
  text: string;
  link: string;
  className: string;
}
