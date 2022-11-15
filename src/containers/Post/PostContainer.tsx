import { RefObject, useRef } from 'react';
import { useWindowSize } from '@hooks/useWindowSize';
import classes from './Post.module.scss';
import { formatDate } from '@utils/date';
import { getBlogJSONLD } from '@utils/page';
import { Tag, PostSEO, ToC } from '@components/index';
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
							{tags.map((tag) => (
								<Tag tag={tag} />
							))}
						</div>
						<h1>{title}</h1>
						<div className={classes['']}>
							<time dateTime={date} className={classes.createdAt}>
								{formattedDate}
							</time>
							{/* <p>zubetcha</p> */}
						</div>
					</header>
					<div className={classes['content-wrapper']}>
						<div className={classes.content}>{children}</div>
						{!isMobile ? <ToC headingList={headingList} ref={ToCRef} /> : null}
					</div>
				</div>
			</article>
		</>
	);
};
