---
title: '블로그 만들 수 있을까?ㅠ'
category: 'React'
tags:
  - blog
  - test
published: true
date: 2022-09-14 00:21:56
description: '블로그 만들 수 있겠지....!'
---

## h2 블로그 만들기~

### 이거는 h3

`이거는 강조`

```JSX
import classes from './Post.module.scss';
import { formatDate, formatDateInKorean } from '@utils/date';
import { Tag } from '@components/index';
import { FrontMatter } from '@type/post';

interface Props {
	children: JSX.Element;
	frontMatter: FrontMatter;
	slug: string;
}

export const PostContainer = ({ children, frontMatter }: Props) => {
	const { title, date, tags, category } = frontMatter;
	console.log(frontMatter);
	return (
		<article>
			<div className={classes.container}>
				<header>
					<div className={classes['tags-wrapper']}>
						{tags.map((tag) => (
							<Tag tag={tag} />
						))}
					</div>
					<h1>{title}</h1>
					<div>
						<time dateTime={formatDate(date)} className={classes.createdAt}>
							{formatDate(date)}
						</time>
						<p>zubetcha</p>
					</div>
				</header>
				<div className={classes.content}>{children}</div>
			</div>
		</article>
	);
};
```

이거는 그냥 본문 내용!

[a 태그](https://eslint.org/docs/latest/rules/no-restricted-imports)

> 여기는 인용구~
