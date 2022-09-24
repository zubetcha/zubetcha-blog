import classes from './postList.module.scss';

import { ContentLayout } from '../../components';
import { PostCard } from '../../components';
import { Select } from '../../components/Elements/Select';

import { Post } from '../../types/post';

interface Props {
	posts: Array<Post>;
	hasMore: boolean;
	pageNo: number;
	categories: Array<string>;
}

export const PostListPageContainer = ({
	posts,
	hasMore,
	pageNo,
	categories,
}: Props) => {
	console.log(posts);
	console.log(categories);
	return (
		<div>
			<ContentLayout title='All Posts'>
				<div>
					<Select defaultLabel='Category' onChange={() => {}}>
						{categories.map((category, i) => (
							<Select.Option id={String(i)} label={category} />
						))}
					</Select>
				</div>
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
