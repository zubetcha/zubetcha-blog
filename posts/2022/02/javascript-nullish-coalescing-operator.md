---

title: nullish 병합 연산자
category: Javascript
description: 보다 더 촘촘한 예외처리를 위해 ✊🏻
date: 2022-02-24
published: true
tags:
  - javacript
  - nullish coalescing operator

---

## Table of Contents

## nullish 병합 연산자

nullish 병합 연산자 (nullish coalescing operator) `??` 를 사용하면 짧은 문법으로 여러 피연산자 중 그 값이 **확정되어 있는** 변수를 찾을 수 있다.

`a ?? b` 의 평가 결과는 아래와 같다.

- a가 null도 아니고 undefined도 아니면 a
- 그 외의 경우에는 b

nullish 병합 연산자 `??` 없이 **x = a ?? b** 와 동일한 동작을 하는 코드는 다음과 같다.

```jsx
x = (a !== null && a !== undefined) ? a : b;
```

아래의 예시를 살펴보자.

```jsx
let firstName = null
let lastName = undefined
let nickName = 'zubetcha'

console.log(firstName ?? lastName ?? nickName ?? 'anonymous') // 'zubetcha'
console.log(lastName ?? firstName ?? 'anonymous' ?? nickName) // 'anonymous'
```

<img src="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2Fljb5R%2Fbtruex9FIQ5%2FkWFq5AOGBsUHUpg09MHoOK%2Fimg.png" alt="nullish example" width="100%" />

<br/>

첫 번째 console.log

<br/>

- firstName의 값은 `null` 이기 때문에 무시하고 그 다음에 있는 피연산자인 **lastName의 값**을 평가한다.
- lastName의 값은 `undefined` 이기 때문에 무시하고 그 다음에 있는 피연산자인 **nickName의 값**을 평가한다.
- nickName의 값은 `zubetcha` 이기 때문에 (null 이나 undefined이 아니기 때문에) **해당 값을 반환**하고 그 다음에 있는 피연산자인 'anonymous' 는 평가하지 않는다.

<br/>

두 번째 console.log

<br/>

- lastName의 값은 `undefined` 이기 때문에 무시하고 그 다음에 있는 피연산자인 **firstName의 값**을 평가한다.
- firstName의 값은 `null` 이기 때문에 무시하고 그 다음에 있는 피연산자인 **anonymous** 를 평가한다.
- 'anonymouse' 는 `String` 으로, null 이나 undefined가 아니기 때문에 nullish 병합 연산자는 **anonymous**를 반환하고 그 다음에 있는 피연산자인 nickName은 평가하지 않는다.

<br/>

하지만 위와 같은 연산은 nullish 병합 연산자인 `||` 을 통해서도 동일한 값을 얻을 수 있다. 아래와 같이 `??` 를 `||` 로 변경하여도 동일하게 'zubetcha'와 'anonymous'가 출력되는 것을 확인할 수 있다. 그렇다면 `??` 와 `||` 에는 어떤 차이가 있을까?

```jsx
console.log(firstName || lastName || nickName || 'anonymous') // 'zubetcha'
console.log(lastName || firstName || 'anonymous' || nickName) // 'anonymous'
```

<img src="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FnStcO%2Fbtruk4yWxbX%2FNJx61STODWjPsQGncqztn0%2Fimg.png" alt="nullish example" width="100%" />

<br/>

## ||(or 연산자) 와의 차이

- `||` 는 첫 번째 **truthy 값**을 반환한다.
- `??` 는 첫 번째 **정의된(defined) 값**을 반환한다.

`??` 와 `||` 의 차이는 **숫자 0 등과 같이 false 로 간주하는 값을 어떻게 인식하여 처리하는지**에 있다. `||` 는 숫자 0을 **falsy한 값으로 취급**하여 null 이나 undefined를 할당한 것과 동일하게 처리하지만, `??` 는 반드시 **정확하게 null 이나 undefined**를 가지고 있는 게 아니면 본래 할당되어 있는 값으로 온전히 평가된다.

