import classNames from 'classnames';
import classes from './Toggle.module.scss';
import { ToggleProps } from './Toggle.types';

export const Toggle = ({ status, onClick }: ToggleProps) => {
  return (
    <div className={classNames(classes.container, classes[status])}>
      <div className={classes.handler} onClick={onClick}></div>
    </div>
  );
};
