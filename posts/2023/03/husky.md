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

3. push 시 git 태그 자동화

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

이름에서도 알 수 있듯 pre라는 이름이 있으면 특정 이벤트 완료 전, post라는 이름이 있으면 특정 이벤트가 완료된 후 실행되는 경우가 많다. 그리고 대부분의 `pre-\*` 훅은 실행 스크립트가 반환하는 exit status가 0이 아니면 해당 이벤트가 거절된다. 더 자세한 내용은 [공식문서](https://git-scm.com/book/ko/v2/Git%EB%A7%9E%EC%B6%A4-Git-Hooks)에 더 자세히 나와 있으며, 영어로 되어 있는 문서가 한국어보다 더 자세하게 설명되어 있다.

## Husky란?

# 02. 커밋 시 lint 검사하기

# 03. 커밋 메시지에 Jira 이슈 번호 자동으로 추가하기

# 04. push할 때 git tag 자동으로 추가하기

# 마무링
