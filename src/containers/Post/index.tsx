import { useRef } from 'react';
import { useWindowSize } from '@hooks/useWindowSize';
import classes from './Post.module.scss';
import { formatDate } from '@utils/date';
import { Tag, PostSEO, ToC, Comment } from '@components/index';
import { FrontMatter, HeadingContent } from '@type/post';

interface Props {
	children: React.ReactNode;
	frontMatter: FrontMatter;
	slug: string;
	headingList: Array<HeadingContent>;
}

export const PostContainer = ({
	children,
	frontMatter,
	slug,
	headingList,
}: Props) => {
	const { title, date, tags, category, description } = frontMatter;
	const { isMobile } = useWindowSize();
	const formattedDate = formatDate(date);

	const ToCRef = useRef<HTMLDivElement>(null);

	return (
		<>
			<PostSEO
				title={title}
				description={description}
				path={`/${slug}`}
				date={date}
			/>
			<article>
				<div className={classes.container}>
					<header>
						<div className={classes['tags-wrapper']}>
							{tags.map((tag, i) => (
								<Tag tag={tag} key={`${tag}-${i}`} />
							))}
						</div>
						<h1>{title}</h1>
						<div className={classes['']}>
							<time dateTime={date} className={classes.createdAt}>
								{formattedDate}
							</time>
						</div>
					</header>
					<div className={classes['content-wrapper']}>
						<div className={classes.content}>
							{children}
							<div className={classes.divider}></div>
							<Comment />
						</div>
						{!isMobile && <ToC headingList={headingList} ref={ToCRef} />}
					</div>
				</div>
			</article>
		</>
	);
};
