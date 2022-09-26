export interface IconProps {
	role: IconRoleUnionType;
	size: 'large' | 'medium' | 'small';
	onClick?: (e: React.MouseEvent<SVGElement>) => void;
}

export type IconRoleUnionType =
	| 'github'
	| 'twitter'
	| 'linkedIn'
	| 'email'
	| 'menu-fold'
	| 'menu-unfold'
	| 'about'
	| 'html'
	| 'css'
	| 'javascript'
	| 'typescript'
	| 'react'
	| 'graphql'
	| 'about'
	| 'search'
	| 'home'
	| 'dropdown';
