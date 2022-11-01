---

title: 바텀 시트 컴포넌트 개발기
category: React
date: 2022-10-23
description: 재사용 가능한 컴포넌트 만들기
published: false
slug: react-bottom-sheet
tags: 
  - react
  - bottomsheet

---

## Table of Contents

## 들어가면서

여름에 개발했던 PoC를 고객사뿐만 아니라 현장에서 일하시는 타 팀도 고객사 페이지 및 관리자 페이지를 모두 사용하고 있는데, 현장에서는 노트북을 사용하기 어려워 모바일용 화면을 만들어 줄 수 있냐는 요청이 들어왔습니다. 마침 10월에 여유가 생겨서 약 2주의 동안 모바일 화면을 추가로 개발하기로 하였고, 그중에서 저는 데스크탑 화면에서의 모달을 대체할 바텀 팝업 시트를 만들기로 했습니다.

## 인터랙션 요구사항

우선 감사하게도 디자이너가 바텀시트 컴포넌트 디자인을 빠르게 만들어주셨습니다. 그리고 모바일용인 만큼 신경써야 하는 인터랙션이 굉장히 많았습니다! 우선 개발하기에 앞서 필요사항들을 정리해 보았습니다.

### 공통

- expanded가 false일 때 바텀 시트의 dimmed 영역을 클릭하면 바텀 시트가 언마운트됩니다.
- 바텀 시트를 아래 방향으로 snap 조건 이상 터치하여 움직이면 바텀 시트가 언마운트됩니다.

### expanded가 false이고 헤더 + 컨텐츠 + 버튼 높이가 50vh 이하인 경우

바텀 시트를 처음 열었을 때 expanded의 상태는 false 입니다.

- UI
  - 바텀 시트의 컨테이너 높이는 헤더 + 컨텐츠 + 버튼 높이입니다.
  - 헤더에 핸들바가 보이지 않습니다.
- 인터랙션
  - 해당 높이만큼 바텀 시트가 올라오고 컨텐츠 영역을 자유롭게 사용할 수 있습니다.
  - 컨텐츠 영역을 위 방향으로 snap 조건만큼 터치하여 움직여도 expanded 상태가 변하지 않습니다.

### expanded가 false이고 헤더 + 컨텐츠 + 버튼 높이가 50vh를 초과하는 경우

- UI
  - 바텀 시트의 컨테이너 높이는 50vh이어야 하고 50vh만큼 올라옵니다.
  - 헤더에 핸들바가 보입니다.
  - 컨텐츠 영역에 스크롤바가 보입니다.
  - 컨텐츠 영역의 하단에 스크롤 힌트가 보입니다.
- 인터랙션
  - 컨텐츠 영역을 사용(입력, 클릭 등등..)하려면 바텀 시트가 전체 viewport에 다 차도록 열어야 합니다.
  - 컨텐츠 영역을 위 방향으로 snap 조건만큼 터치하여 움직이면 expanded의 상태가 true가 됩니다.

### expanded가 true일 때

- UI
  - 바텀 시트의 컨테이너 높이가 100vh가 되고 전체 viewport를 채웁니다.
  - 헤더에 핸들바, 타이틀, close 아이콘이 보입니다.
  - 만약 컨텐츠의 높이가 컨텐츠 영역의 높이를 초과하는 경우 스크롤바와 스크롤 힌트가 보입니다.
  - 컨텐츠 영역의 스크롤이 최상단에 있는 경우 상단의 스크롤 힌트가 보이지 않습니다.
  - 컨텐츠 영역의 스크롤이 최하단에 있는 경우 하단의 스크롤 힌트가 보이지 않습니다.
  - 컨텐츠 영역의 스크롤이 중간에 있는 경우 상단과 하단의 스크롤 힌트가 모두 보여야 합니다.
- 인터랙션
  - 컨텐츠 영역의 스크롤이 회상단에 있는 상태에서 위로 스크롤하면 바텀 시트가 언마운트됩니다.

## State와 Props

바텀 시트 컴포넌트의 내부에서 관리해야 하는 state와 외부에서 받아야 하는 props를 정리해 보았습니다.

### State

- expanded (boolean): 완전히 펼친 상태인지 아닌지를 관리하는 상태
- isInDom (boolean): open 상태에 따라 DOM에 컴포넌트 마운트할지 언마운트할지를 관리하는 상태
- scrollable (boolean): 바텀 시트를 처음 열었을 때 container의 clientHeight가 viewport height의 절반보다 같거나 큰지 혹은 작은지를 확인하는 상태로, scrollable의 상태에 따라 handle bar를 보여주거나, 위의 방향으로 touchmove를 할 수 있는지를 관제합니다.
- container (dom): DOM의 변화를 알기 위해 useRef 대신 useCallback으로 설정한 dom ref로, 바텀 시트의 컨테이너를 참조합니다.
- content (dom): DOM의 변화를 알기 위해 useRef 대신 useCallback으로 설정한 dom ref로, 바텀 시트의 컨텐츠 영역을 참조합니다.

```jsx
const [expanded, setExpanded] = useState(false);
const [scrollable, setScrollable] = useState(false);
const [isInDOM, setIsInDOM] = useState(false);
const [container, setContainer] = useState<HTMLDivElement | null>(null);
const [content, setContent] = useState<HTMLDivElement | null>(null);

const containerRef = useCallback((node) => {
  if (node !== null) {
    setContainer(node);
  }
}, []);

const contentRef = useCallback((node) => {
  if (node !== null) {
    setContent(node);
  }
}, []);
```

### Props

- open: 바텀 시트를 열 때 사용하는 useState의 state
- setOpen: 바텀 시트의 상태를 업데이트하는 useState의 setState

### Constant

- OFFSET_CONDITION (number): snap 인터랙션을 관제하는 touchmove 거리 조건

```jsx
const OFFSET_CONDITION = 70;
```

### Ref

- firstClientHeight (number): 바텀 시트를 터치 이벤트로 움직였지만 OFFSET_CONDITION 보다 이동 거리가 작아 snap되지 않고 다시 원래 높이로 되어야 할 때 사용합니다.
- halfVh (number): 50vh를 px로 변환한 숫자
- metrics (object): 터치 이벤트에 사용할 매트릭

```jsx
const firstClientHeight = useRef(0);
const halfVh = useRef(0);
const metrics = useRef<BottomSheetMetrics>({
  touchStart: {
    containerHeight: 0,
    touchY: 0,
  },
  touchMove: {
    prevTouchY: undefined,
    movingDirection: 'none',
    touchOffset: 0,
  },
  isContentAreaTouched: false,
});
```

## 만들어보자..!

### react-spring

처음 바텀 시트가 열리거나 완전히 내려가는 경우에는 react-spring이라는 라이브러리의 도움을 받았습니다.

```jsx
import { useSpring } from 'react-spring';

const [springProps, api] = useSpring(() => ({
  y: '100%',
  onRest: {
    y: (y) => {},
  },
}));
```

useSpring 함수의 파라미터에는 객체와 객체를 반환하는 함수가 들어갈 수 있습니다.
