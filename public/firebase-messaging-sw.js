importScripts("https://www.gstatic.com/firebasejs/10.4.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.4.0/firebase-messaging-compat.js");

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
firebase.initializeApp({
  apiKey: "AIzaSyAArMykrPSaAaMF1Z3vix8BV6y-MhDGT6U",
  authDomain: "nextjs-test-fcm.firebaseapp.com",
  projectId: "nextjs-test-fcm",
  storageBucket: "nextjs-test-fcm.appspot.com",
  messagingSenderId: "978233719828",
  appId: "1:978233719828:web:080d8681d12cd921a5fb01"
});
// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging(); 

messaging.onBackgroundMessage((payload) => {
  console.log(
    '[firebase-messaging-sw.js] Received background message ',
    payload
  );
  const notificationTitle = payload.notification?.title;
  const notificationOptions = {
    body: payload.notification?.body,
    icon: './favicon.ico',
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});

messaging.onMessage((payload) => {
  console.log(
    '[firebase-messaging-sw.js] Received onMessage ',
    payload
  );
  const notificationTitle = payload.notification?.title;
  const notificationOptions = {
    body: payload.notification?.body,
    icon: './favicon.ico',
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});

/*
import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging/sw";

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
const firebaseApp = initializeApp({
  apiKey: "AIzaSyAArMykrPSaAaMF1Z3vix8BV6y-MhDGT6U",
  authDomain: "nextjs-test-fcm.firebaseapp.com",
  projectId: "nextjs-test-fcm",
  storageBucket: "nextjs-test-fcm.appspot.com",
  messagingSenderId: "978233719828",
  appId: "1:978233719828:web:080d8681d12cd921a5fb01"
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = getMessaging(firebaseApp);

onMessage(messaging, (payload) => {
  console.log('[firebase-messaging-sw] Message received. ', payload);
  // ...
});
*/


/*
importScripts("https://www.gstatic.com/firebasejs/10.4.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.4.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyAArMykrPSaAaMF1Z3vix8BV6y-MhDGT6U",
  authDomain: "nextjs-test-fcm.firebaseapp.com",
  projectId: "nextjs-test-fcm",
  storageBucket: "nextjs-test-fcm.appspot.com",
  messagingSenderId: "978233719828",
  appId: "1:978233719828:web:080d8681d12cd921a5fb01"
});

// Retrieve an instance of Firebase Messaging so that it can handle background messages.
const messaging = firebase.messaging();
*/
/*
// 通知を受けとると push イベントが呼び出される。
self.addEventListener(
  "push",
  function (event) {
    let message = event.data.json();
    console.log("[firebase-messaging-sw] event:push", message);
    let messageTitle = message.notification.title;
    let messageBody = message.notification.body;
    let tag = "cuppa";

    const notificationPromise = self.registration.showNotification(
      messageTitle,
      {
        //icon: "/img/icons/favicon-32x32.png",
        body: messageBody,
        tag: tag,
      }
    );

    event.waitUntil(notificationPromise);
  },
  false
);

// WEBアプリがバックグラウンドの場合にはsetBackGroundMessageHandlerが呼び出される。
messaging.setBackgroundMessageHandler(function (payload) {
  console.log("[firebase-messaging-sw] backgroundMessage");

  return self.registration.showNotification(payload.title, {
    body: payload.body,
  });
});
*/
