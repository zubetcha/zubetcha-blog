import classes from './Layout.module.scss';

import { Typo } from '../Elements/Typo/Typo';

interface Props {
	children: JSX.Element[] | JSX.Element;
	title: string;
}

export const ContentLayout = ({ children, title }: Props) => {
	return (
		<div className={classes.content_container}>
			<Typo role='display-medium' style={{ fontWeight: '700' }}>
				{title}
			</Typo>
			{children}
		</div>
	);
};
