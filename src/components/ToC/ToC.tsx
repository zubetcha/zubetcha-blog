import { forwardRef } from 'react';
import { HeadingContent } from '@type/post';
import classes from './ToC.module.scss';

interface Props {
  headingList: Array<HeadingContent>;
}
type Ref = HTMLDivElement;

export const ToC = forwardRef<Ref, Props>(({ headingList }, ref) => {
  return (
    <div className={classes.ToC} ref={ref}>
      <ul>
        {headingList.map(({ link, text, className }) => {
          return (
            <li className={classes[className]} key={text}>
              <a href={link}>{text}</a>
            </li>
          );
        })}
      </ul>
    </div>
  );
});

ToC.displayName = 'ToC';
