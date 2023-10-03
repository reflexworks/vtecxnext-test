import { NextRequest } from 'next/server'
import { VtecxNext, VtecxNextError } from '@vtecx/vtecxnext'

/**
 * ログイン処理.
 * @param req リクエスト
 * @param res レスポンス
 * @returns ログイン成功の場合、SIDをSet-Cookieする。
 */
export const GET = async (req:NextRequest):Promise<Response> => {
  console.log(`[api login] start. x-requested-with=${req.headers.get('x-requested-with')}`)

  const vtecxnext = new VtecxNext(req)

  // X-Requested-With ヘッダチェック
  let result = vtecxnext.checkXRequestedWith()
  if (result) {
    return result
  }

  // ログイン
  let resStatus:number
  let resMessage:string
  try {
    let statusMessage
    const totp:string = vtecxnext.getParameter('totp') ?? ''
    console.log(`[api login] start. totp=${totp}`)
    if (!totp) {
      // リクエストヘッダからWSSEを取得
      const wsse:string|null = req.headers.get('x-wsse')
      const reCaptchaToken:string = vtecxnext.getParameter('g-recaptcha-token') ?? ''
      console.log(`[api login] x-wsse=${wsse}`)
      if (wsse == null) {
        console.log(`[api login] x-wsse header is required.`)
        return vtecxnext.response(400, {feed : {title: 'Authentication is required.'}})
      }
      statusMessage = await vtecxnext.login(wsse, reCaptchaToken)
    } else {
      // ２段階認証
      const isTrustedDevice = vtecxnext.hasParameter('trusteddevice')
      statusMessage = await vtecxnext.loginWithTotp(totp, isTrustedDevice)
    }
    resMessage = statusMessage.message
    resStatus = statusMessage.status
  } catch (error) {
    if (error instanceof VtecxNextError) {
      console.log(`[api login] Error occured. status=${error.status} ${error.message}`)
      resStatus = error.status
      resMessage = error.message
    } else {
      console.log(`[api login] Error occured. (not VtecxNextError) ${error}`)
      resStatus = 503
      resMessage = 'Error occured.'
    }
  }
  const feed = {'feed' : {'title' : resMessage}}

  console.log('[api login] end.')
  return vtecxnext.response(resStatus, feed)
}
