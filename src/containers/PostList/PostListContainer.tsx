import { MouseEvent } from 'react';
import { useRouter } from 'next/router';
import classNames from 'classnames';
import classes from './PostList.module.scss';
import { getUpperCategory } from '@utils/category';

import {
	ContentLayout,
	PostCard,
	Icon,
	Select,
	PageSEO,
	Button,
} from '@components/index';

import { Post } from 'src/type/post';

interface Props {
	posts: Array<Post>;
	hasMore: boolean;
	pageNo: number;
	categories: Array<string>;
	category: string;
}

export const PostListContainer = ({
	posts,
	hasMore,
	pageNo,
	categories,
	category,
}: Props) => {
	const router = useRouter();
	const isAll = category.toLowerCase().includes('all');
	const title = getUpperCategory(category);

	const onClickPrev = (e: MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		isAll
			? router.push(`/page/${pageNo - 1}`)
			: router.push(`/category/${category.toLowerCase()}/${pageNo - 1}`);
	};

	const onClickNext = (e: MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		isAll
			? router.push(`/page/${pageNo + 1}`)
			: router.push(`/category/${category.toLowerCase()}/${pageNo + 1}`);
	};

	const onChangeCategory = (selected: string) => {
		const selectedCategory = categories[parseInt(selected)];
		selectedCategory === 'all'
			? router.push('/page/1')
			: router.push(`/category/${selectedCategory.toLowerCase()}/1`);
	};

	return (
		<>
			<PageSEO
				title={`${title} ${pageNo}`}
				description={title}
				path={router.asPath}
			/>
			<ContentLayout title={title}>
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
							<Button label='Prev' onClick={onClickPrev} iconLeft='backward' />
						) : null}
					</div>
					<div>
						{hasMore ? (
							<Button label='Next' onClick={onClickNext} iconRight='forward' />
						) : null}
					</div>
				</div>
			</ContentLayout>
		</>
	);
};
