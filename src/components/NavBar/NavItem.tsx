import { useRouter } from 'next/router';
import classes from './NavBar.module.scss';
import { IconRoleUnionType } from '../../types/element';

import { Icon } from '../Elements/Icon/Icon';
import { Typo } from '../Elements/Typo/Typo';

interface Props {
	name: string;
	icon: IconRoleUnionType;
	path: string;
	isFocused: boolean;
}

export const NavItem = ({ name, icon, path, isFocused }: Props) => {
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
