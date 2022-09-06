import classes from './Main.module.scss';

import { Typo } from '../Elements/Typo/Typo';
import { PostCard } from '../PostCard/PostCard';

export const Main = () => {
	return (
		<div className={classes.container}>
			<Typo role='display-medium' style={{ fontWeight: '700' }}>
				All Posts
			</Typo>
			<div>드롭다운: 태그, 최신순</div>
			<div className={classes.cards_wrapper}>
				{new Array(20).fill(0).map((_) => (
					<PostCard />
				))}
			</div>
		</div>
	);
};
