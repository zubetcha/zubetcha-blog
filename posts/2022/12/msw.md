---

title: MSW로 개발자 경험 향상시키기
category: Etc
date: 2022-12-13
description: API 개발 후에 고통 받고 있다면..
published: false
slug: improve-DX-with-MSW
tags: 
  - etc
  - MSW

---

# 들어가며

최근에 회사에서 새롭지만 새롭지만은 않은..(?) 프로젝트를 시작했다. 여러 사정으로 인해 백엔드와 프론트엔드의 개발이 동시에 이뤄지고 있어 늘 하던대로 화면에 필요한 데이터들을 하드 코딩으로 여기저기 만들어놓고 사용하려던 참에 MSW라는 라이브러리의 존재에 대해서 알게 되었고, API가 개발된 후 고통받을 나의 구세주라는 생각에 빠르게 프로젝트에 사용해보았다!😇

# MSW? 🤔

먼저 MSW가 무엇인지 살펴보자!

## MSW란?

MSW는 Mock Service Worker의 약자로, 이름에서도 알 수 있듯이 브라우저의 [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)를 이용해서 실제로 네트워크 레벨에서 요청을 가로채고 임의의 응답을 보내주는 API Mocking 라이브러리이다. MSW가 Service Worker API를 사용하는 가장 큰 이유는 실제 리소스 요청을 가로챌 수 있기 때문이다.

