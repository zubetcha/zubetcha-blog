import Image from 'next/image';
import classes from './NavBar.module.scss';
import Profile from '../../assets/images/profile.jpeg';

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
        <div>
          <p>이름</p>
          <p>소개</p>
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
