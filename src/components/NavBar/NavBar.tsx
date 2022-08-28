import Image from 'next/image';
import classes from './NavBar.module.scss';
import Profile from '../../assets/images/profile.jpeg';

import { IoLogoGithub, IoLogoTwitter, IoLogoLinkedin } from 'react-icons/io';
import { MdOutlineEmail } from 'react-icons/md';
import { RiMenuFoldLine, RiMenuUnfoldLine } from 'react-icons/ri';

import { Typo } from '../Elements/Typo/Typo';
import { NavItem } from './NavItem';

export const NavBar = () => {
  const navItems = [
    {
      name: 'About',
      icon: '',
      path: '/about',
      isFocused: false,
    },
    {
      name: 'Posts',
      icon: '',
      path: '/posts',
      isFocused: false,
    },
    {
      name: 'About',
      icon: '',
      path: '/about',
      isFocused: false,
    },
    {
      name: 'About',
      icon: '',
      path: '/about',
      isFocused: false,
    },
  ];
  return (
    <div className={classes.container}>
      <div className={classes.menuIcon_wrapper}>
        <RiMenuFoldLine />
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
          <IoLogoGithub />
          <IoLogoLinkedin />
          <IoLogoTwitter />
          <MdOutlineEmail />
        </div>
      </div>
      <div className={classes.navItems_wrapper}>
        <NavItem />
      </div>
      <div>Footer</div>
    </div>
  );
};
