import classes from './PostCard.module.scss';
import { Tag, Icon } from '@components/index';
import { Post } from 'src/type/post';
import { formatDate } from '@utils/date';

interface Props {
  post: Post;
  onClick: () => void;
}
export const PostCard = ({ post, onClick }: Props) => {
  const { frontMatter, fields } = post;
  const { tags, title, description, date } = frontMatter;

  return (
    <div className={classes.container} onClick={onClick}>
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
  );
};
