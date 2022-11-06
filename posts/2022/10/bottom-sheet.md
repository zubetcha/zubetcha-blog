---

title: 바텀 시트 컴포넌트 개발기
category: React
date: 2022-10-23
description: 재사용 가능한 컴포넌트 만들기
published: true
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

## useBottomSheet 만들기

BottomSheet에만 사용될 거긴 하지만 인터랙션 관련 로직을 뷰와 분리하고 싶어 useBottomSheet라는 커스텀훅을 만들었습니다.

### react-spring

처음 바텀 시트가 열리거나 완전히 내려가는 경우에는 react-spring이라는 라이브러리의 도움을 받았습니다. useSpring은 react-spring이 제공해주는 훅 중 하나로, 매개변수에는 객체와 객체를 반환하는 함수가 들어갈 수 있습니다.

```javascript
const styles = useSpring({ opacity: toggle ? 1 : 0 }) // 객체 전달

const [styles, api] = useSpring(() => ({ opacity: 1 })) // 함수 전달

api.start({ opacity: toggle ? 1 : 0 })
api.stop()

return <animated.div style={styles}>i will fade</animated.div>
```

객체를 바로 전달하면 컴포넌트가 리렌더링 될 때 애니메이션이 발생하도록 할 수 있고, 함수를 전달하면 반환해주는 api를 사용해서 리렌더링 시점이 아닌 내가 원하는 시점에 styles를 업데이트 시킬 수도 있습니다.

바텀 시트를 처음 열었다면 viewport 아래에서 DOM에 잡히고 위로 올라오도록 하기 위해 translateY의 초기값을 100%로 설정하고 DOM에 잡히면 api를 사용해 translateY를 0으로 업데이트합니다. 바텀 시트를 DOM에서 제거할 때도 마찬가지로 다시 바텀 시트의 translateY를 100%로 업데이트한 후 DOM에서 제거합니다.

```jsx
import { useSpring } from 'react-spring';

const [springProps, api] = useSpring(() => ({
  y: '100%',
  onRest: {
    y: (y) => {
      if (y.value === '100%') {
        // 바텀 시트가 완전히 내려가면 DOM에서 제거
      }
    },
  },
}));
```

### 흐름 잡기

개발하기에 앞서 각각의 state와 props가 변경되었을 때 어떤 흐름으로 이어지는지를 정리해 보았습니다.

**BottomSheet를 열 때**

1. BottomSheet 외부에서 open을 true로 업데이트합니다.
2. open이 true가 되면 DOM에 BottomSheet를 추가하기 위해 isInDOM을 true로 업데이트합니다.
3. isInDOM이 true가 되면 BottomSheet의 translateY는 100%에서 0으로 업데이트되면서 viewport 아래에 위치해 있다가 위로 올라옵니다.

**BottomSheet를 닫을 때**

1. BottomSheet를 닫기 위해 open을 false로 업데이트합니다.
2. open이 false가 되면 BottomSheet의 translateY는 0에서 100%로 업데이트되면서 viewport 아래로 이동합니다.
3. translateY가 100%가 되면 react-spring에서 이를 감지하여 isInDOM을 false로 업데이트합니다.
4. isInDOM이 false가 되면 BottomSheet 컴포넌트는 null을 반환하면서 DOM에서 제거됩니다.

이를 코드로 작성해보면 아래와 같이 됩니다.

```jsx
const [springProps, api] = useSpring(() => ({
  y: '100%',
  onRest: {
    y: (y) => {
      if (y.value === '100%') {
        setIsInDOM(false);
      }
    },
  },
}));

useEffect(() => {
  if (open) {
    setIsInDOM(true);
  } else if (!open) {
    api.start({ y: '100%' });
  }
}, [open]);

useEffect(() => {
  if (isInDOM && container) {
    // DOM에 잡힌 BottomSheet의 높이가 50vh 이상인 경우 content 영역에 스크롤이 있다고 판단
    if (container.clientHeight >= halfVh.current) {
      setScrollable(true);
    }
    // BottomSheet의 overlay 영역 스크롤 막기
    document.body.style.setProperty('overflow', 'hidden');
    // expanded false이고 BottomSheet를 움직인 거리가 snap 조건에 미달하여 원래 높이로 다시 돌아가야 하는 경우 사용할 높이
    firstClientHeight.current = container.clientHeight;
    api.start({ y: '0' });
  }

  if (!isInDOM) {
    document.body.style.removeProperty('overflow');
  }
}, [isInDOM]);

useEffect(() => {
  const containerHeight = expanded ? halfVh.current * 2 : firstClientHeight.current;
  const overflowY = expanded ? 'overlay' : 'hidden';

  container?.style.setProperty('transition', 'height 0.4s ease-out');
  container?.style.setProperty('height', `${containerHeight}px`);
  content?.style.setProperty('overflow-y', `${overflowY}`);
}, [expanded]);
```

