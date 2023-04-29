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

# never Deep Dive

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

## never 타입이란?

타입스크립트에서 never 타입은 값의 공집합을 의미한다. 즉, never 타입은 값을 포함할 수 없는 빈 타입이다.

never 타입은 아래와 같은 상황에서의 타입을 나타낸다.

- 값을 포함할 수 없는 빈 타입

  - 제네릭과 함수에서 허용되지 않는 매개변수
  - 호환되지 않는 타입들의 교차 타입
  - 빈 합집합(무의 합집합)

- 실행이 끝날 때 호출자에게 제어를 반환하지 않는 함수의 반환 타입

  - 예) Node의 process.exit
  - void는 호출자에게 함수가 유용한 것을 반환하지 않는다는 것이므로 혼동하지 않도록 한다.

- 절대로 도달할수 없을 esle 분기의 조건 타입
- 거부된 프로미스에서 처리된 값의 타입

```jsx
const p = Promise.reject('foo') // const p: Promise<never>
```

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

## never 타입 오류 메시지

```jsx
function f1(obj: { a: number, b: string }, key: 'a' | 'b') {
    obj[key] = 1;    // ❌ Type 'number' is not assignable to type 'never'.
    obj[key] = 'x';  // ❌ Type 'string' is not assignable to type 'never'.
}
```

위의 예제를 살펴보면, 변수에 빈 배열을 할당하여 선언했을 때와 마찬가지로 개발자가 직접 타입에 never를 사용하지는 않았지만 오류 메시지에 `never`가 등장한다.

obj[key]에 호환될 수 있는 타입은 두 가지이다. 런타임 환경에서 key에 `a`가 오면 obj[key]의 타입은 `number`가 된다. 만약 key에 `b`가 오면 obj[key]의 타입은 string이 된다. 그러나 key에 어떤 값이 올 지 알 수 있는 지는 런타임에만 알 수 있다.

이러한 상황에서 타입스크립트는 안정적으로 타입을 검사하기 위해 obj[key]의 타입을 가능한 모든 타입을 호환할 수 있는 `교차 타입`으로 추론한다. obj[key]에 할당 가능한 교차 타입은 `number & string` 이다. 그리고 number 타입과 string 타입은 상호 호환이 불가능한 타입이기 때문에 never 타입이 무엇인지 살펴봤던 것처럼 never 타입으로 추론되는 것이다.

또한 앞서 살펴봤던 것처럼 never 타입에는 자기 자신을 제외한 어떠한 타입도 할당할 수 없다. 즉, 위의 오류 메시지는 obj[key]의 타입은 never인데 다른 타입을 할당하려고 하니 발생하는 것이다.

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

never 타입에 대해 잘 모르고 있는 채로 문제만 봤을 때 난이도가 medium인 것 치고는 문제가 쉬운 거 아닌가..! 하는 우매한 생각을 했었다..😸 제네릭으로 받은 T를 never 타입과 비교만 해주면 될 것 같았다. 그리고 결과는 이러했다.

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

제네릭으로 never 타입을 받은 케이스만 풀리지 않았다. 그래서 `IsNever<never>`가 어떻게 추론되는지 확인해봤다.

```jsx
type Test = IsNever<never> // never
```

결과는 true도, false도 아닌 `never`였다.

### 조건부 타입과 제네릭

never 타입을 검사하는 방식을 알려면 먼저 조건부 타입에 대해서 알고 있어야 한다. 타입스크립트의 조건부 타입은 자바스크립트의 조건부 타입과 비슷하다.

```jsx
// 자바스크립트
condition ? trueExpression : falseExpression

// 타입스크립트
SomeType extends OtherType ? TrueType : FalseType;
```

`extends` 키워드의 왼쪽에 위치한 타입이 오른쪽에 위치한 타입에 할당이 가능한 타입이면 콜론(:)의 왼쪽 타입으로 추론되고, 그렇지 않으면 오른쪽 타입으로 추론된다.

그리고 조건부 타입에 `제네릭`을 받으면 조건부 타입이 유니온 타입으로 추론되는 독특한 방식으로 동작한다. 다음은 타입스크립트 공식문서에 있는 예제를 가져온 것이다.

```tsx
type ToArray<Type> = Type extends any ? Type[] : never;
```

코드만 봤을 때는 제네릭 Type에 전달한 타입을 요소로 가지는 배열로 추론해 줄 것 같지만 실제로는 조금 다르게 동작한다. 예를 들어 Type에 string 또는 number 유니온 타입을 전달하면 아래와 같이 추론된다.

```tsx
type Test = ToArray<string | number>

// ❌ (string | number)[]
// ✅ string[] | number[]
```

즉, 제네릭으로 받은 타입을 유니온 타입으로 취급하여 각 타입 멤버들마다 조건부 타입 추론을 반복한다. `ToArray<string | number>`는 사실 `ToArray<string> | ToArray<number>`와 같은 것이다.

보다 더 자세한 내용은 [타입스크립트 공식문서](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html)에 잘 정리되어 있다.

### empty union

never 타입은 없는 타입, 빈 타입이다. 따라서 never 타입이 유니온 타입이 되면 빈 유니온이다.

바로 위의 조건부 타입 예제에서 제네릭으로 받은 타입은 유니언 타입으로 분배되었다.

```tsx
ToArray<string | number>
ToArray<string> | ToArray<number>
string[] | number[]
```

다시 IsNever 타입 챌린지 문제로 돌아가보면,

```tsx
type IsNever<T> = T extends never ? true : false;
type Test = IsNever<never>;
```

제네릭 T로 받은 never는 빈 유니언이 된다. 빈 유니언은 또다른 유니언 타입으로 분배할 수 있는 타입이 없다. 그래서 빈 유니언은 유니언 타입으로 분배되어도 또다른 빈 유니언으로 도출될 뿐인 것이다.

<br/>

참고

- [The Type Hierarchy Tree](https://www.zhenghao.io/posts/type-hierarchy-tree#the-bottom-of-the-tree)
- [A Complete Guide To TypeScript's Never Type](https://www.zhenghao.io/posts/ts-never)
- [타입스크립트의 Never 타입 완벽 가이드](https://ui.toast.com/posts/ko_20220323)
- [Typescript Issue: Conditional Types - Checking extends never only works sometimes](https://github.com/microsoft/TypeScript/issues/23182)
