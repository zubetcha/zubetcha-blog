import { IconRoleUnionType } from '../components/Elements/Icon/Icon.types';

const navList = [
	{ name: 'About', isPost: false },
	{ name: 'HTML', isPost: true },
	{ name: 'CSS', isPost: true },
	{ name: 'Javascript', isPost: true },
	{ name: 'Typescript', isPost: true },
	{ name: 'React', isPost: true },
	{ name: 'GraphQL', isPost: true },
	{ name: 'Tags', isPost: false },
];

export const navItems = navList.map((navItem, i) => {
	const { name, isPost } = navItem;
	const smallLetter = name.toLowerCase();
	return {
		name: name,
		icon: smallLetter as IconRoleUnionType,
		path: !isPost ? `/${smallLetter}` : `posts?category=${smallLetter}`,
		isFocused: false,
	};
});

export const contactList = {
	github: 'https://github.com/zubetcha',
	twitter: 'https://twitter.com/zubetcha_',
	linkedIn: 'https://www.linkedin.com/in/juhye-jeong-0994a0234/',
	email: 'mailto:zuhye5@gmail.com',
};