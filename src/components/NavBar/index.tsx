import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useExpanded } from '../../context';
import classNames from 'classnames';
import classes from './NavBar.module.scss';

import Profile from '../../assets/images/profile.jpeg';
import { IconRoleUnionType } from '../Elements/Icon/Icon.types';

import Image from 'next/image';
import { Icon } from '../Elements/Icon';
import { Typo } from '../Elements/Typo';
import { NavItem } from './NavItem';

export const NavBar = () => {
    const router = useRouter();
    const { expanded, setExpanded } = useExpanded();
    const newExpanded = expanded ? false : true;

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

    const onClickContact = (e: React.MouseEvent<SVGElement>) => {
        const { id } = e.currentTarget;
        window.open(contactList[id]);
    };

    const onClickMenu = () => {
        setExpanded(newExpanded);
        localStorage.setItem('expanded', String(newExpanded));
    };

    useEffect(() => {
        const storedExpanded = localStorage.getItem('expanded');

        setExpanded(storedExpanded ? JSON.parse(storedExpanded) : expanded);
    }, []);

    return (
        <div
            className={classNames(classes.container, {
                [classes.isFolded]: !expanded,
            })}
        >
            <div className={classes.menuIcon_wrapper}>
                <Icon
                    role={expanded ? 'menu-fold' : 'menu-unfold'}
                    onClick={onClickMenu}
                />
            </div>

            <div className={classes.profile_wrapper}>
                <div
                    className={classes.profile_image_wrapper}
                    onClick={() => router.replace('/')}
                >
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
                {!expanded && (
                    <div
                        className={classes.navItem_container}
                        onClick={() => router.replace('/')}
                    >
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
