import classes from './Icon.module.scss';
import { IconRoleUnionType, IconProps } from './Icon.types';

import {
	IoLogoGithub,
	IoLogoTwitter,
	IoLogoLinkedin,
	IoIosSearch,
	IoMdHome,
	IoMdArrowDropdown,
} from 'react-icons/io';

import { MdOutlineEmail } from 'react-icons/md';
import {
	RiMenuFoldLine,
	RiMenuUnfoldLine,
	RiCodeSSlashLine,
	RiHashtag,
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
	const props = { className: classes[size], onClick, id: role };
	const icons: { [key: string]: JSX.Element } = {
		github: <IoLogoGithub {...props} />,
		twitter: <IoLogoTwitter {...props} />,
		linkedIn: <IoLogoLinkedin {...props} />,
		email: <MdOutlineEmail {...props} />,
		'menu-fold': <RiMenuFoldLine {...props} />,
		'menu-unfold': <RiMenuUnfoldLine {...props} />,
		javascript: <SiJavascript {...props} />,
		html: <SiHtml5 {...props} />,
		css: <SiCss3 {...props} />,
		typescript: <SiTypescript {...props} />,
		react: <SiReact {...props} />,
		graphql: <SiGraphql {...props} />,
		about: <RiCodeSSlashLine {...props} />,
		search: <IoIosSearch {...props} />,
		home: <IoMdHome {...props} />,
		tags: <RiHashtag {...props} />,
		dropdown: <IoMdArrowDropdown {...props} />,
	};

	return icons[role];
};

Icon.defaultProps = {
	size: 'medium',
};
