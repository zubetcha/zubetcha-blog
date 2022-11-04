import classes from './Button.module.scss';
import classNames from 'classnames';
import { Icon } from '../Icon/Icon';
import { IconRoleUnionType } from '@type/element';

interface Props {
	onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
	iconLeft?: IconRoleUnionType;
	iconRight?: IconRoleUnionType;
	status?: 'disabled' | 'focused';
	label: string;
}

export const Button = ({
	onClick,
	label,
	iconLeft,
	iconRight,
	status,
}: Props) => {
	return (
		<button
			className={classNames(
				classes.button,
				iconLeft && classes.left,
				iconRight && classes.right,
				status === 'focused' && classes.focused,
			)}
			onClick={(e) => onClick(e)}
		>
			{iconLeft && <Icon role={iconLeft} />}
			{label}
			{iconRight && <Icon role={iconRight} />}
		</button>
	);
};
