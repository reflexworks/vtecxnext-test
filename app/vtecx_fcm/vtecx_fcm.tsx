'use client'

import { useState } from 'react'
import { initializeApp } from 'firebase/app'
import { getMessaging } from 'firebase/messaging'
import { getToken } from 'firebase/messaging'
import { Props, useApi as getUid } from './useapi'
import * as browserutil from 'utils/browserutil'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDAhRNQElMDnwQx1DdFW7u2FNbLAN1Uxho",
  authDomain: "vtecxnext-test-fcm.firebaseapp.com",
  projectId: "vtecxnext-test-fcm",
  storageBucket: "vtecxnext-test-fcm.appspot.com",
  messagingSenderId: "619691136868",
  appId: "1:619691136868:web:de62d2dc6db6b21946cc71",
  measurementId: "G-F2FBPLCE4K"
}

const vapidKey = 'BGo6ihc1kHchsglkOyiudllokmdCxqs8U1O63BNqcJPAeioHPzIxVFVbcjiTxRaqMmgkdlJS709pOghttTpGstc'

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firebase Cloud Messaging and get a reference to the service
const messaging = getMessaging(app)

const Header = ({title} : {title:string}) => {
  return <h1>{title ? title : 'Default title'}</h1>
}

const HomePage = () => {
  const props:Props = getUid()
  const [fcmToken, setFcmToken] = useState('')
  const [putMessage, setPutMessage] = useState('')

  /**
   * FCM登録トークン取得
   */
  const handleClickGetToken = async () => {
    console.log(`[handleClickGetToken] start.`)
    // 結果表示欄をクリア
    setFcmToken('')

    Notification.requestPermission().then((permission) => {
      console.log(`[Notification.requestPermission] permission=${permission}`)
      if (permission === "granted") {
        getToken(messaging, { vapidKey: vapidKey }).then((currentToken) => {
          console.log(`[Notification.requestPermission] currentToken=${currentToken}`)
          setFcmToken(currentToken)
        }).catch((err) => {
          console.log('[Notification.requestPermission] An error occurred while retrieving token. ', err)
        })
      }
    })

    console.log(`[handleClickGetToken] end.`)
  }

  /**
   * FCM登録トークンをvte.cxに登録
   */
  const handleClickPutToken = async () => {
    console.log(`[handleClickPutToken] start.`)
    if (!fcmToken) {
      setPutMessage('FCM登録トークンが取得されていません。')
      return
    }
    if (!props.uid) {
      setPutMessage('FCM登録トークンはログインユーザに紐付けるため、ログインが必要です。')
      return
    }

    const method = 'PUT'
    const apiAction = 'putentry'
    const body = [{
      'link' : [{ '___rel' : 'self', '___href' : `/_user/${props.uid}/push_notification` }],
      'contributor' : [{ 'uri' : `urn:vte.cx:fcm:${fcmToken}`, 'name' : 'fcmweb'  }]
    }]
    const data = await browserutil.requestApi(method, apiAction, 'tmpUrlparam', JSON.stringify(body))
    if (!data) {
      console.log(`[handleClickPutToken] data is null.`)
      setPutMessage(`no response data.`)
    } else {
      const feedStr = JSON.stringify(data)
      console.log(`[handleClickPutToken] data=${feedStr}`)
      setPutMessage(feedStr)
    }

    console.log(`[handleClickPutToken] end.`)
  }

  const handleClickClearToken = async () => {
    // 結果表示欄をクリア
    setFcmToken('')
  }

  const handleClickClearMessage = async () => {
    // 結果表示欄をクリア
    setPutMessage('')
  }
  
  return (
    <div>
      <Header title="vtecxnext FCMテスト" />
      <p>【useEffect】 uid: {props.uid}</p>
      <br/>
      <button onClick={handleClickGetToken}>FCM登録トークンを取得</button>
      &nbsp;&nbsp;
      <button onClick={handleClickClearToken}>表示クリア</button>
      <br/>
      <p>{fcmToken}&nbsp;</p>
      <button onClick={handleClickPutToken}>FCM登録トークンをvte.cxに登録</button>
      &nbsp;&nbsp;
      <button onClick={handleClickClearMessage}>表示クリア</button>
      <br/>
      <p>{putMessage}&nbsp;</p>

    </div>
  )
}

export default HomePage
