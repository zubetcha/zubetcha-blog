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
	hasMore,
	pageNo,
	categories,
}: Props) => {
	const router = useRouter();

	const onChangeCategory = (selected: string) => {
		const selectedCategory = categories[parseInt(selected)];
		selectedCategory === 'all'
			? router.push('/')
			: router.push(`/category/${selectedCategory}/1`);
	};

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
					{posts.map((post: Post) => (
						<PostCard post={post} key={post.fields.slug} />
					))}
				</div>
			</ContentLayout>
			{hasMore && (
				<div onClick={() => router.replace(`/${pageNo + 1}`)}>
					다음 페이지 {pageNo + 1}
				</div>
			)}
		</div>
	);
};
