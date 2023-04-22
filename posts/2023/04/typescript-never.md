---

title: '[Typescript] never 타입에 대한 고찰'
category: Typescript
date: 2023-04-22
description: 
published: false
slug: typescript-never
tags: 
  - typescript
  - never

---

# 들어가며

요즘 타입스크립트 공부를 위해 [type-challenges](https://github.com/type-challenges/type-challenges) 문제들을 풀어보는 스터디를 하고 있는데, 며칠 전 푼 문제 중 이런 게 있었다.

```jsx
/* _____________ 여기에 코드 입력 _____________ */
type IsNever<T> = any;

/* _____________ 테스트 케이스 _____________ */
import type { Equal, Expect } from '@type-challenges/utils'

type cases = [
  Expect<Equal<IsNever<never>, true>>,
  Expect<Equal<IsNever<never | string>, false>>,
  Expect<Equal<IsNever<''>, false>>,
  Expect<Equal<IsNever<undefined>, false>>,
  Expect<Equal<IsNever<null>, false>>,
  Expect<Equal<IsNever<[]>, false>>,
  Expect<Equal<IsNever<{}>, false>>,
]
```

제네릭으로 받은 타입이 never이면 true, never가 아니면 false로 타입이 추론되도록 푸는 문제였다.
처음에 문제를 보고는 medium 난이도인 것 치고는 생각보다 간단하게 풀 수 있을 것 같다는 생각이 들었다. 특정 조건에 따라 추론되어야 하는 타입이 다르니 extends를 사용해 조건부 타입을 활용하면 될 것만 같았다.
