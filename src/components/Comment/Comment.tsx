import { useEffect, useRef } from 'react';

export const Comment = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      const utterances = document.createElement('script');
      const attributes = {
        src: 'https://utteranc.es/client.js',
        repo: 'zubetcha/zubetcha-blog',
        'issue-term': 'url',
        label: 'comment',
        theme: 'dark-blue',
        crossorigin: 'anonymous',
        async: 'true',
      };
      Object.entries(attributes).forEach(([key, value]) => {
        utterances.setAttribute(key, value);
      });
      containerRef.current.appendChild(utterances);
    }
  }, []);

  return <div id='comment' ref={containerRef} />;
};
