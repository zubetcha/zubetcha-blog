---

title: 'Nextj에서 Firbase Cloud Messaging 으로 웹 푸시 알림 구현하기'
category: 'Next'
date: 2022-09-23 00:21:56
description: '혹시 next-pwa 사용하시나요..?'
published: false
tags: 
  - FCM
  - PWA
  - next-pwa
  - v9

---

## Table of Contents

회사에는 4개의 회의실이 있는데 회의실 예약을 할때 구글의 스프레드 시트를 이용해야 해서 불편한 점이 많았습니다. 9월 한 달 동안 일이 많이 바쁘지 않아서 이러한 불편함을 해소하고자 개발자들끼리 회의실 예약을 관리해주는 백오피스 서비스를 만드는 사이드 프로젝트를 시작했습니다.

회의에 초대되었거나, 회의 시작 전에 알림을 받고, 모바일에서도 확인할 수 있으면 좋을 것 같아 PWA를 적용하고, Firebase Cloud Messaging 서비스를 이용해 푸시 알림 기능도 구현하기로 하였습니다.

## firebase 앱 등록

firebase에서 앱을 등록하고 FCM을 사용하기 위해 Project settings 페이지의 Cloud Messging 탭에서 웹 푸시 인증서의 키페어를 발급 받습니다.

![Screen Shot 2022-09-30 at 16.25.48.png](Nextj%E1%84%8B%E1%85%A6%E1%84%89%E1%85%A5%20Firbase%20Cloud%20Messaging%20%E1%84%8B%E1%85%B3%E1%84%85%E1%85%A9%20%E1%84%8B%E1%85%B0%E1%86%B8%20%E1%84%91%E1%85%AE%E1%84%89%E1%85%B5%20%E1%84%8B%E1%85%A1%2048c3f1ba9dad4721930a5e9072382d24/Screen_Shot_2022-09-30_at_16.25.48.png)

이후 General 탭으로 이동하면 firebase를 사용하기 위해 필요한 환경설정 구성값들을 확인할 수 있습니다.

