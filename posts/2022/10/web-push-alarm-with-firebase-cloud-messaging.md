---

title: Nextj에서 Firbase Cloud Messaging 으로 웹 푸시 알림 구현하기
category: Next
date: 2022-10-14
description: 내 눈물 모아....💧 푸시 알림 구현기
published: true
slug: web-push-alarm-with-firebase-cloud-messaging
tags: 
  - FCM
  - PWA
  - next-pwa
  - v9

---

## Table of Contents

## 들어가면서

> 이 포스트는 웹 푸시 알람 구현에 필요한 프론트엔드 로직만 포함하고 있습니다!

회사에는 4개의 회의실이 있는데 회의실 예약을 할때 구글의 스프레드 시트를 이용해야 해서 불편한 점이 많았습니다. 9월 한 달 동안 일이 많이 바쁘지 않아서 이러한 불편함을 해소하고자 개발자들끼리 회의실 예약을 관리해주는 백오피스 서비스를 만드는 사이드 프로젝트를 시작했습니다.

회의에 초대되었거나, 회의 시작 전에 알림을 받고, 모바일에서도 확인할 수 있으면 좋을 것 같아 PWA를 적용하고, Firebase Cloud Messaging 서비스를 이용해 푸시 알림 기능도 구현하기로 하였습니다.

## firebase 앱 등록

firebase에서 앱을 등록하고 FCM을 사용하기 위해 Project settings 페이지의 Cloud Messging 탭에서 웹 푸시 인증서의 키페어를 발급 받습니다.

![firebase project setting](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/4a7a21ab-9ee1-4457-8fa8-1320718a6e2e/Screen_Shot_2022-09-30_at_16.25.48.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20221015%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20221015T092530Z&X-Amz-Expires=86400&X-Amz-Signature=26e353d6f7608722d89e5e66c42750bc035215467f97a547f8c0135aca877ede&X-Amz-SignedHeaders=host&response-content-disposition=filename%20%3D%22Screen%2520Shot%25202022-09-30%2520at%252016.25.48.png%22&x-id=GetObject)

이후 General 탭으로 이동하면 firebase를 사용하기 위해 필요한 환경설정 구성값들을 확인할 수 있습니다.

![firebase app config](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/d850877e-c131-4052-a873-c920fb86eb5e/Screen_Shot_2022-09-30_at_16.36.07.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20221015%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20221015T092651Z&X-Amz-Expires=86400&X-Amz-Signature=911f5b88fc83c1cca003229a6ac375c172140ce12e5c23b7037fed8801efd3f6&X-Amz-SignedHeaders=host&response-content-disposition=filename%20%3D%22Screen%2520Shot%25202022-09-30%2520at%252016.36.07.png%22&x-id=GetObject)

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

FCM의 푸시 알림 서비스를 이용하기 위해서는 `FCM 토큰`을 발급받아야 하며, FCM 토큰을 발급 받기 위해서는 `메시징 인스턴스`와 firebase console에서 발급 받은 `vapid key`가 필요합니다.

우선 FCM 토큰을 발급 받는 함수를 만듭니다.

getToken의 첫 번째 인자에는 `메시징 인스턴스`를, 두 번째 인자에는 `vapidKey` 키를 가지고 있는 객체를 전달해주면 비동기로 FCM 토큰을 발급 받을 수 있습니다. 저는 이 함수를 또 다른 함수에서 외부 스토리지에 저장되어 있는 FCM 토큰이 없는 경우에만 실행시킬 예정이므로 메시징 인스턴스를 함수 안에서 만들지 않고 파라미터로 받을 수 있도록 하였습니다.

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

상황에 따라 유효하거나 혹은 유효하지 않은 FCM 토큰 값을 반환해주는 함수를 만듭니다. 이 함수에서 위에서 만든 `deriveFcmToken`함수를 사용합니다.

getFcmToken 함수는 아래와 같이 동작하도록 작성하였습니다.

<br/>

1. 외부 스토리지에 저장되어 있는 FCM 토큰이 있는 경우 해당 값을 반환합니다.
2. 유저가 접속한 브라우저의 window 객체에 Notification 객체가 없는 경우 `undefined`를 반환합니다.
3. Notification 객체의 permission이 `granted`인 경우 (알림이 이미 허용되어 있는 경우) deriveFcmToken 함수를 실행하여 firebase로부터 발급 받은 FCM 토큰을 반환합니다.
4. Notification 객체의 permssion이 `denied`(알림 거부) 또는 `default`(알림 설정한 적 없음)인 경우 알림 허용을 요청합니다.
   1. 알림을 허용한 경우 3번과 동일하게 실행되어 firebase로부터 발급 받은 FCM 토큰을 반환합니다.
   2. 알림을 거부한 경우 `undefined`를 반환합니다.

