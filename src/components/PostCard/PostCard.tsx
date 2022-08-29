import classes from './PostCard.module.scss';
import { Tag } from '../Tag/Tag';
import { Typo } from '../Elements/Typo/Typo';

export const PostCard = () => {
  return (
    <div className={classes.container}>
      <div className={classes.image_wrapper}></div>
      <div className={classes.contents_wrapper}>
        <div className={classes.tags_wrapper}>
          <Tag tag='javascript' />
          <Tag tag='javascript' />
          <Tag tag='javascript' />
        </div>

        <div>
          <Typo role='title-large' style={{ fontWeight: '700' }}>
            타이틀
          </Typo>
          <Typo>한줄요약</Typo>
        </div>

        <div className={classes.date_wrapper}>
          <Typo role='body-small' style={{ fontStyle: 'selif' }}>
            날짜
          </Typo>
        </div>
      </div>
    </div>
  );
};
