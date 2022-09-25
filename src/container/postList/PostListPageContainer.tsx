import { useState } from 'react';
import { useRouter } from 'next/router';
import classes from './postList.module.scss';

import { ContentLayout } from '../../components';
import { PostCard } from '../../components';
import { Select } from '../../components/Elements/Select';

import { NUMBER_OF_POSTS } from '../../constants/post';
import { Post } from '../../types/post';

interface Props {
	posts: Array<Post>;
	hasMore: boolean;
	pageNo: number;
	categories: Array<string>;
}

export const PostListPageContainer = ({
	posts,
	// hasMore,
	pageNo,
	categories,
}: Props) => {
	const router = useRouter();
	const startIndex = (pageNo - 1) * NUMBER_OF_POSTS;
	const endIndex = startIndex + NUMBER_OF_POSTS;
	const [postList, setPostList] = useState<Array<Post>>(posts);
	const [hasMore, setHasMore] = useState(
		posts[endIndex] !== undefined ? true : false,
	);

	const onChangeCategory = (selected: string) => {
		const selectedCategory = categories[parseInt(selected)];
		selectedCategory === 'all'
			? setPostList(posts)
			: setPostList(
					posts.filter(
						(post) =>
							post.frontMatter.category === categories[parseInt(selected)],
					),
			  );

		router.push(
			{ query: { ...router.query, category: selectedCategory } },
			undefined,
			{
				shallow: true,
			},
		);
	};

	console.log(pageNo);

	return (
		<div>
			<ContentLayout title='All Posts'>
				<div>
					<Select defaultLabel='Category' onChange={onChangeCategory}>
						{categories.map((category, i) => (
							<Select.Option id={String(i)} label={category} />
						))}
					</Select>
				</div>
				<div className={classes.cards_wrapper}>
					{postList.slice(startIndex, endIndex).map((post: Post) => (
						<PostCard post={post} key={post.fields.slug} />
					))}
				</div>
			</ContentLayout>
			{hasMore && (
				<div
					onClick={() =>
						router.push(
							{
								query: {
									...router.query,
									id: parseInt(router.query.id as string) + 1,
								},
							},
							undefined,
							{
								shallow: true,
							},
						)
					}
				>
					다음 페이지 {pageNo + 1}
				</div>
			)}
		</div>
	);
};