자바스크립트에서는 **기본적으로 false로 간주되는 값**들이 있는데, 바로 `숫자 0, ''(빈 문자열), NaN, null, undefined`이다. or 연산자인 `||` 는 실제로 직접 할당된 값이 false가 아니더라도 false로 간주되는 값이 `||` 의 앞에 위치하면 해당 값을 false로 처리하여 **반드시 || 의 뒤에 있는 값을 반환**한다.

```javascript
console.log(0 || nickName) // 'zubetcha'
console.log(0 || NaN) // NaN
console.log('' || 0) // 0
```

<img src="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FuOHfG%2FbtruefvbROU%2FkyYwhL20JyDd4Xmqa5qDOK%2Fimg.png" alt="nullish example" width="100%" />

<br/>

변수에 **falsy한 값**을 할당한 후 각 연산자 `||` 와 `??` 가 반환하는 값을 비교해보자.

💡 `숫자 0` 을 할당한 경우

```jsx
let z = 0

console.log(z || 100) // 100
console.log(z ?? 100) // 0
```

<img src="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2F3Bvd8%2Fbtruh7pyZjx%2FVhmCZxa6gS5tn2OH7YfMJk%2Fimg.png" alt="nullish 0 example" width="100%" />

<br/>

💡 `빈 문자열 ''` 을 할당한 경우

```jsx
let z = ''

console.log(z || 100) // 100
console.log(z ?? 100) //
```

<img src="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FciLPHe%2Fbtruc57uLM5%2FoqmSWo6W93bE9Y1oq8R4MK%2Fimg.png" alt="nullish empty string example" width="100%" />

<br/>

💡 `NaN` 을 할당한 경우

```jsx
let z = NaN

console.log(z || 100) // 100
console.log(z ?? 100) // NaN
```

<img src="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FbbnD7T%2FbtrueeC2zIt%2FTkxXKORUG0n183akEBUc3k%2Fimg.png" alt="nullish NaN example" width="100%" />

<br/>

💡 `null` 을 할당한 경우

```jsx
let z = null

console.log(z || 100) // 100
console.log(z ?? 100) // 100
```

<img src="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FyuEFD%2Fbtruk4eFs6J%2FcYw60Hb4YH7x04RUAfpdHK%2Fimg.png" alt="nullish null example" width="100%" />

<br/>

💡 `undefined` 를 할당한 경우

```jsx
let z = undefined

console.log(z || 100) // 100
console.log(z ?? 100) // 100
```

<img src="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2Fb6lAsJ%2Fbtruk308X3b%2F8FAus2mnK5HeGxguKeFO01%2Fimg.png" alt="nullish undefined example" width="100%" />

<br/>

각 연산자가 반환하는 값에서 알 수 있듯이, or 연산자 `||` 은 변수 z에 할당한 값이 **falsy한 값인지, truthy한 값인지**를 확인하여 falsy한 값이면 **무조건 || 뒤에 위치한 값을 반환**하고 있다. nullish 병합 연산자`??` 는 변수 z에 할당한 값이 `null` 또는 `undefined`인지, 아닌지를 확인하여 `??` 앞에 위치한 값이 `null` 또는 `undefined`인 경우에만 **?? 뒤에 있는 값을 반환**하고 있다.

단, nullish 병합 연산자 `??` 또한 or 연산자 `||` 와 같이 연산자의 **앞에 위치한 값을 확인**하므로 연산자 앞, 뒤에 모두 `null` 또는 `undefined`가 위치해 있더라도 연산자 앞에 있는 값이 `null` 또는 `undefined`이면 반드시 연산자 뒤에 있는 값을 반환한다.

```jsx
console.log(null ?? undefined) // undefined
console.log(undefined ?? null) // null
```

<img src="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FbzkyvJ%2FbtrunOWIwXh%2F5CZq1AnuxkI33uShJioUMK%2Fimg.png" alt="nullish example" width="100%" />

<br/>

---

읽어주셔서 감사합니다. 혹시 잘못된 정보가 있다면 메일로 신고 부탁드립니다. 🙇🏻‍♀️
