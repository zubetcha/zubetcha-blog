import Image from 'next/image';
import classes from './NavBar.module.scss';
import Profile from '../../assets/images/profile.jpeg';
import { IconRoleUnionType } from '../Elements/Icon/Icon.types';

import { Icon } from '../Elements/Icon/Icon';
import { Typo } from '../Elements/Typo/Typo';
import { NavItem } from './NavItem';

export const NavBar = () => {
  const navList = [
    'About',
    'HTML',
    'CSS',
    'Javascript',
    'Typescript',
    'React',
    'GraphQL',
  ];

  const navItems = navList.map((navItem, i) => {
    return {
      name: navItem,
      icon: navItem.toLowerCase() as IconRoleUnionType,
      path: i === 0 ? '/about' : `posts/${navItem.toLowerCase()}`,
      isFocused: false,
    };
  });

  return (
    <div className={classes.container}>
      <div className={classes.menuIcon_wrapper}>
        <Icon role='menu-fold' />
      </div>
      <div className={classes.profile_wrapper}>
        <Image
          src={Profile}
          width={160}
          height={160}
          className={classes.profile_image}
        />
        <div className={classes.profile_info_wrapper}>
          <Typo role='title-medium'>zubetcha</Typo>
          <Typo role='body-small'>Web Frontend Developer</Typo>
        </div>
        <div className={classes.profile_contacts_wrapper}>
          <Icon role='github' />
          <Icon role='linkedIn' />
          <Icon role='twitter' />
          <Icon role='email' />
        </div>
      </div>
      <div className={classes.navItems_wrapper}>
        {navItems.map((navItem) => {
          return <NavItem key={navItem.name} {...navItem} />;
        })}
      </div>
      <div className={classes.footer_container}>
        <Typo>© 2022 zubetcha.</Typo>
        <Typo>All Rights Reserved.</Typo>
      </div>
    </div>
  );
};
