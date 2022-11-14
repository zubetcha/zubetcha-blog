---

title: 트리쉐이킹으로 ECharts 번들 사이즈 최적화하기
category: Optimization
date: 2022-08-14
published: true
tags:
  - optimization
  - treeshaking
  - echarts

---

# 들어가면서

최근 회사에서 약 3개월에 걸쳐 진행한 프로젝트가 마무리 되었습니다. 잠깐의 여유가 생겨 프로젝트 회고를 하던 중 성능 최적화에 대한 얘기가 나왔습니다. 프로젝트는 크게 **1) 고객사에서 사용하는 페이지**와 **2) 관리자 계정이 사용하는 어드민 페이지로** 나뉘어져 있는데, 고객사 페이지는 데이터를 시각화하여 대시보드의 형태로 제공하고 있는 페이지가 많아 받아오는 데이터가 크고, 실시간으로 데이터를 받아서 실시간 차트를 그려주는 페이지도 있기 때문에 `성능`이 중요했습니다.

성능을 최적화하는 방법에는 여러가지가 있겠지만 우선 번들 사이즈를 줄이는 방법을 택했습니다. 이유는 두 가지인데,

<br/>

1.  비교적 **적은 리소스**를 투입해서
2.  서비스 운영에 큰 리스크를 주지 않으면서도 **가시적인 효과**를 기대할 수 있기 때문입니다.

<br/>

# 번들 사이즈 확인

## @next/bundle-analyzer 설치

번들 사이즈를 줄이기 위해서는 먼저 `번들 사이즈`를 확인해야 합니다.

저는 간편하게 확인할 수 있는 `webpack-bundle-analyzer` 툴을 사용했고, 프로젝트가 Nextjs로 되어 있어 Nextjs 프레임워크에서 사용할 수 있도록 만들어진 `@next/bundle-analyzer`를 사용했습니다.

## next.config.js 설정

```jsx
// next.config.js

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
})

// ...

module.exports = withBundleAnalyzer({...config});
```

## 실행 script 추가

번들 사이즈 결과가 담겨 있는 html을 브라우저에 띄워주려면 분석 실행 환경에서 빌드하는 명령어를 실행해야 합니다. 번들 사이즈를 확인하려는 프로젝트가 모노레포 환경에 있기 때문에 짧은 명령어로 실행시킬 수 있도록 루트 레벨의 package.json에 실행 스크립트를 추가했습니다.

```jsx
// package.json

{
  "scripts": {
    "analyze-bundle/프로젝트 이름": "ANALYZE=true yarn workspace 프로젝트 이름 build",
  }
}
```

## 결과 확인하기

analyzer를 실행하면 자동으로 브라우저에 사이즈를 확인할 수 있는 화면이 열립니다. 만약 자동으로 열리는 걸 원하지 않는다면 next.config.js에서 withBundleAnalyzer 옵션 중 `openAnalyzer`를 false로 설정하면 됩니다.

analyzer가 측정하는 어플리케이션의 크기는 `stats`, `parsed`, `gzip`으로 총 세 가지가 있습니다. 일반적으로 프로젝트를 배포할 때에는 빌드 결과물을 사용하므로 parsed 크기를 중점적으로 봐야 한다고 합니다. parsed 크기를 줄이면 gzip 크기 또한 비례적으로 줄어듭니다.

<br/>

- stats : 순수한 어플리케이션 크기
- parsed : 웹팩 플러그인을 사용하여 사이즈 최소화가 적용된 결과물의 크기
- gzip : parsed 번들을 gzip 압축을 통해 실행시켰을 때의 크기

<br/>

그리고 아래와 같이 프로젝트의 전체 사이즈 측정 결과가 나왔습니다.

<br/>

- stat: 6.13MB
- parsed: 1.93MB
- gzipped: 591.12KB

<br/>

패키지별 사이즈는 아래와 같았습니다.

<p align="center">
  <img src="https://zubetcha-blog.s3.ap-northeast-2.amazonaws.com/2022/08/2022-08-bundle-optimization-top10.png" alt="bundle size top10" width="70%" />
</p>

<img src="https://zubetcha-blog.s3.ap-northeast-2.amazonaws.com/2022/08/2022-08-bundle-optimization-before.png" alt="echarts size before" width="100%" />

<br/>

결과는 무척이나 놀라웠읍니다....

