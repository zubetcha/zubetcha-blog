import { useRouter } from 'next/router';
import classes from './NavBar.module.scss';
import { NavItemProps } from './NavBar.types';

import { Icon } from '../Elements/Icon/Icon';
import { Typo } from '../Elements/Typo/Typo';

export const NavItem = ({ name, icon, path, isFocused }: NavItemProps) => {
	console.log(path);
	const router = useRouter();
	return (
		<div
			className={classes.navItem_container}
			onClick={() => router.replace(path)}
		>
			<Icon role={icon} />
			<Typo role='body-large' style={{ cursor: 'pointer' }}>
				{name}
			</Typo>
		</div>
	);
};
