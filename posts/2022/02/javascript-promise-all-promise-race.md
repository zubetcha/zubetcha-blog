---

title: 'Promise.all & Promise.race'
category: Javascript
date: 2022-02-18
description: Promise all과 Promise race는 언제 사용할까? 🤔
published: true
tags:
  - javascript
  - promise

---

## Table of Contents

## Promise.all

![Promise.all](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FbrAHwE%2FbtrtJCRmHUE%2FbUylqkmqvh9SONVmjYsWcK%2Fimg.png)

`Promise.all`은 파라미터로 주어진 `Iterable 객체`(보통은 배열의 형태가 많음)의 **모든 프로미스를 이행**한 후 새로운 프로미스를 반환한다. 이 때 반환되는 프로미스는 파라미터로 받은 배열 안의 프로미스의 결과값을 담은 새로운 배열을 result로 가지게 된다. 새로운 프로미스의 result 배열의 요소 순서는 Promise 이행 완료의 순서와는 상관 없이 **Promise.all의 파라미터 배열의 요소 순서와 상응**한다.

Promise.all은 서로 관련된 여러 프로미스의 결과를 집계할 때 유용하며, 다음 코드를 실행하기 전에 연관되어 있는 비동기 작업들이 모두 이행이 완료되어야 하는 경우에 사용된다.

### Syntax

```javascript
Promise.all(iterable)
// iterable은 배열 등과 같이 순회가 가능한 객체

```

### 특징

📌 반환되는 결과 배열의 순서는 작업 완료 순서와 관계 없이 파라미터로 받은 배열(순회 가능한 객체)의 순서와 동일하다.

```javascript
function timer(time) {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      resolve(time)
    }, time)
  })
}

console.time('Promise.all')
Promise.all([timer(2000), timer(1000), timer(3000)]).then(function (result) {
  console.log('result', result)
  console.timeEnd('Promise.all')
})

```

![promise.all resolved result](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FHMQ81%2FbtrtEx4pGjJ%2FPnrF5bkVHZdqQEtuBm1iz0%2Fimg.png)

📌 파라미터로 받은 프로미스 중 한 개라도 거부되면 (실패하면) Promise.all() 전체도 즉시 거부된다.

```javascript
const ppp = Promise.all([timer(2000), timer(1000), timer(3000), Promise.reject(15)])
console.log(ppp)
setTimeout(() => {
  console.log(ppp)
})

```

![promise all rejected result](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FYdZO2%2FbtrtHDjoW4E%2FOMKSEYythTpATGoPjpfp8k%2Fimg.png)

📌 순회 가능한 객체가 비어 있는 경우 동기적으로 즉시 이행하며, 즉시 이행한 프로미스를 반환한다.

```javascript
const p = Promise.all([])
console.log(p)

```

![promise.all](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2Fz7r3n%2FbtrtG7K4O9X%2FhhIHDifAnVcn2f6g0YtZS1%2Fimg.png)

📌 순회 가능한 객체에 프로미스가 아닌 값이 있으면 해당 값은 무시되지만 비동기적으로 이행되며 결과 배열에도 포함된다.

```javascript
// 프로미스 객체가 포함되어 있지 않은 경우
const pp = Promise.all([1, 2, 3])
console.log(pp)
setTimeout(() => {
  console.log(pp)
})

```

![promise.all](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FdPEy5j%2FbtrtMJIY5os%2F4vXwIrP7ZIjQIxTJKkLIc0%2Fimg.png)

```javascript
// 프로미스 객체도 포함되어 있는 경우
const pp = Promise.all([1, 2, 3, timer(2000)])
console.log(pp)
setTimeout(() => {
  console.log(pp)
}, 2000)

```

![promise.all](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FbHeNFW%2FbtrtH2b9f2l%2Fy3RLxmRI7trEkjS9ODKO5K%2Fimg.png)

## Promise.race

![promise.race](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FbPSY3c%2FbtrtO9f3dH7%2FpHOqWKOSFeGBQJ2WtH1DKK%2Fimg.png)

`Promise.race`는 Promise.all과 동일하게 파라미터로 `Iterable 객체`(순회 가능한 객체)를 받는다. 따라서 Promise.race의 구문은 Promise.all과 동일하다. 다만 차이는 이행 결과에 있다. Promise.race는 파라미터로 받은 프로미스들 중 **가장 먼저 완료되는 프로미스** 한 개의 이행 또는 거부의 결과값만을 반환한다.

### Syntax

```javascript
Promise.race(iterable)
// iterable은 배열 등과 같이 순회가 가능한 객체

```

### 특징

📌 파라미터로 받은 프로미스 중 가장 먼저 처리되는 프로미스의 결과 또는 에러를 반환한다.

```javascript
console.time('Promise.race')
Promise.race([timer(2000), timer(1000), timer(3000)]).then(function (result) {
  console.log('result', result)
  console.timeEnd('Promise.race')
})

```

![promise.race result](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2Fdy923c%2FbtrtLzGB26C%2F5MlHssknKMrn8vdTsy9zWk%2Fimg.png)

📌 파라미터로 비어 있는 Iterable을 전달할 경우 영원히 대기 상태(pending)가 된다.

```javascript
const race = Promise.race([])
console.log(race)
setTimeout(() => {
  console.log(race)
})

```

![promise.race result](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FvuWYQ%2FbtrtO8nYGe4%2F0RWnmr20yfsng2hNcKmxY0%2Fimg.png)

📌 파라미터로 프로미스가 아닌 값 또는 이미 이행이 완료된 프로미스가 포함되어 있는 경우 이러한 요소 중 가장 첫 번째의 결과값을 반환한다.

```javascript
// timer(0)은 프로미스이므로 이미 이행이 완료된 Promise.resolve(15)와 문자열인 '프로미스 아님' 중
// Promise.resolve(15)의 순서가 더 빠르기 때문에 Promise.resolve(15)의 결과값을 반환한다.
const race2 = Promise.race([timer(0), Promise.resolve(15), '프로미스 아님'])

// 반대로 문자열인 '프로미스 아님'이 Promise.resolve(15)보다 순서가 더 빠르기 때문에
// '프로미스 아님'이 결과값으로 반환된다.
const race3 = Promise.race([timer(0), '프로미스 아님', Promise.resolve(15)])

console.log(race2)
console.log(race3)
setTimeout(() => {
  console.log(race2)
  console.log(race3)
})

```

![promise.race result](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2F1wPPy%2FbtrtG8J400c%2FwjBXOQntiIo4kUkVfziyJk%2Fimg.png)

> 이 외에도 한 프로미스가 거절되어도 나머지 프로미스는 이행하여 결과를 기다려주고 후속 조치에 사용할 수 있도록 해주는 `Promise.allSettled`, 지금은 잘 사용하지 않지만 결과 값을 사용해 이행 상태의 프로미스를 만들어주는 `Promise.resolve`,  에러를 사용해 거부 상태의 프로미스를 만들어주는 `Promise.reject`도 Promise의 메서드들이다.

실무에서는 Promise.all을 많이 사용한다고 한다. 연관되어 있는 프로미스 작업들을 모두 성공적으로 이행시킨 후에 프로미스의 결과값으로 후속 조치를 취해야 하는 경우 유용하게 사용할 수 있을 것 같다.

---

읽어주셔서 감사합니다. 혹시 잘못된 정보가 있다면 메일로 신고 부탁드립니다. 🙇🏻‍♀️
