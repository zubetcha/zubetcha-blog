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

        <div className={classes.typos_wrapper}>
          <Typo role='headline-small' style={{ fontWeight: '700' }}>
            타이틀
          </Typo>
          <Typo role='body-large'>한줄요약</Typo>
        </div>

        <div className={classes.date_wrapper}>
          <Typo role='body-small' style={{ fontStyle: 'selif' }}>
            last modified: 날짜
          </Typo>
          <div>
            <Typo>read more</Typo>
          </div>
        </div>
      </div>
    </div>
  );
};
