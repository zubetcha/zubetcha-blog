import classes from './Icon.module.scss';
import { IconRoleUnionType } from 'src/type/element';

import {
	IoLogoGithub,
	IoLogoTwitter,
	IoLogoLinkedin,
	IoIosSearch,
	IoMdHome,
	IoMdArrowDropdown,
	IoMdArrowForward,
	IoMdArrowBack,
} from 'react-icons/io';

import { MdOutlineEmail, MdChevronRight } from 'react-icons/md';
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
import { GoBrowser } from 'react-icons/go';

interface Props {
	role: IconRoleUnionType;
	size: 'large' | 'medium' | 'small';
	onClick?: (e: React.MouseEvent<SVGElement>) => void;
}

export const Icon = ({ role, size, onClick }: Props) => {
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
		forward: <IoMdArrowForward {...props} />,
		backward: <IoMdArrowBack {...props} />,
		web: <GoBrowser {...props} />,
		'chevron-right': <MdChevronRight {...props} />,
	};

	return icons[role];
};

Icon.defaultProps = {
	size: 'medium',
};