`parsed` 기준으로 전체 사이즈가 1.93MB인데 그 중 절반 이상을 `echarts`가 차지하고 있었습니다. 렌더링하는 차트의 종류 및 개수가 많기는 했지만 그래도 절반 이상을 차지하는 결과는 예상 밖이었습니다.. 페이지 수로 보면 오히려 차트를 사용하는 페이지보다 차트를 사용하지 않는 페이지가 더 많았습니다.

하지만 데이터 시각화는 핵심 서비스이고, echarts를 사용하지 않을 수는 없었기에 사이즈를 줄일 수 있는 방법이 있는지 찾아보았고 echarts의 공식문서에서 `트리쉐이킹`을 적용하는 방법을 찾았습니다.

# Echarts 트리쉐이킹

## 트리쉐이킹이란?

트리쉐이킹이란 간단히 말해서 사용하지 않는 코드를 제거하는 것을 의미합니다.

기존에 echarts를 사용하던 방식은 아래의 코드와 같습니다.

```jsx
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts';

// ...

<ReactECharts option={option} style={{ height: "100%", width: "100%" }} />
```

echarts-for-react가 react에서 echarts를 컴포넌트의 형태로 렌더링하기 위해 제공하는 ReactEcharts와 차트의 옵션을 설정하거나 메서드를 사용하기 위해서 **echarts의 모든 모듈을 import**한 코드입니다.

echarts는 다양한 차트 타입과 그 외에도 선택적으로 사용할 수 있는 스크롤, 툴팁 등의 다양한 컴포넌트들을 제공하고 있습니다. ReactEcharts 컴포넌트의 option 프로퍼티로 전달하는 객체에서 차트에 사용할 컴포넌트와 차트 타입 등을 설정하지만, 위와 같은 방식은 **컴포넌트에서 사용하지 않는** 차트 인스턴스나 모듈들도 import합니다.

## 트리쉐이킹 적용하기

echarts에 트리쉐이킹을 적용하는 방법은 의외로 굉장히 간단했습니다. 트리쉐이킹의 의미처럼 **컴포넌트에 필요한** 차트 인스턴스와 모듈만 import하면 됩니다.

위에 있던 기존의 코드에 `트리쉐이킹`을 적용한 모습입니다.

```jsx
import ReactEChartsCore from 'echarts-for-react/lib/core';
import * as echarts from 'echarts/core';
import { LineChart } from "echarts/charts";
import { GridComponent, TooltipComponent, DataZoomInsideComponent, DataZoomSliderComponent } from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";

// ...
echarts.use([LineChart, CanvasRenderer, GridComponent, TooltipComponent, DataZoomInsideComponent, DataZoomSliderComponent]);

// ...

<ReactEChartsCore
	echarts={echarts}
	option={option}
	style={{ height: "100%", width: "100%" }}
	ref={eChartRef}
></ReactEChartsCore>
```

<br/>

1. echarts-for-react/lib/core 에서 `차트 컴포넌트`를,
2. echarts/charts 에서 `사용할 차트 타입`을,
3. echarts/components 에서 차트에 `사용할 컴포넌트`를,
4. echarts/renderers 에서 차트를 `렌더링할 방식`을 import합니다.
5. 그리고 import한 모듈들만 사용하기 위해서 echarts의 `use` 메서드를 실행합니다.

<br/>

## 트리쉐이킹 적용 결과

결과적으로는 echarts 번들 사이즈를 약 `46%`를 줄일 수 있었습니다.

<img src="https://zubetcha-blog.s3.ap-northeast-2.amazonaws.com/2022/08/2022-08-bundle-optimization-after.png" alt="echarts size after" width="100%" />

## 트리쉐이킹 할 때 참고하면 좋을 것들

<br/>

- 사용하고 있는 차트 컴포넌트 중 한 개라도 트리쉐이킹을 적용하지 않으면 번들 사이즈는 줄어들지 않습니다! 차트를 사용하는 컴포넌트가 100개가 있고 99개의 컴포넌트에 트리쉐이킹을 적용했다 하더라도 나머지 적용하지 않은 1개 때문에 원하는 결과를 얻을 수 없습니다.
- 사실상 echarts에서는 사용하고자 하는 차트 타입과 컴포넌트들의 세부 설정을 option에서 관리합니다. 그래서 가장 좋은 방법은 차트 타입별 option을 생성해주는 함수를 만들고, 차트 컴포넌트는 1개만 사용하는 게 좋지 않을까..? 라는 생각을 요즘 하고 있습니다. 🥲

<br/>

---

읽어주셔서 감사합니다. 혹시 잘못된 정보가 있다면 메일로 신고 부탁드립니다. 🙇🏻‍♀️