### 50vh 값 저장하기

```jsx
useEffect(() => {
  if (window) {
    const setVh = () => {
      const vh = window.innerHeight * 0.01;
      halfVh.current = vh * 50;
    }

    window.addEventListener('resize', setVh);
    window.addEventListener('touchend', setVh);

    return () => {
      window.removeEventListener('resize', setVh);
      window.removeEventListener('touchend', setVh);
    }
  }
}, []);
```

### 터치 이벤트

BottomSheet는 모바일 화면에서만 사용되기 때문에 핸들을 잡고 내리거나 올리는 등의 인터랙션을 위해 터치 이벤트가 필요합니다. 터치 이벤트를 개발한 경험이 전무후무했기 때문에 콴다 팀블로그를 정말정말 많이 참고했습니다! _감사합니다. 🙇🏻‍♀️_

터치 이벤트는 touchstart, touchmove, touchend 세 개가 필요합니다.

- touchstart: BottomSheet를 처음 터치했을 때의 터치 포인트 위치와 BottomSheet의 clientHeight를 기록합니다.
- touchmove: BottomSheet를 터치하여 움직인 거리만큼 BottomSheet의 clientHeight 높이를 변경하고 위로 움직였는지, 아래로 움직였는지의 방향을 기록합니다.
- touchend: BottomSheet에서 뗐을 때 touchmove에서 기록한 움직인 방향과 거리에 따라 1) snap 시키거나, 2) BottomSheet를 닫거나, 3) 터치하기 전의 높이 그대로 유지할 지를 결정하고, 기록한 metric을 초기화합니다.

```jsx
// touchstart
const handleTouchStart = (e: TouchEvent) => {
  const { touchStart } = metrics.current;

  touchStart.containerHeight = container?.clientHeight as number;
  touchStart.touchY = e.touches[0].clientY;
};

// touchmove
const handleTouchMove = (e: TouchEvent) => {
  const { touchStart, touchMove } = metrics.current;
  const currentTouch = e.touches[0];

  // 방향 기록
  if (touchMove.prevTouchY === undefined) {
    touchMove.prevTouchY = touchStart.touchY;
  }

  if (touchMove.prevTouchY < currentTouch.clientY) {
    touchMove.movingDirection = 'down';
  }

  if (touchMove.prevTouchY > currentTouch.clientY) {
    touchMove.movingDirection = 'up';
  }

  // 움직인 거리만큼 BottomSheet의 height 변경
  if (availableToMoveBottomSheet()) {
    e.preventDefault();

    touchMove.touchOffset = touchStart.touchY - currentTouch.clientY;
    let nextSheetHeight = touchStart.containerHeight + touchMove.touchOffset;

    // 만약 BottomSheet를 처음 열었을 때
    // 1) content 영역이 작아서 BottomSheet를 초과하지 않는데 위로 움직이려고 하는 경우
    // 2) 이미 expanded true인데 위로 움직이려고 하는 경우
    // BottomSheet의 height 값이 달라지지 않도록 처리
    if ((!scroll && touchMove.touchOffset > 0) || (expanded && touchMove.touchOffset > 0)) {
      nextSheetHeight = touchStart.containerHeight;
    }

    container?.style.setProperty('transition', 'height 0.4s linear');
    container?.style.setProperty('height', `${nextSheetHeight}px`);
  }
};

// touchend
const handleTouchEnd = (e: TouchEvent) => {
  const { touchMove } = metrics.current;
  const needToSnap = Math.abs(touchMove.touchOffset) > OFFSET_CONDITION;

  // snap 할 필요 없는 경우 터치하기 전의 BottomSheet 높이로 재설정
  if (!needToSnap) {
    container?.style.setProperty('transition', 'height 0.4s ease-out');

    if (expanded) {
      container?.style.setProperty('height', `${halfVh.current * 2}px`);
    }
    if (!expanded) {
      container?.style.setProperty('height', `${firstClientHeight.current}px`);
    }
  }

  // snap 해야 하는 경우
  if (needToSnap) {
    if (expanded) {
      // content 영역의 스크롤이 상단에 위치해 있는 상태에서 다시 위로 스크롤하려고 하는 경우
      if (touchMove.movingDirection === 'down' && content?.scrollTop! <= 0) {
        setOpen(false);
      }
    }
    if (!expanded) {
      // BottomSheet를 아래로 내린 경우 닫기
      if (touchMove.movingDirection === 'down') {
        setOpen(false);
      }
      // BottomSheet를 위로 올린 경우 컨텐츠 영역에 스크롤이 있을 때만 expanded true로 업데이트
      if (touchMove.movingDirection === 'up') {
        if (scrollable) setExpanded((prev) => !prev);
      }
    }
  }

  // metric 초기화
  metrics.current = {
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
  };
};
```

