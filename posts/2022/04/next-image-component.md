---

title: Next의 Image 컴포넌트, 왜 사용할까?
category: Next
description: 알고 쓰면 더 좋은 Image 컴포넌트
date: 2022-04-13
published: true
tags: 
  - next
  - optimization

---

## Table of Contents

## 들어가면서

SPA의 서버 사이드 렌더링을 지원하는 React 기반의 Next.js는 Link, Image, Head 등 몇 가지 컴포넌트를 제공하고 있다. 그 중 Image 컴포넌트에 대해서 알아보자!

## Next.js의 이미지 컴포넌트, 왜 사용할까?

답은 간단하다. `이미지 최적화`를 위해 사용한다.

이미지는 어플리케이션에 있어서 필수적인 존재이다. 이미지가 차지하는 비율에 따라서 어플리케이션의 성능에 중요한 영향을 끼치기도 한다. 그래서 많은 사람들이 이미지의 `크기`, `포맷`, 불러오는 `속도` 등에 신경을 쓰고, 이미지를 최적화하기 위한 여러 장치들을 마련해 놓고는 한다.

Next.js는 위와 같이 이미지 소스와는 별도로 추가해야 했던 최적화 기능들을 이미지 컴포넌트 하나로 손쉽게 사용할 수 있도록 제공해주고 있다.

이미지 컴포넌트로 누릴 수 있는 최적화는 아래와 같은 것들이 있다. 아래와 네 가지는 모두 서로 관련이 있는 최적화들이다.

<br/>

- 퍼포먼스 향상
- 시각적 안정성 (CLS 방지)
- 더욱 빠른 페이지 로드
- 자산의 유연성

<br/>

## 이미지 컴포넌트 사용 방법

사용 방법 또한 간단하다. next/image에서 Image 모듈을 불러온 후 컴포넌트처럼 사용한다. 주의할 점은 로컬 이미지가 아닌 경우 반드시 프로퍼티로 `width`, `heigth` 값 또는 `layout`을 설정해주어야 한다는 것이다.

나는 public 폴더에 이미지 파일을 넣어두고 소스 경로는 절대 경로를 사용하였다.

```jsx
// index.tsx

import Image from "next/image";

const NextImage = () => {

  const imagePaths = new Array (5).fill(0).map((el, i) => i + 1);

  return (
    <div>
      <h1>🌳 Image Component</h1>
      {imagePaths.map(path => {
        return (
          <div key={path}>
            <Image src={`/${path}.jpg`}  width="300" height="400"/>
          </div>
        )
     })}
    </div>
  )
}

export default NextImage
```

브라우저 화면을 보면 public 폴더에 저장되어 있는 이미지들이 잘 로드되고 있는 걸 볼 수 있다.

<img src="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fk.kakaocdn.net%2Fdn%2FbgEinN%2FbtrzkyIKZId%2F2tmXCeKczaTGzjn6xVJZjk%2Fimg.png" alt="image component example" width="100%" />

## img 태그와 비교해보자!

### img 태그를 사용하면?

위의 코드에서 next.js의 이미지 컴포넌트 부분만 `img` 태그로 변경하고 네트워크가 빠른 3G 환경에서 어떻게 렌더링 되는지 확인해보자.

```jsx
// index.tsx

import Image from "next/image";

const NextImage = () => {

  const imagePaths = new Array (5).fill(0).map((el, i) => i + 1);

  return (
    <div>
      <h1>🌳 Image Component</h1>
      {imagePaths.map(path => {
        return (
          <div key={path}>
            <img src={`/${path}.jpg`} alt="pet" width="300" height="400" />
          </div>
        )
     })}
    </div>
  )
}

export default NextImage
```

<img src="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fk.kakaocdn.net%2Fdn%2FbTJim7%2FbtrzhrdlWHl%2F1aNeMCAyICK1wTQwke1380%2Fimg.png" alt="img tag example" width="100%" />

유의해서 봐야할 건 다운로드하는 이미지의 `갯수`, `유형`, `크기` 및 `시간`이다.

<br/>

- 브라우저에서 보여지는 이미지의 갯수는 2~3개인데 **5개 이미지 모두** 다운로드한다.
- 넓이 300px, 높이 400px의 이미지 영역에 비해 **불필요하게 큰 원본 이미지를 로드**한다.
- 큰 크기의 원본 이미지를 로드하기 때문에 당연히 **소요되는 시간 또한 길다.**
- 이미지의 포맷은 **저장되어 있는 그대로의 포맷**을 사용한다.

