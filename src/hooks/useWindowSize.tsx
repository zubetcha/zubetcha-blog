import { useState, useEffect } from 'react';

type Dimension = 'width' | 'height';
export const useWindowSize = () => {
	const [windowSize, setWindowSize] = useState<{
		[key in Dimension]: undefined | number;
	}>({
		width: undefined,
		height: undefined,
	});
	useEffect(() => {
		const handleResize = () => {
			setWindowSize({
				width: window.innerWidth,
				height: window.innerHeight,
			});
		};

		window.addEventListener('resize', handleResize);

		handleResize();

		return () => window.removeEventListener('resize', handleResize);
	}, []);

	return windowSize;
};
