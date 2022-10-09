import { useRouter } from 'next/router';
import { useTheme } from '@context/theme';
import { useWindowSize } from '@hooks/useWindowSize';
import classes from './Header.module.scss';

import { SearchBar, Toggle, Avartar } from '@components/index';

export const Header = () => {
	const router = useRouter();
	const { width } = useWindowSize();
	const navList = [
		{ name: 'Posts', path: '/page/1' },
		{ name: 'About', path: '/about' },
	];
	const isMobile = (width as number) < 768;

	const { theme, setTheme } = useTheme();
	const newTheme = theme === 'dark' ? 'light' : 'dark';

	const onClickToggle = () => {
		setTheme(newTheme);
		localStorage.setItem('theme', newTheme);
	};

	if (isMobile) {
		return (
			<>
				<div className={classes['header-container']}>
					<Avartar
						size='small'
						onClick={() => router.push('/page/1')}
						style={{ cursor: 'pointer' }}
					/>
					<div className={classes['left']}>
						<ul className={classes['nav-wrapper']}>
							{navList.map(({ name, path }) => (
								<li key={name} onClick={() => router.push(`${path}`)}>
									<p>{name}</p>
								</li>
							))}
						</ul>
						<Toggle status={theme} onClick={onClickToggle} />
					</div>
				</div>
			</>
		);
	}

	return (
		<div className={classes.container}>
			{/* <SearchBar /> */}
			<Toggle status={theme} onClick={onClickToggle} />
		</div>
	);
};
