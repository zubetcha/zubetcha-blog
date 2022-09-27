import { useState } from 'react';
import { useRouter } from 'next/router';
import classes from './postList.module.scss';

import { ContentLayout, PostCard, Select } from '@components/index';

import { NUMBER_OF_POSTS } from '../../constants/post';
import { Post } from 'src/type/post';

interface Props {
	posts: Array<Post>;
	hasMore: boolean;
	pageNo: number;
	title: string;
	children?: JSX.Element[] | JSX.Element;
}

export const PostListPageContainer = ({
	posts,
	hasMore,
	pageNo,
	title,
	children,
}: Props) => {
	const router = useRouter();

	return (
		<div>
			<ContentLayout title={title}>
				<div>{children}</div>
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
