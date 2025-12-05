// src/lib/firebase.ts
import { initializeApp } from 'firebase/app'
import { getMessaging, getToken, onMessage } from 'firebase/messaging'

/**
 * Firebase Console https://console.firebase.google.com/ よりコピーする.
 * (public/firebase-messaging-sw.js と同じ値)
 */
const firebaseConfig = {
  apiKey: "AIzaSyDAhRNQElMDnwQx1DdFW7u2FNbLAN1Uxho",
  authDomain: "vtecxnext-test-fcm.firebaseapp.com",
  projectId: "vtecxnext-test-fcm",
  storageBucket: "vtecxnext-test-fcm.appspot.com",
  messagingSenderId: "619691136868",
  appId: "1:619691136868:web:de62d2dc6db6b21946cc71",
  measurementId: "G-F2FBPLCE4K"
}

const app = initializeApp(firebaseConfig)

// ブラウザ以外では messaging を作らない
export const messaging =
  typeof window !== 'undefined' ? getMessaging(app) : null

// ブラウザ通知用 token を取得
export async function requestForToken() {
  if (!messaging) return null

  try {
    /**
     * vapidKey の取得箇所
     * 1. Firebase Console
     *   → プロジェクト設定
     * 2. 「Cloud Messaging」タブ
     * 3. Web configuration → Web Push certificates
     * 4. 「Key pair（公開鍵）」をコピーする
     */
    const token = await getToken(messaging, {
      vapidKey: 'BGo6ihc1kHchsglkOyiudllokmdCxqs8U1O63BNqcJPAeioHPzIxVFVbcjiTxRaqMmgkdlJS709pOghttTpGstc',
    })
    return token
  } catch (err) {
    console.error('FCM Token error', err)
    return null
  }
}

// 前面通知メッセージ（ブラウザタブで受信）
export function listenForegroundMessage(callback: (payload: any) => void) {
  if (!messaging) return
  onMessage(messaging, callback)
}
