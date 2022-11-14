import { HeadingContent } from '@type/post';
import classes from './ToC.module.scss';

interface Props {
	headingList: Array<HeadingContent>;
}

export const ToC = ({ headingList }: Props) => {
	console.log(headingList);
	return (
		<div className={classes.ToC}>
			<ul>
				{headingList.map(({ link, text, className }) => {
					return (
						<li className={classes[className]}>
							<a href={link}>{text}</a>
						</li>
					);
				})}
			</ul>
		</div>
	);
};
