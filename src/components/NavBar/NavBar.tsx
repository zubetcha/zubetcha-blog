import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import classNames from 'classnames';
import classes from './NavBar.module.scss';
import Profile from '../../assets/images/profile.jpeg';
import { IconRoleUnionType } from '../Elements/Icon/Icon.types';

import { Icon } from '../Elements/Icon/Icon';
import { Typo } from '../Elements/Typo/Typo';
import { NavItem } from './NavItem';

export const NavBar = () => {
  const router = useRouter();
  const [isFolded, setIsFolded] = useState(false);

  const contactList = {
    github: 'https://github.com/zubetcha',
    twitter: 'https://twitter.com/zubetcha_',
    linkedIn: 'https://www.linkedin.com/in/juhye-jeong-0994a0234/',
    email: 'zuhye5@gmail.com',
  };

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

  const onClickHome = () => {
    router.replace('/');
  };

  const onClickContact = (e: React.MouseEvent<SVGElement>) => {
    const { id } = e.currentTarget;
    window.open(contactList[id]);
  };

  const onClickMenu = () => {
    setIsFolded((prev) => !prev);
    localStorage.setItem('isFolded', isFolded ? 'false' : 'true');
  };

  useEffect(() => {
    const isFolded = localStorage.getItem('isFolded');

    if (isFolded) {
      setIsFolded(JSON.parse(isFolded));
    }
  }, []);

  return (
    <div
      className={classNames(classes.container, {
        [classes.isFolded]: isFolded,
      })}
    >
      <div className={classes.menuIcon_wrapper}>
        <Icon
          role={isFolded ? 'menu-unfold' : 'menu-fold'}
          onClick={onClickMenu}
        />
      </div>

      <div className={classes.profile_wrapper}>
        <div className={classes.profile_image_wrapper} onClick={onClickHome}>
          <Image src={Profile} className={classes.profile_image} />
          <div className={classes.highlight_wrapper}>
            <span className={classes.highlight}></span>
          </div>
        </div>
        <div className={classes.profile_info_wrapper}>
          <Typo role='title-small'>zubetcha</Typo>
          <Typo role='body-small'>Web Frontend Developer</Typo>
        </div>
        <div className={classes.profile_contacts_wrapper}>
          {Object.keys(contactList).map((contact) => {
            return (
              <Icon
                key={contact}
                role={contact as IconRoleUnionType}
                onClick={onClickContact}
              />
            );
          })}
        </div>
      </div>

      <div className={classes.navItems_wrapper}>
        {isFolded && (
          <div className={classes.navItem_container} onClick={onClickHome}>
            <Icon role='home' />
          </div>
        )}
        <div className={classes.divider}></div>
        {navItems.map((navItem) => {
          return <NavItem key={navItem.name} {...navItem} />;
        })}
      </div>

      <div className={classes.footer_container}>
        <Typo role='body-small'>© 2022 zubetcha.</Typo>
        <Typo role='body-small'>All Rights Reserved.</Typo>
      </div>
    </div>
  );
};
