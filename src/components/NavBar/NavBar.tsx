import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useExpanded } from '@context/expanded';
import classNames from 'classnames';
import classes from './NavBar.module.scss';

import Zubetcha from '../../assets/images/zubetcha.jpeg';
import { IconRoleUnionType } from 'src/type/element';
import { contactList, navItems } from '@constants/navigation';

import Image from 'next/image';
import { Icon, Typo, NavItem } from '@components/index';

export const NavBar = () => {
	const router = useRouter();
	const { expanded, setExpanded } = useExpanded();
	const newExpanded = expanded ? false : true;

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
					onClick={() => router.push('/')}
				>
					<Image src={Zubetcha} className={classes.profile_image} />
					<div className={classes.highlight_wrapper}>
						<span className={classes.highlight}></span>
					</div>
				</div>
				<div className={classes['profile-info-wrapper']}>
					<p className={classes.nickname}>zubetcha</p>
					<p className={classes.description}>Web Frontend Developer</p>
				</div>
				<div className={classes['profile-contacts-wrapper']}>
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
						onClick={() => router.push('/')}
					>
						<Icon role='home' />
					</div>
				)}
				<div className={classes.divider}></div>
				{navItems.map((navItem) => {
					return <NavItem key={navItem.name} {...navItem} />;
				})}
			</div>

			<div className={classes['footer-container']}>
				<p className={classes['footer-info']}>© 2022 zubetcha.</p>
				<p className={classes['footer-info']}>All Rights Reserved.</p>
			</div>
		</div>
	);
};
