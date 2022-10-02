import classes from './Post.module.scss';
import { formatDate, formatDateInKorean } from '@utils/date';
import { Tag } from '@components/index';
import { FrontMatter } from '@type/post';

interface Props {
	children: JSX.Element;
	frontMatter: FrontMatter;
	slug: string;
}

export const PostContainer = ({ children, frontMatter }: Props) => {
	const { title, date, tags, category } = frontMatter;
	console.log(frontMatter);
	return (
		<article>
			<div className={classes.container}>
				<header>
					<div className={classes['tags-wrapper']}>
						{tags.map((tag) => (
							<Tag tag={tag} />
						))}
					</div>
					<h1>{title}</h1>
					<time dateTime={formatDate(date)} className={classes.createdAt}>
						{formatDateInKorean(formatDate(date))}
					</time>
				</header>
				<div className={classes.content}>{children}</div>
			</div>
		</article>
	);
};
