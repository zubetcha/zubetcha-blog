import classes from './Icon.module.scss';
import classNames from 'classnames';
import { IconRoleUnionType, IconProps } from './Icon.types';

import {
	IoLogoGithub,
	IoLogoTwitter,
	IoLogoLinkedin,
	IoIosSearch,
	IoMdHome,
} from 'react-icons/io';

import { MdOutlineEmail } from 'react-icons/md';
import {
	RiMenuFoldLine,
	RiMenuUnfoldLine,
	RiCodeSSlashLine,
} from 'react-icons/ri';
import {
	SiTypescript,
	SiJavascript,
	SiReact,
	SiGraphql,
	SiCss3,
	SiHtml5,
} from 'react-icons/si';

export const Icon = ({ role, size, onClick }: IconProps) => {
	const icons: { [key: string]: JSX.Element } = {
		github: (
			<IoLogoGithub
				className={classes[size]}
				onClick={onClick}
				id={role}
			/>
		),
		twitter: (
			<IoLogoTwitter
				className={classes[size]}
				onClick={onClick}
				id={role}
			/>
		),
		linkedIn: (
			<IoLogoLinkedin
				className={classes[size]}
				onClick={onClick}
				id={role}
			/>
		),
		email: (
			<MdOutlineEmail
				className={classes[size]}
				onClick={onClick}
				id={role}
			/>
		),
		'menu-fold': (
			<RiMenuFoldLine
				className={classes[size]}
				onClick={onClick}
				id={role}
			/>
		),
		'menu-unfold': (
			<RiMenuUnfoldLine
				className={classes[size]}
				onClick={onClick}
				id={role}
			/>
		),
		javascript: (
			<SiJavascript
				className={classes[size]}
				onClick={onClick}
				id={role}
			/>
		),
		html: (
			<SiHtml5
				className={classNames(classes[size], classes.stroke)}
				onClick={onClick}
				id={role}
			/>
		),
		css: (
			<SiCss3
				className={classNames(classes[size], classes.stroke)}
				onClick={onClick}
				id={role}
			/>
		),
		typescript: (
			<SiTypescript
				className={classes[size]}
				onClick={onClick}
				id={role}
			/>
		),
		react: (
			<SiReact className={classes[size]} onClick={onClick} id={role} />
		),
		graphql: (
			<SiGraphql className={classes[size]} onClick={onClick} id={role} />
		),
		about: (
			<RiCodeSSlashLine
				className={classes[size]}
				onClick={onClick}
				id={role}
			/>
		),
		search: (
			<IoIosSearch
				className={classes[size]}
				onClick={onClick}
				id={role}
			/>
		),
		home: (
			<IoMdHome className={classes[size]} onClick={onClick} id={role} />
		),
	};

	return icons[role];
};

Icon.defaultProps = {
	size: 'medium',
};