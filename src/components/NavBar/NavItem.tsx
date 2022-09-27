import { useRouter } from 'next/router';
import classes from './NavBar.module.scss';
import { IconRoleUnionType } from 'src/type/element';

import { Icon, Typo } from '@components/index';

interface Props {
	name: string;
	icon: IconRoleUnionType;
	path: string;
	isFocused: boolean;
}

export const NavItem = ({ name, icon, path, isFocused }: Props) => {
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
