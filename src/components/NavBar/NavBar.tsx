import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useSpring } from 'react-spring';
import { useExpanded } from '@context/expanded';
import classNames from 'classnames';
import classes from './NavBar.module.scss';

import { IconRoleUnionType } from 'src/type/element';
import { CONTACT_LIST, NAV_ITEM_LIST } from '@constants/navigation';

import { Icon, NavItem, Avartar } from '@components/index';

export const NavBar = () => {
	const router = useRouter();
	const { expanded, setExpanded } = useExpanded();
	const [style, api] = useSpring(() => ({
		width: '72px',
	}));
	const newExpanded = expanded ? false : true;

	const onClickContact = (e: React.MouseEvent<SVGElement>) => {
		const { id } = e.currentTarget;
		window.open(CONTACT_LIST[id]);
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
					<Avartar size='medium' />
					<div className={classes.highlight_wrapper}>
						<span className={classes.highlight}></span>
					</div>
				</div>
				<div className={classes['profile-info-wrapper']}>
					<p
						className={classes.nickname}
						onClick={() => router.push('/resume')}
					>
						zubetcha
					</p>
					<p className={classes.description}>Web Frontend Developer</p>
				</div>
				<div className={classes['profile-contacts-wrapper']}>
					{Object.keys(CONTACT_LIST).map((contact, i) => {
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

			<div className={classes['nav-item-list-wrapper']}>
				{!expanded && (
					<div
						className={classes['navitem-container']}
						onClick={() => router.push('/')}
					>
						<Icon role='home' />
					</div>
				)}
				<div className={classes.divider}></div>
				{NAV_ITEM_LIST.map((navItem) => {
					return <NavItem key={navItem.name} {...navItem} />;
				})}
			</div>

			<div className={classes['footer-container']}>
				<p className={classes['footer-info']}>
					© 2022 zubetcha.
					<br />
					All Rights Reserved.
				</p>
			</div>
		</div>
	);
};
