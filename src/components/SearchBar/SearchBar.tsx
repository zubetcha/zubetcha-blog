import classes from './SearchBar.module.scss';
import { Icon } from '../Elements/Icon/Icon';

export const SearchBar = () => {
	return (
		<div className={classes.container}>
			<input className={classes.textField} placeholder='search' />
			<Icon role='search' />
		</div>
	);
};
