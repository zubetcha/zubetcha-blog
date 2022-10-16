---

title: Nextj에서 Firbase Cloud Messaging 으로 웹 푸시 알림 구현하기
category: Next
date: 2022-10-14
description: 내 눈물 모아....💧 푸시 알림 구현기
published: true
slug: web-push-alarm-with-firebase-cloud-messaging
tags: 
  - next
  - FCM
  - web push alarm

---

## Table of Contents

## 들어가면서

> 이 포스트는 웹 푸시 알람 구현에 필요한 `프론트엔드` 로직만 포함하고 있습니다!

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

푸시 알림 메시지에는 앱(화면)에 포커스하고 있는 상태일 때 받는 `포그라운드`와 앱(화면)을 떠나있거나(?) 종료했을 때 받을 수 있는 `백그라운드` 두 가지 종류가 있습니다. 두 메시지 모두 브라우저에 firebase cloud messaging용 service worker를 등록해야 메시지 이벤트를 통해 받을 수 있습니다.

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
    const { notification: { title, body }, data: { reservation } } = payload;
    const reservationId = parseInt(reservation);
    self.registration.showNotification(title, { body });
  });
}
```

서비스 워커는 앱을 실행시키는 Javascript와는 **다른 스레드**에서 동작하고, DOM에도 접근할 수 없기 때문에 최상위 컴포넌트에서 firebase 앱을 초기화했더라도 서비스워커에서 별도로 다시 한번 firebase 앱을 초기화하는 작업이 필요합니다.

그다음 ServiceWorker API를 이용하여 어플리케이션이 실행되면 브라우저에 서비스워커가 등록될 수 있도록 최상위 컴포넌트에서 서비스 워커 등록 코드를 작성해줍니다. 만약 **next-pwa** 라이브러리를 사용하고 있다면 next-pwa에서 서비스워커를 자동으로 등록해주기 때문에 이 과정은 생략해도 됩니다.

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

![web push background message](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/d821df35-56c5-4c07-b96e-bb40e8bf9e55/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA_2022-09-14_09.17.42.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20221016%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20221016T123713Z&X-Amz-Expires=86400&X-Amz-Signature=33ca3e32485464ec112be11ca109e6633389b00fbc7551fe1ed15cf194678805&X-Amz-SignedHeaders=host&response-content-disposition=filename%20%3D%22%25E1%2584%2589%25E1%2585%25B3%25E1%2584%258F%25E1%2585%25B3%25E1%2584%2585%25E1%2585%25B5%25E1%2586%25AB%25E1%2584%2589%25E1%2585%25A3%25E1%2586%25BA%25202022-09-14%252009.17.42.png%22&x-id=GetObject)

> 백그라운드 상태에서도 푸시 알림을 받을 수 있는 이유는 ServiceWorker API의 특성상 브라우저에 서비스 워커가 한번 등록되면 등록된 서비스 워커의 수명은 어플리케이션이 종료되어도 보존되기 때문입니다.

### 포그라운드 메시지 수신하기

포그라운드는 유저가 화면에 포커스하고 있는 상태를 말합니다.

포그라운드 메시지는 위에서 살펴 봤던 백그라운드 메시지와 동일하게 등록한 서비스 워커의 showNotification 메서드를 사용해서 받을 수 있습니다. 다만 백그라운드 메시지를 받을 때 firebase의 `onBackgroundMessage` 메서드를 사용했던 것과 달리 포그라운드 메시지를 받을 때는 `onMessage` 메서드를 사용해야 하며, 페이지에서 직접 메시지를 받을 수 있습니다.

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

여기까지 하면 백그라운드 푸시 알림 형태와 같은 알림을 받을 수 있습니다.
저는 포그라운드 메시지는 푸시 알림의 형태로 보여주면 시인성이 좋지 않을 것 같아 페이지에 토스트 팝업으로 띄워주도록 **react-toastify** 라이브러리를 사용하여 코드를 조금 수정했습니다.

```javascript
// PushNotificationLayout.tsx
import { useEffect } from "react"
import { ToastContainer, toast } from "react-toastify";
import { getMessaging, onMessage } from "firebase/messaging";
import { getFcmToken } from "@utils/firebase";