[MSW의 공식문서](https://mswjs.io/docs/)를 살펴보면, 크게 두 가지 목적으로 사용할 수 있다. 첫 번째는 내가 사용한 이유는 클라이언트 개발에서 서버에서의 API 개발이 완료되기 전에 API Mocking을 하기 위해서, 두 번째는 nodejs 환경에서 통합 테스트를 할 때 실제로 API를 호출하는 대신 미리 만들어놓은 Request handler로 안정적인 Mock API를 호출하고 테스트를 처리할 수 있도록 하기 위함이다.

위의 두 가지 사용 사례는 커다란 목적(API Mocking) 자체는 비슷하지만, 실행하는 환경이 다르다. 클라이언트 개발에서 사용하는 경우에는 실제로 호출한 HTTP Request를 가로채야 하기 때문에 반드시 Service Worker API를 사용해야 하고, Service Worker API는 브라우저 환경에서만 사용할 수 있다. 반대로 통합 테스트에 사용하는 경우 실행 환경은 nodejs가 된다. 그리고 nodejs 환경에서는 브라우저에 접근할 수 없기 때문에 Service Worker API도 사용할 수 없다.

하지만 MSW의 가장 큰 장점 중 하나는 Mock API 코드를 한 번만 작성해놓으면 작성해둔 Request Handler와 Response Resolver를 클라이언트 개발과 통합 테스트 실행에 모두 재사용할 수 있다는 것이다.

## Request flow

MSW를 브라우저 환경에서 사용하는 경우 아래의 그림과 같이 요청과 응답이 이루어진다.

1. 우선 앱이 실행되면 MSW는 브라우저에 Service Worker를 등록한다.
2. 등록된 Service Worker는 Fetch 이벤트를 통해 외부로 가는 요청을 가로챈다.
3. 가로챈 요청에 만들어둔 응답을 실어 보낸다.

<img src="https://zubetcha-blog.s3.ap-northeast-2.amazonaws.com/2022/12/msw_request-flow.png" width="100%" alt="msw-request-flow">

## 특징

MSW 외에도 Mock API를 제공하거나 Mock Server를 구축할 수 있는 여러가지 라이브러리가 있지만, 다른 라이브러리와 비교했을 때 MSW는 아래와 같은 장점을 지니고 있다.

- Mocking이 네트워크 통신 레벨에서 일어나기 때문에 클라이언트 코드를 실제로 서버와 통신하는 것처럼 작성할 수 있다.
  - 따라서 백엔드의 API 개발이 완료된 후에 수정해야 할 코드가 현저히 줄어든다.
  - 즉, API 개발 완료 시기에 종속 받지 않고 클라이언트 개발을 이어나갈 수 있다.
- 브라우저의 Service Worker 환경이나 Nodejs의 테스트 환경에서 모두 하나의 코드를 작성해서 활용할 수 있다.
  - 변경사항이 발생했을 때 반영해야 하는 코드의 범위가 적기 때문에 개발자 경험을 향상시킨다.
- REST API와 GraphQL API 모킹을 모두 지원한다.

# 사용 방법

MSW에 대해서 간단하게 살펴보았으니 이제 어떻게 사용하는지도 알아보자!

## MSW 설치

```jsx
yarn add msw
npm install msw
```

## 서비스 워커 파일 생성

```jsx
$ npx msw init public/ --save
```

위의 명령어를 실행하면 public 폴더에 `mockServiceWorker.js` 파일이 생성된다.

<p align="center">
  <img src="https://zubetcha-blog.s3.ap-northeast-2.amazonaws.com/2022/12/msw_init.png" alt="msw-init" width="50%">
</p>

mockServiceWorker.js 파일을 들여다보면 `install`, `activate`, `message`, `fetch` 이벤트 핸들러를 볼 수 있다.

message, fetch 이벤트에 대해서 자세히 작성하기

## Request Handler

Mock API를 사용하려면 우선 요청이 들어왔을 때 임의의 응답을 보내줄 Request handler를 작성해야 한다. Request handler는 REST API와 GraphQL API 모두 처리할 수 있다. 그중 REST API용 Request handler를 작성하려면 `메소드`와 `URL 엔드포인트`, Mock Response를 반환해 줄 `Response resolver`가 필요하다.

우선 폴더 구조는 이렇게 정리했다. mocks 폴더 아래에 도메인별로 폴더를 만들어 Mock data와 Request handler, Response resolver를 한 데 둘까 고민도 해봤지만, 도메인이 많아지는 만큼에 비례해서 폴더의 개수도 많아지는 걸 선호하는 편이 아니라서 (에디터에서 파일명으로 찾을 때 빨리 찾기 힘듦🥲) data, resolver, type, const 등으로 폴더를 나누어놓았다.

```jsx
├─src
│  └─mocks
│    ├─handlers.ts // request 핸들러
│    ├─data // mock data
│    │ ├─account.ts
│    │ ├─auth.ts
│    │ └─// ...
│    └─resolver // request 리졸버
│      ├─account.ts
│      ├─auth.ts
│      └─// ...
```

이제 진짜 핸들러를 만들어보자..!

작성한 Request handler들은 모두 모아서 Service Worker 인스턴스를 생성해주는 함수의 인자로 전달할 것이기 때문에 하나의 파일에 작성하였다. 작성할 핸들러가 많지 않다면 반환하는 배열 안에 바로 작성해도 괜찮지만, 도메인별 핸들러가 많아지면 나중에 찾기 어려워지는 상황이 생길 수도 있을 것 같아 따로 나눠보았다.

REST API용 Request handler를 작성하기 위해서는 우선 msw가 제공하는 `rest` 객체를 import 해야 한다. rest 객체는 HTTP 통신 `메서드`들을 key로 가지고 있고, 각 메서드는 함수의 형태로 되어 있다. 그리고 각 메서드의 함수는 첫 번째 인자로 요청을 보낼 `경로`를, 두 번째 인자로는 `Response resolver`를 전달 받아 `RestHandler`를 반환한다.

```jsx
// src/mocks/handlers.ts

import { rest } from 'msw';

export const handlers = () => {
  return [
    rest.get('/api/accounts/:accountId', (req, res, ctx) => res(ctx.status(200), ctx.text('성공!'))),
  ];
};
```

### 경로에 대해서

보통 서버로 데이터를 전달하는 방식에는 `Request variables`, `Request params`, `Request body` 등의 여러가지 방식이 있다. 그 중 Request variables와 Request params는 서버로 보내는 경로에 노출이 되는 정보들이다.

Response resolver에서는 Request 정보들에서 각기 다른 방식으로 전달되는 데이터들에 접근할 수 있는데, 그 중 Request variables는 API 경로에 아래와 같이 명시해 주어야 한다.

> '/api/accounts/`:accountId`/email',

이렇게 하면 Response resolver에서 이렇게 접근이 가능하다!

```jsx
const { accountId } = req.params;
```

`Request params`와 `Request body`는 경로와 상관 없이 request 객체의 또 다른 방법으로 접근할 수 있으니 Response resolver에서 자세히 다뤄보겠다.

## Response resolver

Response resolver는 브라우저에서 발생하는 네트워크 요청을 가로채서 대신 응답을 보내주는 역할을 한다. 함수로 되어 있으며 매개변수로 `request`, `response`, `context` 세 개의 인자를 받는다.

- request: 일치하는 request에 대한 정보
- response: mocked response를 생성해주는 함수
- context: mocked response의 status code, headers, body 등을 설정해주는 함수들을 담고 있는 객체

```jsx
export const responseResolver: Parameters<typeof rest.get>[1] = (req, res, ctx) => {
  return res(ctx.status(200), ctx.json(보내고 싶은 Mock Response!));
};
```

## Service Worker 인스턴스 생성

보ㅇ Service Worker를 브라우저에 등록하기 위해서 [Navigator.serviceWorker](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/serviceWorker) 를 사용하고는 하지만 MSW에서는 `setupWorker` 함수가 알아서 Service Worker 인스턴스를 생성해주고, 앱이 실행되면 브라우저에 등록해주는 일까지 해주기 때문에 신경쓰지 않아도 괜찮다! setupWorker 함수는 우리가 작성(혹은 정의)한 Request handler들을 가지고 Service Worker 인스턴스를 생성해준다.

```jsx
// src/mocks/browser.ts

import { setupWorker } from 'msw';
import { handlers } from './handlers'; // Request handler들

export const worker = setupWorker(...handlers());
```

## Service Worker 실행

앱이 실행될 때 Entry Point가 되는 파일에 Service Worker를 실제로 브라우저에 등록하고 활성화해주어야 한다. 방금 setupWorker 함수로 만들어 둔 Service Worker 인스턴스에는 몇 가지 메소드가 있는데, 이 중 start가 public 폴더에 생성된 mockServiceWorker.js 파일을 가지고 브라우저에 ServiceWorker를 등록하고 활성화시켜준다.

```jsx
// src/pages/_app.tsx

import { worker } from '@mocks/worker';

useEffect(() => {
  if (IS_DEVELOPMENT) {
    worker.start();
  }
}, []);
```

### node.js 환경에서 setupWorker를 실행할 수 없는 문제

필요한 것들을 세팅하고나서 앱을 실행시켜 확인하는데 아래와 같은 에러가 발생했다. 브라우저에 Service Worker를 등록하려면 당연하게도 브라우저 환경에서 setupWorker가 실행되어야 하지만, Nextjs가 빌드될 때에는 nodejs(server) 환경에서 실행되기 때문에 브라우저에 접근할 수 없기 때문에 발생하는 에러이다.

<img src="https://zubetcha-blog.s3.ap-northeast-2.amazonaws.com/2022/12/msw_browser-error.png" alt="msw-browser-error" width="100%">

이 부분은 `_app.tsx`에서 `useEffect`를 사용하여 window 객체가 있을 때에만 setupWorker 함수가 실행되도록 실행 시점을 제어하여 해결하였다.

```jsx
// 문제
export const worker = () => setupWorker(...handlers());

useEffect(() => {
    if (IS_DEVELOPMENT) {
      worker.start();
    }
  }, []);

// 해결
export const worker = () => {
  if (typeof window) {
    return setupWorker(...handlers());
  }
};

useEffect(() => {
    if (IS_DEVELOPMENT) {
      worker()?.start();
    }
  }, []);
```

<p align="center">
  <img src="https://zubetcha-blog.s3.ap-northeast-2.amazonaws.com/2022/12/msw_mock-enabled.png" alt="mock-enabled" width="60%">
</p>

이제 여기까지 하고 앱을 실행시킨 후 콘솔을 확인했을 때 위와 같이 `Mocking enabled.` 가 보인다면 MSW를 사용할 준비를 모두 마친 것이다!

브라우저의 개발자 도구에서도 확인해보면 mockServiceWorker가 잘 등록되어 있고 활성화되어 있는 것까지 확인할 수 있다.

<p align="center">
  <img src="https://zubetcha-blog.s3.ap-northeast-2.amazonaws.com/2022/12/msw_service-worker.png" alt="service-worker" width="60%">
</p>

# 적용해보기

MSW와 사용 방법에 대해서 알아봤으니 이제 사용해 볼 차례이다.

## 준비

MSW를 사용할 때 누릴 수 있는 가장 큰 이점인 Mock API에서 실제 API로 변경해서 연동할 때 **수정할 코드의 양을 줄일 수 있다는 점**을 톡톡히 누리기 위해서는 몇 가지 미리 준비해야 할 것들이 있다. Request handler와 Response Resolver에 사용할 API의 URL과 Request에 필요한 데이터의 형태, Response resolver에서 반환할 응답 데이터의 형태가 그러하다.

### API

우선 API는 Mock API용과 실제 API 두 종류를 준비해야 한다. (이 부분이 MSW를 사용할 때 다소 아쉬운 부분 중 하나이다...🥲) 만약 API URL에 Request variables가 들어가지 않는다면 하나의 API로 통합하여 사용하여도 무방하다.

```jsx
// Mock API용
export const API_ENDPOINT = {
  account: {
    /** 전체 계정 쿼리 */
    getAllAccounts: '/api/accounts',

    /** 특정 계정 조회 */
    getAccount: '/api/accounts/:accountId',

    /** 계정 추가 */
    createAccount: '/api/accounts',

    /** 계정 이메일 수정 */
    updateEmail: '/api/accounts/:accountId/email',

    /** 계정 일괄 삭제 */
    deleteAccount: '/api/accounts',
  }
};

// 실제 API용
export const AccountAPI = {
  /** 전체 계정 조회 */
  getAccounts: ({ pageParam, ...rest }: AccountsQueryParams): Promise<AxiosResponse<AccountsInfiniteQueryResult>> =>
    api.get('/api/accounts', { params: { page: pageParam, ...rest } }),

  /** 특정 계정 조회 */
  getAccount: (accountId: number): Promise<AxiosResponse<Account>> => api.get(`/api/accounts/${accountId}`),


  /** 계정 추가 */
  createAccount: (account: AccountPostRequestDTO): Promise<AxiosResponse<Account>> =>
    api.post('/api/accounts', account),

  /** 계정 이메일 수정 */
  updateEmail: ({ accountId, email }: PatchEmailRequestDTO): Promise<AxiosResponse<Account>> =>
    api.patch(`/api/accounts/${accountId}/email`, { email }),

  /** 계정 삭제 */
  deleteAccount: (accountIdList: number[]): Promise<AxiosResponse<string>> => {
    const requestParams = accountIdList.map((accountId) => `id=${accountId}`).join('&');

    return api.delete(`/api/accounts?${requestParams}`);
  },
}
```

### Request Handler

위의 Mock API를 사용하여 Request handler를 만든다.

```jsx
// src/mocks/handlers.ts

import { rest } from 'msw';

export const handlers = () => {
  return [
    /** 계정 관련 핸들러 */
    ...accountHandles,
  ];
};

const accountHandlers = [
  /** 특정 계정 조회 */
  rest.get(API_ENDPOINT.account.getAccount, getAccount),

  /** 계정 추가 */
  rest.post(API_ENDPOINT.account.createAccount, createAccount),

  /** 계정 이메일 수정 */
  rest.patch(API_ENDPOINT.account.updateEmail, updateEmail),

  /** 계정 삭제 */
  rest.delete(API_ENDPOINT.account.deleteAccount, deleteAccount),
];
```

### Response resolver

먼저 Response resolver를 작성하기에 앞서 Request와 Response에 필요한 타입들을 먼저 정의해두면 편리하다.

Response는 다양한 형태로 보낼 수 있다.

- json: ctx.json()
- text: ctx.text()
- xml: ctx.xml()

Response resolver 함수는 아래와 같은 형태로 작성하는데, 그 중 함수의 인자로 주어지는 req 매개변수를 이용하여 요청이 싣고 온 데이터들에 접근할 수 있다.

```jsx
export const requestHandler = (req, res, ctx) => {
  return res();
};

```

**Request variables 정보 가져오기**

만약 Request handler의 url을 `/api/accounts/:accountId`로 작성했다면, `req.params` 객체 안에 accountId라는 key 이름으로 Request variables 정보에 접근할 수 있다.

```jsx
const {/** Request handler의 url에 작성한 키*/} = req.params;
```

**Request body 정보 가져오기**

Request body에 대한 정보는 req.json()을 통해 가져올 수 있다. 또한 req.json에 제네릭으로 Request body에 대한 타입 인터페이스를 제공하면 자동완성으로 더 편하게 사용할 수 있다. req.json 함수는 (T = any) => Promise<T>의 형태로 되어 있기 때문에 `async-await`을 함께 사용하였다.

```jsx
const { email } = await req.json<CreateAccountReq>();
```

**Request params 정보 가져오기**

Request params에 대한 정보 또한 req 객체에서 가져올 수 있다. req.url 객체에서 searchParams는 URL API인 [URLSearchParams](https://developer.mozilla.org/ko/docs/Web/API/URLSearchParams)의 인터페이스와 동일하다.

```jsx
const accountId = req.url.searchParams.getAll('id');
```

특히 POST 메소드로 데이터를 새로 생성할 때 Request body에 있는 데이터를 그대로 Response에 사용할 수 있어 Mock API로 개발할 때 굉장히 편리했다.

```jsx
/** 특정 계정 조회 */
export const getAccount: Parameters<typeof rest.get>[1] = (req, res, ctx) => {
  const { accountId } = req.params;

  return res(ctx.status(200), ctx.json<Account>({ ...accountList[0], id: accountId }));
};

/** 계정 추가 */
export const createAccount: Parameters<typeof rest.post>[1] = async (req, res, ctx) => {
  const { username, email, phone, profileUrl, canInquire, authorityId, customerId, depthId } = await req.json<CreateAccountReq>();

  return res(
    ctx.status(200),
    ctx.json<Account>({
      accountId: 100,
      username,
      name,
      email,
      phone,
      profileUrl,
      canInquire,
      authority: {
        id: authorityId,
        name: authorityId,
      },
      customer: {
        id: customerId,
        name: `${customerId} 소속이에용`,
      },
      depth: {
        id: depthId,
        name: `${depthId} 부서에용`,
      },
    }),
  );
};

/** 계정 이메일 수정 */
export const updateEmail: Parameters<typeof rest.patch>[1] = async (req, res, ctx) => {
  const { email } = await req.json<PatchAccountRequestBody<PatchEmailReq>>();
  const { accountId } = req.params;

  return res(ctx.status(200), ctx.json({ id: accountId, email }));
};

/** 계정 삭제 */
export const deleteAccount: Parameters<typeof rest.delete>[1] = (req, res, ctx) => {
  const accountId = req.url.searchParams.getAll('id');

  return res(ctx.status(200), ctx.text(`accountId: ${accountId} 계정 삭제 완료`));
};

```

## 확인

Mock API를 만들었으니 클라이언트 개발에 연동하는 코드를 작성한 후 확인해보자. 회사에서 react-query를 적극적으로 사용하고 있는데, 실제로 API 개발이 완료되어 코드를 작성하는 것처럼 동일하게 작성하였다.

```jsx

import { useFactoroidStatusQuery } from '@services/factoroid-status/query';

export default function FactoroidStatusPage() {
  const result = useFactoroidStatusQuery();
  console.log(result);

	// ...
}
```

![Screen Shot 2022-12-04 at 19.16.36.png](MSW%20475e19b768a14328a387e8610185d1cf/Screen_Shot_2022-12-04_at_19.16.36.png)

![Screen Shot 2022-12-04 at 19.17.06.png](MSW%20475e19b768a14328a387e8610185d1cf/Screen_Shot_2022-12-04_at_19.17.06.png)

## MSW를 사용하기 전에는…

<p align="center">
  <img src="https://zubetcha-blog.s3.ap-northeast-2.amazonaws.com/2022/12/msw_hard-coded-mock-data-1.png" alt="hard-coded-mock-data-1" width="60%">
</p>

<p align="center">
  <img src="https://zubetcha-blog.s3.ap-northeast-2.amazonaws.com/2022/12/msw_hard-coded-mock-data-2.png" alt="hard-coded-mock-data-2" width="60%">
</p>

- 여러 컴포넌트에 침투해 있는 하드 코딩 Mock 데이터들
  - key 이름도 내마음대로

# MSW 연동을 위해 사전에 필요한 것들 🤔

- 백엔드 개발자와 API에 대한 충분한 커뮤니케이션
  - method 및 endpoint 설정
  - response 포맷 및 데이터 타입 설정
  - 에러 케이스에 대한 논의
- 변경사항이 발생했을 때 최신 API 명세를 문서와 동기화할 수 있는 프로세스

# 마무리

- 실제 네트워크 레벨에서의 HTTP 요청과 응답이 이루어진다는 점
- API 서빙 전과 후에 따라 변경해야 할 코드가 거의 없다는 점
- 구축이 간편함 (json-server 처럼 따로 서버를 실행할 필요 X)
