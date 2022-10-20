---

title: Next에서 svg를 React의 컴포넌트처럼 사용하는 방법
category: Next
description: 🤔
date: 2022-08-05
published: true
tags:
  - next
  - react

---

## Table of Contents

## 들어가면서

React에서는 `svg`파일을 import해서 바로 `컴포넌트`의 형태로 사용할 수 있지만 React 기반의 프레임워크인 `Nextjs`에서는 위의 방식대로 svg를 사용할 수 없습니다. svg 파일을 컴포넌트의 형태로 사용하면 svg의 속성들을 동적으로 변경해주어야 할 때 보다 쉽게 props를 내려줄 수 있어 편리합니다.

React에서 사용하던 것처럼 **Nextjs에서 svg 파일을 컴포넌트처럼 바로 사용하기 위한 몇 가지 방법**을 소개합니다.

## @svgr/webpack

### @svgr/webpack 라이브러리 설치

> yarn add --dev @svgr/webpack
> npm install @svgr/webpack -D

### next.config.js 설정

파일의 포맷이 svg인지 확인하여 svg일 경우에만 @svgr/webpack 라이브러리를 사용하도록 룰을 설정하기 위해 아래의 코드를 `next.config.js`에 추가합니다.

```javascript
// next.config.js

const config = {
  // ...
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });

    return config;
  },
}
```

## babel plugin

webpack을 설정하는 방법 외에도 babel plugin을 사용하는 방법이 있습니다.

### babel-plugin-inline-react-svg 설치

> yarn add --dev babel-plugin-inline-react-svg
> npm install babel-plugin-inline-react-svg -D

### babelrc 수정

.babelrc 파일이 없다면 프로젝트의 루트 레벨에 `.babelrc` 파일을 추가합니다.

.babelrc는 아래와 같이 presets와 plugins 두 개의 키를 가지고 있도록 설정하고, presets는 **next/babel**을, plugins에는 **inline-react-svg**를 추가합니다.

```javascript
// .babelrc

{
  "presets": [
    "next/babel"
  ],
  "plugins": [
    "inline-react-svg"
  ]
}
```

위의 두 방법 중 선호하는 방식으로 svg에서 바로 파일을 import하여 바로 `컴포넌트`처럼 사용할 수 있습니다.

![svg component use-case](https://zubetcha-blog.s3.ap-northeast-2.amazonaws.com/2022/08/2022-08-next-svg-use-case.png)

## tsx 로 컴포넌트화

다소 귀찮지만 tsx 확장자로 컴포넌트 자체를 만들어 버리는 방법도 있습니다.

아이콘의 크기 및 컬러 관련한 속성들을 동적으로 변경해 줄 수 있도록 props를 설정해줍니다.

![svg componentify example](https://zubetcha-blog.s3.ap-northeast-2.amazonaws.com/2022/08/2022-08-next-svg-component-example.png)

아이콘 컴포넌트를 import 하는 방식은 다른 컴포넌트를 import하는 방식과 동일합니다.

![svg componentify use-case](https://zubetcha-blog.s3.ap-northeast-2.amazonaws.com/2022/08/2022-08-next-svg-component-use-case.png)

## 스토리북에서 사용할 때

nextjs 환경에서 스토리북으로 svg 파일의 아이콘의 UI 테스트를 진행하고 싶은 경우에는 **.storybook > main.js**에서 **babel** 또는 **webpack** 설정을 추가해주면 됩니다. (.tsx로 컴포넌트화 하여 사용하고 있는 경우에는 필요 없습니다.)

```javascript
// main.js

module.exports = {
  babel: async (options) => ({
    "presets": [
      "next/babel"
    ],
    "plugins": [
      "inline-react-svg"
    ],
    ...options
  })
  // or
  webpackFinal: (config) => {
    rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });

    return config;
  }
}
```

## 요약

<br/>

- 아이콘을 **컴포넌트**의 형태로 사용하고 싶다면
- @svgr/webpack
- babel-plugin-inline-react-svg
- .tsx로 컴포넌트화
- 컴포넌트로 사용할 필요가 없다면
- `svg` 태그로 바로 삽입
- Next의 `Image` 컴포넌트의 src에 .svg의 경로 설정

<br/>

---

읽어주셔서 감사합니다. 혹시 잘못된 정보가 있다면 메일로 신고 부탁드립니다. 🙇🏻‍♀️