[https://www.notion.so](https://www.notion.so)

## SDK 설치 및 firebase 초기화

FCM을 사용하려면 우선 firebase를 설치하고 앱을 초기화해야 합니다. 공식문서를 참고하기 위해 최신 버전인 v9로 설치하였습니다.

```jsx
yarn add firebase
npm install firebase
```

firebase 관련 함수들을 모아놓을 용도로 utils 폴더 안에 firebase.ts 파일을 생성한 후 아래와 같이 firebase 앱을 초기화해주는 함수를 만들었습니다. 초기화할 때 파라미터로 전달하는 config 객체는 firebase console에서 확인한 환경설정 값들을 사용하여 만들어 줍니다.

```jsx
// utils/firebase.ts

import { initializeApp, getApps } from "firebase/app";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID,
};

export const initFirebaseApp = () => {
  const apps = getApps();

  if (!apps.length) {
    const app = initializeApp(firebaseConfig);
    const messaging =  getMessaging(app);
  }
}
```

최상위 컴포넌트인 \_app.tsx에 어플리케이션 실행 시 firebase 앱을 초기화해주는 코드를 추가합니다.

```jsx
// _app.tsx

import { initFirebaseApp } from "@utils/firebase";

useEffect(() => {
  initFirebaseApp();
}, [])
```

## FCM 토큰 발급

FCM의 푸시 알림 서비스를 이용하기 위해서는 FCM 토큰을 발급받아야 하며, FCM 토큰을 발급 받기 위해서는 메시징 인스턴스와 firebase console에서 발급 받은 vapid key가 필요합니다.

우선 FCM 토큰을 발급 받는 함수를 만듭니다.

getToken의 첫 번째 인자에는 `메시징 인스턴스`를, 두 번째 인자에는 `vapidKey` 키를 가지고 있는 객체를 전달해주면 비동기로 FCM 토큰을 발급 받을 수 있습니다. 저는 이 함수를 또 다른 함수에서 외부 스토리지에 저장되어 있는 FCM 토큰이 없는 경우에만 실행시킬 예정이므로 메시징 인스턴스는 별도로 만들지 않고 파라미터로 받을 수 있도록 하였습니다.

```jsx
// utils/firebase.ts

import { getToken } from "firebase/messaging";

const deriveFcmToken = async (messaging: any) => {
  try {
    const derivedFcmToken = await getToken(messaging, { vapidKey: VAPID_KEY })

    if (derivedFcmToken) {
      await noticeStorage.setItem(FCM_TOKEN, derivedFcmToken);
      return derivedFcmToken;
    }
  }
  catch (error) {
		// ...
  }
}
```

상황에 따른 FCM 토큰 값을 반환해주는 함수를 만듭니다. 이 함수에서 위에서 만든 deriveFcmToken을 사용합니다.

getFcmToken 함수는 아래와 같이 동작하도록 작성하였습니다.

1. 외부 스토리지에 저장되어 있는 FCM 토큰이 있는 경우 해당 값을 반환합니다.
2. 유저가 접속한 브라우저의 window 객체에 Notification 객체가 없는 경우 `undefined`를 반환합니다.
3. Notification 객체의 permission이 `granted`인 경우 (알림이 이미 허용되어 있는 경우) deriveFcmToken 함수를 실행하여 firebase로부터 발급 받은 FCM 토큰을 반환합니다.
4. Notification 객체의 permssion이 `denied`(알림 거부) 또는 `default`(알림 설정한 적 없음)인 경우 알림 허용을 요청합니다.
   1. 알림을 허용한 경우 3번과 동일하게 실행되어 firebase로부터 발급 받은 FCM 토큰을 반환합니다.
   2. 알림을 거부한 경우 `undefined`를 반환합니다.

즉, 외부 스토리지에 저장되어 있는 FCM 토큰이 있거나 알림을 허용한 경우에는 유효한 FCM 토큰을 반환하고, window에 Notification 객체 자체가 없거나 알림을 거부한 경우에는 undefined를 반환하도록 작성하였습니다.

```jsx
// utils/firebase.ts

export const getFcmToken = async () => {
  initFirebaseApp();
  const messaging = getMessaging();
  const storedFcmToken: string | null = await noticeStorage.getItem(FCM_TOKEN);

  if (storedFcmToken) return storedFcmToken;

  if (window && !('Notification' in window)) {
    return;
  }

	if (Notification.permission === 'granted') {
    try {
      const derivedFcmToken = await deriveFcmToken(messaging);
      return derivedFcmToken;
    } catch (error) {
			// ...
    }
  }

	if (Notification.permission === 'denied' || Notification.permission === 'default') {
    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        try {
          const derivedFcmToken = await deriveFcmToken(messaging);
          return derivedFcmToken;
        } catch (error) {
					// ...
        }
      } else if (permission === 'denied') {
        return;
      }
    } catch (error) {
			// ...
    }
  }
}
```

## 서버로 FCM 토큰 전달

클라이언트로 보내야 하는 알림 내용과 언제 알림을 보내야 하는 지는 서버에서 처리해주기 때문에 서버에서 알림을 보내야 하는 유저를 식별할 수 있도록 로그인에 성공하면 FCM 토큰을 서버로 전달해주는 API를 호출해줍니다.

```jsx
// Oauth2RedirectHandler.tsx

const accessToken = useUrlParameter("access_token");
const refreshToken = useUrlParameter("refresh_token");
const { mutateAsync, isSuccess } = useSendDeviceInfo();

useEffect(() => {
  if (accessToken) { // 로그인 성공
    setCookie(ACCESS_TOKEN, accessToken, 60 * 60 * 24)
    setCookie(REFRESH_TOKEN, refreshToken, 60 * 60 * 24)

    getFcmToken().then(fcmToken => {
      const deviceInfo: DeviceInfo = { device: osName, fcmToken: fcmToken ? fcmToken : null };
      mutateAsync(deviceInfo);
    })
  }

  if (!accessToken) { // 로그인 실패
    router.replace("/login")
  }
}, [accessToken, refreshToken])
```

## 백그라운드와 포그라운드 메시지

푸시 알림은 앱(화면)에 포커스하고 있는 상태일 때 받는 포그라운드와 앱(화면)을 떠나있거나(?) 종료했을 때 받을 수 있는 백그라운드 두 가지 종류가 있습니다. 포그라운드 상태일 때 때에는 firebase 라이브러리가 제공해주는 함수로 메시지를 받을 수 있지만 백그라운드 상태일 때는 firebase cloud messaging용 service worker를 등록해야 메시지를 받을 수 있습니다.

### 백그라운드 메시지 수신을 위한 서비스워커 등록하기

FCM용 서비스워커의 파일 이름은 firebase 지정한 이름인 firebase-messaging-sw.js로 생성해야 합니다.

```jsx
"use strict";

// To disable all workbox logging during development, you can set self.__WB_DISABLE_DEV_LOGS to true
// https://developers.google.com/web/tools/workbox/guides/configure-workbox#disable_logging
self.__WB_DISABLE_DEV_LOGS = true

importScripts("https://www.gstatic.com/firebasejs/9.5.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.5.0/firebase-messaging-compat.js");

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyB5MsSaVHen868J6lRWD1R4bQX0jH5K7qE",
  authDomain: "meetmeet-a49ad.firebaseapp.com",
  projectId: "meetmeet-a49ad",
  storageBucket: "meetmeet-a49ad.appspot.com",
  messagingSenderId: "831729942382",
  appId: "1:831729942382:web:4aa84d00b6d73b28ad4b7f",
  measurementId: "G-41K21FTLLR"
});

// Retrieve an instance of Firebase Messaging so that it can handle background messages.
const isSupported = firebase.messaging.isSupported();
if (isSupported) {
  const messaging = firebase.messaging();

  messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    const { notification: { title, body }, data: { reservation } } = payload;
    const reservationId = parseInt(reservation);
    self.registration.showNotification(title, { body });
  });
}
```

### 포그라운드 메시지 수신하기

포그라운드 상태는 즉 유저가

```jsx

```

## 트러블슈팅 1 - 서비스워커 등록 외않되..
