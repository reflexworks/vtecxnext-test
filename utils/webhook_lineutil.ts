import { NextRequest } from 'next/server'
import createHmac from 'create-hmac'
import { FetchError } from '@vtecx/vtecxnext'

//const LINE_MESSAGINGAPI_URL = 'https://api.line.me/v2/bot/message/push'
const LINE_MESSAGINGAPI_URL = 'https://api.line.me/v2/bot/message/reply'
const LINE_MESSAGINGAPI_METHOD = 'POST'

/*
リクエストがLINEプラットフォームから送られたことを確認するために、ボットサーバーでリクエストヘッダーのx-line-signatureに含まれる署名を検証します。

検証の手順は以下のとおりです。

チャネルシークレットを秘密鍵として、HMAC-SHA256アルゴリズムを使用してリクエストボディのダイジェスト値を取得します。
ダイジェスト値をBase64エンコードした値と、リクエストヘッダーのx-line-signatureに含まれる署名が一致することを確認します。
*/
/*
const checkSignature2 = (req:NextApiRequest) => {
  const channelSecret = "..."; // Channel secret string
  const body = "..."; // Request body string
  const signature = crypto
    .createHmac("SHA256", channelSecret)
    .update(body)
    .digest("base64");
  // Compare x-line-signature request header and the signature
}
*/

/**
 * LINEの署名検証
 * @param req リクエスト
 * @param buf リクエストデータ
 * @returns LINEの署名が正しい場合true
 */
export const checkSignature = (req:NextRequest, buf:Uint8Array):boolean => {
  const lineSignature = req.headers.get('x-line-signature')
  const channelSecret = process.env.LINE_CHANNEL_SECRET ?? ''
  const requestBody = buf
  const lineSignatureVerify = createHmac('sha256', channelSecret)
    .update(requestBody)
    .digest('base64')
  
  return lineSignature === lineSignatureVerify
}

export const fetchLine = (body:any):Promise<Response> => {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${process.env.LINE_CHANNEL_ACCESSTOKEN ?? ''}`,
  }
  //headers['Content-Type'] = 'application/json'
 
  const requestInit:RequestInit = {
    body: body,
    method: LINE_MESSAGINGAPI_METHOD,
    headers: headers
  }

  try {
    return fetch(LINE_MESSAGINGAPI_URL, requestInit)
  } catch (e) {
    let errMsg:string
    if (e instanceof Error) {
      const errName = 'FetchError'
      errMsg = `${errName}: ${e.message}`
    } else {
      errMsg = `Unexpected error.`
    }
    console.log(`[lineutil fetchLine] errMsg = ${errMsg}`)
    throw new FetchError(errMsg)
  }
}

