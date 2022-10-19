---

title: React-query useQuery와 Promise.all을 활용한 리렌더링 최적화
category: React
description: 리렌더링 최적화 그거 어떻게 하는건데…
date: 2022-07-13
published: true
tags:
  - react
  - optimization
  - react-query

---

## Table of Contents

## 들어가면서

> 본 게시글의 내용은 React v17까지만 해당합니다. React v18부터는 Promise에도 automatic batching을 지원하기 때문에 2개 이상의 API를 동시 호출해야 할 떼 useQuery 여러번 또는 useQueries를 사용해도 리렌더링이 한 번밖에 되지 않습니다.  🥲

회사에 들어온 지도 4개월이 다 되어간다.

마침 내가 입사한 시기가 운이 좋게도 jQuery로 되어 있던 레거시 프로젝트를 Nextjs로 막 옮기려고 하고 있던 참이었어서 덕분에 일종의 마이그레이션을 경험할 수 있었다. 프로젝트를 옮기면서 동시에 기능에 필요한 API들도 큰 변경이 있었는데, 바로 API 모듈화였다.

아래와 같이 되어 있는 페이지를 상상해보자.

![api module before](https://zubetcha-blog.s3.ap-northeast-2.amazonaws.com/2022/07/2022-07-rerender-optimization-before.png)

한 페이지를 완성하기 위해 A, B, C, D, E 총 5개의 각기 다른 성격의 데이터가 필요하다고 할 때, 기존에는 5개의 다른 데이터를 모두 하나의 API에 담았기 때문에 한 번의 호출만 필요했다.

하지만 API 모듈화를 진행하게 되면 각기 다른 성격의 데이터마다 다른 API에 실어서 보내야 하기 때문에 같은 페이지를 구성한다고 할 때 총 5번의 API 호출이 필요하게 된다.

![api module after](https://zubetcha-blog.s3.ap-northeast-2.amazonaws.com/2022/07/2022-07-rerender-optimization-after.png)

페이지 렌더링에 필요한 API 호출 횟수가 1회에서 5회로 증가하면서 내가 신경써야 하는 것들이 아래와 같이 생겨났다. (달리 말하면 충족해야 하는 조건이라고도 할 수 있다...🥲)

---

✨ 5개의 API들은 병렬로 호출되어야 한다.
✨ 5개의 API 통신이 모두 성공해야만 페이지를 보여줄 수 있다. (즉, 모든 API의 성공이 보장되어야 한다.)
✨ mutation 시 react-query로 업데이트 최적화를 적용해놨기 때문에 query Key로 refetch를 할 수 있도록 useQuery를 반드시 사용해야 한다.
✨ **(희망사항)** 5개의 API를 따로 따로 호출해도 리렌더링은 한 번만 됐으면 좋겠다!

---

react-query 문서에서 스쳐지나가 듯이 병렬로 API를 호출하는 훅을 본 기억이 있었기에 다시 parralel이라는 단어로 검색해보니 useQueries라는 훅이 있었다. 훅 이름 그대로 여러 개의 useQuery들을 병렬로 호출한다는 내용은 있는데 그 외의 별다른 내용은 없어서 일단 사용해 보기로 했다.

## Mock API 만들기

postman으로 간단하게 mock api를 만들었다.

```jsx
// api.tsx

export const api = axios.create({
    baseURL: 'your mock server url'
});

export const MockAPI = () => {
  return api.get("/api/rerender",)
}
```

## useQuery로 5번 호출해보기

우선 API를 호출할 때 useQuery를 5번 호출하면 리렌더링이 몇 번 발생하는지를 확인해보았다. 리렌더링 횟수를 카운팅하기 위해 useQuery의 option에 API 호출이 성공하면 count + 1을 해주는 코드를 추가했다.

```jsx
const [count, setCount] = useState(0)

console.log("rerender", count)

const queryKey = new Array(5).fill("rerender-test").map((el, i) => [el, String(i)])
const queryFn = async () => {
  try {
    const res = await MockAPI();
    return res.data.data;
  }
  catch (error) {
    error;
  }
}
const queryOption = {
  onSuccess: () => setCount(prev  => prev + 1)
}

useQuery(queryKey[0], queryFn, {...queryOption});
useQuery(queryKey[1], queryFn, {...queryOption});
useQuery(queryKey[2], queryFn, {...queryOption});
useQuery(queryKey[3], queryFn, {...queryOption});
useQuery(queryKey[4], queryFn, {...queryOption});

// ...

return (
  <>
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p>
        Rerender: <span style={{ color: "blue", fontWeight: "700" }}>{count}</span>
      </p>
    </div>
  </>
)
```

이렇게 코드를 작성하고 우선 공식문서에서 설명하고 있는 것처럼 useQuery를 여러 번 실행했을 때 API들이 병렬로 호출되는지 확인하기 위해 네트워크 탭을 열었고 5개의 useQuery가 모두 병렬로 실행되고 있음을 확인할 수 있었다!

![react-query parallel queries](https://zubetcha-blog.s3.ap-northeast-2.amazonaws.com/2022/07/2022-07-rerender-optimization-react-query-parallel-queries.png)

![react-query parallel queries network](https://zubetcha-blog.s3.ap-northeast-2.amazonaws.com/2022/07/2022-07-rerender-optimization-parallel-network.png)

![react-query parallel queries console.log](https://zubetcha-blog.s3.ap-northeast-2.amazonaws.com/2022/07/2022-07-rerender-optimization-parallel-log.png)

그 다음 리렌더링 횟수를 확인하기 위해 콘솔 탭을 열었고, useQuery 실행 횟수만큼 리렌더링이 발생하고 있다는 걸 확인할 수 있었다. 🥲

---

### useQuery 5번

✅ 5개의 API들은 병렬로 호출되어야 한다.
❌ 5개의 API 통신이 모두 성공해야만 페이지를 보여줄 수 있다. (즉, 모든 API의 성공이 보장되어야 한다.)
✅ mutation 시 react-query로 업데이트 최적화를 적용해놨기 때문에 query Key로 refetch를 할 수 있도록 useQuery를 반드시 사용해야 한다.
❌ (희망사항) 5개의 API를 따로 따로 호출해도 리렌더링은 한 번만 됐으면 좋겠다!

---

상단에 적은 조건 중 두 가지만 충족한다. 그래도 만약 useQuery를 사용해야 한다면 리렌더링을 최소화하기 위해 실행 횟수 자체를 줄여야 한다는 걸 알 수 있었다.

## useQueries

useQueries는 react-query에서 제공하는 API 중 하나로, 여러 개의 useQuery를 병렬로 실행해주는 훅이다. 만약 useQueries로 API를 호출했을 때 호출하는 모든 API의 성공을 보장할 수 있다면 위에 적은 조건들은 모두 충족하는 것이다.

![react-query useQueries](https://zubetcha-blog.s3.ap-northeast-2.amazonaws.com/2022/07/2022-07-rerender-optimization-react-query-useQueries.png)

위에 작성한 useQuery 5번 실행하는 코드를 useQueries를 사용한 코드로 바꾼 후 화면을 다시 새로고침 해보았다.. (나는 아직 react-query를 tanstack/react-query로 업그레이드하지 않았기 때문에 공식 문서에 나와 있는 사용 방법과는 조금 다르다.)

```jsx
// ✨ before

useQuery(queryKey[0], queryFn, {...queryOption});
useQuery(queryKey[1], queryFn, {...queryOption});
useQuery(queryKey[2], queryFn, {...queryOption});
useQuery(queryKey[3], queryFn, {...queryOption});
useQuery(queryKey[4], queryFn, {...queryOption});

// ✨ after

useQueries(queryKey.map(key => {
  return {
    queryKey: key,
    queryFn: queryFn,
    ...queryOption
  }
}))
```

![react-query useQueries network](https://zubetcha-blog.s3.ap-northeast-2.amazonaws.com/2022/07/2022-07-rerender-optimization-useQueries-network.png)

![react-query useQueries console.log](https://zubetcha-blog.s3.ap-northeast-2.amazonaws.com/2022/07/2022-07-rerender-optimization-useQueries-log.png)

..?

리렌더링 횟수는 오히려 배가 됐다. 훅의 이름 그대로 useQuery를 여러 개 실행시켜줄 뿐이고, 문서에 나와 있는 것처럼 실행해야 하는 useQuery의 갯수를 미리 알 수 없을 때 (동적으로 실행해야 할 때)를 위한 훅인 듯 하다. 따라서 충족하는 조건도 useQuery를 5번 실행했을 때와 동일하다!

---

### useQueries

✅ 5개의 API들은 병렬로 호출되어야 한다.
❌ 5개의 API 통신이 모두 성공해야만 페이지를 보여줄 수 있다. (즉, 모든 API의 성공이 보장되어야 한다.)
✅ mutation 시 react-query로 업데이트 최적화를 적용해놨기 때문에 query Key로 refetch를 할 수 있도록 useQuery를 반드시 사용해야 한다.
❌ (희망사항) 5개의 API를 따로 따로 호출해도 리렌더링은 한 번만 됐으면 좋겠다!

---

## Promise.all

사실 마지막 세 번째 조건인 react-query를 사용해야 한다는 조건만 빼면 나머지 **1) 병렬 호출**과 **2) 모든 API의 성공 보장**은 자바스크립트의 프로미스 메소드를 사용하면 해결된다. Promise.all()은 만약 파라미터로 주어진 객체가 모두 프로미스일 때 하나의 프로미스라도 거부되면 Promise.all() 자체도 거부되기 때문에 모든 API의 성공을 보장할 수 있다.

또한 파라미터로 주어진 프로미스들을 모두 처리한 후 한 번에 결과를 주기 때문에 리렌더링도 한 번만 되지 않을까..?하는 기대를 해보았다.

그럼 위에서 useQueries로 작성한 코드를 Promise.all()로 바꿔보자!

```jsx
useEffect(() => {
  Promise.all(new Array(5).fill(0).map(_ => {
    const res = MockAPI();
    return res;
  }))
  .then(_ => setCount(prev => prev + 1))
}, [])
```

![promise.all network](https://zubetcha-blog.s3.ap-northeast-2.amazonaws.com/2022/07/2022-07-rerender-optimization-promise-all-network.png)

![promise.all console.log](https://zubetcha-blog.s3.ap-northeast-2.amazonaws.com/2022/07/2022-07-rerender-optimization-promise-all-log.png)

🥹

콘솔에서 확인해보니 예상했던 대로(??) 리렌더링이 한 번밖에 발생하지 않았다..! react-query를 사용해야 하는 조건이 남긴 했지만 query Function을 Promise.all로 쪼물딱쪼물딱 만들면 되겠다는 생각이 들었다.

---

### Promise.all

✅ 5개의 API들은 병렬로 호출되어야 한다.
✅ 5개의 API 통신이 모두 성공해야만 페이지를 보여줄 수 있다. (즉, 모든 API의 성공이 보장되어야 한다.)
❌ mutation 시 react-query로 업데이트 최적화를 적용해놨기 때문에 query Key로 refetch를 할 수 있도록 useQuery를 반드시 사용해야 한다.
✅ (희망사항) 5개의 API를 따로 따로 호출해도 리렌더링은 한 번만 됐으면 좋겠다!

---

## Promise.all을 활용해 useQuery의 queryFn 만들기

Promise.all의 이행이 완료되면 이행 결과가 담겨 있는 리스트를 반환하도록 fetcher 함수를 만들고, useQuery의 queryFn 위치에 해당 함수를 파라미터로 사용했다.

```jsx
const fetcher = async () => {
  try {
    const resultList = await  Promise.all(new Array(5).fill(0).map(_ => {
      const res = MockAPI();
      return res;
    }))

    return resultList;
  }
  catch (error) {
    error;
  }
}

const queryResult = useQuery("rerender-test", fetcher, {...queryOption});
console.log(queryResult);
```

그리고 브라우저에서 확인해보니..!

![promise.all+useQuery network](https://zubetcha-blog.s3.ap-northeast-2.amazonaws.com/2022/07/2022-07-rerender-optimization-promise-useQuery-network.png)

![promise.all+useQuery console.log](https://zubetcha-blog.s3.ap-northeast-2.amazonaws.com/2022/07/2022-07-rerender-optimization-promise-useQuery-log.png)

API들도 너무 이쁘게 병렬로 호출되고~~모든 API의 성공도 보장하고~~

또한 useQuery를 한 번밖에 실행하지 않았으니 리렌더링도 한 번밖에 발생하지 않았다! 이로써 모든 조건들을 충족할 수 있게 되었다.

![lulu](https://blog.kakaocdn.net/dn/t4H26/btrIoBQi8FK/XfeRUjhNXngbnU1MHEfK0K/img.gif)

---

### useQuery + Promise.all로 만든 query function

✅ 5개의 API들은 병렬로 호출되어야 한다.
✅ 5개의 API 통신이 모두 성공해야만 페이지를 보여줄 수 있다. (즉, 모든 API의 성공이 보장되어야 한다.)
✅ mutation 시 react-query로 업데이트 최적화를 적용해놨기 때문에 query Key로 refetch를 할 수 있도록 useQuery를 반드시 사용해야 한다.
✅ (희망사항) 5개의 API를 따로 따로 호출해도 리렌더링은 한 번만 됐으면 좋겠다!

---

## 커스텀훅 만들기 최종*최최최종*진짜진자찐막

내가 담당하는 페이지들도 그렇고 대부분의 페이지에 필요한 데이터들은 모두 API 모듈화가 적용될 예정이기 때문에 페이지마다 fetcher 함수를 만들어서 쓰는 건 비효율적이라는 생각이 들어 필요한 곳에서 가져다 쓸 수 있도록 커스텀훅으로 만들어서 재사용하기로 했다.

```jsx
// useQueries.tsx

export const useQueries = (
  queryKey: string | string[],
  apis: {
    [key: string]: (params?: string | number | { [key:string]: any }) => Promise<AxiosResponse<any, any>>;
  },
  queryOptions?: {},
  params?: any[]
) => {
  const [errorCode, setErrorCode] = useState<number[]>([]);

  const fetchQueries = async () => {
    try {
      const resultList: any[] = await Promise.all(
        Object.keys(apis).map(async (key, i) => {
          const res = params[i] ? await apis[key](params[i]) : await apis[key]();

          return !res.data.code ? [key, res.data] : setErrorCode((prev) => [...prev, res.data.code]);
        })
      )

      return Object.fromEntries(resultList);
    } catch (error) {
      error;
    }
  }

  const queryResult = useQuery(queryKey, fetchQueries, {
    ...queryOptions,
  });

  return { ...queryResult, errorCode };
}
```

**queryKey**

: useQuery의 queryKey로 사용한다.

**apis**

: 데이터 fetch API들을 key-value의 형태로 묶은 오브젝트이다. useQuery가 반환해주는 data에서 key 이름으로 각 API의 response data에 접근할 수 있게 하기 위해 (한마디로 데이터를 이쁘게 정리하기 위해) 무조건 오브젝트의 형태로만 넘길 수 있도록 했다.

**queryOptions (optional)**

: useQuery의 option으로 사용한다.

**params (optional)**

: hoxy나 데이터를 fetch할 때 request url의 쿼리스트링이나 request body로 제공해야 하는 정보가 있는 경우에만 사용한다.

우리팀은 특정할 수 있는 원인으로 인해 request 오류가 발생한 경우에는 서버에서 커스텀 에러 코드를 함께 보내주는데, 프론트엔드에서는 500번대 에러를 제외한 그 외의 나머지 에러들은 모두 resolve가 되도록 처리해놨기 때문에 try문에서 예외처리를 하고 커스텀훅이 커스텀 에러코드의 상태도 함께 반환하도록 하였다.

request할 때 정보를 함께 전달해야 하는 케이스도 확인하기 위해 포스트맨으로 mock api를 한 개 더 만들고 export하는 API도 수정했다.

![postman](https://zubetcha-blog.s3.ap-northeast-2.amazonaws.com/2022/07/2022-07-rerender-optimization-postman.png)

```jsx
// api.tsx

export const MockAPI = {
  test1: () => api.get("/api/rerender"),
  test2: (name: string) => api.get("/api/test", { params: { name } })
}
```

그리고 API를 호출하는 페이지에서 useQueries 커스텀 훅을 import한 후 아래와 같이 코드를 수정한 후,

```jsx
// index.tsx

import { useQueries } from "../../hooks/useQueries";

// ...

const apis = {
  api1 : MockAPI.test1,
  api2 : MockAPI.test2,
  api3 : MockAPI.test1,
  api4 : MockAPI.test2,
  api5 : MockAPI.test1,
};
const queryOption = { onSuccess: () => setCount(prev  => prev + 1) };
const params = [null, "zubetcha", null, "zubetcha", null];

const result = useQueries("rerender", apis, queryOption, params)
console.log(result)

// ...
```

브라우저에서 확인해보면..!

![useQuery customHook network](https://zubetcha-blog.s3.ap-northeast-2.amazonaws.com/2022/07/2022-07-rerender-optimization-custom-hook-network.png)

![useQuery customHook network](https://zubetcha-blog.s3.ap-northeast-2.amazonaws.com/2022/07/2022-07-rerender-optimization-custom-hook-log.png)

useQuery가 반환해주는 data가 파라미터로 넘긴 apis의 key이름으로 이쁘게 잘 정리까지 되어 있는 걸 볼 수 있다!

## 마치며

프로젝트를 하면서 항상 최적화 해야지~해야지~ 입으로는 말하면서도 뭐부터, 어떻게 해야 할지 감이 안 왔었는데 처음부터 고민하면서 시도하고, 마침내 내가 원하는 바를 이룰 수 있어서 뿌듯하고 뜻깊었다. 앞으로도 다양한 방면으로 최적화를 해내고 싶다는 욕심도 생겼다. 아좌좌..~!

<p align="center">
  <img src="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2Fb6ZF5g%2FbtrIiLtZ40i%2FPyNoa5t4Pzgv0tj6u1tAC1%2Fimg.jpg" alt="azaza" width="600" />
</p>

---

읽어주셔서 감사합니다. 혹시 잘못된 정보가 있다면 메일로 신고 부탁드립니다. 🙇🏻‍♀️
