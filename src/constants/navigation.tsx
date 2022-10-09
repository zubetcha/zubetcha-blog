import { IconRoleUnionType } from '@type/element';

const navList = [
	// { name: 'HTML', isPost: true },
	// { name: 'CSS', isPost: true },
	{ name: 'Javascript', isPost: true },
	{ name: 'Typescript', isPost: true },
	{ name: 'React', isPost: true },
	// { name: 'GraphQL', isPost: true },
	{ name: 'Web', isPost: true },
	// { name: 'Tags', isPost: false },
	{ name: 'About', isPost: false },
];

export const navItems = navList.map((navItem, i) => {
	const { name, isPost } = navItem;
	const smallLetter = name.toLowerCase();
	return {
		name: name,
		icon: smallLetter as IconRoleUnionType,
		path: !isPost ? `/${smallLetter}` : `/category/${smallLetter}/1`,
		isFocused: false,
	};
});

export const contactList: { [key: string]: string } = {
	github: 'https://github.com/zubetcha',
	twitter: 'https://twitter.com/zubetcha_',
	linkedIn: 'https://www.linkedin.com/in/juhye-jeong-0994a0234/',
	email: 'mailto:zuhye5@gmail.com',
};