<br/>

### next.js의 이미지 컴포넌트를 사용하면?

```jsx
// index.tsx

import Image from "next/image";

const NextImage = () => {

  const imagePaths = new Array (5).fill(0).map((el, i) => i + 1);

  return (
    <div>
      <h1>🌳 Image Component</h1>
      {imagePaths.map(path => {
        return (
          <div key={path}>
            <Image src={`/${path}.jpg`}  width="300" height="400"/>
          </div>
        )
     })}
    </div>
  )
}

export default NextImage
```

<img src="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fk.kakaocdn.net%2Fdn%2F3Xpha%2Fbtrzj0FxmPh%2FB0jksFcpb7g6aFx7xKiDDk%2Fimg.png" alt="Image component example" width="100%" />

<br/>

- 브라우저 영역에 **필요한 이미지의 갯수만** 다운로드한다. (`lazy loading` 지원)
- 이미지가 그려지는 영역에 맞게 **크기도 자동으로 줄어든다**. 첫 번째 고양이 이미지는 img 태그로 로드했을 때 크기가 `1.7MB`였지만 이미지 컴포넌트로 로드하면 `47.6kB`밖에 되지 않는다.
- 다운로드하는 이미지의 크기가 줄어들었기 때문에 그에 따라 **로드하는 데 소요되는 시간 또한 줄어든다.** 첫 번째 고양이 이미지는 img 태그로 로드했을 때 `33.13초`가 소요됐지만 이미지 컴포넌트로 로드하면 `1.12초`밖에 걸리지 않는다.
- 이미지의 포맷이 크롬 브라우저에 최적화된 포맷인 `webp`로 변환되었다.

<br/>

## 어떻게 CLS를 방지할까?

next.js는 이미지 컴포넌트를 사용하면 `CLS`를 아예 막을 수 있다고 설명하고 있다. 어떻게 막는 건지 살펴보자!

> **CLS란?** > **Cumulative Layout Shift**의 약자로,  사용자가 예상하지 못한 **레이아웃 이동**을 경험하는 빈도를 수치화하여 시각적인 안정성을 측정할 때 사용하는 **사용자 중심 메트릭**이다. CLS는 **낮을수록 좋다!**

<img src="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fk.kakaocdn.net%2Fdn%2Fbdl3Ed%2FbtrzNCKhf1b%2FWx7NXYUhdxuLHLxSSr9mO0%2Fimg.jpg" alt="CLS" width="100%" />

만약 컴포넌트 안에 이미지를 불러올 때 `dynamic import`가 아닌 `static import`를 사용한다면 next.js는 **프로젝트가 빌드될 때 자동으로 이미지의 넓이와 높이를 특정**할 수 있게 된다. 따라서 브라우저에서 이미지가 완전히 로드되기 전이라도 이미지의 크기를 미리 알 수 있기 때문에 로드 시점에 따라 이미지의 위치가 변경되지 않을 수 있게 된다. next.js는 이러한 방법으로 CLS를 막고 있다!

네트워크 속도를 Slow 3G로 설정해놓고 보면, 두 번째 강아지 이미지의 크기가 가장 작기 때문에 가장 빨리 로드되지만 **원래 있어야 할 위치에서** 바로 로드되는 걸 확인할 수 있다. 즉, 비교적으로 로드 속도가 느린 첫 번째 이미지가 로드되기 전에 두 번째 이미지가 첫 번째 이미지의 위치에서 로드되고, 후에 첫 번째 이미지가 로드되면 두 번째 위치로 변경되는 게 아니라는 의미이다.

<img src="https://k.kakaocdn.net/dn/8YM1b/btrzKczwvPT/KotaJVm30hSbQsC4k6EOr1/img.gif" alt="CLS example" width="100%" />

> Next 이미지 컴포넌트의 특징을 간단히 살펴보았다. 내가 생각하는 Next가 제공해주는 이미지 컴포넌트를 사용해야 하는 이유는..안 쓸 이유가 없기 때문인 것 같다. 😬

참고: [https://web.dev/i18n/ko/cls/](https://web.dev/i18n/ko/cls/)

---

읽어주셔서 감사합니다. 혹시 잘못된 정보가 있다면 메일로 신고 부탁드립니다. 🙇🏻‍♀️
