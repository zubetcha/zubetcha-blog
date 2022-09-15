import classes from './Main.module.scss';

import { ContentLayout } from '../Layout/ContentLayout';
import { Typo } from '../Elements/Typo/Typo';
import { PostCard } from '../PostCard/PostCard';

import { Post } from '../../types/post';

interface Props {
	posts: Post[];
}
export const Main = ({ posts }: Props) => {
	return (
		<ContentLayout title='All Posts'>
			<div>드롭다운: 태그, 최신순</div>
			<div className={classes.cards_wrapper}>
				{new Array(45).fill(posts[0]).map((post: Post) => (
					<PostCard post={post} />
				))}
			</div>
		</ContentLayout>
	);
};
