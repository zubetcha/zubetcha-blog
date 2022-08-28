import { NavBar } from '../NavBar/NavBar';
import { Header } from '../Header/Header';

import { LayoutProps } from './Layout.types';

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div>
      <NavBar />
      <Header />
    </div>
  );
};