handleTouchMove에 있는 availableToMoveBottomSheet 함수는 유저가 BottomSheet를 터치했을 때 BottomSheet를 움직여도 될지를 결정하는 함수입니다. 아래와 같은 경우 BottomSheet를 움직여도 된다고 판단하여 true를 반환합니다.

- expanded가 false일 때
- metrics의 isContentAreaTouched가 false일 때 (= content 영역을 터치하고 있지 않은 경우)
- 움직인 방향이 down이고 content 영역의 스크롤이 상단에 위치해 있는 경우

isContentAreaTouched는 content 영역을 터치하면 true가 되어야 합니다. 이를 위해서 content에 터치 이벤트를 등록해 줍니다.

```jsx
useEffect(() => {
  if (content) {
    const handleTouchStart = (e: TouchEvent) => {
      metrics.current.isContentAreaTouched = true;
    }

    content.addEventListener('touchstart', handleTouchStart);
    return () => {
      content.removeEventListener('touchstart', handleTouchStart);
    }
  }
}, [content])
```

그리고 container에도 위에서 만든 handleTouchStart, handleTouchMove, handleTouchEnd를 각각 등록해줍니다.

```jsx
useEffect(() => {
  if (container) {
    container.addEventListener('touchstart', handleTouchStart);
    container.addEventListener('touchmove', handleTouchMove);
    container.addEventListener('touchend', handleTouchEnd);

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }
}, [container, expanded])
```

### useBottomSheet

최종적으로 useBottomSheet는 아래와 같은 모습이 됩니다.

```jsx
interface Params {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const useBottomSheet = ({ open, setOpen }: Params) => {
  // ...

  return {
    containerRef,
    contentRef,
    springProps,
    isInDOM,
    expanded,
    scroll,
  }
}
```

## BottomSheet 컴포넌트 만들기

컴포넌트는 필요한 부분만 사용할 수 있도록 하기 위해 Compound 패턴으로 만들었습니다. 구성은 아래와 같습니다.

- BottomSheet: 메인 컴포넌트
- BottomSheetContent: 서브 컴포넌트
- BottomSheetButtons: 서브 컴포넌트
- BottomSheetButton: 서브 컴포넌트

### 메인 컴포넌트

메인 컴포넌트인 BottomSheet에서는 Portal로 BottomSheet의 컨테이너를 렌더링합니다.

컨테이너용 div는 react-spring의 useSpring을 사용하기 위해 react-spring의 animated를 사용했습니다. animated.div에는 useSpring이 반환한 springProps와 DOM을 참조하기 위해 만들었던 containerRef를 props로 전달합니다.

```jsx
import { animated } from 'react-spring'
import { useBottomSheet } from '@hooks/useBottomSheet';
import { Portal } from '@components/Portal';

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  title: string;
  children: JSX.Element | JSX.Element[];
}

export const BottomSheet = ({ open, setOpen, title, children }: Props) => {
  const { containerRef, contentRef, springProps, isInDOM, expanded, scroll, content, setExpanded } = useBottomSheet({ open, setOpen});

  document.querySelector("#__next")?.querySelectorAll('.BottomSheet').forEach((node, i) => {
    (node as HTMLDivElement).style.zIndex = `${10000 + i * 100}`;
  })

  // 내려가는 애니메이션이 끝나면 컴포넌트는 null을 반환
  if (!isInDOM) return null

  return (
    <Portal>
      <div className={classNames(
          classes.overlay,
          {[classes.open]: open},
          'BottomSheet'
        )}
        onClick={() => setOpen(false)}
      ></div>
      <animated.div
        ref={containerRef}
        style={springProps}
        className={classNames(classes.container, 'BottomSheet')}
      >
        <div className={classNames(
          classes.wrapper,
          classes[expanded? 'expanded' : 'notExpanded']
        )}>
          <div className={classes.header}>
            <div className={classes.handle}>
              <div className={classNames(
                classes.bar,
                {[classes.scroll]: scroll}
              )}></div>
            </div>
            <div className={classNames(
              classes.title,
              {[classes.expanded]: open && expanded}
            )}>
              <div className={classes['close-icon']} onClick={() => setOpen(false)}>
                <SVG name='close' />
              </div>
              {title}
            </div>
          </div>
          {Children.toArray(children).map((child: any, i: number) => {
            return cloneElement(child, typeof child.type === 'object' && {
              ref: contentRef,
              expanded,
              scroll,
            }
          )}
          )}
        </div>
      </animated.div>
    </Portal>
  )
}
```

### 서브 컴포넌트

