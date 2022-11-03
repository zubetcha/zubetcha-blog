import { useState, useEffect } from 'react';
import classNames from 'classnames';
import classes from './Select.module.scss';
import { SelectContext } from '@context/select';

import { Button } from '../Button';
import { Icon } from '../Icon/Icon';
interface Props {
	children: JSX.Element | JSX.Element[];
	onChange: (selected: string) => void;
	defaultLabel: string;
}

export const Select = ({ children, onChange, defaultLabel }: Props) => {
	const [open, toggle] = useState(false);
	const [selected, setSelected] = useState<string | null>(null);

	const onClickButton = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		toggle(!open);
	};

	useEffect(() => {
		if (selected) {
			onChange(selected);
			toggle(false);
		}
	}, [selected]);

	return (
		<SelectContext.Provider value={{ open, toggle, selected, setSelected }}>
			<div className={classes.container}>
				<Button
					label={defaultLabel}
					onClick={onClickButton}
					status={open ? 'focused' : undefined}
					iconRight='dropdown'
				/>
				<ul
					className={classNames(classes['options-wrapper'], {
						[classes.open]: open,
					})}
				>
					{children}
				</ul>
			</div>
		</SelectContext.Provider>
	);
};
