import classes from './Layout.module.scss';

import { ContentLayoutProps } from './Layout.types';

import { Typo } from '../Elements/Typo/Typo';

export const ContentLayout = ({ children, title }: ContentLayoutProps) => {
	return (
		<div className={classes.content_container}>
			<Typo role='display-medium' style={{ fontWeight: '700' }}>
				{title}
			</Typo>
			{children}
		</div>
	);
};
