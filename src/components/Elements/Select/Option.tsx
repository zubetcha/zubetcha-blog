import { useSelect } from '../../../context/select';

interface Props {
	id: string;
	label: string;
}

export const Option = ({ id, label }: Props) => {
	const { setSelected } = useSelect();
	return (
		<li id={id} onClick={() => setSelected(id)}>
			{label}
		</li>
	);
};
