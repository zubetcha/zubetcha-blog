import classes from './Select.module.scss';
import { useSelect } from '../../../context/select';

interface Props {
	id: string;
	label: string;
}

export const Option = ({ id, label }: Props) => {
	const { setSelected } = useSelect();
	return (
		<li id={id} className={classes.option} onClick={() => setSelected(id)}>
			{label}
		</li>
	);
};
