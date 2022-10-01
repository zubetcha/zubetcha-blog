import { useLayoutEffect } from 'react';
import { useRouter } from 'next/router';

export default function HomePage() {
	const router = useRouter();
	useLayoutEffect(() => {
		router.push('/page/1');
	}, []);

	return <></>;
}
