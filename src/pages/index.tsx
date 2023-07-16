import { useLayoutEffect } from 'react';
import { useRouter } from 'next/router';

export default function HomePage() {
  const router = useRouter();

  useLayoutEffect(() => {
    router.push('/post?page=1');
  }, [router]);

  return <></>;
}
