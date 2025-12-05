importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js")
importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js")

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
// [console] https://console.firebase.google.com/
firebase.initializeApp({
  apiKey: "AIzaSyDAhRNQElMDnwQx1DdFW7u2FNbLAN1Uxho",
  authDomain: "vtecxnext-test-fcm.firebaseapp.com",
  projectId: "vtecxnext-test-fcm",
  storageBucket: "vtecxnext-test-fcm.firebasestorage.app",
  messagingSenderId: "619691136868",
  appId: "1:619691136868:web:de62d2dc6db6b21946cc71",
  measurementId: "G-F2FBPLCE4K"
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging(); 

// バックグラウンド通知受信
messaging.onBackgroundMessage((payload) => {
  console.log("[firebase-messaging-sw.js] Background message", payload);

  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: "/icon.png",  // './favicon.ico'
  });
});

messaging.onMessage((payload) => {
  console.log(
    '[firebase-messaging-sw.js] Received onMessage ',
    payload
  );
  const notificationTitle = payload.notification?.title;
  const notificationOptions = {
    body: payload.notification?.body,
    icon: "/icon.png",  // './favicon.ico'
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});
