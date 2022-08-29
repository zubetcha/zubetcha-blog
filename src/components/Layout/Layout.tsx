import classes from './Layout.module.scss';

import { NavBar } from '../NavBar/NavBar';
import { Header } from '../Header/Header';

import { LayoutProps } from './Layout.types';

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className={classes.container}>
      <NavBar />
      <div className={classes.body}>
        <Header />
        {children}
      </div>
    </div>
  );
};
