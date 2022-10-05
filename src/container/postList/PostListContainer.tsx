import { useEffect, useRef, MouseEvent } from 'react';
import { useRouter } from 'next/router';
import classes from './PostList.module.scss';
import { getUpperCategory } from '@utils/category';

import { ContentLayout, PostCard, Icon, Select } from '@components/index';

import { Post } from 'src/type/post';

interface Props {
	posts: Array<Post>;
	hasMore: boolean;
	pageNo: number;
	title: string;
	categories: Array<string>;
}

export const PostListContainer = ({
	posts,
	hasMore,
	pageNo,
	title,
	categories,
}: Props) => {
	const router = useRouter();
	const container = useRef<null | HTMLDivElement>(null);

	const onClickPrev = (e: MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		router.replace(`/page/${pageNo - 1}`);
	};

	const onClickNext = (e: MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		router.replace(`/page/${pageNo + 1}`);
	};

	console.log(posts);
	const onChangeCategory = (selected: string) => {
		const selectedCategory = categories[parseInt(selected)];
		selectedCategory === 'all'
			? router.push('/page/1')
			: router.push(`/category/${selectedCategory}/1`);
	};

	useEffect(() => {
		if (container.current) {
			container.current.scrollIntoView({ behavior: 'smooth' });
		}
	}, [pageNo]);

	return (
		<ContentLayout title={title} ref={container}>
			<Select
				defaultLabel={
					router.asPath.split('/').includes('category')
						? getUpperCategory(router.query.category as string)
						: 'Category'
				}
				onChange={onChangeCategory}
			>
				{categories.map((category, i) => (
					<Select.Option
						key={category}
						id={String(i)}
						label={getUpperCategory(category)}
					/>
				))}
			</Select>
			<div className={classes['cards-wrapper']}>
				{posts.map((post: Post) => (
					<PostCard
						post={post}
						key={post.fields.slug}
						onClick={() => router.push(`/${post.fields.slug}`)}
					/>
				))}
			</div>
			<div className={classes['button-wrapper']}>
				<div>
					{pageNo > 1 ? (
						<button
							className={classes['prev-page-button']}
							onClick={(e) => onClickPrev(e)}
						>
							<Icon role='backward' />
							Prev
						</button>
					) : (
						<></>
					)}
				</div>
				<div>
					{hasMore ? (
						<button
							className={classes['next-page-button']}
							onClick={(e) => onClickNext(e)}
						>
							Next
							<Icon role='forward' />
						</button>
					) : (
						<></>
					)}
				</div>
			</div>
		</ContentLayout>
	);
};
