---

title: 모노레포 w/ turborepo
category: Etc
date: 2022-11-16
description: 구축기라고 쓰고 반성문이라고 읽는다.
published: false
slug: monorepo-with-turborepo
tags: 
  - monorepo
  - tureborepo

---

# 들어가면서

사실 이미 반년 전에 비슷한 UI의 프로젝트가 여러개가 생겨나고 디자인 시스템을 도입하게 되면서 Turborepo를 사용하여 모노레포를 구축해두었다. 위에 정리해놨듯이 Turborepo는 여러가지 이점을 제공하고 있지만 사실 처음 모노레포를 구축할 때에는 `Lerna`를 사용하려고 했었다.

당시 프론트엔드팀은 나를 포함해서 3명의 주니어 개발자로 구성되어 있었다. (지금은 2명만 남아 있다…🥲) 그리고 3명 모두 현재 회사가 첫 회사였고 모두 모노레포를 구축해본 경험이 없었기에 레퍼런스가 많은 툴을 사용해야 한다는 의견이 지배적이었다. 그래서 여러가지 옵션들 중에 Lerna를 선택했고, 실제로 Lerna로 모노레포 구축까지 해둔 상태였다.

![Screen Shot 2022-11-14 at 17.45.17.png](%E1%84%86%E1%85%A9%E1%84%82%E1%85%A9%E1%84%85%E1%85%A6%E1%84%91%E1%85%A9%20w%20turborepo%20ce203692a9a84229b7d694041b7ee898/Screen_Shot_2022-11-14_at_17.45.17.png)

그리고 시간이 흐른 후

![Untitled](%E1%84%86%E1%85%A9%E1%84%82%E1%85%A9%E1%84%85%E1%85%A6%E1%84%91%E1%85%A9%20w%20turborepo%20ce203692a9a84229b7d694041b7ee898/Untitled.png)

정확히 Lerna로 모노레포를 구축한 지 일주일이 지났을 때 Lerna 레포의 리드미가 위와 같이 변경되어 있었다. 더이상 유지보수되지 않는다고.

그래서 추가 대안을 찾아보다가 Turborepo를 발견했고, 마침 Nextjs로 개발을 하고 있고 배포도 vercel을 사용하고 있었기에 간단히 사용 방법을 찾아본 후 채택하게 되었다. 가장 마음에 들었던 건 세팅 방법이 간단하고, 공식 문서가 잘 정리되어 있는 것이었다.

사실 이 포스트는 모노레포를 처음 구축한 경험의 기록이라기 보다는, 초기의 구조에서 개선을 적용한 경험의 기록이라고 볼 수 있다.

# 모노레포란?

모노레포란 하나의 메인 레포지토리에 여러개의 프로젝트가 존재하는 구조를 뜻한다.

![Untitled](%E1%84%86%E1%85%A9%E1%84%82%E1%85%A9%E1%84%85%E1%85%A6%E1%84%91%E1%85%A9%20w%20turborepo%20ce203692a9a84229b7d694041b7ee898/Untitled%201.png)

각각의 관리 방식에 대해서 간단히 알아보면,

1. 모놀리스

모든 소스 코드가 모듈화되지 않고 하나의 레포지토리 안에서 관리되는 방식이다. 하나의 버전으로 모든 코드들이 관리되기 때문에 빌드 및 배포 과정이 단순하다는 장점이 있지만, 동시에 관심사 분리가 되지 않는다는 단점이 있다.

1. 멀티레포

멀티레포는 모놀리스의 단점을 보완하기 위해 등장했다. 이름처럼 여러개의 레포지토리를 두어 관심사를 분리하고 모듈화하여 독립적으로 관리가 가능해진다. 하지만 동시에 각 모듈을 관리하는 레포지토리가 분리되어 있기 때문에 코드의 재사용이 어려워지고 빌드와 배포 과정이 번거로워진다는 단점이 있다.

1. 모노레포

모노레포는 모놀리스와 멀티레포 방식의 이점을 모두 가지고 있는 방식이다.

- Visibility
  - 리포지터리가 하나이기 때문에 모든 프로젝트의 코드와 자원(assets) 간의 관계와 의존성을 한눈에 확인할 수 있다.
