import classes from './PostCard.module.scss';
import { Tag } from '../Tag/Tag';
import { Typo } from '../Elements/Typo/Typo';
import { Post } from '../../types/post';

interface Props {
	post: Post;
}
export const PostCard = ({ post }: Props) => {
	console.log(post);
	const { frontMatter, fields } = post;
	const { tags, title, description, date } = frontMatter;
	const updatedAt = new Date(date);
	console.log(updatedAt);
	return (
		<div className={classes.container}>
			<div className={classes.contents_wrapper}>
				<div className={classes.tags_wrapper}>
					{tags.map((tag) => (
						<Tag tag={tag} />
					))}
				</div>

				<div className={classes.typos_wrapper}>
					<Typo role='headline-small' style={{ fontWeight: '700' }}>
						{title}
					</Typo>
					<Typo role='body-large'>{description}</Typo>
				</div>

				<div className={classes.date_wrapper}>
					<div>
						<Typo role='body-medium'>read more</Typo>
					</div>
					<Typo role='body-small' style={{ fontStyle: 'selif' }}>
						{date}
					</Typo>
				</div>
			</div>
		</div>
	);
};
