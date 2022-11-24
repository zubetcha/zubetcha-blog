---

title: NHN Forward
category: Etc
date: 2022-11-24
description: 
published: false
slug: tech-conference
tags: 
  - conference

---

# 들어가면서

## Keynote

### Data Platform

- 1st party data

데이터 수집 -> 비즈니스 진단 및 전략 수립 -> 액션 플랜 설계 -> 액션 플랜 실행 및 성과 측정 -> 비즈니스 인사이트

DBTI 데이터 기반 진단 및 유형 분류

### NHN Cloud

**Data Center**

- 여러 개의 데이터 센터 운영 (평촌, 판교, 도쿄, LA...)
- 각 지역의 특성에 부합하는 데이터 센터 추가 구축 및 서비스 확대 예정
  - 내년 광주에도 데이터 센터를 추가 구축 예정 (107PB)
  - 경남 김해에도 추가 구축 예정 (10만대 서버 수용 가능 기대)
  - 순천에 공공 데이터 센터 구축 예정

**Cloud Native**

- 오케스트레이션 매니지먼트
- 최신의 쿠버네티스 플랫폼 버전을 제공
- 지난 1월 CNCF 인증 획득

**Notification Service**

- 플랫폼과 관계 없는 통합 메시지 서비스
- 메일링, 푸시 알림, SNS - REST API로 손쉽게 구축 가능
- Notification 연도별 발송량 8755(2020), 12890(2021), 15779(2022)

**AI Service**

- 현재 기술: 음성인식, 얼굴인식, 광학문자인식, 게임 AI, 패션 검색 및 가상피팅, 손금관상 등
- 개발 예정 기술: 동화책 음성 합성기 + voice 크롤링, 카툰 생성 기술

일상 속 보편적으로 사용 가능한 AI 기술

## 세션 1. 거대한 서비스 쪼개서 마이크로 프론트엔드 만들기

- angular, vue 기반의 레거시 프로젝트 -> React 모놀리틱 SPA 리뉴얼

linked single-page applications -> unified single-page application

### 페이지 통합

**Application shell**

- 하위 서비스들의 상위 애플리케이션 역할
- 하위 서비스 연결
- 라우터 분리

> Micro Frontend -> 페이지 및 앱 통합 기술에 대해 서술되어 있는 서적

### Webpack 5 Module Federation

- 소스코드가 존재할 때만 컴포넌트를 Import 할 수 있도록 lazy import 방식 사용
- 컴포넌트를 가져오다 실패한 경우 (런타임, 네트워크 등) -> Suspense, ErrorBoundary 등을 활용
- Drive 서비스와의 연결 고리 -> remoteEntry.js

### 전역 상태의 분리

RTK + Redux-saga

- 서비스 간 전환 -> 리듀서 대체
  - shell(상위 앱)에 필요한 리듀서와 하위 서비스에 필요한 리듀서 분리
- 서비스 간 사용되는 프레그먼트에 리덕스가 사용된다면?
  - 리덕스를 사용하지 않고, 로컬 상태만 사용?
  - 프레그먼트를 리듀서와 사가만 없을 때 로드 -> 후에 해당 서비스에 필요한 리듀서 로드

### 코딩보다 중요한 것...!

- 서비스가 충분히 커져서 복잡도의 증가를 따라가지 못할 때 선택할 수 있는 여러가지 대안 중 하나
- 마이크로 서비스는 개발도 중요하지만 운영하면서 나오는 요소들을 계속 고려하며 발전시켜 나가야 함
- 컴파일 타임과 런타임에 적용할 부분에 대한 팀내 정책 수립 필요
- 테스트 바운더리 및 케이스가 명확해져야 함
- 코드의 중복에 대한 두려움보다 이점에 더 포인트 맞추기
  - 각 서비스는 각자 잘 돌아가면 된다!
- 팀 구조의 변화도 필요
  - 도메인 담당 프론트 엔지니어의 커뮤니케이션 대상은 해당 도메인의 기획자와 BE 엔지니어가 되어야 함
- 기술적인 교류를 위한 채널 및 아키텍쳐에 대한 고민의 노력 필요

## 세션 2. 구글 디자인 시스템

제일 기대되는 세션..!!!!!

**Material Design 3**

- 유저의 wallpaper에서 key color를 추출해 테마에 적용하는 로직 추가
- icon을 이미지에서 폰트로 변경하며 weight, fill, grade, optical size 등의 기술적인 업데이트 적용

**Line**

- key color
- 동일한 얼라인의 정체성을 모든 곳에 적용

### 디자인 시스템의 가치

- Efficiency
  - 일관적인 용어 사용
- Usability
  - 일관적인 UX
- Product Identity
  - 제품 그 자체의 완성도

### 진화하는 디자인 시스템

1. state-0 Alligned Design Guideline

- 로컬 파일로만 존재
- 디자이너 간의 버전 싱크 맞지 않음

2. state-1 Cloud Design Library

- 클라우드를 통한 라이브러리 배포
- 디자인 시스템 팀 셋업
- 일관성 개선
- Design Legacy 개선
- Design Foundation 정립

3. state-2 Code + Design Sync

- 코드와 디자인의 동기화
- Components
- Documentation
- Iteration Process

4. state-3 Company level Design System

- 프로덕트별 디자인시스템 존재
- 상속관계 정의
- 디자인 원칙 재정립
- Desgin Token 도입
- 크로스 플랫폼 커버

**Design Token**

- 크로스 플랫폼 간에 적용되는 공통되는 라벨

### 디자인 시스템 언제 시작할까

- 팀이 커지고, 일관성은 무너지는 경우
  - System UI color 설정
  - 확장할 수 있는 color palette
- 회사 차원의 디자인 언어가 필요한 경우
  - 디자인 토큰을 통한 상속 가능
- 역할을 확장해야 할 때
  - Research 강화
  - A/B 테스트 및 실험 확대
  - Product User Value 정의
- 제품 전체적으로 디자인 리프레시를 앞두고 있는 경우
- 새로운 디자인 툴의 도입과 발맞춰

### 적용 노하우와 팁들

- 열정적인 엔지니어 (커뮤니케이션)
- 가시적인 마일스톤 설정 (feature와 관련 지어서)
- Product Impact 초기 설정
  - 도입함으로써 얻을 수 있는 이점과 목표 설정
  - 충분한 커뮤니케이션
- Visibility 생각 및 팀 키우기
  - 공유하고 피드백 받기
  - 당장 팀에 도움이 되는 부분 생각하기
- 열린 자세로, 여러 채널로 커뮤니케이션
  - 업데이트된 내용에 대해서 뉴스레터, 메일, 미팅, 문서, 슬라이드, 발표 등 가능한 모든 채널을 통해 전파
  - 자발적인 기여를 권장하는 분위기 조성
- 꾸준히 운영하고 지속되는 모델로
  - workflow가 잘 처리될 수 있는 process를 만들기

## 세션 3. 웹앱 정리하기

- 컴포넌트 정리 -> 컨테이너/프레젠터 패턴
- 데이터 파편화 제거

## 세션 6. 밑바닥부터 만들어보는 UI 프레임워크

어렵고 아쉬웠던 세션! 흐름이 안 이어지고, 만들게 된 배경을 몰라서 이해하기 더 어려웠다

### 반응형

**scheduler**

- 옵저버 패턴 + proxy
- 상태 전파 대상 관리

### Incremental DOM vs Virtual DOM

- Incremental DOM

- Virtual DOM

### 템픞릿

- Tokenizer

### render

- 동적인 영역만...

# 마무리

컨퍼런스는 인터넷 강의랑 비슷한 것 같당...
