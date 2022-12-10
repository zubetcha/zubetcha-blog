import { forwardRef } from 'react';
import classes from './Layout.module.scss';

interface Props {
  children: JSX.Element[] | JSX.Element;
  title: string;
}

export const ContentLayout = ({ children, title }: Props) => {
  return (
    <div className={classes['content-container']}>
      <div className={classes['content-wrapper']}>
        <p className={classes.title}>{title}</p>
        {children}
      </div>
    </div>
  );
};
