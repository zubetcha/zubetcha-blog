---

title: '실행 컨텍스트, 스코프 체인과 호이스팅'
category: Javascript
date: 2022/02/14
description: 함수 실행 파헤치기!
published: true
tags: 
  - execution context
  - hoisting
  - scope chain

---

## Table of Contents

## 실행 컨텍스트 (Execution Context)

- 실행 컨텍스트는 **코드를 실행하는 데 필요한 조건이나 환경 정보 등을 수집해 놓은 객체**를 뜻한다.
- 실행 컨텍스트는 1) 전역 공간에서 익명 함수 실행 시, 2) eval 함수 실행 시, 3) 함수 실행 시, 4) {} 코드 블럭 사용 시 생성된다.

<br/>

if문, for문, switch문, while문 등의 반복문이나 조건문은 let과 const 키워드에 대해서는 별개의 독립된 공간으로서의 역할을 하지만 별도의 실행 컨텍스트가 생성되지는 않으며, 함수라 하더라도 함수의 실행 내용을 정의해 놓은 **정의부가 아닌 실행문을 만나야** 실행 컨텍스트가 생성된다.

아래 코드의 실행 순서와 출력값을 예측해보자.

```javascript
var a = 1;
function outer () {
  console.log(a); // 1번 console.log
  function inner () {
    console.log(a); // 2번 console.log
    var a = 3;
  }
  inner();
  console.log(a); // 3번 console.log
}
outer();
console.log(a); // 4번 console.log

```

전역 공간은 자동으로 전역 컨텍스트로 구성된다.

<br/>

1. 전역 컨텍스트가 열리고 전역 공간의 코드를 한 줄 한 줄 실행한다.
2. outer 함수를 실행하는 명령을 만나 outer 함수를 실행함에 따라 outer 컨텍스트가 열린다.
3. outer 함수 내부에 대해서 한 줄 한 줄 실행한다.
4. 1번 console.log(a)를 만나 실행한다. outer 함수 내부에는 정의되어 있는 a가 없기 때문에 outer 함수 밖의 전역 공간에서 a를 찾아 1을 출력한다.
5. inner 함수를 실행하는 명령을 만나 inner 함수를 실행함에 따라 inner 컨텍스트가 열린다.
6. inner 함수 내부에 대해서 한 줄 한 줄 실행한다.
7. 2번 console.log(a)를 만나 실행한다. inner 함수 내부의 a가 정의되어 있기는 하지만 console.log가 정의부보다 먼저 실행되기 때문에 var a의 초기화 단계인 undefined가 출력된다.
8. inner 함수의 실행 컨텍스트가 종료되면 그 다음 줄의 3번 console.log(a)를 만나 실행한다. 3번 또한 outer 함수 내부에는 정의되어 있는 a가 없기 때문에 outer 함수 밖의 전역 공간에서 a를 찾아 1을 출력한다.
9. outer 함수의 실행 컨텍스트가 종료되면 그 다음 줄의 4번 console.log(a)를 만나 실행한다. 4번 console.log는 가장 가까운 전역 공간에 a가 정의되어 있기 때문에 1을 출력한다.
10. 전역 컨텍스트의 모든 코드 실행이 끝나면 전역 컨텍스트가 종료된다.

<br/>

### Call Stack

위의 순서를 보면 **전역 컨텍스트 → outer 컨텍스트 → inner 컨텍스트** 순서로 **실행 컨텍스트가 생성**되지만, **컨텍스트의 종료**는 반대로 **inner 컨텍스트 → outer 컨텍스트 → 전역 컨텍스트**의 순서로 진행된다. 이처럼 가장 먼저 들어온 게 가장 마지막에 빠지고, 가장 마지막에 들어온 게 가장 먼저 빠지는 개념을 `스택(Stack)`이라고 한다. `콜 스택(Call Stack)`은 현재 어떤 함수가 실행 중인지, 다음에 어떤 함수가 호출될 예정인지를 제어하는 자료구조이다.

<div>
![Call Stack](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FcGZnto%2FbtrtlTruYT2%2FmDeSHtxnUR5PFH0RuOGss1%2Fimg.png)
</div>

## Variable Environment / Lexical Environment / This Binding

실행 컨텍스트에는 `Variable Environment`, `Lexical Environment`, `This Binding` 이라는 세 가지의 환경 정보가 담긴다. 이 중 Variable Environment와 Lexical Environment는 **현재의 환경과 관련된 식별자 정보**가 담긴다. 두 Environment의 차이는 변화를 추적하느냐, 추적하지 않느냐에 있다.

- Variable Environment는 오직 식별자 정보를 수집하는 데만 사용되어 변화가 반영되지 않는다.
- Lexical Environment는 실행 컨텍스트를 구성하는 환경 정보들을 사전처럼 구성한 객체이다. 수집된 **각 식별자의 데이터를 추적**하는 데 사용되어 변수의 값들에 변화가 생기면 Lexical Environment에 실시간으로 반영된다.

<br/>

### Lexical Environment = environmentRecord + outerEnvironmentReference

- environmentRecord → 현재 컨텍스트의 내부의 식별자 정보
- outerEnvironmentReference → 외부 환경에 있는 것들을 참조하는 정보

<br/>

## 스코프 체인 (Scope Chain)

`outerEnvironmentReference`는 현재 컨텍스트와 관련이 있는 **외부의 식별자 정보**를 참조한다. outerEnvironmentReference가 관여하는 것이 바로 스코프 체인(Scope Chain)이다. 스코프 체인(Scope Chain)은 outerEnvironmentReference에 의해서 만들어진다.

