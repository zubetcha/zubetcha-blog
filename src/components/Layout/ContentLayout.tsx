import { forwardRef } from 'react';
import classes from './Layout.module.scss';
import { Typo } from '@components/Elements';

interface Props {
	children: JSX.Element[] | JSX.Element;
	title: string;
}

export const ContentLayout = forwardRef(({ children, title }: Props, ref) => {
	return (
		<div ref={ref} className={classes['content-container']}>
			<div className={classes['content-wrapper']}>
				<Typo role='display-medium' style={{ fontWeight: '700' }}>
					{title}
				</Typo>
				{children}
			</div>
		</div>
	);
});
