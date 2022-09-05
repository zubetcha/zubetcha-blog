import classes from './PostCard.module.scss';
import { Tag } from '../Tag';
import { Typo } from '../Elements/Typo';

export const PostCard = () => {
	return (
		<div className={classes.container}>
			<div className={classes.contents_wrapper}>
				<div className={classes.tags_wrapper}>
					<Tag tag='javascript' />
					<Tag tag='javascript' />
					<Tag tag='javascript' />
				</div>

				<div className={classes.typos_wrapper}>
					<Typo role='headline-small' style={{ fontWeight: '700' }}>
						타이틀
					</Typo>
					<Typo role='body-large'>한줄요약</Typo>
				</div>

				<div className={classes.date_wrapper}>
					<div>
						<Typo>read more</Typo>
					</div>
					<Typo role='body-small' style={{ fontStyle: 'selif' }}>
						2022 / 09 / 05
					</Typo>
				</div>
			</div>
		</div>
	);
};