interface Props {
  children: JSX.Element[] | JSX.Element;
}
export const PushNotificationLayout = ({ children }: Props) => {

  useEffect(() => {
    getFcmToken().then(fcmToken => {
      console.log(fcmToken)
      if (fcmToken) {
        getMessage();
      }
    })
  }, [])

  const getMessage = () => {
    const messaging = getMessaging();

    onMessage(messaging, (payload) => {
      if (payload.notification) {
        const title = payload.notification.title;
        const [location, date] = payload.notification.body?.split(", ") as string[];

        navigator.serviceWorker.ready.then(registration => {
          toast(
            <div className={classes.toast_wrapper}>
              <SVG name="alert" color="primary" />
              <div className={classes.content_wrapper}>
                <Text type="body-medium" color="surface" style={{ fontWeight: "500", cursor: "pointer" }}>
                  {title}
                </Text>
                <Text type="body-small" color="surface" style={{ cursor: "pointer" }}>
                  {location}
                  <br/>
                  {date}
                </Text>
              </div>
            </div>,
            {
              position: "top-right",
              autoClose: false,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: false,
              progress: 0,
            }
          );

          // registration.showNotification(title as string, { body });
        })
      }
    });
  }

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable={false}
      />
      {children}
    </>
  );
}
```

따란..✨
라이브러리의 도움을 받아 제법 깔끔한 토스트 팝업이 완성되었습니다!

![toast popup](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/ff221b97-15e3-44cb-81c5-4a3bfdb8a90a/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA_2022-10-16_%E1%84%8B%E1%85%A9%E1%84%92%E1%85%AE_9.23.25.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20221016%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20221016T122432Z&X-Amz-Expires=86400&X-Amz-Signature=d6f1ed444d07fd5b251ee9df60f1cb0b308cb3c0ed0e17e20e7333306a146d2d&X-Amz-SignedHeaders=host&response-content-disposition=filename%20%3D%22%25E1%2584%2589%25E1%2585%25B3%25E1%2584%258F%25E1%2585%25B3%25E1%2584%2585%25E1%2585%25B5%25E1%2586%25AB%25E1%2584%2589%25E1%2585%25A3%25E1%2586%25BA%25202022-10-16%2520%25E1%2584%258B%25E1%2585%25A9%25E1%2584%2592%25E1%2585%25AE%25209.23.25.png%22&x-id=GetObject)

## 트러블슈팅

FCM과 서비스 워커로 푸시 알림을 구현하는 것 자체는 firebase 공식문서에 설명이 잘 되어 있어서 많이 어렵거나 하지는 않았습니다. 하지만 의외의(?) 곳에서 자잘한 애를 먹었습니다.

### 1. 서비스 워커 등록이 안 돼요 🥲

분명 public 폴더에 `firebase-messaging-sw.js` 라는 이름으로 파일을 생성하고 서비스 워커 내용을 정의했는데도 브라우저에 서비스 워커를 등록할 수 없다는 문구와 함께 **401 에러**가 발생했습니다.

![service worker registration error](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/6065bd0c-e413-4ef4-aed2-b5c15741d2dc/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA_2022-09-14_01.05.52.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20221016%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20221016T125046Z&X-Amz-Expires=86400&X-Amz-Signature=fdbf200a289a681c87b077238ddd29c9d5d02f8095db8c32692ea701e2b24f51&X-Amz-SignedHeaders=host&response-content-disposition=filename%20%3D%22%25E1%2584%2589%25E1%2585%25B3%25E1%2584%258F%25E1%2585%25B3%25E1%2584%2585%25E1%2585%25B5%25E1%2586%25AB%25E1%2584%2589%25E1%2585%25A3%25E1%2586%25BA%25202022-09-14%252001.05.52.png%22&x-id=GetObject)

401 에러는 인증 에러라서 확인해보니 유효하지 않은 JWT가 서버로 전달되었을 때 받는 response가 오고 있었습니다.

**시도 1. 스프링 부트에서 토큰 확인 불필요 경로 수정**
인증 관련 에러가 발생하는 게 의심스러워 스프링 부트 파일에서 **JWT를 확인하지 않는 경로**들에 firebase-messaging-sw.js를 추가하고 다시 확인해보았습니다. 여전히 에러가 발생했지만 HTTP 상태 코드가 401에서 **404 Not Found**로 바뀌었습니다.

**시도 2. firebase-messaging-sw.js 파일을 루트로 이동**
서비스 워커 등록 관련 이슈들을 찾아보니 대부분 서비스 워커 파일을 찾지 못해서 발생하는 문제때 서비스 워커 **파일의 위치를 루트 레벨로** 이동시켜보았지만 여전히 등록에 실패했다는 에러가 발생했습니다.

**시도 3. serviceWorker.register**
next-pwa를 사용하고 있어 생략했던 서비스 워커 등록 코드 `navigator.serviceWorker.register('/firebase-messaging-sw.js')` 를 루트 컴포넌트에 작성해보았습니다. 하지만 여전히 같은 에러가 발생했고 이쯤에서 스물스물 **next-pwa**가 떠오르기 시작했습니다...

**시도 4. next-pwa option 수정**
프로젝트를 처음 만들 때 다른 프론트엔드 개발자분이 PWA 설정을 맡아주셨습니다. 그 때 next-pwa도 설치하고 서비스 워커 등록 테스트용으로 worker라는 폴더를 생성하고 거기에 파일을 생성해 두신 게 있었습니다. 우선 `next.config.js`에서 next-pwa의 옵션들을 확인해 보았습니다.

```javascript
// next.config.js

