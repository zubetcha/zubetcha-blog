import classes from './Post.module.scss';
import { formatDate } from '@utils/date';
import { getBlogJSONLD } from '@utils/page';
import { Tag, PostSEO } from '@components/index';
import { FrontMatter } from '@type/post';

interface Props {
	children: JSX.Element;
	frontMatter: FrontMatter;
	slug: string;
}

export const PostContainer = ({ children, frontMatter, slug }: Props) => {
	const { title, date, tags, category, description } = frontMatter;
	const formattedDate = formatDate(date);

	return (
		<>
			<PostSEO
				title={title}
				description={description}
				path={`/${slug}`}
				date={formattedDate}
			/>
			<article>
				<div className={classes.container}>
					<header>
						<div className={classes['tags-wrapper']}>
							{tags.map((tag) => (
								<Tag tag={tag} />
							))}
						</div>
						<h1>{title}</h1>
						<div className={classes['']}>
							<time dateTime={formattedDate} className={classes.createdAt}>
								{formattedDate}
							</time>
							{/* <p>zubetcha</p> */}
						</div>
					</header>
					<div className={classes.content}>{children}</div>
				</div>
			</article>
		</>
	);
};
