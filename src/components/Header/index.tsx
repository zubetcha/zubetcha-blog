import { useTheme } from '../../context/ThemeContext';
import classes from './Header.module.scss';

import { SearchBar } from '../SearchBar';
import { Toggle } from '../Toggle';

export const Header = () => {
	const { theme, setTheme } = useTheme();
	const isDark = theme === 'dark';

	return (
		<div className={classes.container}>
			<SearchBar />
			<Toggle
				status={isDark ? 'on' : 'off'}
				onClick={() => setTheme(isDark ? 'light' : 'dark')}
			/>
		</div>
	);
};