<br/>

즉, 외부 스토리지에 저장되어 있는 FCM 토큰이 있거나 알림을 허용한 경우에는 `유효한 FCM 토큰`을 반환하고, window에 Notification 객체 자체가 없거나 알림을 거부한 경우에는 `undefined`를 반환하도록 작성하였습니다.

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

참고로 noticeStorage는 `localforage`라는 라이브러리로 생성한 외부 스토리지 인스턴스입니다.

localforage는 외부 스토리지와 어플리케이션 내의 상태를 동기화하려고 할 때 `비동기적으로` 동작하도록 하는 것을 쉽게 도와주는 라이브러리입니다. localforage가 지원하는 외부 스토리지로는 `indexedDB`, `localStorage`, `WebSQL`이 있는데, FCM 토큰뿐만 아니라 SSE로 받는 메시지들도 저장할 예정이라 용량의 제한이 적은 indexedDB를 선택했습니다.

인스턴스를 새로 생성하지 않아도 바로 사용할 수 있지만, Next를 사용하고 있고 SSR 중에는 외부 스토리지와의 동기화가 불가능하므로 예외처리를 하기 위해 localforage의 createInstance 메서드를 사용하여 별도로 인스턴스를 생성하여 사용하였습니다.

```jsx
// noticeStorage.ts

import localforage from "localforage";
import * as memoryDriver from 'localforage-driver-memory';

const getDefaultConfig = () => ({
  name: 'meetmeet',
  driver: [localforage.INDEXEDDB]
})

export default class Storage {
  storage: any;
  constructor(storage: any, config: { [key: string]: any }) {
    this.storage = storage
    this.config(config)
  }

  setItem(key: string, value: unknown) {
    try {
      return this.storage.setItem(key, value)
    } catch (e) {
      console.log('setItem - Executing on SSR')
    }
  }

  getItem(key: string) {
    try {
      return this.storage.getItem(key)
    } catch (e) {
      console.log('getItem - Executing on SSR')
    }
  }

  removeItem(key: string) {
    try {
      return this.storage.removeItem(key)
    } catch (e) {
      console.log('removeItem - Executing on SSR')
    }
  }

  length() {
    try {
      return this.storage.length()
    } catch (e) {
      console.log('length - Executing on SSR')
    }
  }

  async config({ ...restConfig }) {
    const { driver, ...localForageConfig }: any = {
      ...getDefaultConfig(),
      ...restConfig
    }

    this.storage.config(localForageConfig)

    if (driver !== undefined) {
      try {
        await this.storage.ready()
        this.storage.defineDriver(memoryDriver);
        this.storage.setDriver([localforage.INDEXEDDB, localforage.LOCALSTORAGE, localforage.WEBSQL, memoryDriver._driver]);
      } catch (e) {
        console.log('Storage on SSR Mode')
      }
    }
  }

  keys() {
    try {
      return this.storage.keys()
    } catch (e) {
      console.log('Keys - Executing on SSR')
    }
  }

  clean() {
    try {
      return this.storage.clean()
    } catch (e) {
      console.log('Clean - Executing on SSR')
    }
  }
}

export const noticeStorage = new Storage(localforage.createInstance(getDefaultConfig()), getDefaultConfig())
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

푸시 알림 메시지에는 앱(화면)에 포커스하고 있는 상태일 때 받는 `포그라운드`와 앱(화면)을 떠나있거나(?) 종료했을 때 받을 수 있는 `백그라운드` 두 가지 종류가 있습니다. 두 메시지 모두 브라우저에 firebase cloud messaging용 service worker를 등록해서 메시지 이벤트를 통해 받을 수 있습니다.

### 서비스워커 등록하기

FCM용 서비스워커의 파일 이름은 firebase에서 지정한 이름인 `firebase-messaging-sw.js`로 생성해야 합니다. 서비스워커 파일은 public 폴더에 생성해줍니다.

```jsx
// firebase-messaging-sw.js

"use strict";

self.__WB_DISABLE_DEV_LOGS = true

importScripts("https://www.gstatic.com/firebasejs/9.5.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.5.0/firebase-messaging-compat.js");

