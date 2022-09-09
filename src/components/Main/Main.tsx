import classes from './Main.module.scss';

import { ContentLayout } from '../Layout/ContentLayout';
import { Typo } from '../Elements/Typo/Typo';
import { PostCard } from '../PostCard/PostCard';

export const Main = () => {
	return (
		<ContentLayout title='All Posts'>
			<div>드롭다운: 태그, 최신순</div>
			<div className={classes.cards_wrapper}>
				{new Array(20).fill(0).map((_) => (
					<PostCard />
				))}
			</div>
		</ContentLayout>
	);
};
