import { HTMLProps } from 'react';
import { getLinkContent } from '@utils/post';

const Heading1 = (props: HTMLProps<HTMLHeadingElement>) => {
	return (
		<h1
			id={getLinkContent(
				typeof props.children === 'string' ? props.children : '',
			)}
		>
			{props.children}
		</h1>
	);
};

const Heading2 = (props: HTMLProps<HTMLHeadingElement>) => {
	return (
		<h2
			id={getLinkContent(
				typeof props.children === 'string' ? props.children : '',
			)}
		>
			{props.children}
		</h2>
	);
};

const Heading3 = (props: HTMLProps<HTMLHeadingElement>) => {
	return (
		<h3
			id={getLinkContent(
				typeof props.children === 'string' ? props.children : '',
			)}
		>
			{props.children}
		</h3>
	);
};

export const MDXComponents = {
	h1: Heading1,
	h2: Heading2,
	h3: Heading3,
};
