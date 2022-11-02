import classes from './Button.module.scss';
import { Icon } from '../Icon/Icon';
import { IconRoleUnionType } from '@type/element';

interface Props {
	onClick: () => void;
	leftIcon?: IconRoleUnionType;
	rightIcon?: IconRoleUnionType;
	children: JSX.Element;
}
export const Button = ({ onClick, children, leftIcon, rightIcon }: Props) => {
	return (
		<button className={classes.button} onClick={onClick}>
			{leftIcon && <Icon role={leftIcon} />}
			{children}
			{rightIcon && <Icon role={rightIcon} />}
		</button>
	);
};
