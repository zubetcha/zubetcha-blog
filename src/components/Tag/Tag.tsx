import classes from './Tag.module.scss';
import { Typo } from '../Elements/Typo/Typo';

interface Props {
	tag: string;
	onClick?: () => void;
}

export const Tag = ({ tag, onClick }: Props) => {
	return (
		<div className={classes.container} onClick={onClick}>
			<Typo role='label-small'>{tag}</Typo>
		</div>
	);
};
