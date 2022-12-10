import classNames from 'classnames';
import classes from './Toggle.module.scss';

interface Props {
  status: 'on' | 'off';
  onClick: () => void;
}

export const Toggle = ({ status, onClick }: Props) => {
  return (
    <div
      className={classNames(classes.container, classes[status])}
      onClick={onClick}
    >
      <div className={classes.toggle_bar}>
        <div className={classes.handler}></div>
      </div>
    </div>
  );
};
