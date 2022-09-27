import { useRouter } from 'next/router';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { getAllPosts, getPageInfo, getUpperCategory } from '@utils/index';

import { PostListPageContainer } from '@container/index';
import { Select } from '@components/index';

import { NUMBER_OF_POSTS } from '@constants/post';
import { Post } from 'src/type/post';
import { ParsedUrlQuery } from 'querystring';

interface Props {
	posts: Array<Post>;
	hasMore: boolean;
	pageNo: number;
	categories: Array<string>;
}

export default function PostListPage({ categories, ...props }: Props) {
	const router = useRouter();

	const upperCategories = categories.map((category) =>
		getUpperCategory(category),
	);

	const onChangeCategory = (selected: string) => {
		const selectedCategory = categories[parseInt(selected)];
		selectedCategory === 'all'
			? router.push('/')
			: router.push(`/category/${selectedCategory}/1`);
	};
	return (
		<PostListPageContainer {...props} title='All Posts'>
			<Select defaultLabel='Category' onChange={onChangeCategory}>
				{upperCategories.map((category, i) => (
					<Select.Option id={String(i)} label={category} />
				))}
			</Select>
		</PostListPageContainer>
	);
}

export const getStaticPaths: GetStaticPaths = async () => {
	const posts = await getAllPosts();

	const paths = [
		...new Array(Math.round(posts.length / NUMBER_OF_POSTS)).keys(),
	].map((i) => ({ params: { id: `${i + 1}` } }));

	return {
		paths,
		fallback: 'blocking',
	};
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
	const { id } = params as ParsedUrlQuery;

	const posts = await getAllPosts();
	const { pageNo, maximumPageNo, slicedPosts, hasMore, categories } =
		getPageInfo({
			id,
			posts,
		});

	if (!params || !pageNo || isNaN(pageNo) || pageNo > maximumPageNo) {
		return { notFound: true };
	}

	return {
		props: {
			posts: slicedPosts,
			categories,
			hasMore,
			pageNo,
		},
	};
};