module.exports = withPlugins(
  [
    withTM,
    withPWA,
    {
      pwa: {
        dest: "public",
        register: true,
        skipWaiting: true,
        runtimeCaching,
        disable: process.env.NODE_ENV === "development",
      },
    },
  ],
  config
);
```

위의 옵션 중 `disable`은 서비스 워커 생성 여부를 정할 수 있는 옵션입니다. `process.env.NODE_ENV === 'development'`로 설정되어 있으니 로컬 환경에서는 서비스 워커 등록 자체가 안 되고 있었던 것입니다. disable 옵션을 `false`로 수정한 후 다시 확인해 보았습니다.

당시 worker 폴더에는 두 개의 파일이 있었는데, 두 파일 이름 모두 sw.js가 아니었음에도 불구하고 서비스 워커에는 worker 폴더에 있는 두 모듈의 내용들이 모두 포함되어 있는 `sw.js` 한 개가 등록되어 있는 걸 확인할 수 있었습니다.

next-pwa 옵션을 다시 찾아보았고 sw와 customWorkerDir 키워드를 찾았습니다.

![next-pwa sw](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/7843f711-7331-43c9-b120-b2e2f5565d2f/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA_2022-10-16_%E1%84%8B%E1%85%A9%E1%84%92%E1%85%AE_11.10.46.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20221016%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20221016T141305Z&X-Amz-Expires=86400&X-Amz-Signature=635daafa184aed7c1539aa9e4d9e7c1430eeb957b22cb594b970e367c0a3312a&X-Amz-SignedHeaders=host&response-content-disposition=filename%20%3D%22%25E1%2584%2589%25E1%2585%25B3%25E1%2584%258F%25E1%2585%25B3%25E1%2584%2585%25E1%2585%25B5%25E1%2586%25AB%25E1%2584%2589%25E1%2585%25A3%25E1%2586%25BA%25202022-10-16%2520%25E1%2584%258B%25E1%2585%25A9%25E1%2584%2592%25E1%2585%25AE%252011.10.46.png%22&x-id=GetObject)

![next-pwa customWorkerDir](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/a978050f-76f2-4f18-a4d9-9281e5d73f84/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA_2022-10-16_%E1%84%8B%E1%85%A9%E1%84%92%E1%85%AE_11.10.57.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20221016%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20221016T141330Z&X-Amz-Expires=86400&X-Amz-Signature=c0ac0af2ca920f7e5730c7b6d3c92dff14e04f3233f6a95bf4d2fad3b0ef1fa1&X-Amz-SignedHeaders=host&response-content-disposition=filename%20%3D%22%25E1%2584%2589%25E1%2585%25B3%25E1%2584%258F%25E1%2585%25B3%25E1%2584%2585%25E1%2585%25B5%25E1%2586%25AB%25E1%2584%2589%25E1%2585%25A3%25E1%2586%25BA%25202022-10-16%2520%25E1%2584%258B%25E1%2585%25A9%25E1%2584%2592%25E1%2585%25AE%252011.10.57.png%22&x-id=GetObject)

<br/>

- sw: next-pwa가 등록해주는 **서비스 워커 스크립트의 파일 이름**으로, default로 `sw.js`가 설정되어 있습니다.
- customWorkerDir: next-pwa가 **서비스 워커로 등록할 실행 스크립트를 찾을 디렉토리 이름**으로, default로 `worker`가 설정되어 있습니다.

<br/>

옵션들을 확인해보니 next-pwa가 기본 옵션으로 설정되어 있던 `worker` 폴더에서 서비스 워커로 등록할 코드들을 찾아 `sw.js`라는 이름으로 서비스 워커 등록용 파일을 빌드 시에 생성해주고 앱이 실행되면 생성한 파일을 자동으로 서비스 워커로 등록해주고 있던 것이었습니다.

서비스 워커 파일은 worker 폴더에서 관리하는 게 좋을 것 같아 폴더는 그대로 두고 테스트용으로 만들어 놨던 파일들은 모두 삭제 후 index.js 파일을 생성하여 firebase-messaging-sw.js에 작성했던 코드들을 그대로 옮겼습니다.

```javascript
// worker/index.js

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
    const { notification: { title, body }, data: { reservation } } = payload;
    const reservationId = parseInt(reservation);
    self.registration.showNotification(title, { body });
  });
}
```

그리고 next.config.js의 next-pwa 옵션에 `sw`를 추가하고 생성되는 파일의 이름이 `firebase-messaging-sw.js`가 되도록 수정하였습니다.

```javascript
// next.config.js

