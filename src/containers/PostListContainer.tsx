import type { Post } from '@type/post';

import { useRouter } from 'next/router';
import { getUpperCategory } from '@utils/category';
import { formatDate } from '@utils/date';

import classes from './PostListContainer.module.scss';

import type { NewFrontMatter, Category } from '@type/post';
import { Select, PageSEO, Button, PageTitleContainer, Tag, Icon } from '@components/index';

interface Props {
  posts: NewFrontMatter[];
  hasMore: boolean;
  page: number;
  categories: Category[];
  category: Category;
}

export const PostListContainer = ({ posts, hasMore, page, categories, category }: Props) => {
  const router = useRouter();

  const handleCateogryChange = (index: number) => {
    router.push({ query: { ...router.query, category: categories[index] } });
  };

  const handleNextClick = () => {
    router.push({ query: { ...router.query, page: page + 1 } });
  };

  const handlePrevClick = () => {
    router.push({ query: { ...router.query, page: page - 1 } });
  };

  return (
    <>
      <PageSEO title={`${category} ${page}`} description={category} path={router.asPath} />
      <PageTitleContainer title={category}>
        <Select defaultLabel={category}>
          {categories.map((category, i) => (
            <Select.Option key={category} label={category} onClick={() => handleCateogryChange(i)} />
          ))}
        </Select>
        <div className={classes['cards-wrapper']}>
          {posts.map(({ _id, title, description, date, tags, slug }) => (
            <div key={_id} className={classes.container} onClick={() => router.push(`/post/${slug}`)}>
              <div className={classes.wrapper}>
                <div className={classes['tags-wrapper']}>
                  {tags.map((tag) => (
                    <Tag tag={tag} key={tag} />
                  ))}
                </div>
                <div className={classes['contents-wrapper']}>
                  <div className={classes['above-wrapper']}>
                    <h1 className={classes.title}>{title}</h1>
                    <p className={classes.description}>{description}</p>
                  </div>

                  <div className={classes['below-wrapper']}>
                    <div className={classes['readmore-wrapper']}>
                      <p className={classes['readmore']}>read more</p>
                      <Icon role='chevron-right' />
                    </div>
                    <time className={classes.createdAt}>{formatDate(date)}</time>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className={classes['button-wrapper']}>
          <div>{page > 1 && <Button label='Prev' onClick={handlePrevClick} iconLeft='backward' />}</div>
          <div>{hasMore && <Button label='Next' onClick={handleNextClick} iconRight='forward' />}</div>
        </div>
      </PageTitleContainer>
    </>
  );
};