- Collaboration
  - 모든 커밋 히스토리가 한 리포지터리에 남기 때문에 히스토리를 추적하거나 전체 리포지터리의 개발 방향을 이해하는 게 쉬워진다.
  - 여러 곳에서 중복으로 사용하는 자산들(테스트 코드 등)을 공유하고 재사용할 수 있다.
- Speed
  - 배포와 빌드, 테스트와 같은 작업을 병렬로 한 번에 처리할 수 있으므로 한 번의 명령으로 여러 개의 리포지터리에서 작업을 진행할 수 있다.

<aside>
💡 **관심사 분리란?**
컴퓨터 공학 관점에서 관심사 분리는 프로그램들을 각각 다른 영역으로 구분하는 설계 원칙을 의미한다. 일종의 모듈화라고 볼 수 있다.
 
관심사를 분리하면 아래와 같은 이점을 얻을 수 있다.

- 각각의 관심사와 관련된 정보들을 캡슐화 할 수 있다.
- 코드를 단순화하고 유지보수하기 용이해진다.
- 분리한 각 관심사(모듈)를 재사용하거나, 독립적으로 개발하기 쉬워진다.
- 다른 모듈에 영향을 주지 않고 업그레이드하는 등의 버전 관리를 할 수 있다.

[참고]: [https://en.wikipedia.org/wiki/Separation_of_concerns](https://en.wikipedia.org/wiki/Separation_of_concerns)

</aside>

# Turborepo란?

Turborepo는 vercel에서 운영하고 있는 자바스크립트와 타입스크립트 코드의 고성능 빌드 시스템이다.

프로젝트가 커지면 커질수록 린트, 테스트, 빌드 등에 투입되는 리소스(또한) 늘어나기 마련이다. 또한 프로젝트의 개수가 많아지면 그 개수만큼 관리포인트도 늘어난다. Turborepo는 이러한 문제를 해결하기 위해 모노레포를 구축할 수 있는 툴을 제공하고, 간소화된 스크립트를 통해 보다 빠른 CI를 경험할 수 있게 해준다.

공식문서에 따르면 Meta와 Google도 Turborepo를 사용하고 있는 것으로 보인다!

## Why Turborepo?

![Screen Shot 2022-11-14 at 17.31.32.png](%E1%84%86%E1%85%A9%E1%84%82%E1%85%A9%E1%84%85%E1%85%A6%E1%84%91%E1%85%A9%20w%20turborepo%20ce203692a9a84229b7d694041b7ee898/Screen_Shot_2022-11-14_at_17.31.32.png)

위의 사진은 Turborepo가 밀고 있는(?) 세일즈 포인트이다.

1. **Incremental builds :**
2. **Content-aware hashing**
3. **Parallel execution**
4. **Remote Caching**
5. **Zero runtime overhead**
6. **Pruned subsets**
7. **Task pipelines**
8. **Meets you where you’re at**
9. **Profile in your browser**

## **Incremental builds**

Building once is painful enough, Turborepo will remember what you've built and skip the stuff that's already been computed.

## **Content-aware hashing**

Turborepo looks at the contents of your files, not timestamps to figure out what needs to be built.

## **Parallel execution**

Execute builds using every core at maximum parallelism without wasting idle CPUs.

## **Remote Caching**

Share a remote build cache with your teammates and CI/CD for even faster builds.

## **Zero runtime overhead**

Turborepo won’t interfere with your runtime code or touch your sourcemaps.

## **Pruned subsets**

Speed up PaaS deploys by generating a subset of your monorepo with only what's needed to build a specific target.

## **Task pipelines**

Define the relationships between your tasks and then let Turborepo optimize what to build and when.

## **Meets you where you’re at**

Using Lerna? Keep your package publishing workflow and use Turborepo to turbocharge task running.

## **Profile in your browser**

Generate build profiles and import them in Chrome or Edge to understand which tasks are taking the longest.

그리고 이중에서도 가장 핵심은 `캐싱`일 것이다.

# 적용하기

## Turborepo 세팅 방법

간단

## 개선 1. 환경설정 파일 관리

부끄럽게도 관리하는 프로젝트가 4개까지 늘어나는 동안 매번 제로부터 프로젝트를 세팅했었다. 그 과정에서 이전 프로젝트의 폴더를 뒤져서 config 파일을 복붙하는 번거로움도 있었고, 옵션을 변경해야 할 때 모든 프로젝트마다 일일히 변경해줘야 하는 불편함도 있었다.

이번에 모노레포 구조를 리팩토링하면서 프로젝트에 필요한 환경 설정 파일들도 한 곳에서 관리하면 좋을 것 같다는 생각이 들었다. 그럼 하나의 모듈로 관리하면서 각 프로젝트마다 버전이 달라지는 것에 대해서도 걱정할 필요가 없어 편할 것 같았다.

현재 프로젝트에 세팅하고 있는 환경설정은 babel, esline, prettier, tsconfig가 있는데, 우선 이 네 개만 config 패키지에서 관리하기로 하였다. 처음에는 한 개의 config 패키지를 만들어서 그 안에 모든 config 파일들을 관리할까 했지만, 프로젝트마다 설정하는 옵션들이 달라질 수도 있을 것 같아 각 config마다 패키지를 만들기로 하였다.

**eslint**

eslint는 루트 레벨에 환경설정 파일을 하나만 두는 것만으로도 모든 apps 폴더 하위의 프로젝트와 packages 폴더 하위의 패키지들에 별도의 파일 추가 없이 설정값들을 적용시킬 수 있다. 대신 이렇게 하기 위해 package의 네이밍 룰을 지켜야 한다. (패키지의 폴더 이름은 상관 없다!)

> package name 룰: eslint-config-\*

```jsx
// packages/eslint-config/package.json

{
  "name": "eslint-config-base", // eslint-config-*
  "version": "0.0.0",
  "main": "index.js",
  "private": true,
  "license": "MIT",
  "dependencies": {
		// ...
  }
}

// packages/eslint-config/index.js

module.exports = {
	// 적용할 룰, 플러그인 등
}
```

```jsx
// ./eslintrc.js

module.exports = {
  root: true,
  extends: ['base'], // *
  settings: {
    next: {
      rootDir: ['apps/*/', 'packages/*/'],
    },
  },
}
```

이렇게 하면 각 프로젝트와 패키지마다 의존성을 추가하고 환경설정 파일을 추가해야 하는 번거로움 없이 자동으로 모두 적용된다!

**prettier**

prettier도 가끔 얼라인이 맞지 않으면 엄청난 conflict을 야기하기도 하기 때문에 모든 프로젝트와 패키지에 공통 옵션을 적용하고 싶었다. 그래서 패키지화 해서 config 파일을 공유할 수 있도록 했다.

```jsx
// packages/prettier-config/package.json

{
  "name": "@gec/prettier",
  "version": "0.0.0",
  "main": "index.js",
  "private": true,
  "dependencies": {
		// ...
	}
}

// packages/prettier-config/index.js

module.exports = {
	// 적용할 설정값 등
};
```

패키지화한 prettier의 config를 적용할 방법은 여러가지가 있다. 궁금하신 분들은 [prettier 문서](https://prettier.io/docs/en/configuration.html)를 참고해보면 좋을 것 같다. 나는 그중에서도 따로 config 파일을 프로젝트에 추가할 필요 없이 적용할 수 있는 package.json 참조 방식을 선택했다.

방법은 정말 간단하다! 적용하고자 할 프로젝트의 package.json에 prettier 키를 추가하고 value에 패키지화한 prettier 패키지의 이름을 추가하면 된다. 이렇게 하면 자동으로 prettier가 적용된다.

```jsx
// prettier 설정을 공유할 프로젝트의 package.json

{
	"name": "@gec/utils",
  "version": "0.1.0",
	"prettier": "@gec/prettier",
}
```

**typescript**

타입스크립트 config 파일도 마찬가지로 패키지를 만들고, 각각 다른 환경에서 사용할 수 있도록 여러개의 json을 만들었다.

```jsx
// packages/ts-config/package.json

{
  "name": "@gec/ts",
  "version": "0.0.0",
  "private": true,
  "main": "index.js",
  "prettier": "@gec/prettier",
  "files": [
    "base.json",
    "next.json",
    "react-library.json"
  ]
}

// packages/ts-config/next.json

{
	"compilerOptions": {
		// ...
  },
	"include": ["**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}
```

필요한 프로젝트에 불러와서 사용할 때에는 아래와 같이 package.json에 의존성을 추가하고, tsconfig.json에 extends 키워드를 사용하여 경로를 설정해주면 된다.

```jsx
// apps/프로젝트/package.json

{
	"devDependencies": {
    "@gec/ts": "*",
  }
}

// apps/프로젝트/tsconfig.json

{
  "extends": "@gec/ts/next.json",
  "compilerOptions": {
    "baseUrl": "./",
    "paths": {
      "@components/*": ["src/components/*"],
      "@constants/*": ["src/constants/*"],
      "@hooks/*": ["src/hooks/*"],
      "@public/*": ["public/*"],
      "@recoil/*": ["src/recoil/*"],
      "@services/*": ["src/services/*"],
      "@styles/*": ["src/styles/*"],
      "@types/*": ["src/types/*"],
      "@utils/*": ["src/utils/*"]
    }
  },
  "include": ["src", "next-env.d.ts"],
  "exclude": ["node_modules"]
}
```

유의할 점은 절대 경로를 위해 설정한 baseUrl와 paths는 프로젝트 내에서 설정해주어야 한다는 것이다. 만약 config 패키지 안에서 설정하더라도 baseUrl과 paths의 경로 기준은 config 패키지가 되어 프로젝트 경로에서는 경로를 찾지 못하는 문제가 발생한다.

**babel**

babel도 마찬가지로 프로젝트의 프레임워크마다 presets가 달라질 수 있기 때문에 우선 nextjs 환경에 맞는 설정만 해주었다. 필요한 프로젝트에서 불러와서 사용하는 방법은 ts-config와 동일하다.

```jsx
// packages/babel-config/package.json

{
  "name": "@gec/babel",
  "version": "0.0.0",
  "main": "index.js",
  "files": [
    "next.json"
  ],
  "private": true,
  "license": "MIT",
  "prettier": "@gec/prettier"
}

// packages/babel-config/next.json

{
  "env": {
    "development": {
      "presets": ["next/babel"]
    },
    "production": {
      "presets": ["next/babel"]
    },
    "test": {
      "presets": ["next/babel", "@babel/env", "@babel/react", "@babel/preset-typescript"]
    }
  },
  "presets": ["next/babel", "@babel/preset-env", "@babel/preset-typescript", "@babel/preset-react"]
}
```

```jsx
// apps/프로젝트/package.json

{
	"devDependencies": {
    "@gec/babel": "*",
  }
}

// apps/프로젝트/babel.config.json

{
  "extends": "@gec/babel/next.json",
  "plugins": [
    [
      "module-resolver",
      {
        "root": ["./src"],
        "alias": {
          "@components": "./src/components",
          "@constants": "./src/constants",
          "@hooks": "./src/hooks",
          "@recoil": "./src/recoil",
          "@services": "./src/services",
          "@styles": "./src/styles",
          "@types": "./src/types",
          "@utils": "./src/utils"
        }
      }
    ]
  ]
}
```

babel config를 불러와서 사용할 때 한 가지 주의할 점이 있다.

.babelrc.\*, .babelrc와 같은 File-relative config 파일 타입은 node_modules 같은 서브 모듈까지는 적용이 되지 않는다. 그래서 의존성에 추가해서 사용해야 하는 디자인 시스템의 패키지의 경우 babel presets들이 적용되지 않고 프로젝트 실행 시 원하는 대로 컴파일이 되지 않아 아래와 같은 문법 오류가 발생하게 된다.

![Screen Shot 2022-11-16 at 13.02.52.png](%E1%84%86%E1%85%A9%E1%84%82%E1%85%A9%E1%84%85%E1%85%A6%E1%84%91%E1%85%A9%20w%20turborepo%20ce203692a9a84229b7d694041b7ee898/Screen_Shot_2022-11-16_at_13.02.52.png)

node_modules나 심볼릭 링크 패키지같은 서브 모듈에까지 적용하고 싶다면 Project-wide config 파일 타입인 babel.config.\*로 파일명을 변경하면 된다. 나는 이거 때문에 몇 시간 동안 삽질했다..😇

config에 필요한 dependencies는 어디에?

esline, prettier, @babel/core…, typescript root package.json에! 의존성 호이스팅

## 개선 2. 관심사 분리

![Screen Shot 2022-11-14 at 18.35.44.png](%E1%84%86%E1%85%A9%E1%84%82%E1%85%A9%E1%84%85%E1%85%A6%E1%84%91%E1%85%A9%20w%20turborepo%20ce203692a9a84229b7d694041b7ee898/Screen_Shot_2022-11-14_at_18.35.44.png)

두 번째 개선사항은 관심사 분리다. 모노레포 구조를 개선하기로 결정한 원인이기도 하다. 현재 관리하고 있는 모든 프로젝트들이 Nextjs로 되어 있어 그럼 디자인 시스템 패키지도 Nextjs로 만들어야 하지 않을까요? 하며 시작되었다. 폴더 구조만 봐서는 디자인 시스템 패키지이 아닌 일반적인 프로젝트 같은 모습을 띄고 있다.

개발을 하는 도중 계속해서 재사용할 커스텀 훅, 유틸 함수 등이 생겨났지만 바쁘다는 핑계로 어떤 때는 디자인 시스템 패키지의 폴더에, 어떤 때는 프로젝트의 폴더에 파일들을 추가했고, 결국 마지막 즈음에서는 여기저기 동일한 이름의 파일들이 생겨나서 문제가 생겼을 때 어떤 폴더에 있는 모듈이 문제인 지 확인하기 어려워졌다.

그래서 디자인 시스템 패키지에 혼재되어 있던 react 관련 커스텀훅과 util 함수들을 모두 분리하여 각각 패키지화하고, 프로젝트에서는 root 레벨에 hooks와 utils 폴더 자체를 두지 않기로 하였다. 만약 프로젝트 내에서 커스텀훅을 만들어야 한다면 의존도가 높은 폴더에 각각 나누어 두기로 하였다. 예를 들면, recoil 관련 훅이면 recoil 폴더 내에, react-query 관련 훅이면 services 폴더 내에, 컴포넌트 관련 훅이면 컴포넌트 폴더 내에 두는 식이다. 이렇게 해서 범용적으로 사용되는 커스텀 훅은 반드시 모노레포의 패키지에서만 관리하고, 불러와서 사용할 수 있도록 하여 혼선을 방지하고자 했다.

패키지를 나누는 과정 자체는 어렵지 않았기에 생각만큼 오래 걸리지는 않았고 디자인 시스템 패키지만 Nextjs → React로 변경해주었다. 결과적으로 packages 폴더의 모습은 아래와 같은 구조가 되었다.

![Screen Shot 2022-11-16 at 14.06.21.png](%E1%84%86%E1%85%A9%E1%84%82%E1%85%A9%E1%84%85%E1%85%A6%E1%84%91%E1%85%A9%20w%20turborepo%20ce203692a9a84229b7d694041b7ee898/Screen_Shot_2022-11-16_at_14.06.21.png)

이로써 react 기반이 아닌 다른 프레임워크로 마이그레이션을 하거나 새로 프로젝트를 만드는 경우에도 손쉽게 프로젝트를 세팅하고, utills 함수를 그대로 사용할 수 있게 되었으며, react 기반의 다른 프레임워크를 사용할 때에도 바로 사용할 수 있게끔 정리가 되었다.

각각의 모노레포 패키지들은 독립적인 역할을 담당하고, package.json에서도 의존하고 있는 패키지의 종류와 역할을 한 눈에 파악하기 편해졌다. (너무 후련하당….)

![Screen Shot 2022-11-16 at 14.15.25.png](%E1%84%86%E1%85%A9%E1%84%82%E1%85%A9%E1%84%85%E1%85%A6%E1%84%91%E1%85%A9%20w%20turborepo%20ce203692a9a84229b7d694041b7ee898/Screen_Shot_2022-11-16_at_14.15.25.png)

## 캐싱

번외로 turborepo가 자랑하는 remote caching 또한 CI에 소요되는 시간을 많이 단축해주고 있다. 같은 프로젝트를 배포할 때 이전의 이력을 기억하고 반영하여 시간이 3분 25초 → 57초로 단축된 것을 볼 수 있다.

![Screen Shot 2022-11-15 at 17.22.30.png](%E1%84%86%E1%85%A9%E1%84%82%E1%85%A9%E1%84%85%E1%85%A6%E1%84%91%E1%85%A9%20w%20turborepo%20ce203692a9a84229b7d694041b7ee898/Screen_Shot_2022-11-15_at_17.22.30.png)

# 마치며

참고

[Turborepo로 모노레포 개발 경험 향상하기](https://engineering.linecorp.com/ko/blog/monorepo-with-turborepo)