module.exports = withPlugins(
  [
    withTM,
    withPWA,
    {
      pwa: {
        dest: "public",
        register: true,
        skipWaiting: true,
        runtimeCaching,
				sw: "firebase-messaging-sw.js",
        disable: false,
      },
    },
  ],
  config
);
```

그리고 다시 확인해보니 빌드 시에 public 폴더에 firebase-messaging-sw.js 파일이 자동으로 생성되고, 브라우저에 서비스 워커도 잘 등록되어 있는 것을 확인할 수 있었습니다.

![service worker](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/110a50f5-0e34-401c-b3ca-7c53b9714db2/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA_2022-09-14_02.05.35.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20221016%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20221016T142902Z&X-Amz-Expires=86400&X-Amz-Signature=a30481cd0538defa5952460d1e9f1b1f6acb03da33d5bf0b3dd64f25860e3df8&X-Amz-SignedHeaders=host&response-content-disposition=filename%20%3D%22%25E1%2584%2589%25E1%2585%25B3%25E1%2584%258F%25E1%2585%25B3%25E1%2584%2585%25E1%2585%25B5%25E1%2586%25AB%25E1%2584%2589%25E1%2585%25A3%25E1%2586%25BA%25202022-09-14%252002.05.35.png%22&x-id=GetObject)

### 2. 알림이 안 와요 🥲

분명 FCM 토큰도 잘 발급 받아지고, 서비스 워커도 잘 등록되었는데 firebase console이나 포스트맨에서 아무리 테스트를 해봐도 알림이 오지 않았습니다. 백엔드 개발자분이랑 거의 이틀을 삽질했는데 생각지도 못한 방법으로 해결할 수 있었습니다. 바로.. OS에서 해당 브라우저의 알림을 켜놓는 겁니다..🥲

만약 푸시 알림이 오지 않을 때는 아래의 사항들을 확인해 보는 게 좋습니다!

<br/>

- `FCM 토큰` 발급이 잘 이루어졌는지?
- `firebase-messaging-sw.js`가 서비스 워커로 잘 등록되었는지?
- 브라우저에서 해당 `도메인에 대한 알림`이 허용으로 설정되어 있는지?
- ✨OS에서 `브라우저의 알림`을 꺼놓지는 않았는지?✨

<br/>

저같은 경우는 시스템 환경설정에서 **크롬의 알림 자체를 꺼놨었고**, 공교롭게도 백엔드 개발자분도 크롬 알림을 꺼놔서 둘 다 알림을 받을 수 없었던 것이었습니다..🥲 크롬 브라우저의 알림을 허용해주니 푸시 알림을 잘 받을 수 있었습니다!

## 마무리

알림 기능을 구현해 보는 건 처음이었는데 내가 자주 보던 저 알림을..! 나도 만들 수 있다니..! 하면서 만들었던 기억이 납니다. 그리고 문제가 생겼을 때 백엔드 개발자분이랑 뭐지...왜지..?! 하면서 하나씩 차근차근 해결해가는 과정도 너무 재밌었습니다. 처음 해보는 건 뭐든 재밌는 것 같습니다. 🙂

---

읽어주셔서 감사합니다. 혹시 잘못된 정보가 있다면 메일로 신고 부탁드립니다. 🙇🏻‍♀️
