import classes from './postList.module.scss';

import { ContentLayout } from '../../components';
import { PostCard } from '../../components';

import { Post } from '../../types/post';

interface Props {
	posts: Array<Post>;
	hasMore: boolean;
	pageNo: number;
}

export const PostListPageContainer = ({ posts, hasMore, pageNo }: Props) => {
	return (
		<div>
			<ContentLayout title='All Posts'>
				<div>드롭다운: 태그, 최신순</div>
				<div className={classes.cards_wrapper}>
					{posts.map((post: Post) => (
						<PostCard post={post} key={post.fields.slug} />
					))}
				</div>
			</ContentLayout>
			{/* {hasMore && <div>다음 페이지: {pageNo + 1}</div>} */}
			<div>다음 페이지 {pageNo + 1}</div>
		</div>
	);
};
