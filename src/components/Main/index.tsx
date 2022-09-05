import { Typo } from '../Elements/Typo';
import { PostCard } from '../PostCard';

export const Main = () => {
	return (
		<div>
			<Typo role='display-medium' style={{ fontWeight: '700' }}>
				All Posts
			</Typo>
			<div>
				<div>divider</div>
				<div>드롭다운: 태그, 최신순</div>
				<div>
					{new Array(20).fill(0).map((_) => (
						<PostCard />
					))}
				</div>
			</div>
		</div>
	);
};
