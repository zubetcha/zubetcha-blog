import classes from './Tag.module.scss';
import { TagProps } from './Tag.types';
import { Typo } from '../Elements/Typo';

export const Tag = ({ tag, onClick }: TagProps) => {
  return (
    <div className={classes.container} onClick={onClick}>
      <Typo role='label-small'>{tag}</Typo>
    </div>
  );
};
