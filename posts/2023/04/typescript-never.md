---

title: '[Typescript] never 타입에 대한 고찰'
category: Typescript
date: 2023-04-22
description: 
published: true
slug: typescript-never
tags: 
  - typescript
  - never

---

# 들어가며

요즘 타입스크립트 공부를 위해 [type-challenges](https://github.com/type-challenges/type-challenges) 문제들을 풀어보는 스터디를 하고 있는데, 며칠 전 `never` 타입과 관련된 문제를 풀게 되었다. 언뜻 보기에는 간단한 문제처럼 보였으나 결국 하나의 케이스만 통과하지 못한 채 문제를 푸는 데 실패했다.

never를 직접 타입으로 지정할 일이 거의 없었기 때문에 그냥 없는 타입(?) 정도로만 생각했었는데 이 참에 자세히 찾아 볼 필요가 있다는 생각이 들었다.

# never Shallow Dive

## never?

React로 개발을 해 본 사람이라면 한 번쯤 이런 경험을 한 적이 있을 것이다.

```jsx
const [array, setArray] = useState([])

useEffect(() => {
  // ❌ Type '{ name: string; gender: string; }' is not assignable to type 'never'.
  setArray([
    {
      name: 'zubetcha'
      gender: 'female'
    }
    {
      name: 'suda'
      gender: 'male'
    }
  ])
}, [])
```

useState로 초기 상태를 `빈 배열`로 할당한다. 그 다음, 어딘가로부터 받아 온 데이터로 setState를 통해 state를 업데이트한다. 이 때, 요소를 포함하고 있는 배열로 업데이트하려고 하는 경우 never 타입에 객체 타입은 할당할 수 없다는 타입스크립트 에러가 발생한다.

어떤 변수에 빈 배열을 할당할 때 타입을 별도로 지정해주지 않으면 해당 변수의 타입은 `never[]`로 추론된다. 아무래도 never에 할당할 수 없는 타입들이 존재하는 모양이다.

## never의 타입 호환성

다음은 타입스크립트 공식문서 중 [`타입 좁히기`](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)에서 발췌한 내용이다.

> - 타입스크립트는 **어떠한 상태도 존재하지 않다**는 것을 나타내기 위해 `never` 타입을 사용한다.
> - never 타입은 모든 타입에 할당이 가능하다. 하지만 자기 자신(never)을 제외한 어떠한 타입도 never 타입에 할당할 수 없다.

위와 같은 내용은 [타입 호환성](https://www.typescriptlang.org/docs/handbook/type-compatibility.html)에서도 살펴볼 수 있다.

|             | any | unknown | object | void | undefined | null | never |
| :---------: | :-: | :-----: | :----: | :--: | :-------: | :--: | :---: |
|    any →    |     |   ✅    |   ✅   |  ✅  |    ✅     |  ✅  |  ❌   |
|  unknown →  | ✅  |         |   ❌   |  ❌  |    ❌     |  ❌  |  ❌   |
|  object →   | ✅  |   ✅    |        |  ❌  |    ❌     |  ❌  |  ❌   |
|   void →    | ✅  |   ✅    |   ❌   |      |    ❌     |  ❌  |  ❌   |
| undefined → | ✅  |   ✅    |   ✅   |  ✅  |           |  ✅  |  ❌   |
|   null →    | ✅  |   ✅    |   ✅   |  ✅  |    ✅     |      |  ❌   |
|   never →   | ✅  |   ✅    |   ✅   |  ✅  |    ✅     |  ✅  |       |

즉, never 타입에는 어떠한 타입도 할당할 수 없다. 위에서 살펴본 객체뿐만 아니라 never가 아니라면 할당이 불가능한 것이다.

따라서 배열을 선언할 때에는 요소로 어떤 타입이 올 수 있는지 명시해줘야 한다.

# never Deep Dive

## union과 never

- 유니온 타입에서의 never는 없는 것과 마찬가지이다. 유니온에 never가 포함되어 있는 경우, 마치 없는 것처럼 추론된다.

```jsx
type Test = string | never // string
```

## intersection과 never

- 교차 타입에서 never는 모든 타입을 덮어씌운다.

```jsx
type Test = { a: number } & { b: string } & never; // never
```

- 호환되지 않는 타입들을 교차하면 never 타입으로 추론된다.

```jsx
type Test = number & string // never
```

## never 타입 에러를 읽는 방법

## never 타입의 다양한 활용법

## never 타입 검사

### IsNever

아래는 타입 챌린지 문제 중 하나인 [IsNever](https://github.com/type-challenges/type-challenges/tree/main/questions/01042-medium-isnever)이다. 요구사항은 간단하다.

- IsNever는 제네릭으로 받은 T가 never인지 아닌지를 판별하여
- never이면 true, 아니면 false를 내보내는 유틸 타입이다.

```jsx
/* _____________ 여기에 코드 입력 _____________ */
type IsNever<T> = any;

/* _____________ 테스트 케이스 _____________ */

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

```jsx
type IsNever<T> = T extends never ? true : false;

type cases = [
  Expect<Equal<IsNever<never>, true>>, // ❌
  Expect<Equal<IsNever<never | string>, false>>, // ✅
  Expect<Equal<IsNever<''>, false>>, // ✅
  Expect<Equal<IsNever<undefined>, false>>, // ✅
  Expect<Equal<IsNever<null>, false>>, // ✅
  Expect<Equal<IsNever<[]>, false>>, // ✅
  Expect<Equal<IsNever<{}>, false>>, // ✅
]
```

참고

- [The Type Hierarchy Tree](https://www.zhenghao.io/posts/type-hierarchy-tree#the-bottom-of-the-tree)
- [타입스크립트의 Never 타입 완벽 가이드](https://ui.toast.com/posts/ko_20220323)
