import React, { useState } from 'react';
import { useRouter } from 'next/router';
import classes from './postList.module.scss';

import { ContentLayout, PostCard, Icon } from '@components/index';

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
	const onClickNextPage = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		router.replace(`/${pageNo + 1}`);
	};

	return (
		<ContentLayout title={title}>
			<>{children}</>
			<div className={classes['cards-wrapper']}>
				{posts.map((post: Post) => (
					<PostCard post={post} key={post.fields.slug} />
				))}
			</div>
			{hasMore ? (
				<div className={classes['button-wrapper']}>
					<button
						className={classes['next-page-button']}
						onClick={(e) => onClickNextPage(e)}
					>
						{/* Page {pageNo + 1} */}
						Next
						<Icon role='forward' />
					</button>
				</div>
			) : (
				<></>
			)}
			{pageNo > 1 ? (
				<div>
					<button>
						<Icon role='forward' />
						Prev
					</button>
				</div>
			) : (
				<></>
			)}
		</ContentLayout>
	);
};
