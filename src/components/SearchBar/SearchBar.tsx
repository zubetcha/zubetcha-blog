import classes from './SearchBar.module.scss';
import { Icon } from '../Elements/Icon/Icon';

export const SearchBar = () => {
  return (
    <div className={classes.container}>
      <input className={classes.textField} />
      <Icon role='search' />
    </div>
  );
};
