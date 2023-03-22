import { NextApiRequest, NextApiResponse } from 'next'
import * as vtecxnext from '@vtecx/vtecxnext'
import { VtecxNextError } from '@vtecx/vtecxnext'
import * as testutil from 'utils/testutil'

/**
 * ログイン処理.
 * @param req リクエスト
 * @param res レスポンス
 * @returns ログイン成功の場合、SIDをSet-Cookieする。
 */
const handler = async (req:NextApiRequest, res:NextApiResponse) => {
  // X-Requested-With ヘッダチェック
  if (!vtecxnext.checkXRequestedWith(req, res)) {
    return
  }
  // ログイン
  let resStatus:number
  let resMessage:string
  try {
    let statusMessage
    const totp = testutil.getParam(req, 'totp')
    console.log(`[login] start. totp=${totp}`)
    if (!totp) {
      // リクエストヘッダからWSSEを取得
      const wsse = testutil.toString(req.headers['x-wsse'])
      const reCaptchaToken = testutil.getParam(req, 'g-recaptcha-token')
      console.log(`[login] x-wsse=${wsse}`)
      if (wsse == null) {
        console.log(`[login] x-wsse header is required.`)
        res.status(400).json({feed : {title: 'Authentication is required.'}})
        return
      }
      statusMessage = await vtecxnext.login(req, res, wsse, reCaptchaToken)
    } else {
      // ２段階認証
      const isTrustedDevice = testutil.hasParam(req, 'trusteddevice')
      statusMessage = await vtecxnext.loginWithTotp(req, res, totp, isTrustedDevice)
    }
    resMessage = statusMessage.message
    resStatus = statusMessage.status
  } catch (error) {
    if (error instanceof VtecxNextError) {
      console.log(`[login] Error occured. status=${error.status} ${error.message}`)
      resStatus = error.status
      resMessage = error.message
    } else {
      console.log(`[login] Error occured. (not VtecxNextError) ${error}`)
      resStatus = 503
      resMessage = 'Error occured.'
    }
  }
  const resJson = {feed : {'title' : resMessage}}
  res.status(resStatus).json(resJson)
  res.end()
}

export default handler
