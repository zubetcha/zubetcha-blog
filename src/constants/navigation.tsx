import { IconRoleUnionType } from '@type/element';

export const NAV_LIST = [
	{ name: 'Posts', path: '/page/1' },
	{ name: 'About', path: '/about' },
];

export const NAV_ITEM_LIST = NAV_LIST.map((navItem, i) => {
	const { name, path } = navItem;
	const smallLetter = name.toLowerCase();

	return {
		name: name,
		icon: smallLetter as IconRoleUnionType,
		path,
		isFocused: false,
	};
});

export const CONTACT_LIST: { [key: string]: string } = {
	github: 'https://github.com/zubetcha',
	twitter: 'https://twitter.com/zubetcha_',
	linkedIn: 'https://www.linkedin.com/in/juhye-jeong-0994a0234/',
	email: 'mailto:zuhye5@gmail.com',
	phone: '',
	// phone: '010-2292-6428',
	blog: 'https://zubetcha.com',
};

export const EXCLUSION_PATH_LIST = ['/resume'];
