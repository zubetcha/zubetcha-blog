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

![Untitled](MSW%20475e19b768a14328a387e8610185d1cf/Untitled.png)

## 특징

MSW 외에도 Mock API를 제공하거나 Mock Server를 구축할 수 있는 여러가지 라이브러리가 있지만, 다른 라이브러리와 비교했을 때 MSW는 아래와 같은 장점을 지니고 있다.

- 모킹이 네트워크 통신 레벨에서 일어나기 때문에 프론트엔드 코드를 실제로 서버와 통신하는 것처럼 작성할 수 있다는 이점
  - Mock API → Real API 교체가 간편하게 이루어짐
  - DX, 개발 생산성 향상
- 브라우저의 Service Worker 환경이나 테스트 환경에서 모두 하나의 코드를 작성해서 활용할 수 있음
  - 개발 생산성, 유지보수 측면의 DX 향상
- REST API 모킹, GraphQL API 모킹 모두 지원
- Web의 Service Worker API를 사용하다보니 지원하지 않는 브라우저 있을 수 있음 (ex. IE)

# 사용 방법

MSW에 대해서 간단하게 살펴보았으니 이제 어떻게 사용하는지도 알아보자!

## MSW 패키지 설치

```jsx
yarn add msw
npm install msw
```

## 서비스 워커 코드 생성

```jsx
$ npx msw init public/ --save
```

public 폴더에 `mockServiceWorker.js`가 자동으로 생성되는 것을 확인할 수 있다.

![Screen Shot 2022-12-02 at 09.00.16.png](MSW%20475e19b768a14328a387e8610185d1cf/Screen_Shot_2022-12-02_at_09.00.16.png)

## Request Handler

- 요청이 들어왔을 때 응답할 임의의 핸들러로, REST API, GraphQL API 모두 처리 가능
- REST API의 경우 method, path(endpoint), 리스폰스를 반환해 줄 resolver가 필요함
- rest[http method] 함수는 두 개의 인자를 받음
  - 엔드포인트
  - Response resolver

```jsx
├─src
│  └─mocks
│    ├─handlers.ts // request 핸들러
│    ├─data // mock data
│    │ ├─account.ts
│    │ ├─sensor.ts
│    │ └─// ...
│    └─resolver // request 리졸버
│      ├─account.ts
│      ├─sensor.ts
│      └─// ...
```

```jsx
// src/mocks/handlers.ts

import { DefaultBodyType, rest } from 'msw';
import {
  getCustomerCount,
  getFactoryCount,
  getEquipmentCount,
  getSensorCount,
  getFactoryMapInfo,
} from './resolver/factoroid-status';

const todos = ['먹기', '자기', '놀기'];

export const handlers = () => {
  return [
    /** admin/factoroid-status */

    /** 전체 고객사 개수 */
    rest.get('/api/customer/count', getCustomerCount),

    /** 전체 설치 공장 개수 및 평균 */
    rest.get('/api/factory/count', getFactoryCount),

    /** 전체 설치 설비 개수 및 평균 */
    rest.get('/api/equipment/count', getEquipmentCount),

    /** 전체 설치 센서 개수 및 센서 타입별 개수 */
    rest.get('/api/sensor/count', getSensorCount),

    /** 공장별 위도 경도 및 설치 설비, 센서 개수 */
    rest.get('/api/factory/map/info', getFactoryMapInfo),
  ];
};
```

## Response resolver

- 브라우저에서 발생하는 네트워크 요청을 가로채서 대신 응답을 보내주는 역할
- req, res, ctx 세 개의 인자를 받음
  - req: 일치하는 request에 대한 정보
  - res: mocked response를 생성해주는 함수
  - ctx: mocked response의 status code, headers, body 등을 설정해주는 함수들을 담고 있는 객체

**자주 사용하는 ctx 메서드**

- ctx.status() : status code
- ctx.json() : response body

```jsx
// src/mocks/resolver/factoroid-status.ts

export const getSensorCount: Parameters<typeof rest.get>[1] = (req, res, ctx) => {
  return res(ctx.status(200), ctx.json(sensorCount));
};
```

## Service Worker 인스턴스 생성

- msw가 제공해주는 setupWorker 함수를 사용하여 Service Worker 생성
- setupWorker함수는 이미 정의되어 있는 Request handler들로 worker 인스턴스를 생성해줌
- handlers.ts에 작성한 request handler들을 setupWorker() 함수의 인자로 전달

```jsx
// src/mocks/browser.ts

import { setupWorker } from 'msw';
import { handlers } from './handlers';

export const worker = setupWorker(...handlers());
```

## Service Worker 삽입

- 애플리케이션의 Entry Point에 Service Worker를 실행시키는 코드 삽입
- Next.js에서는 \_app.tsx

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

![Screen Shot 2022-12-02 at 15.08.24.png](MSW%20475e19b768a14328a387e8610185d1cf/Screen_Shot_2022-12-02_at_15.08.24.png)

- setupWorker은 브라우저 환경에서만 정상적으로 실행될 수 있는데 Nextjs는 node(server)환경에서 빌드되어 브라우저에 접근하기 전에 setupWorker 함수가 실행되어 발생하는 문제
- window 객체가 있을 때에만 setupWorker 함수가 실행되도록 실행 시점을 제어하여 해결

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

![Screen Shot 2022-12-02 at 15.33.24.png](MSW%20475e19b768a14328a387e8610185d1cf/Screen_Shot_2022-12-02_at_15.33.24.png)

# 적용해보기

## 준비

### API

```jsx
export const FactoroidStatusAPI = {
  getCustomerCount: () => api.get('/api/customer/count'),
  getFactoryCount: () => api.get('/api/factory/count'),
  getEquipmentCount: () => api.get('/api/equipment/count'),
  getSensorCount: () => api.get('/api/sensor/count'),
  getFactoryMapInfo: () => api.get('/api/factory/map/info'),
};
```

### useQueries

```jsx
export const useFactoroidStatusQuery = () => {
  return useQueries({
    queries: Object.entries(FactoroidStatusAPI).map(([key, fetcher]) => {
      return {
        queryKey: [QUERY_KEYS.FACTOROID_STATUS, key],
        queryFn: fetcher,
      };
    }),
  });
};
```

## 확인

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

![Screen Shot 2022-12-04 at 19.43.17.png](MSW%20475e19b768a14328a387e8610185d1cf/Screen_Shot_2022-12-04_at_19.43.17.png)

![Screen Shot 2022-12-04 at 19.43.43.png](MSW%20475e19b768a14328a387e8610185d1cf/Screen_Shot_2022-12-04_at_19.43.43.png)

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
