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

export type Category = string;

export type NewFrontMatter = {
  author: string;
  category: string;
  date: string;
  description: string;
  published: boolean;
  slug: string;
  tags: string[];
  title: string;
  updatedDate: string;
  url: string;
  __v: number;
  _id: string;
};
