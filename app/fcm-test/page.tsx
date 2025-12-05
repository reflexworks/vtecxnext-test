"use client";
import { useEffect, useState } from "react";
import { requestForToken, listenForegroundMessage } from "@/lib/firebase";

export default function FcmTestPage() {
  const [token, setToken] = useState<string | null>(null);
  const [message, setMessage] = useState<any>(null);

  useEffect(() => {
    // Service Worker 登録（Next.js は自動登録されないため）
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/firebase-messaging-sw.js")
        .then(() => console.log("Service Worker registered"));
    }

    // Token 取得
    requestForToken().then(setToken);

    // Foreground メッセージ受信
    listenForegroundMessage((payload) => {
      console.log("Foreground message received:", payload);
      setMessage(payload);
    });
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>FCM 受信テスト（Next.js）</h1>

      <h2>FCM Token</h2>
      <pre>{token ?? "トークン取得中..."}</pre>

      <h2>Foreground メッセージ</h2>
      <pre>{message ? JSON.stringify(message, null, 2) : "まだメッセージなし"}</pre>
    </div>
  );
}