스코프 체인에서 '스코프'는 변수의 유효범위이다. 변수의 유효범위는 실행 컨텍스트에 의해 결정된다. 실행 컨텍스트가 수집해 놓은 정보에만 접근할 수 있기 때문이다. 현재 실행 컨텍스트의 Lexical Environment에는 외부 환경의 정보들을 참조할 수 있는 outerEnvironmentReference가 있기 때문에 outer, 즉 **외부의 Lexical Environment에 수집되어 있는 정보**들도 참조할 수 있게 되는 것이다.

outer의 실행 컨텍스트에는 inner에 대해서 수집해 놓은 정보가 없기 때문에 inner에서 선언한 변수에는 접근할 수 없게 된다. 즉 자기 자신의 외부로는 나갈 수 있지만 안쪽으로는 들어갈 수 없다.

<br/>

- inner 내부에서는 자기 자신의 environmentRecord와 outer 컨텍스트의 Lexical Environment, 전역 컨텍스트의 Lexical Environment에 접근할 수 있다.
- outer 컨텍스트는 자기 자신의 environmentRecord와 전역 컨텍스트의 Lexical Environment에만 접근할 수 있다.
- 전역 컨텍스트는 inner 컨텍스트와 outer 컨텍스트의 Lexical Environment 모두 접근할 수 없다.

<br/>

<div>
![Scope Chain](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2Fde7pum%2Fbtrtb0SS2tw%2FHUHCgNz7yR85TMlBgTTSU1%2Fimg.png)
</div>

만약 inner 내부에서 어떤 변수를 찾으라고 했을 때, 자기 자신의 environmentRecord에 해당 변수가 있는지 찾는다. 만약 inner 컨텍스트의 environmentRecord에 해당 변수가 없는 경우 outerEnvironmentReference를 타고 outer 컨텍스트의 environmentRecord에서 해당 변수가 있는지 찾는다. outer 컨텍스트의 environmentRecord에서 해당 변수가 없다면 다시 outer 컨텍스트의 outerEnvironmentReference를 타고 전역 컨텍스트로 가서 전역 컨텍스트의 environmentRecord에 해당 변수가 있는지 찾는다. 이것이 스코프 체인이다.

즉, **가장 가까운 자신에서부터 점점 멀리 있는 스코프로 찾아 나가는 것**을 뜻한다. 각각의 컨텍스트에 동일한 이름의 변수가 정의되어 있다 하더라도 **무조건 가장 가까이에 있는 값 한 개만** 참조할 수 있다.

## 호이스팅 (Hoisting)

실행 컨텍스트가 최초로 실행될 때 가장 먼저 하는 일은 **현재 컨텍스트 내부에 있는 식별자 정보를 수집**해서 `Environment Record`에 담는 것이다. 이 과정을 호이스팅 이라고도 한다.

호이스팅은 식별자 정보를 실행 컨텍스트의 맨 위로 끌어 올려지는 듯한 현상을 나타내는 개념이다. 실제로 끌어 올려지는 건 아니고, 그런 것처럼 동작하기 때문에 끌어 올려졌다고 간주하자~ 정도로 이해하면 될 것 같다. 실행 컨텍스트가 생성되는 순간에 가장 먼저 하는 일이 식별자 정보를 수집하는 것이기 때문에 이미 변수 또는 함수에 대한 정보를 가지고 있어 그렇게 보여지는 것이다.

```javascript
// 실제 코드

console.log(a())
console.log(b())
console.log(c())

function a() {
  return 'a'
}

var b = function bb() {
  return 'bb'
}

var c = function () {
  return 'c'
}
```

```javascript
// 실행 컨텍스트의 식별자 정보 수집

function a() {
  return 'a'
}
var b
var c
// 여기까지가 끌어 올려진 식별자 정보가 담긴 environmentRecord이다.
// 원래는 선언문만 끌어 올려지지만 함수는 함수 전체가 식별자 정보로 수집되는 특징이 있다.

console.log(a())
console.log(b())
console.log(c())

b = function bb() {
  return 'bb'
}

c = function () {
  return 'c'
}
```

호이스팅의 대상은 `모든 선언문`이다. 즉 모든 변수와 함수의 선언문은 실행 컨텍스트가 생성되면 가장 먼저 식별자 정보로서 수집된다. 그 중 함수는 무조건 함수 전체가 식별자 정보로 수집되는 특징이 있다. 이러한 이유로 함수의 선언보다 먼저 함수를 실행해도 문제가 없이 동작하는 것이다.

그렇다면 `var` 키워드로 선언한 변수와 `let`, `const` 키워드로 선언한 변수는 어떤 차이가 있을까?

변수 생성 과정은 **1) 선언 단계 → 2) 초기화 단계 (undefined로 초기화) → 3) 할당 단계**로 진행되는데, 호이스팅 대상은 선언문까지이기 때문에 아직 변수가 어떠한 값도 가지고 있지 않은 상태의 정보만 수집된다. 그래서 함수와 다르게 선언보다 먼저 참조할 경우 `let`, `const` 키워드로 선언한 변수는 ReferenceError가 발생한다.

`var` 키워드는 위의 변수 생성 과정에서 **1) 선언 단계와 2) 초기화 단계가 동시에** 이루어지는 특징이 있다. 그렇기 때문에 var 키워드로 선언하면 변수는 선언과 동시에 값을 할당하기도 전에 이미 `undefined`라는 값을 부여받게 된다. 이러한 이유로 var 키워드로 선언한 변수는 선언보다 먼저 참조하더라도 ReferenceError가 발생하지 않고 undefined를 참조하게 되는 것이다.
