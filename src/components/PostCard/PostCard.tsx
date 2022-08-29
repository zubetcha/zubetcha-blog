import classes from './PostCard.module.scss';
import { Tag } from '../Tag/Tag';

export const PostCard = () => {
  return (
    <div className={classes.container}>
      <div>이미지</div>
      <div>
        <Tag tag='javascript' />
      </div>
    </div>
  );
};
