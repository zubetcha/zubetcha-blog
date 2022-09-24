import { useState, useEffect } from 'react';
import { SelectContext } from '../../../context/select';

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
		}
	}, [selected]);

	return (
		<SelectContext.Provider value={{ open, toggle, selected, setSelected }}>
			<div>
				<button onClick={(e) => onClickButton(e)}>{defaultLabel}</button>
				{open && <ul>{children}</ul>}
			</div>
		</SelectContext.Provider>
	);
};
