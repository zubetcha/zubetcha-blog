import { useState } from 'react';
import classes from './Header.module.scss';
import { Icon } from '../Elements/Icon/Icon';
import { SearchBar } from '../SearchBar/SearchBar';
import { Toggle } from '../Toggle/Toggle';

export const Header = () => {
  const [isToggle, setIsToggle] = useState(true);
  const onClickThemeToggle = () => {
    setIsToggle((prev) => !prev);
  };
  return (
    <div className={classes.container}>
      <SearchBar />
      <Toggle status={isToggle ? 'on' : 'off'} onClick={onClickThemeToggle} />
    </div>
  );
};
