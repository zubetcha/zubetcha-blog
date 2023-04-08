---

title: husky로 업무 효율 높이기
category: Etc
date: 2023-03-12
description: 커밋 메시지 및 태그 자동화
published: false
slug: husky
tags: 
  - etc
  - husky

---

# TL;DR

새로 이직한 회사에서는 문서와 소스 관리를 위해 Jira, Bitbucket 등의 아틀라시안 툴들을 사용하고 있다. 그리고 커밋 메시지에는 현재 작업 중인 Jira의 이슈 번호를 메시지 가장 앞에 작성해야 하는 룰이 있다. Jira와 Bitbucket은 이슈 번호로 연결되어 커밋 메시지에 이슈 번호가 포함되어 있으면 하이퍼링크가 생성된다. 그리고 각 프로덕트의 레포에서 작업이 끝나고 커밋을 할 때 이 이슈 번호를 수기로 커밋 메시지에 작성하고 있었다.

마침 오자마자 맡게 된 업무 중 하나가 모노레포를 구축하는 것이었기 때문에 여러 프로젝트들을 한 곳으로 합치는 김에 husky를 이용하여 몇 가지를 자동화하면 좋겠다는 생각을 했다.

1. 커밋 시 lint 검사하기

2. 커밋 메시지에 Jira 이슈 번호 prefix 자동화

`git-hook`과 `husky`가 무엇인지와 위의 업무들을 자동화하기 위해 겪었던 몇 가지 이슈들을 정리해 보려고 한다.

# 01. git-hook과 husky

## Git Hook이란?

`Git Hook`은 commit, merge, push 등 git에서 특정한 이벤트가 발생했을 때 자동으로 스크립트를 실행시킬 수 있는 git의 기능이다. 그리고 이벤트의 종류에 따라서 `클라이언트 훅`과 `서버 훅`으로 나뉜다. 간단히 살펴보면,

| 구분          | hook               | 호출 시기                                                                                    |
| ------------- | ------------------ | -------------------------------------------------------------------------------------------- |
| 클라이언트 훅 | pre-commit         | 커밋 시 가장 먼저                                                                            |
|               | prepare-commit-msg | git이 커밋 메시지를 생성한 후 편집기를 실행하기 전                                           |
|               | commit-msg         | 최종적으로 커밋이 완료되기 전                                                                |
|               | post-commit        | 커밋 완료 후                                                                                 |
|               | applypatch-msg     | git am 명령어 실행 시 가장 먼저                                                              |
|               | pre-applypatch     | git am 명령어 실행 시 두 번째로                                                              |
|               | post-applypatch    | git am 명령어 실행 시 마지막으로                                                             |
|               | pre-rebase         | rebase 하기 전                                                                               |
|               | post-rewrite       | --amend 옵션, rebase 등 커밋을 변경하는 명령어 실행 시                                       |
|               | post-checkout      | 브랜치 checkout 후                                                                           |
|               | post-merge         | merge가 완료된 후                                                                            |
|               | pre-push           | push 명령어 실행 시 원격 정보를 업데이트한 후 원격 레포지토리로 데이터를 전송하기 전         |
|               | pre-auto-gc        | gc 실행 시 가비지 컬렉션이 실행되기 직전                                                     |
| 서버 훅       | pre-receive        | push 명령어 실행 시 완료되기 전                                                              |
|               | update             | push 명령어 실행 시 (pre-receive와 비슷하며, 다수의 브랜치를 push 하는 경우에만 차이가 있음) |
|               | post-receive       | push 명령어 실행 시 완료된 후                                                                |

