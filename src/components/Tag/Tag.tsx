import classes from './Tag.module.scss';

interface Props {
	tag: string;
	onClick?: () => void;
}

export const Tag = ({ tag, onClick }: Props) => {
	return (
		<div className={classes.container} onClick={onClick}>
			{tag}
		</div>
	);
};
