import { forwardRef } from 'react';
import classes from './Layout.module.scss';

interface Props {
	children: JSX.Element[] | JSX.Element;
	title: string;
}

export const ContentLayout = forwardRef(
	({ children, title }: Props, ref: any) => {
		return (
			<div ref={ref} className={classes['content-container']}>
				<div className={classes['content-wrapper']}>
					<p className={classes.title}>{title}</p>
					{children}
				</div>
			</div>
		);
	},
);