서브 컴포넌트 중 BottomSheetButtons와 BottomSheetButton은 단순히 Button의 위치를 잡아주고 보여주는 역할만 담당하므로 생략하고, BottomSheetContent만 다루겠습니다.

BottomSheetContent는 부모 컴포넌트인 BottomSheet에서 ref로 contentRef를 내려받고 있기 때문에 forwardRef를 사용하여 content 영역의 가장 바깥 div를 참조하기 위해 ref를 전달합니다.

그리고 expanded가 true일 때 스크롤이 있다면 스크롤 위치에 따라 스크롤 힌트도 보여줘야 하기 때문에 IntersectionObserver API를 사용했습니다. 스크롤 힌트는 expanded가 true일 때만 보여주면 되기 때문에 expanded가 false일 때는 스크롤 위치를 관찰하지 않도록 하였습니다.

```jsx
import { forwardRef, useRef, useEffect, useState } from "react";

interface Props {
  children: JSX.Element | JSX.Element[];
  expanded?: boolean;
  scroll?: boolean;
}

export const BottomSheetContent = forwardRef(({ children, expanded, scroll }: Props, ref: any) => {
  const [scrollPosition, setScrollPosition] = useState({ top: true, bottom: false })
  const showBottomScrollHint = expanded ? !scrollPosition.bottom : scroll;

  const topRef = useRef(null);
  const bottomRef = useRef(null);

  const topObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(({ isIntersecting }) => setScrollPosition(prev => ({ ...prev, top: isIntersecting })))
  })
  const bottomObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(({ isIntersecting }) => setScrollPosition(prev => ({ ...prev, bottom: isIntersecting })))
  })

  useEffect(() => {
    if (expanded) {
      topObserver.observe(topRef?.current);
      bottomObserver.observe(bottomRef?.current);
    }
    if (!expanded) {
      topObserver.unobserve(topRef?.current);
      bottomObserver.unobserve(bottomRef?.current);
    }
  }, [expanded])

  return (
    <div className={classNames(classes['content-container'])} ref={ref}>
      {expanded && !scrollPosition.top && (
        <div className={classNames(
          classes['scroll-hint'],
          classes.top
        )}></div>
      )}
      <div ref={topRef} className={classes['scroll-hint-ref']}></div>
        {children}
      <div ref={bottomRef}  className={classes['scroll-hint-ref']}></div>
      {showBottomScrollHint && (
        <div className={classNames(
          classes['scroll-hint'],
          classes.bottom
        )}></div>
      )}
    </div>
  )
})

BottomSheetContent.displayName = "BottomSheetContent";
```

### 컴포넌트 내보내기

Compound 패턴으로 컴포넌트를 만들면 모든 구성 요소들을 import할 필요 없이 메인 컴포넌트만 import해서 서브 컴포넌트 key에 접근하여 사용할 수 있다는 장점이 있습니다.

```jsx
import { BottomSheet as BottomSheetMain } from "./BottomSheet";
import { BottomSheetContent } from "./BottomSheetContent";
import { BottomSheetButtons } from "./BottomSheetButtons";
import { BottomSheetButton } from "./BottomSheetButton";

export const BottomSheet = Object.assign(BottomSheetMain, {
  Content: BottomSheetContent,
  Buttons: BottomSheetButtons,
  Button: BottomSheetButton,
})
```

## 결과

테스트를 해봅시당.

```jsx
import { useState } from "react";
import { BottomSheet } from "ui/src/pages";

export default function BottomSheetTest() {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button
        onClick={(e) => {
          e.preventDefault();
          setOpen(!open);
        }}
      >
        Bottom Sheet
      </button>
      <BottomSheet open={open} setOpen={setOpen} title="TEST">
        <BottomSheet.Content>
          <div style={{ padding: "16px" }}>
            {new Array(50).fill(0).map((el, i) => (
              <>
                <p>안녕하세용</p>
              </>
            ))}
          </div>
        </BottomSheet.Content>
        <BottomSheet.Buttons>
          <BottomSheet.Button label="BUTTON" status="default" variant="line" />
          <BottomSheet.Button label="BUTTON" status="default" variant="solid" />
        </BottomSheet.Buttons>
      </BottomSheet>
    </div>
  );
}
```

### content가 넘치지 않는 경우

<p align="center">
<img src="https://zubetcha-blog.s3.ap-northeast-2.amazonaws.com/2022/10/bottom-sheet-result-not-expanded.gif" alt="bottomsheet not-expanded" width="50%" />
</p>

### content가 넘치는 경우

<p align="center">
<img src="https://zubetcha-blog.s3.ap-northeast-2.amazonaws.com/2022/10/bottom-sheet-result-expanded.gif" alt="bottomsheet expanded" width="50%" />
</p>

## 크로스 플랫폼 이슈

## 마치며

