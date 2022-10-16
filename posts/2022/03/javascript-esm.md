---

title: ES Module
description: ESM이란 뭘까...?
category: Javascript
date: 2022-03-10
published: true
tags:
  - ESM

---

## Table of Contents

## 들어가면서

정재남님의 무근본 무계획 쇼핑몰 프로젝트 만드는 걸 따라하면서 새로운 것 투성이라 신기했다. 하나하나 차근차근 찾아보려고 우선 Vite의 공식문서부터 열고 가이드의 가장 첫 번째 섹션인 Vite를 사용해야 하는 이유부터 보는데 첫 문장부터 이해가 잘 되지 않았다...!

![vite](https://t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png)

생각해보니 프로젝트 하면서 너무나 당연하게 `export` 와 `import` 를 사용했고, 이게 ES6 부터 지원하는 모듈이라는 건 알고 있었는데 자세히 알아본 적이 없어서 단어들이 생소하게 느껴진 거였다.

그럼 `ES Module`에 대해서 살펴보자!

## ES Module이란?

ES Module은 ES6부터 도입된 모듈 시스템이다. export 및 import문을 사용하여 분리되어 있는 자바스크립트 파일 간의 접근을 가능하게 만들어준다.

## ES Module 등장 배경

### 기존의 문제점

초기의 자바스크립트 프로그램은 규모가 크지 않았기 때문에 대부분의 스크립트들이 독립적인 작업을 수행했다. 시간이 흐름에 따라 jQuery가 등장하고 어플리케이션의 규모가 커지면서 script 파일을 나누기 시작하였고, 필요한 자바스크립트 프로그램만 가져올 수 있도록 해주는 `모듈 분할`에 대한 필요성이 대두되기 시작했다.

ES Module이 등장하기 이전에는 각각의 script 파일을 `전역 스코프`처럼 사용했다. HTML 파일에서 보다 위에 있는 script 파일은 전역 스코프처럼 하위의 script 태그에서의 접근 또는 변경이 가능했는데, 이 때문에 jQuery script를 최상단에 두고 순서를 올바르게 구성하는 게 중요했다.

![global script](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fk.kakaocdn.net%2Fdn%2FvaUPc%2FbtrvE5cd0sN%2FifXmwJpIqPKa5lg6rh4ufK%2Fimg.png)

이러한 구조는 문제점을 가지고 있다.

<br/>

1. script 파일들을 올바른 순서대로 정렬해야 하기 때문에 **순서가 뒤틀리면** 에러를 발생시키고,
2. 하위에 있는 script가 상위 script의 상태를 쉽게 변경시키는 `전역 오염`이 발생하기 쉬우며,
3. 모든 script 파일에서 전역 스코프에 있는 변수들에 접근할 수 있기 때문에 하나의 script가 **어떤 script를 의존하고 있는지** 파악하기 어려워진다.
4. 궁극적으로 이와 같은 문제점들로 인해 **유지보수가 어려워진다.**

<br/>

![global script problem](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fk.kakaocdn.net%2Fdn%2Fbqj4PS%2FbtrvAbdXMGl%2Fwa5kGTqfHMaIAJ8QQ5fVJ0%2Fimg.png)

### 해결책 - 모듈화

모듈은 함수와 변수를 모듈 스코프에 넣고, 각 함수는 `함수 스코프`를 가진다. 이 때, `export`문을 사용하면 해당 변수와 함수를 다른 모듈에서 `import`문을 사용하여 의존할 수 있도록 해준다. 이러한 모듈화는 아래와 같은 장점을 가진다.

<br/>

1. `export-import`의 명시적인 의존성 관계로, 하나의 모듈이 제거되면 어떤 모듈이 손상되었는지를 파악하기 쉽다.
2. 코드들을 각각 **독립적으로** 동작할 수 있는 단위로 나누기 용이하다. 이는 모듈을 재사용함으로써 다양한 종류의 어플리케이션을 만들 수 있도록 도와주기도 한다.
3. export-import로 관계되어 있지 않은 모듈은 서로 오염을 일으키지 않는다.

<br/>

이미 node.js에는 `RequireJS`와 같은 `CommonJS`를 제공하고 있었으며, 그 외에도 `AMD 기반 모듈 시스템`, `Webpack`, `Babel` 같은 모듈 기반 시스템과 같이 모듈 사용을 가능하게 만들어주는 자바스크립트 라이브러리와 프레임워크가 존재한다.

기존에는 위와 같은 라이브러리에 의존해야 했던 모듈 기능을 `ECMAScript 6`부터 네이티브 자바스크립트에서도 지원하기 시작했으며 여러 브라우저에서도 모듈 로딩을 최적화할 수 있도록 모듈 기능을 지원하고 있다. 브라우저별 export와 import문의 호환성은 아래와 같다. _(IE에서는 무슨 일이 일어나고 있는 걸까..?)_

![export compati](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fk.kakaocdn.net%2Fdn%2FlBVVL%2FbtrvDjPn1VZ%2FsGEgkrYgnkQBsSJn7IkO11%2Fimg.png)

![import compati](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fk.kakaocdn.net%2Fdn%2FwCTg0%2FbtrvylgYMYG%2FDxb9oBdvwXKEMWCJJYVtkK%2Fimg.png)

## ES Module의 동작 방식

의존성 간의 연결은 `import` 문이 작성된 코드에서 발생한다. import 문은 브라우저 또는 node가 어떤 코드를 불러와야 하는지 인식하는 데 사용되며, import 문에서 지정한 파일(일반적으로 url)이 의존성 그래프의 `진입점` (entry point)이 되고 연결되어 있는 import 문을 따라가면서 의존성 그래프가 그려진다.

![dependency graph](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fk.kakaocdn.net%2Fdn%2FpKWFU%2FbtrvF98nr3g%2FglDWFt3C45h6P3m9UbL03k%2Fimg.png)

ES Module이 동작하기 위해서는 브라우저가 사용할 수 있도록 `모듈 레코드(Module Record)` 라고 하는 데이터 구조로 변환 작업 필요한데,

![module record](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fk.kakaocdn.net%2Fdn%2FLDIzR%2FbtrvF91Cgfe%2FDhxYzo5dK8FqBwKDkd3Dak%2Fimg.png)

이러한 모듈화 작업 과정은 `구성 → 인스턴스화 → 평가`의 세 단계를 거친다.

![modulization](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fk.kakaocdn.net%2Fdn%2Fcc6uFO%2FbtrvLgkf6ze%2FtAqUb2fa4GAnEaKekbFTV0%2Fimg.png)

### 1. 구성 (Construction)

구성 단계에서는 모듈이 들어 있는 파일을 어디서 다운로드 할 것인지 확인한 후 → URL을 통하거나 파일 시스템을 이용해 파일을 가져온 후 → 파일을 모듈 레코드로 구문분석한다.

이 때 파일을 불러오는 역할을 하는 것이 `로더(loader)`인데, 사용 중인 플랫폼에 따라 다른 로더를 가질 수도 있지만 브라우저의 경우 **HTML 명세를 따른다.** 로더는 스크립트 태그에서 진입점 파일을 찾을 수 있는 단서를 얻고 import문의 `모듈 지정자(module specifier)`를 통해 다음 모듈의 의존성을 파악한다. 또한 모듈 맵을 이용하여 각 모듈의 캐시를 관리하기도 한다.

![module specifier](https://t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png)

### 2. 인스턴스화 (Instantiation)

자바스크립트 엔진은 먼저 모듈 환경 레코드를 생성한 후 이를 통해 모듈 레코드의 변수를 관리한다. 생성된 모듈 환경 레코드는 각 export와 연관되어 있는 메모리 공간을 추적하는데, 이 때 자바스크립트 엔진은 다른 것에 의존하지 않는 **그래프의 최하단까지** 조사한 후 export를 설정하고 모든 export를 연결한다.

**한 모듈에 대한 export와 import는 같은 메모리 주소를** 가르키게 되는데, 이를 `라이브 바인딩`이라고 한다. 이는 import들이 각각의 export에 연결되어 있다는 것을 보장한다. 이렇게 함으로써 해당 모듈을 import하는 모듈에서는 export하는 모듈에서 발생하는 변경사항을 알 수 있게 된다. 하지만 import하는 모듈에서는 **가져온 값을 변경할 수는 없다.** (단, 모듈이 객체를 가져오는 경우에는 해당 객체에 있는 프로퍼티의 값을 변경할 수는 있다.)

node.js의 CommonJS는 export-import에서 라이브 바인딩이 아닌 **객체 복사**를 이용하기 때문에 나중에 export하는 모듈에서 값을 변경하더라도 **import하는 모듈에서는 변경사항을 파악할 수 없다.** 이 점이 ES Module과 CommonJS의 다른 점이다.

![commonjs](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fk.kakaocdn.net%2Fdn%2FctCEGE%2FbtrvKp9SVVO%2FrCFUQhnr5Dh9oWEnjsFEX1%2Fimg.png)

### 3. 평가 (Evaluation)

평가 단계에서는 코드를 실행하여 메모리 공간에 실제 값을 채운다. 자바스크립트 엔진은 함수 외부 코드인 최상위 레벨 코드를 실행하여 이를 수행한다. 평가는 수행한 횟수에 따라 다른 결과를 가질 수 있기 때문에 **한 번만 평가하도록 설계되어 있다.**

![evaluation](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fk.kakaocdn.net%2Fdn%2FW8yfQ%2FbtrvI4lcfo4%2FoB3bNJDdEeC0KCBwk5W3XK%2Fimg.png)

## ES Module 사용 방법

### 몇 가지 특징

<br/>

1. `함수`, var, let, const 키워드를 사용한 `변수`, `클래스`를 export 하거나 import 할 수 있다.
2. export문은 최상위 항목이어야 한다. 예를 들어, **함수 안에서는 export문을 사용할 수 없다.**
3. 내보내거나 가져올 때는 **중괄호 {}** 로 묶을 수 있다.
4. 스크립트를 모듈로 선언하려면 `script` 태그 속성에 `type="module"`을 포함시키면 된다.

<br/>

### 기본 사용법

각각 내보내기

```jsx
export const name = 'square';

export function draw(ctx, length, x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, length, length);

  return {
    length: length,
    x: x,
    y: y,
    color: color
  };
}
```

묶어서 내보내기

```jsx
export { name, draw, reportArea, reportPerimeter };
```

묶어서 가져오기

```jsx
import { name, draw, reportArea, reportPerimeter } from './modules/square.js';
```

### Renaming

export문과 import문의 중괄호 {} 안에 `as` 키워드를 이용하여 식별 가능한 이름으로 변경하면 **동일한 이름의 여러 함수를 하나의 모듈로 가져오려고 할 때** 발생할 수 있는 충돌과 에러를 방지할 수 있다.

export문 renaming

```jsx
// inside module.js
export {
  function1 as newFunctionName,
  function2 as anotherNewFunctionName
};

// inside main.js
import { newFunctionName, anotherNewFunctionName } from './modules/module.js';
```

import문 renaming

```jsx
// inside module.js
export { function1, function2 };

// inside main.js
import { function1 as newFunctionName,
         function2 as anotherNewFunctionName } from './modules/module.js';
```

### Module Object

위와 같이 이름을 변경하는 것은 상황에 따라 코드가 길어지고 지저분해질 수 있다. 이런 경우에는 각 모듈의 기능을 객체로 묶어 가져옴으로써 해결할 수 있다. 아래의 구문을 사용하면 module.js 내에서 사용할 수 있는 모든 export를 가져와서 각 export들을 **Module 객체의 프로퍼티**처럼 사용할 수 있다.

Syntax

```jsx
import * as Module from './modules/module.js';

Module.function1()
Module.function2()
etc.
```

### Module 집합

모듈을 모아야 할 때 여러 서브 모듈을 **하나의 부모 모듈로 결합하여** 사용할 수 있다.

예를 들어 기존에는 아래와 같이 각각의 서브 모듈을 따로 따로 가져와서 사용했다면,

```jsx
// main.js
import { Square } from './modules/square.js';
import { Circle } from './modules/circle.js';
import { Triangle } from './modules/triangle.js';
```

위의 세 모듈을 하나의 shape.js 라는 임의의 상위 모듈으로 집합시켜서 한 줄로 작성할 수 있다.

structure

```jsx
modules/
  shapes.js
  shapes/
    circle.js
    square.js
    triangle.js
```

example

```jsx
// shape.js
export { Square } from './shapes/square.js';
export { Triangle } from './shapes/triangle.js';
export { Circle } from './shapes/circle.js';
```

```jsx
// main.js
import { Square, Circle, Triangle } from './modules/shapes.js';
```

주의할 점은 shape.js에서 참조되고 있는 export들은 파일을 통해 리다이렉트되는 것일 뿐 실제로는 shape.js 안에 존재하는 게 아니기 때문에 같은 파일 안에서는 유용한 코드를 작성할 수 없다는 것이다.

### 동적 모듈 로딩

동적 모듈 로딩을 사용하면 모든 모듈들을 최상위에서 불러오는 것이 아닌, **필요할 때만** 모듈을 동적으로 불러올 수 있다. 아래와 같이 `import()` 를 함수로 호출하여 파라미터로 `모듈 경로`를 전달하고, 모듈 객체를 사용하여 `promise`를 반환하면 해당 모듈 객체가 가지고 있는 export에 접근할 수 있다.

```jsx
import('/modules/myModule.js')
  .then((module) => {
    // Do something with the module.
  });
```

### Default export & Named export

지금까지 본 export는 내보내지는 함수, 변수, 클래스 등의 항목이 **이름으로 참조**되는 `named export` 이다. named export는 해당 모듈들을 import 할 때에도 이 이름을 참조한다. named export 외에도 `default export` 라고 불리는 export도 존재하는데, 이는 모듈이 제공하는 기본 기능을 쉽게 만들 수 있도록 설계되었다. 또한 모듈을 기존의 CommonJS와 AMD 모듈 시스템과 함께 사용하는 데에도 도움을 준다.

`default export`는 **하나의 모듈에 하나만 존재할 수 있기 때문에** import 할 때 해당 모듈이 default 값임을 알 수 있다. 사용할 때는 named export와 마찬가지로 선언과 분리할 수도 있고, 선언과 동시에 내보낼 수도 있다. 사용 방법은 아래와 같이 `export default` 키워드를 앞에 붙이는 것이다.

```jsx
// 선언과 내보내기 분리

export default randomSquare;

// 선언과 동시에 내보내기

export default function(ctx) {
  // ...
}
```

import문은 아래와 같이 `{default as ...}` 가 기본형이지만 단축하여 사용할 수도 있다.

```jsx
// 기본형

import { default as randomSquare } from './modules/square.js';

// 단축형

import randomSquare from './modules/square.js';
```

`default export`를 사용할 때는 아래의 두 가지를 유의하는 게 좋다.

<br/>

1. named export와 달리 export문과 import문에 **중괄호가 없다.**
2. 함수나 클래스와 달리 `변수`는 **선언과 동시에 내보내기가 불가능**하기 때문에 반드시 선언과 내보내기를 분리하여 작성해야 한다.

<br/>

ES Module의 사용 예시는 [mdn의 js-examples 깃허브](https://github.com/mdn/js-examples/blob/master/modules/dynamic-module-imports/main.js)에 자세히 나와 있으니 참고하면 좋을 것 같다.

---

읽어주셔서 감사합니다. 혹시 잘못된 정보가 있다면 메일로 신고 부탁드립니다. 🙇🏻‍♀️