이름에서도 알 수 있듯 pre라는 이름이 있으면 특정 이벤트 완료 전, post라는 이름이 있으면 특정 이벤트가 완료된 후 실행되는 경우가 많다. 그리고 대부분의 `pre-\*` 훅은 실행 스크립트가 반환하는 exit status가 0이 아니면 해당 이벤트가 거절된다. 인자로 받는 값, 이벤트 중단 가능 여부 등 훅마다 달라지는 것들도 많으니 더 자세한 내용은 [공식문서](https://git-scm.com/book/ko/v2/Git%EB%A7%9E%EC%B6%A4-Git-Hooks)에서 확인할 수 있다.

## Husky란?

husky는 위에서 살펴본 git hook을 보다 더 편리하게 사용할 수 있도록 해주는 라이브러리이다. git hook을 바로 사용할 수 있는데도 불구하고 많은 사람들이 굳이 husky를 사용하는 이유는 뭘까?

사실 git hook 자체를 적용하는 방법 자체는 간단하다. 프로젝트의 루트에서 `.git/hooks/` 폴더 하위에 파일명만 git hook의 이름으로 설정해놓으면 자동으로 적용된다. 심지어 폴더도 이미 만들어져 있으며 sample 파일도 존재한다.

사실 .git 폴더는 숨김 처리되어 있어 에디터에서는 바로 확인하기 어렵다. 숨겨져 있는 폴더와 파일까지 리스트업해주는 명령어를 실행해보면,

```jsx
$ ls -a
```

<p align="center">
  <img src="https://zubetcha-blog.s3.ap-northeast-2.amazonaws.com/2023/03/2023-03_husky-git-hook.png" alt="git hooks location" width="80%">
</p>

이렇게 `.git` 폴더가 이미 만들어져 있는 걸 확인할 수 있다. 그리고 hooks 폴더까지 들어가보면,

<p align="center">
  <img src="https://zubetcha-blog.s3.ap-northeast-2.amazonaws.com/2023/03/2023-03_husky-git-hook-2.png" alt="git hooks location" width="80%">
</p>

사용할 수 있는 git hook의 전체 종류들을 확인할 수 있다. 각 파일에서 `.sample`만 지워주면 바로 적용할 수도 있다.

하지만 지금까지 본 것처럼 .git 폴더는 숨겨져 있기 때문에 우리가 흔히 사용하는 에디터에서는 찾아볼 수 없다. 그렇기 때문에 실제로 git hook을 바로 적용하기 위해 수정하기 위해서는 터미널에서 vi, vim 등으로 편집을 해야 하는데 익숙하지 않은 사람들에게는 꽤나 번거롭고 어려운 작업이 될 것이다.

`huksy`는 개발자가 겪을 수 있는 이러한 불편한 점을 에디터에서 원하는 스크립트로 수정할 수 있는 환경을 제공해줌으로써 해결해주고 있다.

스크립트 실행 불가 - 권한 문제 [이슈](https://github.com/typicode/husky/issues/1177)

# 02. husky 사용하기

## 사용 방법

### husky 설치

```jsx
$ npm install husky --dev
$ yarn add husky --dev
```

### prepare 세팅

패키지 설치 후 자동으로 Git hook을 사용할 수 있도록 하기 위해 package.json을 수정해야 한다. 직접 수정해도 되고, 명령어를 사용해도 된다.

```jsx
$ npm pkg set scripts.prepare="husky install"
```

```jsx
// package.json

{
  "scripts": {
    "prepare": "husky install"
  }
}
```

`prepare`는 `라이프 사이클 스크립트`이다.

> `라이프 사이클 스크립트`란?
> package.json의 scripts 필드는 개발자가 커스텀하여 설정하는 스크립트 외에도, 기본으로 정해져 있는 스크립트가 있다. 이러한 예약 스크립트를 라이프 사이클 스크립트라고 부른다.
> 라이프 사이클 스크립트는 종류와 prefix에 따라 패키지의 install 혹은 publish 명령어가 실행되기 전/후로 호출된다.

라이프 사이클 스크립트는 [이 블로그](https://beomy.github.io/tech/etc/package-json-scripts/)에 잘 정리되어 있으니 읽어보면 좋을 것 같다!

단, `Yarn berry`를 사용하고 있다면 Yarn +2부터는 prepare를 지원하지 않기 때문에 `postinstall`로 설정해야 한다.

```jsx
// package.json
{
  "scripts": {
    "postinstall": "husky install"
  }
}
```

### hook 생성하기

husky install이 실행되어 루트에 .husky 폴더가 생성되어 있다면 huksy CLI로 훅을 간편하게 생성할 수 있다.

```jsx
$ npx husky add .husky/pre-commit "npm test"
```

위의 명령어를 실행하면 .huksy 폴더에 pre-commit 파일이 생성되고 파일 안에는 npm test라는 스크립트가 작성되어 있을 것이다. pre-commit은 커밋이 되기 전에 호출되는 훅이다.

변경사항을 스테이지로 올린 후 커밋을 했을 때,

```jsx
$ git add .husky/pre-commit
$ git commit -m "pre-commit"
```

만약 test에 실패했다면 커밋도 취소될 것이다.

만약 작성해야 하는 스크립트가 길고 복잡하다면 직접 .husky 폴더에 파일을 생성해줘도 된다. 이 때 파일 이름은 반드시 git hook 이름과 일치해야 한다는 점을 유의하자.

## stage 소스코드 lint 검사하기



## 커밋 메시지에 Jira 이슈 번호 자동으로 추가하기

# 마무링
