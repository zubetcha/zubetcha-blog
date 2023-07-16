import type { FrontMatter, HeadingContent } from '@type/post';

import { useRef } from 'react';
import { useWindowSize } from '@hooks/useWindowSize';
import classes from './PostContainer.module.scss';
import { formatDate } from '@utils/date';
import type { NewFrontMatter } from '@type/post';
import { Tag, PostSEO, ToC, Comment } from '@components/index';

interface Props {
  children: React.ReactNode;
  frontMatter: NewFrontMatter;
  slug: string;
  headingList: Array<HeadingContent>;
}

export const PostContainer = ({ children, frontMatter, slug, headingList }: Props) => {
  const { title, date, tags, category, description } = frontMatter;
  const { isMobile } = useWindowSize();
  const formattedDate = formatDate(date);

  const ToCRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <PostSEO title={title} description={description} path={`/${slug}`} date={date} tags={tags} />
      <article>
        <div className={classes.container}>
          <header>
            <div className={classes['tags-wrapper']}>
              {tags.map((tag, i) => (
                <Tag tag={tag} key={`${tag}-${i}`} />
              ))}
            </div>
            <h1>{title}</h1>
            <div className={classes['']}>
              <time dateTime={date} className={classes.createdAt}>
                {formattedDate}
              </time>
            </div>
          </header>
          <div className={classes['content-wrapper']}>
            <div className={classes.content}>
              {children}
              <div className={classes.divider}></div>
              <Comment />
            </div>
            {!isMobile && <ToC headingList={headingList} ref={ToCRef} />}
          </div>
        </div>
      </article>
    </>
  );
};
