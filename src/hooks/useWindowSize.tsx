import { useState, useEffect } from 'react';

type Dimension = 'width' | 'height';
export const useWindowSize = () => {
	const [windowSize, setWindowSize] = useState<{
		[key in Dimension]: undefined | number;
	}>({
		width: undefined,
		height: undefined,
	});
	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		const handleResize = () => {
			let vh = window.innerHeight * 0.01;
			document.documentElement.style.setProperty('--vh', `${vh}px`);

			setWindowSize({
				width: window.innerWidth,
				height: window.innerHeight,
			});
		};

		window.addEventListener('resize', handleResize);

		handleResize();

		return () => window.removeEventListener('resize', handleResize);
	}, []);

	useEffect(() => {
		if (!windowSize.width) {
			return;
		}

		windowSize.width < 768 ? setIsMobile(true) : setIsMobile(false);
	}, [windowSize.width]);

	return {
		...windowSize,
		isMobile,
	};
};
