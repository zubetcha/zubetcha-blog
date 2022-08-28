import Image from 'next/image';
import classes from './NavBar.module.scss';
import Profile from '../../assets/images/profile.jpeg';

import { Typo } from '../Elements/Typo/Typo';
import { NavItem } from './NavItem';

export const NavBar = () => {
  return (
    <div className={classes.container}>
      <div className={classes.icon_wrapper}>접는 아이콘</div>
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
        <div>Contact</div>
      </div>
      <div className={classes.navItems_wrapper}>
        <NavItem />
      </div>
      <div>Footer</div>
    </div>
  );
};
