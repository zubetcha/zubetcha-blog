import classes from './SearchBar.module.scss';
import { Icon } from '@components/index';

export const SearchBar = () => {
  return (
    <div className={classes.container}>
      <input className={classes.textField} placeholder='search' />
      <Icon role='search' />
    </div>
  );
};
