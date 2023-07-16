import { useState } from 'react';
import classNames from 'classnames';
import classes from './Select.module.scss';
import { Button } from '../Button';
interface Props {
  children: JSX.Element[];
  defaultLabel: string;
}

export const Select = ({ children, defaultLabel }: Props) => {
  const [open, toggle] = useState(false);

  const onMouseOver = () => toggle(true);
  const onMouseLeave = () => toggle(false);

  return (
    <div className={classes.container}>
      <Button label={defaultLabel} onMouseOver={onMouseOver} onMouseLeave={onMouseLeave} status={open ? 'focused' : undefined} iconRight='dropdown' />
      <ul
        className={classNames(classes['options-wrapper'], {
          [classes.open]: open,
        })}
        onMouseLeave={onMouseLeave}
        onMouseOver={onMouseOver}
      >
        {children}
      </ul>
    </div>
  );
};