const firebaseApp = firebase.initializeApp({
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "...",
  measurementId: "..."
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

서비스 워커는 앱을 실행시키는 Javascript와는 **다른 스레드**에서 동작하고, DOM에도 접근할 수 없기 때문에 최상위 컴포넌트에서 firebase 앱을 초기화했더라도 서비스워커에서 별도로 다시 한번 firebase 앱을 초기화하는 작업이 필요합니다.

그다음 ServiceWorker API를 이용하여 어플리케이션이 실행되면 브라우저에 서비스워커가 등록될 수 있도록 최상위 컴포넌트에서 서비스 워커 등록 코드를 작성해줍니다. 만약 next-pwa 라이브러리를 사용하고 있다면 next-pwa에서 서비스워커를 자동으로 등록해주기 때문에 이 과정은 생략해도 됩니다.

```javascript
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/firebase-messaging-sw.js')
  .then(function(registration) {
		// ...
  })
  .catch(function(error) {
    console.log('Service worker registration failed:', error);
  });
} else {
  console.log('Service workers are not supported.');
}
```

firebase-messaging-sw 서비스워커가 브라우저에 잘 등록되었다면 `개발자도구 → 어플리케이션 → 서비스워커` 탭에서 도메인에 등록되어 있는 서비스워커 및 활성화 상태를 확인할 수 있습니다.

![devtools service workers](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/237241bd-973d-44cd-8ca0-3e5897377a7d/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA_2022-10-15_%E1%84%8B%E1%85%A9%E1%84%92%E1%85%AE_9.07.08.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20221015%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20221015T142933Z&X-Amz-Expires=86400&X-Amz-Signature=04c18ef049524be3cc2962bd5a82a95488b628a5bf3440ee7ae5fdcb48e39099&X-Amz-SignedHeaders=host&response-content-disposition=filename%20%3D%22%25E1%2584%2589%25E1%2585%25B3%25E1%2584%258F%25E1%2585%25B3%25E1%2584%2585%25E1%2585%25B5%25E1%2586%25AB%25E1%2584%2589%25E1%2585%25A3%25E1%2586%25BA%25202022-10-15%2520%25E1%2584%258B%25E1%2585%25A9%25E1%2584%2592%25E1%2585%25AE%25209.07.08.png%22&x-id=GetObject)

서비스워커 등록까지 잘 마쳤다면 firebase console 에서 메시지 테스트를 해봅니다. 백그라운드 상태에서 약 5분 정도 기다리면 아래의 화면과 같이 푸시 알림이 오는 것을 확인할 수 있습니다.

![web push background message](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/d821df35-56c5-4c07-b96e-bb40e8bf9e55/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA_2022-09-14_09.17.42.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20221015%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20221015T092728Z&X-Amz-Expires=86400&X-Amz-Signature=4a8b6d5a52df723bf71b60c1789e3f324673b07f19a9f58331b946a2e6acbea4&X-Amz-SignedHeaders=host&response-content-disposition=filename%20%3D%22%25E1%2584%2589%25E1%2585%25B3%25E1%2584%258F%25E1%2585%25B3%25E1%2584%2585%25E1%2585%25B5%25E1%2586%25AB%25E1%2584%2589%25E1%2585%25A3%25E1%2586%25BA%25202022-09-14%252009.17.42.png%22&x-id=GetObject)

> 백그라운드 상태에서도 푸시 알림을 받을 수 있는 이유는 ServiceWorker API의 특성상 브라우저에 서비스 워커가 한번 등록되면 등록된 서비스 워커의 수명은 어플리케이션이 종료되어도 보존되기 때문입니다.

### 포그라운드 메시지 수신하기

포그라운드는 유저가 화면에 포커스하고 있는 상태를 말합니다.

포그라운드 메시지는 위에서 살펴 봤던 백그라운드 메시지와 동일하게 등록한 서비스 워커의 showNotification 메서드를 사용해서 받을 수 있습니다. 다만 백그라운드 메시지를 받을 때 firebase의 onBackgroundMessage 메서드를 사용했던 것과 달리 포그라운드 메시지를 받을 때는 onMessage 메서드를 사용합니다.

푸시 알림 메시지를 받아서 브라우저에 띄워주는 목적으로 전역에서 사용할 `PushNotificationLayout` 이라는 컴포넌트를 생성하였습니다.

```javascript
// PushNotificationLayout.tsx
import { useEffect } from 'react';
import { getMessaging, onMessage } from "firebase/messaging";
import { getFcmToken } from "@utils/firebase";

export const PushNotificationLayout = ({ children }: Props) => {
  useEffect(() => {
    getFcmToken().then(fcmToken => {
      if (fcmToken) {
        const messaging = getMessaging(); // 메시지 인스턴스 가져오기

        onMessage(messaging, (payload) => { // 메시지 이벤트 발생 시
          if (payload.notification) {
            const { title, body } = payload.notification;

            navigator.serviceWorker.ready.then(registration => {
              registration.showNotification(title as string, { body }); // 푸시 알림 노출
            })
          }
        });
      }
    })
  }, [])

  return <>{children}</>
}
```

## 트러블슈팅 - 서비스워커 등록 외않되..
