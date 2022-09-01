import classes from './Layout.module.scss';

import { NavBar } from '../NavBar';
import { Header } from '../Header';

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
