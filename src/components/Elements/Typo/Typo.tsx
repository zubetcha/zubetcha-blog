import classNames from 'classnames';
import { TypoRoleUnionType } from '../../../types/element';
import classes from './Typo.module.scss';

interface Props {
	role: TypoRoleUnionType;
	color: string;
	style?: { [key: string]: string };
	children: any;
}

export const Typo = ({ children, role, color, style }: Props) => {
	return (
		<p
			className={classNames(classes.first_class, classes[role], classes[color])}
			style={style}
		>
			{children}
		</p>
	);
};

Typo.defaultProps = {
	role: 'body-medium',
	color: 'title',
};
