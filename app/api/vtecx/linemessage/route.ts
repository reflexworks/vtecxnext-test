import { NextRequest } from 'next/server'
import { VtecxNext, VtecxNextError } from '@vtecx/vtecxnext'
import * as testutil from 'utils/testutil'
import * as lineutil from 'utils/lineutil'

/**
 * POSTメソッド
 * @param req リクエスト
 * @returns レスポンス
 */
export const POST = async (req:NextRequest):Promise<Response> => {
  console.log(`[api linemessage] start. x-requested-with=${req.headers.get('x-requested-with')}`)

  const vtecxnext = new VtecxNext(req)

  // X-Requested-With ヘッダチェック
  let result = vtecxnext.checkXRequestedWith()
  if (result) {
    return result
  }

  // リクエストJSON取得
  const contentLength:number = testutil.toNumber(req.headers.get('content-length'), 0)
  let data:any
  if (contentLength > 0) {
    try {
      data = await req.json()
    } catch (error) {
      let resErrMsg:string
      if (error instanceof Error) {
        resErrMsg = `${error.name}: ${error.message}`
      } else {
        resErrMsg = 'Error occured by req.json()'
      }
      return vtecxnext.response(400, {'feed' : {'title' : resErrMsg}})
    }
  }

  let resStatus:number = 200
  let resJson:any
  try {
    console.log(`[api linemessage] reqJson = ${JSON.stringify(data)}`)
    const textMessages = []
    for (const entry of data) {
      if ('title' in entry) {
        textMessages.push(entry.title)
      }
    }
    console.log(`[api linemessage] textMessages = ${JSON.stringify(textMessages)}`)

    // TODO チャネルアクセストークンは対象の公式アカウントのものを取得してください。
    //const token = process.env.LINE_CHANNEL_ACCESSTOKEN ?? ''
    const token = data[0].rights
    resJson = await lineutil.broadcastMessage(textMessages, token)

} catch (error) {
    let resErrMsg:string
    if (error instanceof VtecxNextError) {
      console.log(`[api linemessage] Error occured. status=${error.status} ${error.message}`)
      resStatus = error.status
      resErrMsg = error.message
    } else {
      console.log(`[api linemessage] Error occured. (not VtecxNextError) ${error}`)
      resStatus = 503
      resErrMsg = 'Error occured.'
    }
    resJson = {'feed' : {'title' : resErrMsg}}
  }

  console.log('[api linemessage] end.')
  return vtecxnext.response(resStatus, resJson)
}
