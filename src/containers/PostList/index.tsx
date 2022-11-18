import { useRouter } from 'next/router';
import classes from './PostList.module.scss';
import { getUpperCategory } from '@utils/category';

import {
	ContentLayout,
	PostCard,
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

	const routeToNextPath = ({
		destination,
		isAll,
		category,
	}: {
		destination: 'prev' | 'next' | 'categoryChange';
		isAll: boolean;
		category: string;
	}) => {
		const page: { [x: string]: number } = {
			prev: pageNo - 1,
			next: pageNo + 1,
			categoryChange: 1,
		};

		const nextPath = isAll
			? `/page/${page[destination]}`
			: `/category/${category.toLowerCase()}/${page[destination]}`;

		return router.push(nextPath);
	};

	const onClickButton = (
		e: React.MouseEvent<HTMLButtonElement>,
		destination: 'prev' | 'next',
	) => {
		e.preventDefault();
		routeToNextPath({ destination, isAll, category });
	};

	const onChangeCategory = (selected: string) => {
		const selectedCategory = categories[parseInt(selected)];

		routeToNextPath({
			destination: 'categoryChange',
			isAll: selectedCategory === 'all',
			category: selectedCategory,
		});
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
							<Button
								label='Prev'
								onClick={(e) => onClickButton(e, 'prev')}
								iconLeft='backward'
							/>
						) : null}
					</div>
					<div>
						{hasMore ? (
							<Button
								label='Next'
								onClick={(e) => onClickButton(e, 'next')}
								iconRight='forward'
							/>
						) : null}
					</div>
				</div>
			</ContentLayout>
		</>
	);
};
