import { NextApiRequest, NextApiResponse } from 'next'
import createHmac from 'create-hmac'

const LINE_MESSAGINGAPI_URL_PUSHMSG = 'https://api.line.me/v2/bot/message/push'
const LINE_MESSAGINGAPI_URL_BROADCAST = 'https://api.line.me/v2/bot/message/broadcast'
const LINE_MESSAGINGAPI_URL_REPLY = 'https://api.line.me/v2/bot/message/reply'
const LINE_MESSAGINGAPI_METHOD = 'POST'

/**
 * LINEの署名検証
 * @param req リクエスト
 * @param buf リクエストデータ
 * @param channelSecret チャネルシークレット
 * @returns LINEの署名が正しい場合true
 */
export const checkSignature = (req:NextApiRequest, buf:Buffer, channelSecret:string):boolean => {
  const lineSignature = req.headers['x-line-signature']
  const requestBody = buf
  const lineSignatureVerify = createHmac('sha256', channelSecret)
    .update(requestBody)
    .digest('base64')
  
  return lineSignature === lineSignatureVerify
}

/**
 * LINEへプッシュメッセージを送信する.
 * @param textMessage テキストメッセージ。文字列または文字列配列。
 * @param to 送信先
 * @param token チャネルアクセストークン
 * @returns レスポンスデータ。正常の場合は{}
 */
export const pushTextMessage = async (textMessage:string|string[], to:string, token:string):Promise<any> => {
  const messages = []
  if (Array.isArray(textMessage)) {
    for (const msg of textMessage) {
      const val = {
        'type': 'text',
        'text': msg
      }
      messages.push(val)
    }
  } else {
    const val = {
      'type': 'text',
      'text': textMessage
    }
    messages.push(val)
  }

  const body = {
    'to' : to,
    'messages' : messages
  }
  //console.log(`[lineutil pushTextMessage] body=${JSON.stringify(body)}`)

  return await pushMessage(body, token)
}

/**
 * LINEへプッシュメッセージを送信する.
 * @param body メッセージと送信先
 * @param token チャネルアクセストークン
 * @returns レスポンスデータ。正常の場合は{}
 */
export const pushMessage = async (body:any, token:string):Promise<any> => {
  const response = await fetchLine(LINE_MESSAGINGAPI_METHOD, LINE_MESSAGINGAPI_URL_PUSHMSG, body, token)
  return await response.json()
}

/**
 * LINEへリプライメッセージを送信する.
 * @param body メッセージと送信先
 * @param token チャネルアクセストークン
 * @returns レスポンスデータ。正常の場合は{}
 */
export const replyMessage = async (body:any, token:string):Promise<any> => {
  const response = await fetchLine(LINE_MESSAGINGAPI_METHOD, LINE_MESSAGINGAPI_URL_REPLY, body, token)
  return await response.json()
}

/**
 * LINEへブロードキャストメッセージを送信する.
 * @param textMessage テキストメッセージ。文字列または文字列配列。
 * @param token チャネルアクセストークン
 * @returns レスポンスデータ。正常の場合は{}
 */
export const broadcastMessage = async (textMessage:string|string[], token:string):Promise<any> => {
  const messages = []
  if (Array.isArray(textMessage)) {
    for (const msg of textMessage) {
      const val = {
        'type': 'text',
        'text': msg
      }
      messages.push(val)
    }
  } else {
    const val = {
      'type': 'text',
      'text': textMessage
    }
    messages.push(val)
  }

  const body = {
    'messages' : messages
  }

  console.log(`[lineutil broadcastMessage] body=${JSON.stringify(body)} token=${token}`)

  const response = await fetchLine(LINE_MESSAGINGAPI_METHOD, LINE_MESSAGINGAPI_URL_BROADCAST, JSON.stringify(body), token)
  return await response.json()
}

/**
 * LINEへfetch
 * @param method method
 * @param url URL
 * @param body リクエストデータ
 * @param token チャネルアクセストークン
 * @returns レスポンス
 */
const fetchLine = (method:string, url:string, body:any, token:string):Promise<Response> => {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token ?? ''}`,
  }
 
  const requestInit:RequestInit = {
    body: body,
    method: method,
    headers: headers
  }

  try {
    return fetch(url, requestInit)
  } catch (e) {
    let errMsg:string
    if (e instanceof Error) {
      const errName = 'FetchError'
      errMsg = `${errName}: ${e.message}`
    } else {
      errMsg = `Unexpected error.`
    }
    console.log(`[lineutil fetchLine] errMsg = ${errMsg}`)
    throw new LineFetchError(errMsg)
  }
}

/**
 * Fetch Error
 */
export class LineFetchError extends Error {
  constructor(message:string) {
    super(message)
    this.name = 'LineFetchError'
  }
}
