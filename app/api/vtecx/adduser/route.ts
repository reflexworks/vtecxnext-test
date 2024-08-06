import { NextRequest } from 'next/server'
import { VtecxNext, VtecxNextError, AdduserInfo as AdduserInfo_V } from '@vtecx/vtecxnext'
import * as testutil from 'utils/testutil'

export type AdduserInfo = AdduserInfo_V

/**
 * POSTメソッド
 * @param req リクエスト
 * @returns レスポンス
 */
export const POST = async (req:NextRequest):Promise<Response> => {
  console.log(`[api adduser] start. x-requested-with=${req.headers.get('x-requested-with')}`)

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

  let resStatus:number
  let resJson:any
  try {
    console.log(`[api adduser] vtecxnext.adduser start. data = ${JSON.stringify(data)}`)
    const reCaptchaToken:string = vtecxnext.getParameter('g-recaptcha-token') ?? ''
    resJson = await vtecxnext.adduser(data, reCaptchaToken)
    resStatus = 200
  } catch (error) {
    let resErrMsg:string
    if (error instanceof VtecxNextError) {
      console.log(`[api adduser] Error occured. status=${error.status} ${error.message}`)
      resStatus = error.status
      resErrMsg = error.message
    } else {
      console.log(`[api adduser] Error occured. (not VtecxNextError) ${error}`)
      resStatus = 503
      resErrMsg = 'Error occured.'
    }
    resJson = {'feed' : {'title' : resErrMsg}}
  }

  console.log('[api adduser] end.')
  return vtecxnext.response(resStatus, resJson)
}
